import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379", // change if your Redis uses a different host/port
});

async function clearCache() {
  try {
    await redisClient.connect();
    const result = await redisClient.del("category_tree");
    console.log(`🧹 Deleted category_tree key (${result} deleted)`);
    await redisClient.disconnect();
  } catch (err) {
    console.error("Error clearing Redis key:", err);
  }
}

clearCache();
