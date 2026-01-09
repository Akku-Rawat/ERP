import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_HRMS_API_URL as string;
const napsa_member_url = import.meta.env.VITE_NAPSA_MEMBER_API_URL as string;

const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getAllEmployees: `${base_url}.employee.api.get_all_employees`,
  getEmployeeById: `${base_url}.employee.api.get_employee`,
  createEmployee: `${base_url}.employee.api.create_employee`,
  deleteEmployee: `${base_url}.employee.api.delete_employee`,
  updateEmployee: `${base_url}.employee.api.update_employee`,
  updateEmployeeDocuments: `${base_url}.employee.api.manage_employee_documents`,
  fetchEmployeeByNrc: `${napsa_member_url}.member.api.get_napsa_member`,
};

export async function getAllEmployees(
  page: number = 1,
  page_size: number = 10,
  status?: string,
  department?: string,
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

export async function updateEmployeeById(payload: any): Promise<any> {
  const resp = await api.patch(ENDPOINTS.updateEmployee, payload);
  return resp.data;
}

export async function deleteEmployeeById(id: string): Promise<any> {
  const url = `${ENDPOINTS.deleteEmployee}?id=${id}`;
  const resp: AxiosResponse = await api.delete(url);
  return resp.data;
}

export async function updateEmployeeDocuments(payload: FormData): Promise<any> {
  const resp: AxiosResponse = await api.put(
    ENDPOINTS.updateEmployeeDocuments,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return resp.data;
}

//verification of employee identity via NRC or SSN
export async function verifyEmployeeIdentity(
  type: "NRC" | "SSN",
  value: string,
): Promise<any> {
  const payload = type === "NRC" ? { nrc: value } : { ssn: value };

  const resp: AxiosResponse = await api.post(
    ENDPOINTS.fetchEmployeeByNrc,
    payload,
  );

  return resp.data;
}
