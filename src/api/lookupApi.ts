import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url =
  import.meta.env.VITE_LOOKUP_BASE_URL || import.meta.env.VITE_BASE_URL;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getUnitOfMeasureList: `${base_url}/api/unit-of-measure-list`,
  getItemClassList: `${base_url}/api/item-class-list`,
  getPackagingUnitCodes: `${base_url}/api/packaging-unit-codes`,
  getCountryList: `http://41.60.191.7:4002/api/country-list/`,
};

export async function getUnitOfMeasureList(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getUnitOfMeasureList);
  return resp.data || [];
}

export async function getItemClassList(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getItemClassList);
  return resp.data || [];
}

export async function getPackagingUnitCodes(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getPackagingUnitCodes);
  return resp.data || [];
}

export async function getCountryList(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getCountryList);
  return resp.data || [];
}
