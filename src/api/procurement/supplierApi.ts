import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "../axiosInstance";


import { API, ERP_BASE } from "../../config/api";
const api = createAxiosInstance(ERP_BASE);

export const SupplierAPI = API.supplier;




export async function getSuppliers(page = 1, pageSize = 10) {
  const resp = await await api.get(SupplierAPI.getAll,
    {
    params: {
      page,
      pageSize
      
    },
  }
    
  );
  return resp.data;
  return resp.data;
}


export async function createSupplier(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(SupplierAPI.create, payload);
  return resp.data;
}

export async function getSupplierById(id: string | number): Promise<any> {
  const resp = await api.get(
    `${SupplierAPI.getById}?supplierId=${id}`
  );
  return resp.data;
}


export async function updateSupplier(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.patch(SupplierAPI.update, payload);
  return resp.data;
}

