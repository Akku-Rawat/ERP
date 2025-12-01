import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getSuppliers: `${base_url}.supplier.api.get_suppliers`,
  createSupplier: `${base_url}.supplier.api.create_supplier`,
  getSupplierById: `${base_url}.supplier.api.get_supplier_details_id`,
  updateSupplier: `${base_url}.supplier.api.update_supplier`,
  deleteSupplier: `${base_url}.supplier.api.delete_supplier`,
};

export async function getSuppliers(): Promise<any[]> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getSuppliers);
  return resp.data?.data || [];
}

export async function createSupplier(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createSupplier, payload);
  return resp.data;
}

export async function getSupplierById(id: string | number): Promise<any> {
  const resp: AxiosResponse = await api.get(
    `${ENDPOINTS.getSupplierById}?custom_supplier_id=${id}`
  );
  return resp.data;
}

export async function updateSupplier(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.put(ENDPOINTS.updateSupplier, payload);
  return resp.data;
}

export async function deleteSupplier(id: string | number): Promise<any> {
  const resp: AxiosResponse = await api.delete(
    `${ENDPOINTS.deleteSupplier}?custom_supplier_id=${id}`
  );
  return resp.data;
}
