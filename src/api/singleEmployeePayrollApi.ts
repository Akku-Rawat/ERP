import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";
import { API, ERP_BASE } from "../config/api";

const api = createAxiosInstance(ERP_BASE);

export type SingleEmployeePayrollPayload = {
  employeeId: string;
  payrollDate: string;
  salaryBreakdown: Record<string, number>;
  statutoryDeductions: Record<string, number>;
};

export async function runSingleEmployeePayroll(payload: SingleEmployeePayrollPayload): Promise<any> {
  const url = API.payrolls.singleEmployeePayroll;
  const resp: AxiosResponse = await api.post(url, payload);
  return resp.data?.data ?? resp.data;
}
