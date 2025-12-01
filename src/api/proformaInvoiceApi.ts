import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  createProformaInvoice: `${base_url}.proforma.api.create_proforma_invoice`,
  getAllProformaInvoices: `${base_url}.proforma.api.get_proforma_invoices`,
};

export async function createProformaInvoice(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.createProformaInvoice,
    payload,
  );
  return resp.data;
}

export async function getAllProformaInvoices(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllProformaInvoices);
  return resp.data?.data || [];
}
