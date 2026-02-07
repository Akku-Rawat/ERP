import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "../axiosInstance";

const base_url = import.meta.env.VITE_PO_API_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  createPi: `${base_url}.invoice.create_purchase_invoice`,
  getPiList: `${base_url}.invoice.get_all_purchase_invoices`,
  
  getPiById: `${base_url}.invoice.get_purchase_invoice_by_id`,
  getPurchaseInvoices: `${base_url}.invoice.get_purchase_invoices`,
   updatePiStatus: `${base_url}.invoice.update_purchase_invoices_status`,
};
export async function createPurchaseInvoice(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createPi, payload);
  return resp.data;
}

export async function getPurchaseInvoices(page = 1, pageSize = 10) {
  const resp = await api.get(
    `${ENDPOINTS.getPiList}?page=${page}&page_size=${pageSize}`
  );
  return resp.data;
}

export async function getPurchaseInvoiceById(
  pId: string | number
) {
  const resp = await api.get(
    `${ENDPOINTS.getPiById}?id=${pId}`
  );

  return resp.data;
}


// UPDATE STATUS
export async function updatePurchaseinvoiceStatus(
  id: string | number,
  status: string
): Promise<any> {
  const payload = {
    id,
    status,
  };

  const resp: AxiosResponse = await api.patch(
    ENDPOINTS.updatePiStatus,
    payload
  );

  return resp.data;
}
