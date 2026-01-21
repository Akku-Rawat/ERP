import { STATUS_MAP } from "../leave/leaveStatus";
import type { BackendStatus } from "../leave/leaveStatus";
import type { LeaveUI } from "../leave/uiLeave";

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
