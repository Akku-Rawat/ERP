import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

import { API, ERP_BASE } from "../config/api";
const api = createAxiosInstance(ERP_BASE);
export const LookupAPI = API.lookup;

export async function getUnitOfMeasureList(): Promise<any> {
  const resp: AxiosResponse = await api.get(LookupAPI.getUnitOfMeasure);
  return resp.data || [];
}

export async function getItemClassList(): Promise<any> {
  const resp: AxiosResponse = await api.get(LookupAPI.getItemClasses);
  return resp.data || [];
}

export async function getPackagingUnitCodes(): Promise<any> {
  const resp: AxiosResponse = await api.get(LookupAPI.getPackagingUnits);
  return resp.data || [];
}

export async function getCountryList(): Promise<any> {
  const resp: AxiosResponse = await api.get(LookupAPI.getCountries);
  return resp.data || [];
}
