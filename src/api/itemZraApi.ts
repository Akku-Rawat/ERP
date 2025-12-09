import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_ITEM_API_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  packagingUnitCodes: `${base_url}/packaging-unit-codes/`,
  countryList: `${base_url}/country-list/`,
  unitOfMeasureList: `${base_url}/unit-of-measure-list/`,
  itemClassList: `${base_url}/item-class-list/`,
};

// Generic function to avoid repeating code
export async function fetchList(endpoint: string): Promise<any> {
  const resp: AxiosResponse = await api.get(endpoint);
  return resp.data;
}

export const getPackagingUnits = () => fetchList(ENDPOINTS.packagingUnitCodes);
export const getCountries = () => fetchList(ENDPOINTS.countryList);
export const getUOMs = () => fetchList(ENDPOINTS.unitOfMeasureList);
export const getItemClasses = () => fetchList(ENDPOINTS.itemClassList);