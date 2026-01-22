import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL_QO as string;
const api = createAxiosInstance(base_url);
const vite_quotation_api_url = import.meta.env.VITE_QUOTATION_API_URL as string;

const ENDPOINTS = {
  getAllQuotations: `${vite_quotation_api_url}.get_all_quotations`,
  getQuotationDetails: `${vite_quotation_api_url}.get_quotation_details`,
  getQuotationById: `${vite_quotation_api_url}.get_quotation_by_id`,

  createQuotation: `${vite_quotation_api_url}.create_quotation`,
  deleteQuotation: `${base_url}.quotation.api.delete_quotation`,
  updateQuotationTerms: `${vite_quotation_api_url}.update_quotation_terms_and_conditions_by_id`,
  updateQuotationAddress: `${vite_quotation_api_url}.update_quotation_address`,
  updateQuotation: `${base_url}.quotation.api.update_quotation`,
};

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
  const resp = await api.get(ENDPOINTS.getAllQuotations, {
    params: {
      page,
      page_size,
      ...filters,
    },
  });
  return resp.data;
}

export async function getQuotationById(id: string): Promise<any> {
  const url = `${ENDPOINTS.getQuotationById}?id=${encodeURIComponent(id)}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data ?? null;
}

export async function createQuotation(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.createQuotation,
    payload,
  );
  return resp.data;
}

export async function deleteQuotationById(id: string): Promise<any> {
  const resp: AxiosResponse = await api.delete(ENDPOINTS.deleteQuotation, {
    data: { quotation_id: id },
  });
  return resp.data;
}

export async function updateQuotationTermsById(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.put(
    ENDPOINTS.updateQuotationTerms,
    payload,
  );
  return resp.data;
}

export async function updateQuotationAddressById(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.put(
    ENDPOINTS.updateQuotationAddress,
    payload,
  );
  return resp.data;
}

export async function updateQuotationById(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.put(ENDPOINTS.updateQuotation, payload);
  return resp.data;
}
