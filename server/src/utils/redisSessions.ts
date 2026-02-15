// utils/redisSessions.ts
import redisClient from "../config/connectRedis.js";
import { REFRESH_EXPIRES_SEC, ABSOLUTE_SESSION_SEC } from "./generateToken.js";
import { hashToken } from "./hash.js";

const refreshKey = (hashed: string) => `refresh:${hashed}`;        // hashed -> { userId, sid }
const userSessionsKey = (userId: string) => `user_sessions:${userId}`; // SET of sids
const sessionMetaKey = (sid: string) => `session_meta:${sid}`;     // metadata including hashed
const blacklistKey = (hashed: string) => `bl_refresh:${hashed}`;   // blacklisted tokens

/**
 * Store a new refresh session
 */
export async function storeSession({ rawRefreshToken, userId, sid, meta = {} }: {
  rawRefreshToken: string;
  userId: string;
  sid: string;
  meta?: Record<string, any>;
}) {
  const hashed = hashToken(rawRefreshToken);

  const now = Date.now();
  const absoluteExpiresAt = now + ABSOLUTE_SESSION_SEC * 1000;

  // 1. Store hashedToken -> { userId, sid }
  await redisClient.set(refreshKey(hashed), JSON.stringify({ userId, sid }), {
    EX: REFRESH_EXPIRES_SEC,
  });

  // 2. Add session id under user session set
  await redisClient.sAdd(userSessionsKey(userId), sid);

  // 3. Store metadata (now includes hashed token!)
  await redisClient.set(
    sessionMetaKey(sid),
    JSON.stringify({
      createdAt: now,
      absoluteExpiresAt,
      hashedRefreshToken: hashed,
      ...meta,
    }),
    { EX: REFRESH_EXPIRES_SEC }
  );

  await redisClient.expire(userSessionsKey(userId), REFRESH_EXPIRES_SEC);
}

/**
 * Find session mapping: raw token → { userId, sid }
 */
export async function findSessionByRawToken(rawRefreshToken: string) {
  const hashed = hashToken(rawRefreshToken);

  if (await redisClient.get(blacklistKey(hashed))) return null;

  const raw = await redisClient.get(refreshKey(hashed));
  if (!raw) return null;

  const { userId, sid } = JSON.parse(raw);

  const metaRaw = await redisClient.get(sessionMetaKey(sid));
  if (!metaRaw) return null;

  const meta = JSON.parse(metaRaw);

  // ⛔ ABSOLUTE EXPIRY ENFORCEMENT
  if (Date.now() > meta.absoluteExpiresAt) {
    await clearAllSessionsForUser(userId);
    return null;
  }

  return { userId, sid };
}


/**
 * Logout single session using raw token
 */
export async function removeSessionByRawToken(rawRefreshToken: string) {
  const hashed = hashToken(rawRefreshToken);
  const v = await redisClient.get(refreshKey(hashed));
  if (!v) return null;

  const { userId, sid } = JSON.parse(v);

  // Delete refresh:<hashed>, sid from set, meta
  await redisClient.del(refreshKey(hashed));
  await redisClient.del(sessionMetaKey(sid));
  await redisClient.sRem(userSessionsKey(userId), sid);

}

/**
 * Blacklist + remove normal session mapping
 */
export async function blacklistRawToken(rawRefreshToken: string, ttl = REFRESH_EXPIRES_SEC) {
  const hashed = hashToken(rawRefreshToken);

  await redisClient.setEx(blacklistKey(hashed), ttl, "1");
  //or
  //  await redisClient.setEx(blacklistKey(hashed), ttl, "blacklisted");


  // Remove real refresh key if exists
  await redisClient.del(refreshKey(hashed));
}

/**
 * Get all user sessions with metadata
 */
export async function getUserSessions(userId: string) {
  const sids = await redisClient.sMembers(userSessionsKey(userId));
  if (sids.length === 0) return [];

  const pipeline = redisClient.multi();
  for (const sid of sids) {
    pipeline.get(sessionMetaKey(sid));
  }

  // 🛡️ THE FIX: Double-cast to unknown first
  const rows = (await pipeline.exec()) as unknown as (string | null)[];

  const sessions = [];
  for (let i = 0; i < sids.length; i++) {
    const raw = rows[i];
    sessions.push({
      sid: sids[i],
      meta: raw ? JSON.parse(raw) : null,
    });
  }

  return sessions;
}


export async function clearAllSessionsForUser(userId: string) {
  const userKey = userSessionsKey(userId);
  const sids = await redisClient.sMembers(userKey);

  if (sids.length === 0) return;

  // Step 1: Get all metadata in one batch
  const getMetaPipeline = redisClient.multi();
  sids.forEach(sid => getMetaPipeline.get(sessionMetaKey(sid)));
  
  // 🛡️ THE FIX: Double-cast to unknown first
  const metaRows = (await getMetaPipeline.exec()) as unknown as (string | null)[];

  // Step 2: Delete everything in one batch
  const deletePipeline = redisClient.multi();

  for (let i = 0; i < sids.length; i++) {
    const sid = sids[i];
    const metaRaw = metaRows[i];

    if (metaRaw) {
      const meta = JSON.parse(metaRaw);
      if (meta.hashedRefreshToken) {
        deletePipeline.del(refreshKey(meta.hashedRefreshToken));
      }
    }
    deletePipeline.del(sessionMetaKey(sid));
  }

  // Delete the main set for the user
  deletePipeline.del(userKey);

  await deletePipeline.exec();
}
