// frontend: utils/cloudinaryUpload.ts
export async function getSignature(folder = "temp/products") {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/upload/signature?folder=${folder}`);
  if (!res.ok) throw new Error("Failed to get signature");
  return res.json(); // { signature, timestamp, apiKey, cloudName, folder }
}

export async function uploadFileDirect(file: File) {
  const sig = await getSignature("products");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", sig.timestamp);
  formData.append("signature", sig.signature);
  formData.append("folder", sig.folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await uploadRes.json();
  if (!uploadRes.ok) throw new Error(data.error?.message || "Upload failed");
  console.log(data)
  // return useful metadata
  return {
    public_id: data.public_id,
    url: data.secure_url,
    width: data.width,
    height: data.height,
    format: data.format,
    size: data.bytes,
  };
}
