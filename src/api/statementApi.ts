import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_CUSTOMER_STATEMENT_API_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getCustomerStatement: `${base_url}.get_customer_statement`,
};



export async function getCustomerStatement(
  customerId: string,
  page: number = 1,
  page_size: number = 10,
): Promise<any> {
  const resp: AxiosResponse = await api.get(
    ENDPOINTS.getCustomerStatement,
    {
      params: {
        id: customerId,
        page,
        page_size,
      },
    },
  );

  return resp.data;
}


