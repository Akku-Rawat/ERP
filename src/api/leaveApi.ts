// src/api/leaveApi.ts
import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";

const base_url = import.meta.env.VITE_HRMS_API_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  applyLeave: `${base_url}.leave.api.create_leave_application`,
  myLeaveHistory: `${base_url}.my_leave_history_api`,
  cancelLeave: `${base_url}.cancel_leave_api`,
  allLeaveHistory: `${base_url}.leave.api.get_all_leaves`,
  pendingLeaves: `${base_url}.leave.api.get_pending_leaves`,
  updateLeaveStatus: `${base_url}.leave.api.update_leave_status`, 
  leaveBalance: `${base_url}.leave.api.get_employee_leave_balance`,

};

export type ApplyLeavePayload = {
  employeeId: string;
  leaveType: string;
  leaveFromDate: string;
  leaveToDate: string;
  isHalfDay: boolean;
  leaveReason: string;
  leaveStatus: string;
  approverId?: string;
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

export async function getAllEmployeeLeaveHistory(
  page: number = 1,
  pageSize: number = 100
): Promise<any> {
  const resp: AxiosResponse = await api.get(
    ENDPOINTS.allLeaveHistory,
    {
      params: {
        page,
        page_size: pageSize,
      },
    }
  );

  return resp.data;
}


export type UpdateLeaveStatusPayload = {
  leaveId: string;
  status: "Approved" | "Rejected";
  rejectionReason?: string;
};

export async function updateLeaveStatus(
  payload: UpdateLeaveStatusPayload
): Promise<{
  leaveId: string;
  newStatus: string;
}> {
  const resp = await api.patch(
    ENDPOINTS.updateLeaveStatus,
    payload
  );

  return resp.data.data;
}



export async function getPendingLeaveRequests(
  page: number = 1,
  pageSize: number = 50
): Promise<any> {
  const resp: AxiosResponse = await api.get(
    ENDPOINTS.pendingLeaves,
    {
      params: {
        page,
        page_size: pageSize,
      },
    }
  );

  return resp.data;
}


export async function getEmployeeLeaveBalance(): Promise<any> {
  const resp: AxiosResponse = await api.get(
    ENDPOINTS.leaveBalance
  );

  return resp.data;
}
