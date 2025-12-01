import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getAllItems: `${base_url}.item.item.get_all_items_api`,
  getItemByCode: `${base_url}.item.item.get_item_by_id_api`,
  deleteItem: `${base_url}.item.item.delete_item_by_code_api`,
  updateItem: `${base_url}.item.item.update_item_api`,
  createItem: `${base_url}.item.item.create_item_api`,
};

export async function getAllItems(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllItems);
  return resp.data?.data || [];
}

export async function getItemByItemCode(item_code: string): Promise<any> {
  const url = `${ENDPOINTS.getItemByCode}?item_code=${item_code}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data?.data || null;
}

export async function deleteItemByItemCode(id: string): Promise<any> {
  const url = `${ENDPOINTS.deleteItem}?item_code=${id}`;
  const resp: AxiosResponse = await api.delete(url);
  return resp.data;
}

export async function createItem(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createItem, payload);
  return resp.data;
}

export async function updateItemByItemCode(
  item_code: string,
  payload: any,
): Promise<any> {
  const url = `${ENDPOINTS.updateItem}?item_code=${item_code}`;
  const resp: AxiosResponse = await api.put(url, payload);
  return resp.data;
}
