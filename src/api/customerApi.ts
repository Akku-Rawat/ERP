import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getCustomerById: `${base_url}.customer.customer.get_customer_by_id`,
  getAllCustomers: `${base_url}.customer.customer.get_all_customers_api`,
  createCustomer: `${base_url}.customer.customer.create_customer_api`,
  deleteCustomer: `${base_url}.customer.customer.delete_customer_by_id`,
  updateCustomer: `${base_url}.customer.customer.update_customer_by_id`,
};


export async function getAllCustomers(
  page: number = 1,
  page_size: number = 10
): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllCustomers, {
    params: { page, page_size },
  });
  return resp.data;
}



export async function deleteCustomerById(id: string): Promise<any> {
  const url = `${ENDPOINTS.deleteCustomer}?id=${id}`;
  const resp: AxiosResponse = await api.delete(url);
  return resp.data;
}

export async function createCustomer(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createCustomer, payload);
  return resp.data;
}

export async function getCustomerByCustomerCode(
  custom_id: string,
): Promise<any> {
  const url = `${ENDPOINTS.getCustomerById}?custom_id=${custom_id}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data || null;
}

export async function updateCustomerByCustomerCode(
  custom_id: string,
  payload: any,
): Promise<any> {
  const url = `${ENDPOINTS.updateCustomer}?id=${custom_id}`;
  const resp: AxiosResponse = await api.patch(url, payload);
  return resp.data;
}
