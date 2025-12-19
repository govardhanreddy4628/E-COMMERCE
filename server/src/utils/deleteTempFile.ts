
import fs from "fs/promises";

export async function deleteTempFile(filePath?: string) {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      console.warn("⚠️ Failed to delete temp file:", err);
    }
    // ENOENT is NORMAL → ignore
  }
}
