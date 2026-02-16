// utils.ts - Utility functions for payroll calculations

import type { Employee, PayrollRecord, Arrear, Bonus } from "./types";
import {
  TAX_SLABS_OLD,
  TAX_SLABS_NEW,
  PF_RATE,
  ESI_RATE,
  PROFESSIONAL_TAX,
  STANDARD_DEDUCTION,
  OVERTIME_RATE_PER_HOUR,
  demoAttendance,
  demoLeaves,
  demoLoans,
  demoAdvances,
} from "./constants";

// Calculate tax based on regime
export const calculateTax = (
  annualIncome: number,
  regime: "Old" | "New",
  investments: number = 0,
): number => {
  const slabs = regime === "Old" ? TAX_SLABS_OLD : TAX_SLABS_NEW;
  let taxableIncome = annualIncome;

  if (regime === "Old") {
    taxableIncome -= STANDARD_DEDUCTION;
    taxableIncome -= investments; // 80C, 80D etc
  } else {
    taxableIncome -= STANDARD_DEDUCTION;
  }

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const slabIncome = Math.min(remainingIncome, slab.max - slab.min);

    if (slabIncome > 0) {
      tax += (slabIncome * slab.rate) / 100;
      remainingIncome -= slabIncome;
    }

    if (remainingIncome <= 0) break;
  }

  // Add 4% cess
  tax = tax * 1.04;

  return Math.round(tax / 12); // Monthly tax
};

// Calculate paid days based on attendance
export const calculatePaidDays = (
  employeeId: string,
): {
  workingDays: number;
  paidDays: number;
  absentDays: number;
  leaveDays: number;
} => {
  const attendance = demoAttendance.find((a) => a.employeeId === employeeId);
  const leaves = demoLeaves.filter(
    (l) => l.employeeId === employeeId && l.status === "Approved",
  );

  if (!attendance) {
    return { workingDays: 22, paidDays: 22, absentDays: 0, leaveDays: 0 };
  }

  const paidLeaves = leaves
    .filter((l) => l.isPaid)
    .reduce((sum, l) => sum + l.days, 0);
  const unpaidLeaves = leaves
    .filter((l) => !l.isPaid)
    .reduce((sum, l) => sum + l.days, 0);

  const workingDays =
    attendance.totalDays - attendance.weeklyOffs - attendance.holidays;
  const paidDays =
    attendance.presentDays + paidLeaves - attendance.halfDays * 0.5;

  return {
    workingDays,
    paidDays: Math.round(paidDays),
    absentDays: attendance.absentDays,
    leaveDays: unpaidLeaves,
  };
};

// Calculate loan deduction
export const calculateLoanDeduction = (employeeId: string): number => {
  const loans = demoLoans.filter(
    (l) => l.employeeId === employeeId && l.status === "Active",
  );
  return loans.reduce((sum, loan) => sum + loan.emiAmount, 0);
};

// Calculate advance deduction
export const calculateAdvanceDeduction = (employeeId: string): number => {
  const advances = demoAdvances.filter(
    (a) => a.employeeId === employeeId && a.status === "Deducting",
  );
  return advances.reduce((sum, adv) => sum + adv.deductionAmount, 0);
};

// Calculate overtime pay
export const calculateOvertimePay = (employeeId: string): number => {
  const attendance = demoAttendance.find((a) => a.employeeId === employeeId);
  if (!attendance || attendance.overtimeHours === 0) return 0;
  return attendance.overtimeHours * OVERTIME_RATE_PER_HOUR;
};

// Generate complete payroll record
export const generatePayrollRecord = (
  emp: Employee,
  status: PayrollRecord["status"] = "Draft",
): PayrollRecord => {
  const { workingDays, paidDays, absentDays, leaveDays } = calculatePaidDays(
    emp.id,
  );

  // Calculate prorated salary based on paid days
  const dailyRate = emp.basicSalary / workingDays;
  const proratedBasic = Math.round(dailyRate * paidDays);
  const proratedHRA = Math.round((emp.hra / workingDays) * paidDays);
  const proratedAllowances = Math.round(
    (emp.allowances / workingDays) * paidDays,
  );

  // Overtime
  const overtimePay = calculateOvertimePay(emp.id);

  // Sample arrears
  const arrearDetails: Arrear[] = [
    {
      id: "ARR001",
      label: "Salary Arrear",
      amount: 5000,
      fromDate: "2025-10-01",
      toDate: "2025-12-31",
      reason: "Pending increment arrear for Q4 2025",
    },
  ];
  const totalArrears = arrearDetails.reduce((sum, arr) => sum + arr.amount, 0);

  // Bonuses
  const bonuses: Bonus[] = [
    {
      id: "BON001",
      label: "Performance Bonus",
      bonusType: "Performance",
      amount: 10000,
      approved: true,
      date: new Date().toISOString(),
      approvedBy: "MGR001",
    },
  ];
  const totalBonus = bonuses.reduce((sum, b) => sum + b.amount, 0);

  const grossSalary = proratedBasic + proratedHRA + proratedAllowances;
  const gross = grossSalary + totalArrears + totalBonus + overtimePay;

  // Calculate annual income for tax
  const annualIncome = (emp.basicSalary + emp.hra + emp.allowances) * 12;
  const monthlyTax = calculateTax(
    annualIncome,
    emp.taxStatus === "New Regime" ? "New" : "Old",
    150000,
  );

  // Deductions
  const pf = Math.round(proratedBasic * PF_RATE);
  const esi = grossSalary <= 21000 ? Math.round(grossSalary * ESI_RATE) : 0;
  const loanDeduction = calculateLoanDeduction(emp.id);
  const advanceDeduction = calculateAdvanceDeduction(emp.id);
  const otherDeductions = 500;

  const totalDeductions =
    monthlyTax +
    pf +
    esi +
    PROFESSIONAL_TAX +
    loanDeduction +
    advanceDeduction +
    otherDeductions;
  const net = gross - totalDeductions;

  return {
    id: `PAY-${emp.id}-${Date.now()}`,
    employeeId: emp.id,
    employeeName: emp.name,
    email: emp.email,
    department: emp.department,
    designation: emp.designation,
    grade: emp.grade,
    joiningDate: emp.joiningDate,
    bankAccount: emp.bankAccount,
    ifscCode: emp.ifscCode,
    pfNumber: emp.pfNumber,
    panNumber: emp.panNumber,

    workingDays,
    paidDays,
    absentDays,
    leaveDays,

    basicSalary: proratedBasic,
    hra: proratedHRA,
    allowances: proratedAllowances,
    bonuses,
    totalBonus,
    arrears: totalArrears,
    arrearDetails,
    overtimePay,

    taxDeduction: monthlyTax,
    pfDeduction: pf,
    esiDeduction: esi,
    professionalTax: PROFESSIONAL_TAX,
    loanDeduction,
    advanceDeduction,
    otherDeductions,

    grossPay: gross,
    totalDeductions,
    netPay: net,

    status,
    createdDate: new Date().toISOString(),
    taxRegime: emp.taxStatus === "New Regime" ? "New" : "Old",
    taxableIncome: annualIncome,
    taxSavings: 150000,
  };
};

export const calculateDeductions = (record: PayrollRecord): number => {
  return (
    record.taxDeduction +
    record.pfDeduction +
    record.esiDeduction +
    record.professionalTax +
    record.loanDeduction +
    record.advanceDeduction +
    record.otherDeductions
  );
};

export const recalculatePayroll = (record: PayrollRecord): PayrollRecord => {
  const grossSalary = record.basicSalary + record.hra + record.allowances;
  const newGross =
    grossSalary + record.arrears + record.totalBonus + record.overtimePay;

  const annualIncome =
    (record.basicSalary + record.hra + record.allowances) * 12;
  const newTax = calculateTax(
    annualIncome,
    record.taxRegime,
    record.taxSavings,
  );
  const newPf = Math.round(record.basicSalary * PF_RATE);
  const newEsi = grossSalary <= 21000 ? Math.round(grossSalary * ESI_RATE) : 0;

  const newTotalDeductions =
    newTax +
    newPf +
    newEsi +
    record.professionalTax +
    record.loanDeduction +
    record.advanceDeduction +
    record.otherDeductions;
  const newNet = newGross - newTotalDeductions;

  return {
    ...record,
    grossPay: newGross,
    taxDeduction: newTax,
    pfDeduction: newPf,
    esiDeduction: newEsi,
    totalDeductions: newTotalDeductions,
    netPay: newNet,
  };
};

// Generate NEFT bank file
export const generateNEFTFile = (records: PayrollRecord[]): string => {
  let content = "H,NEFT,Payroll Payment," + new Date().toISOString() + "\n";

  records.forEach((record) => {
    content += `D,${record.bankAccount},${record.ifscCode},${record.employeeName},${record.netPay},${record.id}\n`;
  });

  const totalAmount = records.reduce((sum, r) => sum + r.netPay, 0);
  content += `T,${records.length},${totalAmount}\n`;

  return content;
};

// Tax comparison between old and new regime
export const compareTaxRegimes = (
  annualIncome: number,
  investments: number,
): {
  oldRegime: number;
  newRegime: number;
  recommendation: "Old" | "New";
  savings: number;
} => {
  const oldTax = calculateTax(annualIncome, "Old", investments) * 12;
  const newTax = calculateTax(annualIncome, "New", 0) * 12;

  return {
    oldRegime: oldTax,
    newRegime: newTax,
    recommendation: oldTax < newTax ? "Old" : "New",
    savings: Math.abs(oldTax - newTax),
  };
};
