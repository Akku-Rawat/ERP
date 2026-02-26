import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";
import { API, ERP_BASE } from "../config/api";

const api = createAxiosInstance(ERP_BASE);

export type SalarySlipListItem = {
  name: string;
  employee: string;
  salary_structure: string;
  start_date: string;
  end_date: string;
  status: string;
  total_earnings: number;
  total_deduction: number;
  net_pay: number;
};

export type SalarySlipListResponse = {
  salary_slips: SalarySlipListItem[];
  pagination?: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
};

export type SalarySlipDetail = SalarySlipListItem & {
  employee_name?: string;
  company?: string;
  earnings?: { component: string; amount: number }[];
  deductions?: { component: string; amount: number }[];
};

export async function getSalarySlips(params?: {
  employee?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}): Promise<SalarySlipListResponse> {
  const url = API.payrollSetup.salarySlip.getAll;
  const resp: AxiosResponse = await api.get(url, {
    params: {
      employee: params?.employee ?? "",
      status: params?.status ?? "",
      start_date: params?.start_date ?? "",
      end_date: params?.end_date ?? "",
      page: params?.page,
      page_size: params?.page_size,
    },
  });

  return resp.data?.data ?? resp.data;
}

export async function getSalarySlipById(salarySlipId: string): Promise<SalarySlipDetail | null> {
  const base = API.payrollSetup.salarySlip.getById;
  const url = `${base}?salarySlipId=${encodeURIComponent(salarySlipId)}`;
  const resp: AxiosResponse = await api.get(url);
  return (resp.data?.data ?? resp.data) || null;
}
