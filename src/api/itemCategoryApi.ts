import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";
import type { ApiSingleResponse } from "../types/api";
import type { ItemGroup } from "../types/itemCategory";

import { API, ERP_BASE } from "../config/api";
const api = createAxiosInstance(ERP_BASE);
export const ItemGroupAPI = API.itemGroup;

export interface ItemGroupFilters {
  search?: string;
  itemType?: string;
}

export async function getAllItemGroups(
  page = 1,
  page_size = 10,
  filters?: ItemGroupFilters
): Promise<any> {

  const cleanedFilters = Object.fromEntries(
    Object.entries(filters || {}).filter(
      ([_, v]) => v !== undefined && v !== ""
    )
  );

  const resp = await api.get(ItemGroupAPI.getAll, {
    params: {
      page,
      page_size,
      ...cleanedFilters,
    },
  });

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
