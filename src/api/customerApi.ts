import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;

const api = createAxiosInstance(base_url);

const GET_CUSTOMER_ENDPOINT = `${base_url}.customer.customer.get_customer_by_id`;
const GET_CUSTOMERS_ENDPOINT = `${base_url}.customer.customer.get_all_customers_api`;
const CREATE_CUSTOMER_ENDPOINT = `${base_url}.customer.customer.create_customer_api`;
const DELETE_CUSTOMER_ENDPOINT = `${base_url}.customer.customer.delete_customer_by_id`;
const UPDATE_CUSTOMER_ENDPOINT = `${base_url}.customer.customer.update_customer_by_id`;

export interface Customer {
  id: string | number;
  customer_name: string;
  [key: string]: any;
}


export async function getAllCustomers(): Promise<Customer[]> {
  const resp: AxiosResponse = await api.get(GET_CUSTOMERS_ENDPOINT);
  return resp.data?.data || [];
}


export async function deleteCustomerById(id: string): Promise<any> {
  return api.delete(`${DELETE_CUSTOMER_ENDPOINT}?id=${id}`);
}

export async function createCustomer(payload: any) {
  const resp = await api.post(CREATE_CUSTOMER_ENDPOINT, payload);
  return resp.data;
}

export async function getCustomerByCustomerCode(item_code: string): Promise<Customer> {
  const resp: AxiosResponse = await api.get(
    `${GET_CUSTOMER_ENDPOINT}?custom_id=${item_code}`
  );

  return resp.data?.data || null;
}

export async function updateCustomerByCustomerCode(
  custom_id: string,
  payload: any
): Promise<any> {
  const resp = await api.put(
    `${UPDATE_CUSTOMER_ENDPOINT}?id=${custom_id}`,
    payload
  );

  return resp.data;
}
