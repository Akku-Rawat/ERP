import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getAllItemGroups: `${base_url}.item.item.get_all_item_groups_api`,
  createItemGroup: `${base_url}.item.item.create_item_group_api`,
  updateItemGroup: `${base_url}.item.item.update_item_group_api`,
  deleteItemGroup: `${base_url}.item.item.delete_item_group`,
};

export interface ItemGroup {
  name: string;
  item_group_name: string;
  custom_description: string | null;
  custom_unit_of_measurement: string | null;
  custom_selling_price: number | null;
  custom_sales_account: string | null;
  [key: string]: any;
}

export async function getAllItemGroups(): Promise<ItemGroup[]> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllItemGroups);
  return resp.data?.data || [];
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
