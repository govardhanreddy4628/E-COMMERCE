// utils/otpGuard.ts
import redisClient from "../config/connectRedis.js";

export async function checkOtpAttempts(key: string) {
  const attempts = Number(await redisClient.get(key)) || 0;
  if (attempts >= 5) throw new Error("Too many OTP attempts");
}

export async function recordOtpAttempt(key: string) {
  const tx = redisClient.multi();
  tx.incr(key);
  tx.expire(key, 10 * 60);
  await tx.exec();
}

export async function throttleOtpSend(key: string) {
  if (await redisClient.get(key)) {
    throw new Error("OTP recently sent. Try again later.");
  }
  await redisClient.setEx(key, 60, "1"); // 1 min
}
