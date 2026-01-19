export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  grade: string;
  joiningDate: string;
  bankAccount: string;
  pfNumber: string;
  taxStatus: string;
  isActive: boolean;
  basicSalary: number;
  hra: number;
  allowances: number;
}

export interface Bonus {
  id: string;
  label: string;
  amount: number;
  approved: boolean;
  date: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  email: string;
  department: string;
  designation: string;
  grade: string;
  joiningDate: string;
  bankAccount: string;
  pfNumber: string;
  workingDays: number;
  paidDays: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  bonuses?: Bonus[];
  arrears: number;
  grossPay: number;
  taxDeduction: number;
  pfDeduction: number;
  otherDeductions: number;
  netPay: number;
  status: "Draft" | "Pending" | "Processing" | "Paid" | "Failed";
  paymentDate?: string;
  createdDate: string;
  taxRegime: "Old" | "New";
}