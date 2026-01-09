import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getAllItems: `${base_url}.item.item.get_all_items_api`,
  getItemByCode: `${base_url}.item.item.get_item_by_id_api`,
  // deleteItem: `${base_url}.item.item.delete_item_by_code_api`,
  deleteItem: `${base_url}.item.item.delete_item_by_id`,
  updateItem: `${base_url}.item.item.update_item_api`,
  createItem: `${base_url}.item.item.create_item_api`,
};

export async function getAllItems(
  page: number = 1,
  page_size: number = 10,
  taxCategory: string | undefined = undefined,
): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllItems, {
    params: { page, page_size, taxCategory },
  });
  return resp.data;
}

export async function getItemByItemCode(itemCode: string): Promise<any> {
  const url = `${ENDPOINTS.getItemByCode}?id=${itemCode}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data || null;
}

export async function deleteItemByItemCode(id: string): Promise<any> {
  const url = `${ENDPOINTS.deleteItem}?id=${id}`;
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
