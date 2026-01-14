import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url =
  import.meta.env.VITE_LOOKUP_BASE_URL || import.meta.env.VITE_BASE_URL;
const api = createAxiosInstance(base_url);
const vite_class_list_api_url=import.meta.env.VITE_CLASS_LIST_API_URL as string;
const vite_country_list_api_url = import.meta.env.VITE_COUNTRY_LIST_API_URL as string;
const vite_unit_of_measurement_api_url = import.meta.env.VITE_UNIT_OF_MEASURE_LIST_API_URL as string;
const vite_packaging_unit_codes_api_url = import.meta.env.VITE_PACKAGING_UNIT_CODES_API_URL as string;

const ENDPOINTS = {
  getUnitOfMeasureList: `${vite_unit_of_measurement_api_url}/unit-of-measure-list`,
  getItemClassList:`${vite_class_list_api_url}/item-class-list/`,
  getPackagingUnitCodes: `${ vite_packaging_unit_codes_api_url}/packaging-unit-codes`,
  getCountryList: `${vite_country_list_api_url}/country-list/`,
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