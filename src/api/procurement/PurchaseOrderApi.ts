import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "../axiosInstance";

const base_url = import.meta.env.VITE_PO_API_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  createPO: `${base_url}.order.create_purchase_order`,
  getPOList: `${base_url}.order.get_purchase_orders`,
  getPOById: `${base_url}.order.get_purchase_order`,
  updatePO: `${base_url}.order.update_purchase_order`,
  getPurchaseOrders: `${base_url}.order.get_purchase_orders`,
   updatePOStatus: `${base_url}.order.update_purchase_order_status`,
};


export async function getPurchaseOrders(page = 1, pageSize = 10) {
  const resp = await api.get(
    `${ENDPOINTS.getPOList}?page=${page}&page_size=${pageSize}`
  );
  return resp.data;
}



export async function createPurchaseOrder(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createPO, payload);
  return resp.data;
}



export async function getPurchaseOrderById(id: string | number): Promise<any> {
  const resp = await api.get(
    `${ENDPOINTS.getPOById}?id=${id}`
  );
  return resp.data;
}




export async function updatePurchaseOrder(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.patch(ENDPOINTS.updatePO, payload);
  return resp.data;
}


export async function getPurchaseOrdersBySupplier(
  supplierName: string,
  page = 1,
  pageSize = 5,
  status = ""
) {
  const resp = await api.get(ENDPOINTS.getPurchaseOrders, {
    params: {
      supplier: supplierName,
      page,
      page_size: pageSize,
      status,
    },
  });

  return {
    data: resp.data?.data || [],
    pagination: resp.data?.pagination || {
      total: 0,
      total_pages: 1,
    },
  };
}


export async function updatePurchaseOrderStatus(
  id: string,
  status: string,
): Promise<any> {
  const resp: AxiosResponse = await api.patch(
    ENDPOINTS.updatePOStatus,
    {
      id,
      status: status.toLowerCase(), 
    }
  );
  return resp.data;
}
