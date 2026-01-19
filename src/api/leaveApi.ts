// src/api/leaveApi.ts
import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const leave_apply_url = import.meta.env.VITE_LEAVE_APPLY as string;
const api = createAxiosInstance(leave_apply_url);

export async function applyLeave(payload: {
  employeeId: string;
  leaveType: string;
  leaveFromDate: string;
  leaveToDate: string;
  isHalfDay: boolean;
  leaveReason: string;
  leaveStatus: string;
  approverId: string;
}): Promise<any> {
  const resp: AxiosResponse = await api.post("", payload);
  return resp.data;
}

export async function getMyLeaveHistory(): Promise<AxiosResponse> {
  const resp: AxiosResponse = await api.get("/my-history");
  return resp.data;
}


export async function cancelLeave(
  leaveId: string
): Promise<AxiosResponse> {
  const resp: AxiosResponse = await api.put(`/${leaveId}/cancel`);
  return resp.data;
}


export async function getAllEmployeeLeaveHistory(): Promise<any> {
  const resp = await api.get("/all-history");
  return resp.data;
}
