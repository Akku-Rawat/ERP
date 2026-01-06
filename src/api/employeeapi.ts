import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getAllEmployees: `${base_url}.hrms.napsa_client.employee.api.get_all_employees`,
  getEmployeeById: `${base_url}.hrms.napsa_client.employee.api.get_employee`,
  createEmployee: `${base_url}.hrms.napsa_client.employee.api.create_employee`,
  deleteEmployee: `${base_url}.hrms.napsa_client.employee.api.delete_employee`,
  updateEmployee: `${base_url}.hrms.napsa_client.employee.api.update_employee`,
  updateEmployeeDocuments: `${base_url}.hrms.napsa_client.employee.api.manage_employee_documents`,
};

export async function getAllEmployees(
  page: number = 1,
  page_size: number = 10,
  status?: string,
  department?: string
): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllEmployees, {
    params: {
      page,
      page_size,
      status,
      department,
    },
  });

  return resp.data;
}

export async function getEmployeeById(id: string): Promise<any> {
  const url = `${ENDPOINTS.getEmployeeById}?id=${id}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data || null;
}

export async function createEmployee(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createEmployee, payload);
  return resp.data;
}

export async function updateEmployeeById(
  id: string,
  payload: any
): Promise<any> {
  const url = `${ENDPOINTS.updateEmployee}?id=${id}`;
  const resp: AxiosResponse = await api.patch(url, payload);
  return resp.data;
}

export async function deleteEmployeeById(id: string): Promise<any> {
  const url = `${ENDPOINTS.deleteEmployee}?id=${id}`;
  const resp: AxiosResponse = await api.delete(url);
  return resp.data;
}

export async function updateEmployeeDocuments(
  employee_id: string,
  payload: any
): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.updateEmployeeDocuments,
    payload,
    {
      params: { employee_id },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return resp.data;
}
