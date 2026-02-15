// services/intentApi.ts
import axios from "axios";

const intentApi = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL_LOCAL || "http://localhost:5000/api",
});

intentApi.interceptors.request.use((config) => {
  const intentToken = localStorage.getItem("intentToken");
  if (intentToken) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${intentToken}`;
  }
  return config;
});

export default intentApi;
