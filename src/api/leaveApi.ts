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
