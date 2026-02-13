/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  createItemStock: `${base_url}.stock.stock.create_item_stock_api`,
  getAllStockEntries: `${base_url}.stock.stock.get_all_stock_entries`,
  deleteStockEntry: `${base_url}.stock.stock.delete_stock_entry`,
  correctStock: `${base_url}.stock.stock.correct_stock`,
  getAllItemsApi: `${base_url}.zra_client.item.item.get_all_items_api`,
  getAllImportItems: `${base_url}.item.imports.api.get_all_import_items`,
  getImportItemById: `${base_url}.item.imports.api.get_import_item_by_id`,
};

export async function createItemStock(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.createItemStock,
    payload,
  );
  return resp.data;
}

// Fetch all items for import table
export async function getAllItemsApi(params: {
  page?: number;
  page_size?: number;
  taxCategory?: string;
}): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllItemsApi, {
    params,
  });
  return resp.data?.data || [];
}

export async function getAllStockEntries(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllStockEntries);
  return resp.data?.data || [];
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

// Fetch all import items
export async function getAllImportItems(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllImportItems);
  return resp.data?.data || [];
}

// Fetch import item by ID
export async function getImportItemById(id: string): Promise<any> {
  const url = `${ENDPOINTS.getImportItemById}?id=${id}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data?.data || null;
}
