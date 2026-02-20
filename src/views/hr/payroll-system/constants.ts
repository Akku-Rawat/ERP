// constants.ts — Demo data and constant values

import type { Employee, AttendanceRecord, LeaveRecord } from "../../../types/payrolltypes";

export const demoEmployees: Employee[] = [
  {
    id: "EMP001", name: "Rajesh Kumar", email: "rajesh.kumar@company.com",
    department: "Engineering", designation: "Senior Developer", grade: "L5",
    joiningDate: "2020-03-15", bankAccount: "9876543210", ifscCode: "HDFC0001234",
    pfNumber: "PF123456", esiNumber: "ESI789012", panNumber: "ABCDE1234F",
    taxStatus: "New Regime", isActive: true, basicSalary: 50000, hra: 20000, allowances: 11000,
  },
  {
    id: "EMP002", name: "Priya Sharma", email: "priya.sharma@company.com",
    department: "Sales", designation: "Sales Manager", grade: "L6",
    joiningDate: "2019-07-22", bankAccount: "8765432109", ifscCode: "ICIC0002345",
    pfNumber: "PF123457", esiNumber: "ESI789013", panNumber: "BCDEF2345G",
    taxStatus: "Old Regime", isActive: true, basicSalary: 60000, hra: 24000, allowances: 16000,
  },
  {
    id: "EMP003", name: "Amit Patel", email: "amit.patel@company.com",
    department: "Engineering", designation: "Tech Lead", grade: "L7",
    joiningDate: "2018-01-10", bankAccount: "7654321098", ifscCode: "SBIN0003456",
    pfNumber: "PF123458", esiNumber: "ESI789014", panNumber: "CDEFG3456H",
    taxStatus: "New Regime", isActive: true, basicSalary: 75000, hra: 30000, allowances: 20000,
  },
  {
    id: "EMP004", name: "Sneha Reddy", email: "sneha.reddy@company.com",
    department: "HR", designation: "HR Manager", grade: "L6",
    joiningDate: "2021-05-18", bankAccount: "6543210987", ifscCode: "UTIB0004567",
    pfNumber: "PF123459", esiNumber: "ESI789015", panNumber: "DEFGH4567I",
    taxStatus: "Old Regime", isActive: true, basicSalary: 55000, hra: 22000, allowances: 13000,
  },
  {
    id: "EMP005", name: "Vikram Singh", email: "vikram.singh@company.com",
    department: "Finance", designation: "Financial Analyst", grade: "L4",
    joiningDate: "2022-09-01", bankAccount: "5432109876", ifscCode: "KKBK0005678",
    pfNumber: "PF123460", esiNumber: "ESI789016", panNumber: "EFGHI5678J",
    taxStatus: "New Regime", isActive: true, basicSalary: 45000, hra: 18000, allowances: 9000,
  },
  {
    id: "EMP006", name: "Ananya Krishnan", email: "ananya.k@company.com",
    department: "Design", designation: "UI/UX Designer", grade: "L4",
    joiningDate: "2023-02-14", bankAccount: "", ifscCode: "", // ← missing bank — triggers validation
    pfNumber: "PF123461", esiNumber: "", panNumber: "FGHIJ5679K",
    taxStatus: "New Regime", isActive: true, basicSalary: 42000, hra: 16800, allowances: 8400,
  },
];

export const demoAttendance: AttendanceRecord[] = [
  { employeeId: "EMP001", month: "January", year: 2026, totalDays: 31, presentDays: 22, absentDays: 2, weeklyOffs: 5, holidays: 2, paidLeaves: 2, unpaidLeaves: 0, halfDays: 1, overtimeHours: 8 },
  { employeeId: "EMP002", month: "January", year: 2026, totalDays: 31, presentDays: 20, absentDays: 0, weeklyOffs: 5, holidays: 2, paidLeaves: 3, unpaidLeaves: 1, halfDays: 0, overtimeHours: 0 },
  { employeeId: "EMP003", month: "January", year: 2026, totalDays: 31, presentDays: 24, absentDays: 0, weeklyOffs: 5, holidays: 2, paidLeaves: 0, unpaidLeaves: 0, halfDays: 0, overtimeHours: 12 },
  { employeeId: "EMP004", month: "January", year: 2026, totalDays: 31, presentDays: 23, absentDays: 1, weeklyOffs: 5, holidays: 2, paidLeaves: 0, unpaidLeaves: 0, halfDays: 0, overtimeHours: 0 },
  { employeeId: "EMP005", month: "January", year: 2026, totalDays: 31, presentDays: 22, absentDays: 0, weeklyOffs: 5, holidays: 2, paidLeaves: 2, unpaidLeaves: 0, halfDays: 0, overtimeHours: 0 },
  // EMP006 attendance missing — triggers validation warning
];

export const demoLeaves: LeaveRecord[] = [
  { id: "LV001", employeeId: "EMP001", leaveType: "Casual", fromDate: "2026-01-15", toDate: "2026-01-16", days: 2, status: "Approved", reason: "Personal work", isPaid: true },
  { id: "LV002", employeeId: "EMP002", leaveType: "Sick", fromDate: "2026-01-20", toDate: "2026-01-22", days: 3, status: "Approved", reason: "Medical", isPaid: true },
  { id: "LV003", employeeId: "EMP002", leaveType: "LWP", fromDate: "2026-01-25", toDate: "2026-01-25", days: 1, status: "Approved", reason: "Personal emergency", isPaid: false },
];

// ── Tax Slabs ─────────────────────────────────────────────────────────────────
export const TAX_SLABS_OLD = [
  { min: 0,       max: 250000,   rate: 0  },
  { min: 250000,  max: 500000,   rate: 5  },
  { min: 500000,  max: 1000000,  rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
];
export const TAX_SLABS_NEW = [
  { min: 0,        max: 300000,   rate: 0  },
  { min: 300000,   max: 600000,   rate: 5  },
  { min: 600000,   max: 900000,   rate: 10 },
  { min: 900000,   max: 1200000,  rate: 15 },
  { min: 1200000,  max: 1500000,  rate: 20 },
  { min: 1500000,  max: Infinity, rate: 30 },
];

// ── Statutory Rates ───────────────────────────────────────────────────────────
export const PF_RATE               = 0.12;
export const ESI_RATE              = 0.0075;
export const ESI_EMPLOYER_RATE     = 0.0325;
export const PROFESSIONAL_TAX      = 200;
export const STANDARD_DEDUCTION    = 50000;
export const OVERTIME_RATE_PER_HOUR = 200;
export const ESI_ELIGIBILITY_LIMIT = 21000; // gross ≤ this → ESI applies

// ── Dropdown Options ──────────────────────────────────────────────────────────
export const LEAVE_TYPES = [
  { value: "Casual",    label: "Casual Leave",    paid: true  },
  { value: "Sick",      label: "Sick Leave",       paid: true  },
  { value: "Earned",    label: "Earned Leave",     paid: true  },
  { value: "LWP",       label: "Leave Without Pay",paid: false },
  { value: "Maternity", label: "Maternity Leave",  paid: true  },
  { value: "Paternity", label: "Paternity Leave",  paid: true  },
];

export const BONUS_TYPES = [
  { value: "Performance", label: "Performance Bonus"       },
  { value: "Festival",    label: "Festival Bonus"          },
  { value: "Retention",   label: "Retention Bonus"         },
  { value: "Referral",    label: "Referral Bonus"          },
  { value: "Project",     label: "Project Completion Bonus"},
];