import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;

const api = createAxiosInstance(base_url);

const GET_ITEMS_ENDPOINT = `${base_url}.item.item.get_all_items_api`;
const GET_ITEM_ENDPOINT = `${base_url}.item.item.get_item_by_id_api`;
const DELETE_ITEM_ENDPOINT = `${base_url}.item.item.delete_item_by_code_api`;
const UPDATE_ITEM_ENDPOINT = `${base_url}.item.item.update_item_api`;
const CREATE_ITEM_ENDPOINT = `${base_url}.item.item.create_item_api`;


export interface Item {
  item_code: string;
  item_name: string;
  [key: string]: any;
}

export async function getAllItems(): Promise<Item[]> {
  const resp: AxiosResponse = await api.get(GET_ITEMS_ENDPOINT);
  return resp.data?.data || [];
}

export async function getItemByItemCode(item_code: string): Promise<Item> {
  const resp: AxiosResponse = await api.get(
    `${GET_ITEM_ENDPOINT}?item_code=${item_code}`
  );

  return resp.data?.data || null;
}

export async function deleteItemByItemCode(id: string): Promise<any> {
  return api.delete(`${DELETE_ITEM_ENDPOINT}?item_code=${id}`);
}

export async function createItem(payload: any) {
  const resp = await api.post(CREATE_ITEM_ENDPOINT, payload);
  return resp.data;
}

export async function updateItemByItemCode(
  item_code: string,
  payload: any
): Promise<any> {
  const resp = await api.put(
    `${UPDATE_ITEM_ENDPOINT}?item_code=${item_code}`,
    payload
  );

  return resp.data;
}
