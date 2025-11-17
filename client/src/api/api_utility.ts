import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";


const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "content-type": "application/json",
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
)

// intentApi.ts
const intentApi = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api"});

intentApi.interceptors.request.use((config) => {
  const intentToken = localStorage.getItem("intentToken");
  if (intentToken) {
    config.headers.Authorization = `Bearer ${intentToken}`;
  }
  return config;
});

export default intentApi;





api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Example: logout user or redirect
      console.warn("Unauthorized — maybe redirect to login");
    }

    // Throw error to be handled in calling code
    return Promise.reject(error);
  }
);


// Create shortcut functions for each HTTP method
export const GET = (
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => api.get(url, config);
export const PUT = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => api.put(url, data, config);
export const POST = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => api.post(url, data, config);
export const DELETE = (
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => api.delete(url, config);




// // services/api.ts
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE,
//   withCredentials: true,
// });

// let isRefreshing = false;
// let queue: { resolve: (v?: any) => void; reject: (e?: any) => void }[] = [];

// const processQueue = (error: any) => {
//   queue.forEach(p => {
//     if (error) p.reject(error);
//     else p.resolve();
//   });
//   queue = [];
// };

// api.interceptors.response.use(
//   res => res,
//   async err => {
//     const originalReq = err.config;
//     if (err.response?.status === 401 && !originalReq._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           queue.push({ resolve, reject });
//         }).then(() => api(originalReq));
//       }
//       originalReq._retry = true;
//       isRefreshing = true;
//       try {
//         await api.get("/auth/refresh"); // server rotates and sets cookies
//         processQueue(null);
//         return api(originalReq);
//       } catch (e) {
//         processQueue(e);
//         window.location.href = "/login";
//         return Promise.reject(e);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;
