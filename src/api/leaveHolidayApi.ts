import { createAxiosInstance } from "./axiosInstance";
const base_url = import.meta.env.VITE_HRMS_API_URL;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  list: `${base_url}.holidays.api.get_holidays`,
  create: `${base_url}.holidays.api.create_holiday`,
  update: `${base_url}.holidays.api.update_holiday`,
  delete: `${base_url}.holidays.api.delete_holiday`,
};

export const getHolidays = (page = 1, page_size = 20) =>
  api.get(ENDPOINTS.list, { params: { page, page_size } });

export const createHoliday = (payload: any) =>
  api.post(ENDPOINTS.create, payload);

export const updateHoliday = (payload: any) =>
  api.put(ENDPOINTS.update, payload);

export const deleteHoliday = (id: number) =>
  api.delete(ENDPOINTS.delete, { data: { id } });
