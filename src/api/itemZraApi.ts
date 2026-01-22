import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_ITEM_API_URL as string;
const api = createAxiosInstance(base_url);

const classApi = createAxiosInstance(
  import.meta.env.VITE_CLASS_LIST_API_URL as string,
);

const vite_class_list_api_url = import.meta.env
  .VITE_CLASS_LIST_API_URL as string;

const vite_country_list_api_url = import.meta.env
  .VITE_COUNTRY_LIST_API_URL as string;
const vite_unit_of_measurement_api_url = import.meta.env
  .VITE_UNIT_OF_MEASURE_LIST_API_URL as string;
const vite_packaging_unit_codes_api_url = import.meta.env
  .VITE_PACKAGING_UNIT_CODES_API_URL as string;

const ENDPOINTS = {
  packagingUnitCodes: `${vite_packaging_unit_codes_api_url}/packaging-unit-codes/`,
  countryList: `${vite_country_list_api_url}/country-list/`,
  unitOfMeasureList: `${vite_unit_of_measurement_api_url}/unit-of-measure-list/`,
  itemClassList: `${vite_class_list_api_url}/item-class-list/`,
};

// Generic function to avoid repeating code
export async function fetchList(endpoint: string): Promise<any> {
  const resp: AxiosResponse = await api.get(endpoint);
  return resp.data;
}

export const getPackagingUnits = () => fetchList(ENDPOINTS.packagingUnitCodes);
export const getCountries = () => fetchList(ENDPOINTS.countryList);
export const getUOMs = () => fetchList(ENDPOINTS.unitOfMeasureList);
export const getItemClasses = async () => {
  const res = await classApi.get("/item-class-list/");
  return res.data;
};
