import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

import { API, ERP_BASE } from "../config/api";
const api = createAxiosInstance(ERP_BASE);
export const ModuleAPI = API.modules;

export async function getAllModules(): Promise<any> {
  const resp: AxiosResponse = await api.get(ModuleAPI.getAll);
  return resp.data;
}

export async function getModuleByKey(key: string): Promise<any> {
  const url = `${ModuleAPI.getByKey}?key=${key}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data || null;
}

export async function createModule(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ModuleAPI.create, payload);
  return resp.data;
}

export async function updateModuleByKey(
  key: string,
  payload: any,
): Promise<any> {
  const url = `${ModuleAPI.update}?key=${key}`;
  const resp: AxiosResponse = await api.patch(url, payload);
  return resp.data;
}

export async function deleteModuleByKey(key: string): Promise<any> {
  const url = `${ModuleAPI.delete}?key=${key}`;
  const resp: AxiosResponse = await api.delete(url);
  return resp.data;
}
