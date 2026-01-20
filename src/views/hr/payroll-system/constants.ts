// constants.ts - Demo data and constant values

import type { Employee, AttendanceRecord, LeaveRecord, LoanRecord, AdvanceRecord } from './types';

export const demoEmployees: Employee[] = [
  { 
    id: "EMP001", 
    name: "Rajesh Kumar", 
    email: "rajesh.kumar@company.com", 
    department: "Engineering", 
    designation: "Senior Developer", 
    grade: "L5", 
    joiningDate: "2020-03-15", 
    bankAccount: "9876543210", 
    ifscCode: "HDFC0001234",
    pfNumber: "PF123456", 
    esiNumber: "ESI789012",
    panNumber: "ABCDE1234F",
    taxStatus: "New Regime", 
    isActive: true, 
    basicSalary: 50000, 
    hra: 20000, 
    allowances: 11000,
    managerId: "MGR001"
  },
  { 
    id: "EMP002", 
    name: "Priya Sharma", 
    email: "priya.sharma@company.com", 
    department: "Sales", 
    designation: "Sales Manager", 
    grade: "L6", 
    joiningDate: "2019-07-22", 
    bankAccount: "8765432109", 
    ifscCode: "ICIC0002345",
    pfNumber: "PF123457", 
    esiNumber: "ESI789013",
    panNumber: "BCDEF2345G",
    taxStatus: "Old Regime", 
    isActive: true, 
    basicSalary: 60000, 
    hra: 24000, 
    allowances: 16000,
    managerId: "MGR001"
  },
  { 
    id: "EMP003", 
    name: "Amit Patel", 
    email: "amit.patel@company.com", 
    department: "Engineering", 
    designation: "Tech Lead", 
    grade: "L7", 
    joiningDate: "2018-01-10", 
    bankAccount: "7654321098", 
    ifscCode: "SBIN0003456",
    pfNumber: "PF123458", 
    esiNumber: "ESI789014",
    panNumber: "CDEFG3456H",
    taxStatus: "New Regime", 
    isActive: true, 
    basicSalary: 75000, 
    hra: 30000, 
    allowances: 20000,
    managerId: "MGR001"
  },
  { 
    id: "EMP004", 
    name: "Sneha Reddy", 
    email: "sneha.reddy@company.com", 
    department: "HR", 
    designation: "HR Manager", 
    grade: "L6", 
    joiningDate: "2021-05-18", 
    bankAccount: "6543210987", 
    ifscCode: "UTIB0004567",
    pfNumber: "PF123459", 
    esiNumber: "ESI789015",
    panNumber: "DEFGH4567I",
    taxStatus: "Old Regime", 
    isActive: true, 
    basicSalary: 55000, 
    hra: 22000, 
    allowances: 13000,
    managerId: "MGR001"
  },
  { 
    id: "EMP005", 
    name: "Vikram Singh", 
    email: "vikram.singh@company.com", 
    department: "Finance", 
    designation: "Financial Analyst", 
    grade: "L4", 
    joiningDate: "2022-09-01", 
    bankAccount: "5432109876", 
    ifscCode: "KKBK0005678",
    pfNumber: "PF123460", 
    esiNumber: "ESI789016",
    panNumber: "EFGHI5678J",
    taxStatus: "New Regime", 
    isActive: true, 
    basicSalary: 45000, 
    hra: 18000, 
    allowances: 9000,
    managerId: "MGR001"
  }
];

export const demoAttendance: AttendanceRecord[] = [
  {
    employeeId: "EMP001",
    month: "January",
    year: 2026,
    totalDays: 31,
    presentDays: 22,
    absentDays: 2,
    weeklyOffs: 5,
    holidays: 2,
    paidLeaves: 2,
    unpaidLeaves: 0,
    halfDays: 1,
    overtimeHours: 8
  },
  {
    employeeId: "EMP002",
    month: "January",
    year: 2026,
    totalDays: 31,
    presentDays: 20,
    absentDays: 0,
    weeklyOffs: 5,
    holidays: 2,
    paidLeaves: 3,
    unpaidLeaves: 1,
    halfDays: 0,
    overtimeHours: 0
  }
];

export const demoLeaves: LeaveRecord[] = [
  {
    id: "LV001",
    employeeId: "EMP001",
    leaveType: "Casual",
    fromDate: "2026-01-15",
    toDate: "2026-01-16",
    days: 2,
    status: "Approved",
    reason: "Personal work",
    isPaid: true
  },
  {
    id: "LV002",
    employeeId: "EMP002",
    leaveType: "Sick",
    fromDate: "2026-01-20",
    toDate: "2026-01-22",
    days: 3,
    status: "Approved",
    reason: "Medical",
    isPaid: true
  },
  {
    id: "LV003",
    employeeId: "EMP002",
    leaveType: "LWP",
    fromDate: "2026-01-25",
    toDate: "2026-01-25",
    days: 1,
    status: "Approved",
    reason: "Personal emergency",
    isPaid: false
  }
];

export const demoLoans: LoanRecord[] = [
  {
    id: "LOAN001",
    employeeId: "EMP001",
    loanType: "Personal",
    amount: 100000,
    remainingAmount: 50000,
    emiAmount: 5000,
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    status: "Active"
  },
  {
    id: "LOAN002",
    employeeId: "EMP003",
    loanType: "Vehicle",
    amount: 200000,
    remainingAmount: 150000,
    emiAmount: 10000,
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    status: "Active"
  }
];

export const demoAdvances: AdvanceRecord[] = [
  {
    id: "ADV001",
    employeeId: "EMP002",
    amount: 20000,
    deductionAmount: 10000,
    remainingAmount: 10000,
    reason: "Medical emergency",
    date: "2025-12-15",
    status: "Deducting"
  }
];

export const TAX_SLABS_OLD = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 }
];

export const TAX_SLABS_NEW = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 5 },
  { min: 600000, max: 900000, rate: 10 },
  { min: 900000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 }
];

export const PF_RATE = 0.12;
export const ESI_RATE = 0.0075; // 0.75%
export const ESI_EMPLOYER_RATE = 0.0325; // 3.25%
export const PROFESSIONAL_TAX = 200;
export const STANDARD_DEDUCTION = 50000;
export const OVERTIME_RATE_PER_HOUR = 200;

export const LEAVE_TYPES = [
  { value: 'Casual', label: 'Casual Leave', paid: true },
  { value: 'Sick', label: 'Sick Leave', paid: true },
  { value: 'Earned', label: 'Earned Leave', paid: true },
  { value: 'LWP', label: 'Leave Without Pay', paid: false },
  { value: 'Maternity', label: 'Maternity Leave', paid: true },
  { value: 'Paternity', label: 'Paternity Leave', paid: true }
];

export const BONUS_TYPES = [
  { value: 'Performance', label: 'Performance Bonus' },
  { value: 'Festival', label: 'Festival Bonus' },
  { value: 'Retention', label: 'Retention Bonus' },
  { value: 'Referral', label: 'Referral Bonus' },
  { value: 'Project', label: 'Project Completion Bonus' }
];