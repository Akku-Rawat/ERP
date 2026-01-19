// src/api/leaveApi.ts
import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_HRMS_API_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  applyLeave: `${base_url}.leave.api.create_leave_application`,
  myLeaveHistory: `${base_url}.my_leave_history_api`,
  cancelLeave: `${base_url}.cancel_leave_api`,
  allLeaveHistory: `${base_url}.all_leave_history_api`,
};

export type ApplyLeavePayload = {
  employeeId: string;
  leaveType: string;
  leaveFromDate: string;
  leaveToDate: string;
  isHalfDay: boolean;
  leaveReason: string;
  leaveStatus: string;
  approverId: string;
};

export async function applyLeave(
  payload: ApplyLeavePayload
): Promise<any> {
  const resp: AxiosResponse = await api.post(
    ENDPOINTS.applyLeave,
    payload
  );
  return resp.data;
}

export async function getMyLeaveHistory(): Promise<any> {
  const resp: AxiosResponse = await api.get(
    ENDPOINTS.myLeaveHistory
  );
  return resp.data;
}

export async function cancelLeave(
  leaveId: string
): Promise<any> {
  const url = `${ENDPOINTS.cancelLeave}?leave_id=${leaveId}`;
  const resp: AxiosResponse = await api.put(url);
  return resp.data;
}

export async function getAllEmployeeLeaveHistory(): Promise<any> {
  const resp: AxiosResponse = await api.get(
    ENDPOINTS.allLeaveHistory
  );
  return resp.data;
}
