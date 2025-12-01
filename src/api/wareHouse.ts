import type { AxiosResponse } from "axios";
import {createAxiosInstance} from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getAllWarehouses: `${base_url}.stock.warehouse.get_all_warehouses`,
  createWarehouse: `${base_url}.stock.warehouse.create_warehouse_api`,
  updateWarehouse: `${base_url}.stock.warehouse.update_warehouse_api`,
  deleteWarehouse: `${base_url}.stock.warehouse.delete_warehouse_api`,
};

export async function getAllWarehouses(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllWarehouses);
  return resp.data?.data || [];
}

export async function createWarehouse(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createWarehouse, payload);
  return resp.data;
}

export async function updateWarehouseById(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.put(ENDPOINTS.updateWarehouse, payload);
  return resp.data;
}

export async function deleteWarehouseById(id: string): Promise<any> {
  const resp: AxiosResponse = await api.delete(ENDPOINTS.deleteWarehouse, {
    data: { warehouse_id: id },
  });
  return resp.data;
}
