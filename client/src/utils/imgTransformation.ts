export const getCloudinaryImage = (
  url: string,
  options: { width?: number; height?: number; crop?: string; quality?: string; format?: string } = {}
) => {
  const { width, height, crop = "fill", quality = "auto", format = "auto" } = options;
  return url.replace(
    "/upload/",
    `/upload/w_${width || ""},h_${height || ""},c_${crop},q_${quality},f_${format}/`
  );
};
