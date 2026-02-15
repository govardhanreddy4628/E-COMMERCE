// utils/cloudinaryDelete.ts

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL_LOCAL ||
  import.meta.env.VITE_BACKEND_URL;

export async function deleteCloudinaryImage(publicId: string) {
  const res = await fetch(`${BASE_URL}/api/v1/upload/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Delete failed");
  }
}
