import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL_PRO as string;
const api = createAxiosInstance(base_url);
const vite_proforma_api_url = import.meta.env.VITE_PROFORMA_API_URL as string;

const ENDPOINTS = {
  createProformaInvoice: `${vite_proforma_api_url}.create_proforma_api`,
  getProformaInvoiceById: `${vite_proforma_api_url}.get_proforma_by_id`,
  getAllProformaInvoices: `${vite_proforma_api_url}.get_proforma_api`,
  updateProformaInvoiceStatus: `${vite_proforma_api_url}.proforma.api.update_proforma_status`,
  deleteProformaInvoiceById: `${vite_proforma_api_url}.proforma.api.delete_proforma`,
};

export async function createProformaInvoice(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.createProformaInvoice,
    payload
  );
  return resp.data;
}

export async function getProformaInvoiceById(id: string): Promise<any | null> {
  const url = `${ENDPOINTS.getProformaInvoiceById}?id=${encodeURIComponent(id)}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data ?? null;
}

export async function updateProformaInvoiceStatus(
  proformaInvoiceNumber: string,
  status: string,
) {
  const url = `${ENDPOINTS.updateProformaInvoiceStatus}?id=${encodeURIComponent(proformaInvoiceNumber)}`;
  const resp: AxiosResponse = await api.patch(url, {
    invoiceStatus: status,
  });

  return resp.data;
}

export async function getAllProformaInvoices(
  page: number = 1,
  page_size: number = 10,
): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllProformaInvoices, {
    params: { page, page_size },
  });
  return resp.data;
}

export async function deleteProformaInvoiceById(id: string): Promise<any> {
  const url = `${ENDPOINTS.deleteProformaInvoiceById}?id=${encodeURIComponent(id)}`;
  const resp: AxiosResponse = await api.delete(url);
  return resp.data;
}
