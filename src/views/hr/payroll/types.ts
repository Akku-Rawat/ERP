export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  grade: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  workingDays: number;
  isActive: boolean;
}
export type Bonus = {
  id: string;
  label: string;
  amount: number;
  approved: boolean;
};

export interface PayrollRecord {

  bonuses?: Bonus[];  
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  grade: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  grossPay: number;
  taxDeduction: number;
  pfDeduction: number;
  otherDeductions: number;
  netPay: number;
  status: 'Paid' | 'Pending' | 'Processing' | 'Failed';
  paymentDate: string | null;
  bankAccount: string;
  workingDays: number;
  paidDays: number;
}



