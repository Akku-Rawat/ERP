import axios from "axios";
import type { AxiosInstance } from "axios";
export const createAxiosInstance = (
  baseURL: string,
  withAuth: boolean = true
): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (withAuth) {
    instance.defaults.headers.common["Authorization"] =
      import.meta.env.VITE_AUTHORIZATION;
  }

  return instance;
};