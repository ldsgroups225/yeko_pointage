import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "@/config/constants";
import { getItem } from "@/store/mmkvStorage";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

api.interceptors.request.use(
  async (config) => {
    const token = getItem<string>("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
