import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";
import type { ApiSingleResponse } from "../types/api";
import type { ItemGroup } from "../types/itemGroup";

const base_url = import.meta.env.VITE_ITEM_API_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getAllItemGroups: `${base_url}.get_all_item_groups_api`,
  getItemGroupById: `${base_url}.get_item_group_by_id_api`,
  createItemGroup: `${base_url}.create_item_group_api`,
  updateItemGroup: `${base_url}.update_item_group_api`,
  deleteItemGroup: `${base_url}.delete_item_group`,
};

// export async function getAllItemGroups(
//   page: number = 1,
//   page_size: number = 10,
// ): Promise<any> {
//   const resp: AxiosResponse<ApiListResponse<ItemGroup>> = await api.get(
//     ENDPOINTS.getAllItemGroups,
//     {
//       params: { page, page_size },
//     },
//   );
//   return resp.data;
// }
export async function getAllItemGroups(
  page: number = 1,
  page_size: number = 10,
): Promise<any> {
  const url = `${ENDPOINTS.getAllItemGroups}?page=${page}&page_size=${page_size}`;

  const resp = await api.get(url);
  return resp.data;
}

export async function getItemGroupById(
  id: string,
): Promise<ApiSingleResponse<ItemGroup>> {
  const url = `${ENDPOINTS.getItemGroupById}?id=${id}`;
  const resp: AxiosResponse<ApiSingleResponse<ItemGroup>> = await api.get(url);
  return resp.data || null;
}

// export async function getItemGroupByName(
//   groupName: string,
// ): Promise<ApiSingleResponse<ItemGroup>> {
//   const url = `${ENDPOINTS.getItemGroupById}?item_code=${groupName}`;
//   const resp: AxiosResponse<ApiSingleResponse<ItemGroup>> = await api.get(url);
//   return resp.data || null;
// }

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
  id: string,
  payload: Partial<ItemGroup>,
): Promise<any> {
  const url = `${ENDPOINTS.updateItemGroup}?id=${id}`;
  const resp: AxiosResponse = await api.put(url, payload);
  return resp.data;
}

export async function deleteItemGroupById(id: string): Promise<any> {
  const resp: AxiosResponse = await api.delete(ENDPOINTS.deleteItemGroup, {
    data: { id },
  });
  return resp.data;
}
