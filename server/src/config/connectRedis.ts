// server/config/connectRedis.ts
import { createClient } from "redis";
import "colors";

const redisUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_URL // For cloud Redis later
    : "redis://127.0.0.1:6379"; // Local Redis for dev

if (!redisUrl) {
  throw new Error("❌ REDIS_URL is not defined in environment variables");
}

const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("❌ Redis: too many retries, giving up.".red);
        return new Error("Redis connection failed");
      }
      console.log(`🔄 Redis retry attempt #${retries}`.yellow);
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("connect", () => console.log("🔌 Redis connecting...".cyan));
redisClient.on("ready", () => console.log("✅ Redis connected".green));
redisClient.on("error", (err) => console.error("❌ Redis error:", err.message));
redisClient.on("end", () => console.log("⚠️ Redis disconnected".yellow));

export default redisClient;
