import cron from "node-cron";
import cloudinary from "../config/cloudinary.js";
import productModel from "../models/productModel.js";

// Utility: Sleep helper to avoid hitting Cloudinary rate limits
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Helper: Fetch all Cloudinary resources under a given prefix (handles pagination)
 */
async function fetchAllCloudinaryResources(prefix: string) {
  let allResources: any[] = [];
  let nextCursor: string | undefined;

  try {
    do {
      const res = await cloudinary.api.resources({
        type: "upload",
        prefix,
        max_results: 500,
        next_cursor: nextCursor,
      });
      allResources.push(...res.resources);
      nextCursor = res.next_cursor;
      if (nextCursor) await sleep(300);
    } while (nextCursor);
  } catch (err) {
    console.error(
      `💥 [Fetch] Failed to fetch resources for prefix: ${prefix}`,
      err,
    );
  }

  return allResources;
}

/**
 * 🧹 Job 1: Delete temporary images older than 24 hours
 * These are the ones uploaded directly to `temp/products/` but never finalized
 */
cron.schedule("0 3 * * *", async () => {
  console.log("🧹 [CleanupJob] Starting temp upload cleanup...");

  try {
    const allTemp = await fetchAllCloudinaryResources("temp/products/");
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours

    const oldTempImages = allTemp.filter(
      (img: any) => new Date(img.created_at).getTime() < cutoff,
    );

    if (oldTempImages.length) {
      const publicIds = oldTempImages.map((img: any) => img.public_id);
      console.log(
        `🗑️ [Temp Cleanup] Deleting ${publicIds.length} old temp images...`,
      );
      await cloudinary.api.delete_resources(publicIds);
      console.log(`✅ [Temp Cleanup] Deleted ${publicIds.length} old images.`);
    } else {
      console.log("✨ [Temp Cleanup] No old temp images found.");
    }
  } catch (err) {
    console.error("💥 [Temp Cleanup] Error:", err);
  }
});

/**
 * 🧠 Job 2: Delete orphaned images under `products/` that aren't linked to any DB product
 * Runs every 6 hours
 */
cron.schedule("0 */6 * * *", async () => {
  console.log("🔄 [CleanupJob] Starting orphaned image cleanup...");

  try {
    const allCloudinaryImages = await fetchAllCloudinaryResources("products/");

    // Get all used image public_ids from DB
    const allProducts = await productModel.find({}, { "images.public_id": 1 });
    const usedPublicIds = new Set(
      allProducts.flatMap(
        (p) => p.images?.map((img: any) => img.public_id) || [],
      ),
    );

    // Find orphaned Cloudinary images
    const orphanedImages = allCloudinaryImages.filter(
      (img: any) => !usedPublicIds.has(img.public_id),
    );

    if (orphanedImages.length > 0) {
      console.log(
        `🗑️ [Orphan Cleanup] Found ${orphanedImages.length} orphaned images.`,
      );

      const CHUNK_SIZE = 50;
      for (let i = 0; i < orphanedImages.length; i += CHUNK_SIZE) {
        const chunk = orphanedImages.slice(i, i + CHUNK_SIZE);
        await cloudinary.api.delete_resources(
          chunk.map((img: any) => img.public_id),
        );
        console.log(
          `✅ [Orphan Cleanup] Deleted batch ${i / CHUNK_SIZE + 1} (${chunk.length} images)`,
        );
        await sleep(500);
      }

      console.log("✅ [Orphan Cleanup] Completed successfully.");
    } else {
      console.log("✨ [Orphan Cleanup] No orphaned images found.");
    }
  } catch (err) {
    console.error("💥 [Orphan Cleanup] Error:", err);
  }
});

// v2
// import cron from "node-cron";
// import cloudinary from "../config/cloudinary.js";
// import productModel from "../models/product.model.js";

// /**
//  * 🧹 Job 1: Remove old temp uploads (older than 24 hours)
//  * Runs every day at 3 AM.
//  */
// cron.schedule("0 3 * * *", async () => {
//   console.log("🧹 [CleanupJob] Running temp upload cleanup...");

//   try {
//     const { resources } = await cloudinary.api.resources({
//       type: "upload",
//       prefix: "temp/products/", // only temp folder
//       max_results: 500,
//     });

//     const cutoff = Date.now() - 24 * 60 * 60 * 1000; // older than 24h
//     const oldResources = resources.filter(
//       (r: any) => new Date(r.created_at).getTime() < cutoff
//     );

//     if (oldResources.length > 0) {
//       const idsToDelete = oldResources.map((r: any) => r.public_id);
//       await cloudinary.api.delete_resources(idsToDelete);
//       console.log(`✅ [Temp Cleanup] Deleted ${idsToDelete.length} old temp images.`);
//     } else {
//       console.log("✨ [Temp Cleanup] No old temp uploads found.");
//     }
//   } catch (err) {
//     console.error("💥 [Temp Cleanup] Error:", err);
//   }
// });

// /**
//  * 🧠 Job 2: Remove orphaned images (not linked to any product)
//  * Runs every 6 hours.
//  */
// cron.schedule("0 */6 * * *", async () => {
//   console.log("🔄 [CleanupJob] Checking for orphaned product images...");

//   try {
//     // Get all used image public_ids from DB
//     const allProducts = await productModel.find({}, { "images.public_id": 1 });
//     const usedPublicIds = new Set(
//       allProducts.flatMap((p) => p.images.map((img: any) => img.public_id))
//     );

//     // Fetch images in Cloudinary products folder (not just temp)
//     const { resources } = await cloudinary.api.resources({
//       type: "upload",
//       prefix: "products/",
//       max_results: 500,
//     });

//     const orphaned = resources.filter((img: any) => !usedPublicIds.has(img.public_id));

//     if (orphaned.length > 0) {
//       for (const img of orphaned) {
//         await cloudinary.uploader.destroy(img.public_id);
//         console.log(`🗑️ [Orphan Cleanup] Deleted: ${img.public_id}`);
//       }
//       console.log(`✅ [Orphan Cleanup] Deleted ${orphaned.length} unlinked images.`);
//     } else {
//       console.log("✨ [Orphan Cleanup] No orphaned images found.");
//     }
//   } catch (err) {
//     console.error("💥 [Orphan Cleanup] Failed:", err);
//   }
// });
