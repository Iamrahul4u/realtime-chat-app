import axios from "axios";
import { toast } from "sonner";

const ENV = import.meta.env;

export const axiosInstance = axios.create({
  baseURL: ENV.VITE_NODE_ENV === "development" ? ENV.VITE_BACKEND_URL : "/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || "Something went wrong";
    return Promise.reject(message);
  }
);
