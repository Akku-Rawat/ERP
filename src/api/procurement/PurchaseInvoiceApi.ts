import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "../axiosInstance";



import { API, ERP_BASE } from "../../config/api";
const api = createAxiosInstance(ERP_BASE);
export const purchaseinvoiceapi = API.purchaseIvoice;


export async function createPurchaseInvoice(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(purchaseinvoiceapi.create, payload);
  return resp.data;
}

export async function getPurchaseInvoices(page = 1, pageSize = 10) {
  const resp = await api.get(
    `${purchaseinvoiceapi.getAll}?page=${page}&page_size=${pageSize}`
  );
  return resp.data;
}

export async function getPurchaseInvoiceById(
  pId: string | number
) {
  const resp = await api.get(
    `${purchaseinvoiceapi.getById}?id=${pId}`
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
    purchaseinvoiceapi.updateStatus,
    
    payload
  );

  return resp.data;
}
