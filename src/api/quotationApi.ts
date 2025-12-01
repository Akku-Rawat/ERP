import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getAllQuotations: `${base_url}.quotation.api.get_all_quotations`,
  getQuotationDetails: `${base_url}.quotation.api.get_quotation_details`,
  createQuotation: `${base_url}.quotation.api.create_quotation`,
  deleteQuotation: `${base_url}.quotation.api.delete_quotation`,
  updateQuotationTerms: `${base_url}.quotation.api.update_quotation_terms_and_conditions_by_id`,
  updateQuotationAddress: `${base_url}.quotation.api.update_quotation_address`,
  updateQuotation: `${base_url}.quotation.api.update_quotation`,
};

export async function getAllQuotations(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllQuotations);
  return resp.data?.data || [];
}

export async function getQuotationById(id: string): Promise<any> {
  const url = `${ENDPOINTS.getQuotationDetails}?quotation_id=${encodeURIComponent(id)}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data?.data ?? null;
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
