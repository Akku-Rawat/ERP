import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";
import type { ApiSingleResponse } from "../types/api";
import type { ItemGroup } from "../types/itemCategory";

import { API, ERP_BASE } from "../config/api";
const api = createAxiosInstance(ERP_BASE);
export const ItemGroupAPI = API.itemGroup;

export async function getAllItemGroups(
  page: number = 1,
  page_size: number = 130,
  itemType?: string,
): Promise<any> {
  let url = `${ItemGroupAPI.getAll}?page=${page}&page_size=${page_size}`;
  
  if (itemType) {
    url += `&itemType=${itemType}`;
  }

  return resp.data;
}


export async function getItemGroupById(
  id: string,
): Promise<ApiSingleResponse<ItemGroup>> {
  const url = `${ItemGroupAPI.getById}?id=${id}`;
  const resp: AxiosResponse<ApiSingleResponse<ItemGroup>> = await api.get(url);
  return resp.data || null;
}

export async function createItemGroup(
  payload: Partial<ItemGroup>,
): Promise<any> {
  const resp: AxiosResponse = await api.post(ItemGroupAPI.create, payload);
  return resp.data;
}

export async function updateItemGroupById(
  id: string,
  payload: Partial<ItemGroup>,
): Promise<any> {
  const url = `${ItemGroupAPI.update}?id=${id}`;
  const resp: AxiosResponse = await api.put(url, payload);
  return resp.data;
}

export async function deleteItemGroupById(id: string): Promise<any> {
  const resp: AxiosResponse = await api.delete(ItemGroupAPI.delete, {
    data: { id },
  });
  return resp.data;
}
