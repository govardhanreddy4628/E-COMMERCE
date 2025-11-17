// utils/redisSessions.ts
import redisClient from "../config/connectRedis.js";
import { REFRESH_EXPIRES_SEC } from "./generateToken.js";
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
      createdAt: Date.now(),
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

  // blacklisted?
  const black = await redisClient.get(blacklistKey(hashed));
  if (black) return null;

  const v = await redisClient.get(refreshKey(hashed));
  if (!v) return null;

  return JSON.parse(v) as { userId: string; sid: string };
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
  await redisClient.sRem(userSessionsKey(userId), sid);
  await redisClient.del(sessionMetaKey(sid));

  return { userId, sid };
}

/**
 * Blacklist + remove normal session mapping
 */
export async function blacklistRawToken(rawRefreshToken: string, ttl = REFRESH_EXPIRES_SEC) {
  const hashed = hashToken(rawRefreshToken);

  await redisClient.setEx(blacklistKey(hashed), ttl, "blacklisted");

  // Remove real refresh key if exists
  await redisClient.del(refreshKey(hashed));
}

/**
 * Get all user sessions with metadata
 */
export async function getUserSessions(userId: string) {
  const sids = await redisClient.sMembers(userSessionsKey(userId));
  const pipeline = redisClient.multi();

  for (const sid of sids) pipeline.get(sessionMetaKey(sid));
  const rows = await pipeline.exec();

  const sessions = [];
  for (let i = 0; i < sids.length; i++) {
    const raw = rows?.[i];
    const value = (raw as any) ?? null;

    sessions.push({
      sid: sids[i],
      meta: value ? JSON.parse(value) : null,
    });
  }

  return sessions;
}

/**
 * Remove ALL sessions for a user (logout-all)
 */
export async function clearAllSessionsForUser(userId: string) {
  const sids = await redisClient.sMembers(userSessionsKey(userId));

  const pipeline = redisClient.multi();

  for (const sid of sids) {
    pipeline.get(sessionMetaKey(sid));
  }

  const metaRows = await pipeline.exec();

  const pipeline2 = redisClient.multi();

  for (let i = 0; i < sids.length; i++) {
    const sid = sids[i];
    const metaJson = metaRows?.[i] as unknown as string | null;

    const meta = metaJson ? JSON.parse(metaJson) : null;

    // delete refresh:<hashed>
    if (meta?.hashedRefreshToken) {
      pipeline2.del(refreshKey(meta.hashedRefreshToken));
    }

    // delete meta
    pipeline2.del(sessionMetaKey(sid));
  }

  pipeline2.del(userSessionsKey(userId));

  await pipeline2.exec();
}
