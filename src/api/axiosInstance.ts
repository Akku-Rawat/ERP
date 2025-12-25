import axios from "axios";
import type { AxiosInstance } from "axios";

export const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const AUTH = import.meta.env.VITE_AUTHORIZATION;

  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: AUTH,
    },
  });
};
