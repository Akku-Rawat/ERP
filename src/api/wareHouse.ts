import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

import { API, ERP_BASE } from "../config/api";
const api = createAxiosInstance(ERP_BASE);
export const WarehouseAPI = API.warehouse;

export async function getAllWarehouses(): Promise<any> {
  const resp: AxiosResponse = await api.get(WarehouseAPI.getAll);
  return resp.data?.data || [];
}

export async function createWarehouse(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(WarehouseAPI.create, payload);
  return resp.data;
}

export async function updateWarehouseById(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.put(WarehouseAPI.update, payload);
  return resp.data;
}

export async function deleteWarehouseById(id: string): Promise<any> {
  const resp: AxiosResponse = await api.delete(WarehouseAPI.delete, {
    data: { warehouse_id: id },
  });
  return resp.data;
}
