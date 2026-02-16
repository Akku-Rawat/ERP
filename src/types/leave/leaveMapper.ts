import { STATUS_MAP } from "../leave/leaveStatus";
import type { BackendStatus } from "../leave/leaveStatus";
import type { LeaveUI } from "../leave/uiLeave";
import type { LeaveAllocationUI } from "../leave/uiLeave";
import type { LeaveBalanceUI } from "./leaveBalance";

const normalizeStatus = (status: string) => {
  if (!status) return "Pending";

  if (
    status === "Pending" ||
    status === "Approved" ||
    status === "Rejected" ||
    status === "Cancelled"
  ) {
    return status;
  }

  return STATUS_MAP[status as BackendStatus] ?? "Pending";
};

export const mapLeaveFromApi = (l: any): LeaveUI => ({
  id: l.leaveId,

  employeeId: l.employee?.employeeId,
  employeeName: l.employee?.employeeName,
  department: l.employee?.department,

  leaveType: l.leaveType?.name ?? l.leaveType,

  startDate: l.duration?.fromDate ?? l.fromDate,
  endDate: l.duration?.toDate ?? l.toDate,
  totalDays: l.duration?.totalDays ?? l.totalDays ?? 0,

  reason: l.leaveReason ?? l.reason ?? "-",

  status: normalizeStatus(l.status),

  appliedOn: l.appliedOn,
});

export const mapAllocationFromApi = (a: any): LeaveAllocationUI => {
  const allocated = a.totalLeavesAllocated ?? 0;
  const remaining = a.unusedLeaves ?? 0;

  return {
    id: a.id,
    leaveType: a.leaveType,
    period: `${a.fromDate} → ${a.toDate}`,
    allocated,
    used: allocated - remaining,
    remaining,
  };
};

export const mapLeaveBalanceFromApi = (data: any): LeaveBalanceUI => {
  const summary = data?.summary ?? {};
  const balances = data?.leaveBalances ?? [];

  return {
    summary: {
      totalAllocated: Number(summary.totalAllocated ?? 0),
      totalTaken: Number(summary.totalTaken ?? 0),
      totalExpired: Number(summary.totalExpired ?? 0),
      totalClosingBalance: Number(summary.totalClosingBalance ?? 0),
    },
    balances: balances.map((l: any) => ({
      leaveType: l.leaveType,
      allocated: Number(l.newLeavesAllocated ?? 0),
      taken: Number(l.leavesTaken ?? 0),
      remaining: Number(l.closingBalance ?? 0),
    })),
  };
};
