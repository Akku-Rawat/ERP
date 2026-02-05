import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

import { API, ERP_BASE } from "../config/api";
const api = createAxiosInstance(ERP_BASE);
export const QuotationAPI = API.quotation;

export type QuotationFilters = {
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
};

export async function getAllQuotations(
  page: number = 1,
  page_size: number = 10,
  filters?: QuotationFilters,
): Promise<any> {
  const resp = await api.get(QuotationAPI.getAll, {
    params: {
      page,
      page_size,
      ...filters,
    },
  });
  return resp.data;
}

export async function getQuotationById(id: string): Promise<any> {
  const url = `${QuotationAPI.getById}?id=${encodeURIComponent(id)}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data ?? null;
}

export async function createQuotation(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(QuotationAPI.create, payload);
  return resp.data;
}

export async function deleteQuotationById(id: string): Promise<any> {
  const resp: AxiosResponse = await api.delete(QuotationAPI.delete, {
    data: { quotation_id: id },
  });
  return resp.data;
}

export async function updateQuotationTermsById(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.put(QuotationAPI.updateTerms, payload);
  return resp.data;
}

export async function updateQuotationAddressById(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.put(
    QuotationAPI.updateAddress,
    payload,
  );
  return resp.data;
}

export async function updateQuotationById(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.put(QuotationAPI.update, payload);
  return resp.data;
}
