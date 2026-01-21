
import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";
import type {
  ApplyLeavePayload,
  UpdateLeaveStatusPayload,
  UpdateLeaveStatusResponse,
  PendingLeaveResponse,
    UpdateLeaveApplicationPayload,        
  UpdateLeaveApplicationResponse, 
} from "../types/leave/leave";


const base_url = import.meta.env.VITE_HRMS_API_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  applyLeave: `${base_url}.leave.api.create_leave_application`,
  allLeaveHistory: `${base_url}.leave.api.get_all_leaves`,
  pendingLeaves: `${base_url}.leave.api.get_all_pending_leaves`,
  updateLeaveStatus: `${base_url}.leave.api.update_leave_status`, 
    leaveHistoryByEmployee:`${base_url}.leave.api.get_leaves_by_employee_id`,
  leaveById:`${base_url}.leave.api.get_leave_by_id`,
   cancelLeave: `${base_url}.leave.api.cancel_leave`,
     updateLeaveApplication:`${base_url}.leave.api.update_leave_application`,
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


export async function updateLeaveStatus(
  payload: UpdateLeaveStatusPayload
): Promise<UpdateLeaveStatusResponse> {
  const resp = await api.patch(
    ENDPOINTS.updateLeaveStatus,
    payload
  );

  return resp.data.data;
}


export async function getPendingLeaveRequests(
  page: number = 1,
  pageSize: number = 100
): Promise<PendingLeaveResponse> {
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


export async function getLeaveHistoryByEmployee(
  employeeId: string,
  page: number = 1,
  pageSize: number = 10
) {
  const resp: AxiosResponse = await api.get(
    ENDPOINTS.leaveHistoryByEmployee,
    {
      params: {
        employeeId,
        page,
        pageSize,
      },
    }
  );

  return resp.data;
}


export async function getLeaveById(leaveId: string) {
  const resp: AxiosResponse = await api.get(
    ENDPOINTS.leaveById,
    {
      params: { leaveId },
    }
  );

  return resp.data;
}

export async function cancelLeave(leaveId: string) {
  const resp = await api.patch(
    ENDPOINTS.cancelLeave,
    { leaveId }
  );

  return resp.data;
}


export async function updateLeaveApplication(
  payload: UpdateLeaveApplicationPayload
): Promise<UpdateLeaveApplicationResponse> {
  const resp = await api.put(
    ENDPOINTS.updateLeaveApplication,
    payload
  );

  return resp.data;
}
