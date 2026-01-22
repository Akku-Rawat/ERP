export type LeaveBalanceSummary = {
  totalAllocated: number;
  totalTaken: number;
  totalExpired: number;
  totalClosingBalance: number;
};

export type LeaveBalanceItem = {
  leaveType: string;
  allocated: number;
  taken: number;
  remaining: number;
};

export type LeaveBalanceUI = {
  summary: LeaveBalanceSummary;
  balances: LeaveBalanceItem[];
};
