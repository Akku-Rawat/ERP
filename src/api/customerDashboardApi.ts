import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

import { API, ERP_BASE } from "../config/api";

const api = createAxiosInstance(ERP_BASE);

export const CustomerDashboardAPI = API.customerDashboard;

export type CustomerDashboardSummaryResponse = {
  status_code: number;
  status: string;
  message: string;
  data: {
    cards: {
      totalCustomers: number;
      totalIndividualCustomers: number;
      totalCompanyCustomers: number;
      lopCustomers: number;
      exportCustomers: number;
      nonExportCustomers: number;
    };
  };
};

export async function getCustomerDashboardSummary(): Promise<CustomerDashboardSummaryResponse> {
  const resp: AxiosResponse<CustomerDashboardSummaryResponse> = await api.get(
    CustomerDashboardAPI.summary,
  );
  return resp.data;
}
