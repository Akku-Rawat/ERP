import type { AxiosResponse } from "axios";
import { createAxiosInstance } from "./axiosInstance";
import type {
  ApplyLeavePayload,
  UpdateLeaveStatusPayload,
  UpdateLeaveStatusResponse,
  PendingLeaveResponse,
  UpdateLeaveApplicationPayload,
  UpdateLeaveApplicationResponse,
  CreateLeaveAllocationPayload,
  CreateLeaveAllocationResponse,
  LeaveAllocationListResponse,
} from "../types/leave/leave";

const base_url = import.meta.env.VITE_HRMS_API_URL as string;
const api = createAxiosInstance(base_url);

const ENDPOINTS = {
  applyLeave: `${base_url}.leave.api.create_leave_application`,
  allLeaveHistory: `${base_url}.leave.api.get_all_leaves`,
  pendingLeaves: `${base_url}.leave.api.get_all_pending_leaves`,
  updateLeaveStatus: `${base_url}.leave.api.update_leave_status`,
  leaveHistoryByEmployee: `${base_url}.leave.api.get_leaves_by_employee_id`,
  leaveById: `${base_url}.leave.api.get_leave_by_id`,
  cancelLeave: `${base_url}.leave.api.cancel_leave`,
  updateLeaveApplication: `${base_url}.leave.api.update_leave_application`,
  createLeaveAllocation: `${base_url}.leave_allocation.api.create_leave_allocation`,
  getLeaveAllocationsByEmployee: `${base_url}.leave_allocation.api.get_leave_allocations_by_employee_id`,
  getLeaveBalance: `${base_url}.leave_balance.api.get_employee_leave_balance_report`,
  getHolidays: `${base_url}.holidays.api.get_holidays`,
};

export async function applyLeave(payload: ApplyLeavePayload): Promise<any> {
  const resp: AxiosResponse = await api.post(ENDPOINTS.applyLeave, payload);
  return resp.data;
}

export async function getAllEmployeeLeaveHistory(
  page: number = 1,
  pageSize: number = 100,
): Promise<any> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.allLeaveHistory, {
    params: {
      page,
      page_size: pageSize,
    },
  });

  return resp.data;
}

export async function updateLeaveStatus(
  payload: UpdateLeaveStatusPayload,
): Promise<UpdateLeaveStatusResponse> {
  const resp = await api.patch(ENDPOINTS.updateLeaveStatus, payload);

  return resp.data.data;
}

export async function getPendingLeaveRequests(
  page: number = 1,
  pageSize: number = 100,
): Promise<PendingLeaveResponse> {
  const resp: AxiosResponse = await api.get(ENDPOINTS.pendingLeaves, {
    params: {
      page,
      page_size: pageSize,
    },
  });

  return resp.data;
}

export async function getLeaveHistoryByEmployee(
  employeeId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  const resp: AxiosResponse = await api.get(ENDPOINTS.leaveHistoryByEmployee, {
    params: {
      employeeId,
      page,
      pageSize,
    },
  });

  return resp.data;
}

export async function getLeaveById(leaveId: string) {
  const resp: AxiosResponse = await api.get(ENDPOINTS.leaveById, {
    params: { leaveId },
  });

  return resp.data;
}

export async function cancelLeave(leaveId: string) {
  const resp = await api.patch(ENDPOINTS.cancelLeave, { leaveId });

  return resp.data;
}

export async function updateLeaveApplication(
  payload: UpdateLeaveApplicationPayload,
): Promise<UpdateLeaveApplicationResponse> {
  const resp = await api.patch(ENDPOINTS.updateLeaveApplication, payload);

  return resp.data;
}

export async function createLeaveAllocation(
  payload: CreateLeaveAllocationPayload,
): Promise<CreateLeaveAllocationResponse> {
  const resp = await api.post(ENDPOINTS.createLeaveAllocation, payload);

  return resp.data;
}

export async function getLeaveAllocationsByEmployee(
  employeeId: string,
  page = 1,
  pageSize = 10,
): Promise<LeaveAllocationListResponse> {
  const resp = await api.get(ENDPOINTS.getLeaveAllocationsByEmployee, {
    params: {
      employeeId,
      page,
      pageSize,
    },
  });

  return resp.data;
}

export async function getEmployeeLeaveBalanceReport(params: {
  employeeId: string;
  fromDate: string;
  toDate: string;
  page?: number;
  page_size?: number;
}) {
  const resp = await api.get(ENDPOINTS.getLeaveBalance, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 100,
      employeeId: params.employeeId,
      fromDate: params.fromDate,
      toDate: params.toDate,
    },
  });

  return resp.data;
}

export async function getHolidays(params?: {
  page?: number;
  page_size?: number;
}) {
  const resp: AxiosResponse = await api.get(ENDPOINTS.getHolidays, {
    params: {
      page: params?.page ?? 1,
      page_size: params?.page_size ?? 20,
    },
  });

  return resp.data;
}
