import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";
import type { ApiListResponse, ApiSingleResponse } from "../types/api";
import type { ItemGroup } from "../types/itemGroup";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getAllItemGroups: `${base_url}.item.item.get_all_item_groups_api`,
  getItemGroupByName: `${base_url}.item.item.get_item_group_by_id_api`,
  createItemGroup: `${base_url}.item.item.create_item_group_api`,
  updateItemGroup: `${base_url}.item.item.update_item_group_api`,
  deleteItemGroup: `${base_url}.item.item.delete_item_group`,
};

export async function getAllItemGroups(
  page: number = 1,
  page_size: number = 10,
): Promise<any> {
  const resp: AxiosResponse<ApiListResponse<ItemGroup>> = await api.get(
    ENDPOINTS.getAllItemGroups,
    {
      params: { page, page_size },
    },
  );
  return resp.data;
}

export async function getItemGroupByName(
  groupName: string,
): Promise<ApiSingleResponse<ItemGroup>> {
  const url = `${ENDPOINTS.getItemGroupByName}?name=${groupName}`;
  const resp: AxiosResponse<ApiSingleResponse<ItemGroup>> = await api.get(url);
  return resp.data || null;
}

export async function createItemGroup(
  payload: Partial<ItemGroup>,
): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.createItemGroup,
    payload,
  );
  return resp.data;
}

export async function updateItemGroupById(
  payload: Partial<ItemGroup>,
): Promise<any> {
  const resp: AxiosResponse = await api.put(ENDPOINTS.updateItemGroup, payload);
  return resp.data;
}

export async function deleteItemGroupByName(payload: {
  item_group_name: string;
}): Promise<any> {
  const resp: AxiosResponse = await api.delete(ENDPOINTS.deleteItemGroup, {
    data: payload,
  });
  return resp.data;
}
