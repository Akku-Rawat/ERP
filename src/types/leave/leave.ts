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


export type Leave = {
  leaveId: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  isHalfDay: boolean;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  appliedOn: string;
  rejectionReason?: string;
};


export type LeaveHistoryResponse = {
  status_code: number;
  status: string;
  message: string;
  data: {
    employee: {
      employeeId: string;
      employeeName: string;
      department: string;
    };
    pagination: {
      page: number;
      page_size: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
    leaves: Leave[];
  };
};


export type LeaveDetailResponse = {
  status_code: number;
  status: string;
  message: string;
  data: {
    leaveId: string;
    employee: {
      employeeId: string;
      employeeName: string;
      department: string;
    };
    leaveType: string;
    fromDate: string;
    toDate: string;
    totalDays: number;
    isHalfDay: boolean;
    leaveReason: string;
    status: "Pending" | "Approved" | "Rejected";
    appliedOn: string;
    approver: string | null;
    rejectionReason?: string;
  };
};


export type CancelLeaveResponse = {
  status_code: number;
  status: "success" | "fail";
  message: string;
};


export type UpdateLeaveApplicationPayload = {
  leaveId: string;
  leaveType?: string;
  leaveFromDate?: string;
  leaveToDate?: string;
  isHalfDay?: boolean;
  leaveReason?: string;
};


export type UpdateLeaveApplicationResponse = { 
  status_code: number; 
  status: "success" | "fail"; 
  message: string;
 };