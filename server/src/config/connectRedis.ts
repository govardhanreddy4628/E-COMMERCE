import { createClient } from "redis";
import "colors";

const redisUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_URL_PROD
    : process.env.REDIS_URL_DEV;

if (!redisUrl) {
  throw new Error("❌ Redis URL is not defined in environment variables");
}

// Detect if using TLS
const useTLS = redisUrl.startsWith("rediss://");

// Create client
const redisClient = createClient({
  url: redisUrl,
  socket: useTLS
    ? {
        tls: true,
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            console.error("❌ Redis: too many retries, giving up.".red);
            return new Error("Redis connection failed");
          }
          console.log(`🔄 Redis retry attempt #${retries}`.yellow);
          return Math.min(retries * 100, 3000);
        },
      }
    : {
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
