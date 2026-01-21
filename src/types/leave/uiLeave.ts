import type { UIStatus } from "./leaveStatus";
export type LeaveUI = {
  id: string;
  employeeId?: string;
  employeeName?: string;
  department?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: UIStatus;
  appliedOn: string;
};
