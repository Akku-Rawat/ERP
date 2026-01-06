import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getAllEmployees: `${base_url}.hrms.napsa_client.employee.api.get_all_employees`,
  getEmployeeById: `${base_url}.hrms.napsa_client.employee.api.get_employee_by_id`,
  createEmployee: `${base_url}.hrms.napsa_client.employee.api.create_employee`,
  deleteEmployee: `${base_url}.hrms.napsa_client.employee.api.delete_employee_by_id`,
  updateEmployee: `${base_url}.hrms.napsa_client.employee.api.update_employee_by_id`,
};

type GetEmployeesParams = {
  page?: number;
  page_size?: number;
  status?: string;
  department?: string;
  jobTitle?: string;
  workLocation?: string;
};

export async function getAllEmployees(
  params: GetEmployeesParams
): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllEmployees, {
    params,
  });
  return resp.data;
}

export async function getAllCustomers(
  page: number = 1,
  page_size: number = 5
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
  custom_id: string
): Promise<any> {
  const url = `${ENDPOINTS.getCustomerById}?custom_id=${custom_id}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data || null;
}

export async function updateCustomerByCustomerCode(
  custom_id: string,
  payload: any
): Promise<any> {
  const url = `${ENDPOINTS.updateCustomer}?id=${custom_id}`;
  const resp: AxiosResponse = await api.patch(url, payload);
  return resp.data;
}
