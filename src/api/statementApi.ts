import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

import { API, ERP_BASE } from "../config/api";
const api = createAxiosInstance(ERP_BASE);
export const CustomerAPI = API.customer;

export async function getCustomerStatement(
  customerId: string,
  page: number = 1,
  page_size: number = 10,
): Promise<any> {
  const resp: AxiosResponse = await api.get(CustomerAPI.getStatement, {
    params: {
      id: customerId,
      page,
      page_size,
    },
  });

  return resp.data;
}
