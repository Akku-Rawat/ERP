import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_SUPPLIER_API_URL as string;
const api = createAxiosInstance(base_url);


const ENDPOINTS = {
  getSuppliers: `${base_url}.get_suppliers`,
  createSupplier: `${base_url}.create_supplier`,
  getSupplierById: `${base_url}.get_supplier_details_id`,
  updateSupplier: `${base_url}.update_supplier`,
};


export async function getSuppliers(page = 1, pageSize = 10) {
  const resp = await api.get(
    `${ENDPOINTS.getSuppliers}?page=${page}&page_size=${pageSize}`
  );
  return resp.data;
}


export async function createSupplier(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createSupplier, payload);
  return resp.data;
}

export async function getSupplierById(id: string | number): Promise<any> {
  const resp = await api.get(
    `${ENDPOINTS.getSupplierById}?supplierId=${id}`
  );
  return resp.data;
}


export async function updateSupplier(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.patch(ENDPOINTS.updateSupplier, payload);
  return resp.data;
}


