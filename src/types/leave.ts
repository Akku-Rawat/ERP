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


export type PendingLeave = {
  leaveId: string;
  employee: {
    employeeName: string | null;
  };
  leaveType: {
    name: string;
  };
  duration: {
    fromDate: string;
    toDate: string;
    totalDays: number;
  };
  leaveReason: string;
  status: "OPEN";
  appliedOn: string;
};


export type PendingLeaveResponse = {
  status_code: number;
  status: string;
  message: string;
  data: {
    leaves: PendingLeave[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
};


export type UpdateLeaveStatusResponse = {
  leaveId: string;
  newStatus: "Approved" | "Rejected";
};




export type UpdateLeaveStatusPayload = {
  leaveId: string;
  status: "Approved" | "Rejected";
  rejectionReason?: string;
};
