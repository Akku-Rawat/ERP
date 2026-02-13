import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  createItemStock: `${base_url}.stock.stock.create_item_stock_api`,
  getAllStockEntries: `${base_url}.stock.stock.get_all_stock_entries`,
  deleteStockEntry: `${base_url}.stock.stock.delete_stock_entry`,
  correctStock: `${base_url}.stock.stock.correct_stock`,
};

export async function createItemStock(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.createItemStock,
    payload,
  );
  return resp.data;
}

export async function getAllStockEntries(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllStockEntries);
  return resp.data?.data || [];
}

export async function getStockById(id: string): Promise<any> {
  const url = `${base_url}.stock.stock.get_stock_by_id?id=${id}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data;
}

export async function deleteStockEntry(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.delete(ENDPOINTS.deleteStockEntry, {
    data: payload,
  });
  return resp.data;
}

export async function correctStock(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.correctStock, payload);
  return resp.data;
}
