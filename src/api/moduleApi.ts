import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_BASE_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  getAllModules: `${base_url}.company-setup.modules.get_all_modules_api`,
  getModuleByKey: `${base_url}.company-setup.modules.get_module_by_key_api`,
  createModule: `${base_url}.company-setup.modules.create_module_api`,
  updateModule: `${base_url}.company-setup.modules.update_module_by_key_api`,
  deleteModule: `${base_url}.company-setup.modules.delete_module_by_key_api`,
};

export async function getAllModules(): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getAllModules);
  return resp.data;
}

export async function getModuleByKey(key: string): Promise<any> {
  const url = `${ENDPOINTS.getModuleByKey}?key=${key}`;
  const resp: AxiosResponse = await api.get(url);
  return resp.data || null;
}

export async function createModule(payload: any): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.createModule, payload);
  return resp.data;
}

export async function updateModuleByKey(
  key: string,
  payload: any,
): Promise<any> {
  const url = `${ENDPOINTS.updateModule}?key=${key}`;
  const resp: AxiosResponse = await api.patch(url, payload);
  return resp.data;
}

export async function deleteModuleByKey(key: string): Promise<any> {
  const url = `${ENDPOINTS.deleteModule}?key=${key}`;
  const resp: AxiosResponse = await api.delete(url);
  return resp.data;
}
