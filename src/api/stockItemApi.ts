import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

export async function getStockById(id: string) {
  const url = `${base_url}erpnext.zra_client.stock.stock.get_stock_by_id?id=${id}`;
  const resp = await api.get(url);
  return resp.data?.data || {};
}

export async function getAllStockItems() {
  const url = `${base_url}.item.item.get_all_items_api?page=1&page_size=100&taxCategory=`;
  const resp = await api.get(url);
  return resp.data?.data || [];
}
