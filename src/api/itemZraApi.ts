import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

import { API, ERP_BASE } from "../config/api";
const api = createAxiosInstance(ERP_BASE);
export const LookupAPI = API.lookup;
// Generic function to avoid repeating code
export async function fetchList(endpoint: string): Promise<any> {
  const resp: AxiosResponse = await api.get(endpoint);
  return resp.data;
}

export const getPackagingUnits = () => fetchList(LookupAPI.getPackagingUnits);
export const getCountries = () => fetchList(LookupAPI.getCountries);
export const getUOMs = () => fetchList(LookupAPI.getUnitOfMeasure);
export const getItemClasses = async () => {
  const res = await LookupAPI.getItemClasses;
  return res;
};
