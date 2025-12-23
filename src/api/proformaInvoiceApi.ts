import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  createProformaInvoice: `${base_url}.proforma.api.create_proforma_api`,
  getProformaInvoiceById: `${base_url}.proforma.api.get_proforma_by_id`,
  getAllProformaInvoices: `http://41.60.191.7:8081/api/method/erpnext.proforma.api.get_proforma_api`,
  updateProformaInvoiceStatus: `${base_url}.proforma.api.update_proforma_status`,
  deleteProformaInvoiceById: `${base_url}.proforma.api.delete_proforma`,
};

export async function createProformaInvoice(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.createProformaInvoice,
    payload,
  );
  return resp.data;
}

export async function getProformaInvoiceById(id: string): Promise<any | null> {
  const url = `${ENDPOINTS.getAllProformaInvoices}?id=${encodeURIComponent(id)}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data ?? null;
}

export async function updateProformaInvoiceStatus(
  proformaInvoiceNumber: string,
  status: string
) {
  const url = `${ENDPOINTS.updateProformaInvoiceStatus}?id=${encodeURIComponent(proformaInvoiceNumber)}`;
  const resp: AxiosResponse = await api.patch(url, {
    invoiceStatus: status,
  });

  return resp.data;
}

export async function getAllProformaInvoices(
  page: number = 1,
  page_size: number = 10
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