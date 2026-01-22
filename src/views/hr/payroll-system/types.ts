// types.ts - All TypeScript interfaces and types

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  grade: string;
  joiningDate: string;
  bankAccount: string;
  ifscCode: string;
  pfNumber: string;
  esiNumber?: string;
  panNumber: string;
  taxStatus: string;
  isActive: boolean;
  basicSalary: number;
  hra: number;
  allowances: number;
  managerId?: string;
}

export interface AttendanceRecord {
  employeeId: string;
  month: string;
  year: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  weeklyOffs: number;
  holidays: number;
  paidLeaves: number;
  unpaidLeaves: number;
  halfDays: number;
  overtimeHours: number;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  leaveType: "Casual" | "Sick" | "Earned" | "LWP" | "Maternity" | "Paternity";
  fromDate: string;
  toDate: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
  isPaid: boolean;
}

export interface LoanRecord {
  id: string;
  employeeId: string;
  loanType: "Personal" | "Home" | "Vehicle" | "Emergency";
  amount: number;
  remainingAmount: number;
  emiAmount: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Closed";
}

export interface AdvanceRecord {
  id: string;
  employeeId: string;
  amount: number;
  deductionAmount: number;
  remainingAmount: number;
  reason: string;
  date: string;
  status: "Pending" | "Approved" | "Deducting" | "Completed";
}

export interface Bonus {
  id: string;
  label: string;
  bonusType: "Performance" | "Festival" | "Retention" | "Referral" | "Project";
  amount: number;
  approved: boolean;
  date: string;
  approvedBy?: string;
}

export interface Arrear {
  id: string;
  label: string;
  amount: number;
  fromDate: string;
  toDate: string;
  reason: string;
}

export interface TaxInvestment {
  employeeId: string;
  section80C: number;
  section80D: number;
  hra: number;
  homeLoanInterest: number;
  other: number;
  regime: "Old" | "New";
}

export interface PayrollRecord {
  id: string;
  payrollName: string;
  employeeId: string;
  employeeName: string;
  email: string;
  department: string;
  designation: string;
  grade: string;
  joiningDate: string;
  bankAccount: string;
  ifscCode: string;
  pfNumber: string;
  panNumber: string;

  // Attendance
  workingDays: number;
  paidDays: number;
  absentDays: number;
  leaveDays: number;

  // Earnings
  basicSalary: number;
  hra: number;
  allowances: number;
  bonuses?: Bonus[];
  totalBonus: number;
  arrears: number;
  arrearDetails?: Arrear[];
  overtimePay: number;

  // Deductions
  taxDeduction: number;
  pfDeduction: number;
  esiDeduction: number;
  professionalTax: number;
  loanDeduction: number;
  advanceDeduction: number;
  otherDeductions: number;

  // Calculations
  grossPay: number;
  totalDeductions: number;
  netPay: number;

  // Status & Workflow
  status:
    | "Draft"
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Processing"
    | "Paid"
    | "Failed";
  paymentDate?: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;

  // Tax
  taxRegime: "Old" | "New";
  taxableIncome: number;
  taxSavings: number;
}

export interface PayrollEntry {
  postingDate: string;
  payrollName: string;
  currency: string;
  company: string;
  payrollPayableAccount: string;
  status: string;
  salarySlipTimesheet: boolean;
  deductTaxForProof: boolean;
  payrollFrequency: string;
  startDate: string;
  endDate: string;
  paymentAccount: string;
  costCenter: string;
  project: string;
  letterHead: string;
  selectedEmployees: string[];
  // filters
  branch?: string;
  department?: string;
  designation?: string;
  grade?: string;
}

export interface ApprovalWorkflow {
  id: string;
  payrollRecordId: string;
  employeeId: string;
  employeeName: string;
  requestedBy: string;
  requestDate: string;
  approverIds: string[];
  currentApprover: string;
  status: "Pending" | "Approved" | "Rejected";
  comments: string[];
  approvalHistory: {
    approverId: string;
    action: "Approved" | "Rejected";
    date: string;
    comment: string;
  }[];
}

export interface BankTransferRecord {
  id: string;
  payrollRecordId: string;
  employeeId: string;
  employeeName: string;
  bankAccount: string;
  ifscCode: string;
  amount: number;
  status: "Pending" | "Processed" | "Failed";
  transactionId?: string;
  processedDate?: string;
}

export interface PayrollReport {
  month: string;
  year: number;
  totalEmployees: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  departmentWise: {
    department: string;
    count: number;
    gross: number;
    net: number;
  }[];
  taxCollected: number;
  pfCollected: number;
  esiCollected: number;
}
