// src/payroll/utils.ts
import type { Employee, PayrollRecord, Bonus } from "./types";

/**
 * Generate a payroll record for an employee.
 * Adds sensible default deductions and empty bonuses array.
 */
export const generatePayrollRecord = (
  employee: Employee,
  status: PayrollRecord["status"] = "Pending",
): PayrollRecord => {
  const grossPay = Math.round(
    employee.basicSalary + employee.hra + employee.allowances,
  );
  const taxDeduction = Math.round(grossPay * 0.15);
  const pfDeduction = Math.round(grossPay * 0.12);
  const otherDeductions = Math.round(grossPay * 0.01);
  const netPay = grossPay - taxDeduction - pfDeduction - otherDeductions;

  return {
    id: `PAY${employee.id.replace(/[^0-9]/g, "")}`,
    employeeId: employee.id,
    employeeName: employee.name,
    department: employee.department,
    designation: employee.designation,
    grade: employee.grade,
    basicSalary: employee.basicSalary,
    hra: employee.hra,
    allowances: employee.allowances,
    grossPay,
    taxDeduction,
    pfDeduction,
    otherDeductions,
    netPay,
    status,
    paymentDate:
      status === "Paid"
        ? new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : null,
    bankAccount: `****${Math.floor(1000 + Math.random() * 9000)}`,
    workingDays: employee.workingDays,
    paidDays: employee.workingDays,
    bonuses: [] as Bonus[], // NEW: default empty bonuses array
  };
};

// Status color helper (keeps same API as before)
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Paid":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Processing":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Failed":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Export to CSV
export const exportToCSV = (records: PayrollRecord[]): void => {
  const header = [
    "EmpID",
    "Employee",
    "Department",
    "Designation",
    "Grade",
    "GrossPay",
    "Deductions",
    "NetPay",
    "Status",
    "PaymentDate",
  ];
  const lines = records.map((r) =>
    [
      r.employeeId,
      `"${r.employeeName}"`,
      r.department,
      r.designation,
      r.grade,
      r.grossPay,
      r.taxDeduction + r.pfDeduction + r.otherDeductions,
      r.netPay,
      r.status,
      r.paymentDate || "N/A",
    ].join(","),
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payroll_export_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// Download a simple text payslip; includes bonuses if present
export const downloadPayslip = (employee: PayrollRecord): void => {
  const totalBonuses = (employee.bonuses || []).reduce(
    (s, b) => s + (b.amount || 0),
    0,
  );

  const payslipContent = `
═══════════════════════════════════════════════════════
                PAYSLIP - ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
═══════════════════════════════════════════════════════

Employee Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Employee ID      : ${employee.employeeId}
Name             : ${employee.employeeName}
Designation      : ${employee.designation}
Department       : ${employee.department}
Grade            : ${employee.grade}
Bank Account     : ${employee.bankAccount}
Working Days     : ${employee.workingDays}
Paid Days        : ${employee.paidDays}

Earnings:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Basic Salary     : ₹ ${employee.basicSalary.toLocaleString()}
HRA              : ₹ ${employee.hra.toLocaleString()}
Allowances       : ₹ ${employee.allowances.toLocaleString()}
${totalBonuses > 0 ? `Bonuses          : ₹ ${totalBonuses.toLocaleString()}` : ""}
                   ─────────────────
Gross Pay        : ₹ ${employee.grossPay.toLocaleString()}

Deductions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tax Deduction    : ₹ ${employee.taxDeduction.toLocaleString()}
PF Deduction     : ₹ ${employee.pfDeduction.toLocaleString()}
Other Deductions : ₹ ${employee.otherDeductions.toLocaleString()}
                   ─────────────────
Total Deductions : ₹ ${(employee.taxDeduction + employee.pfDeduction + employee.otherDeductions).toLocaleString()}

═══════════════════════════════════════════════════════
NET PAY          : ₹ ${employee.netPay.toLocaleString()}
═══════════════════════════════════════════════════════

Status           : ${employee.status}
Payment Date     : ${employee.paymentDate || "Pending"}

This is a computer-generated payslip and does not require a signature.
Generated on: ${new Date().toLocaleString()}
  `;

  const blob = new Blob([payslipContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Payslip_${employee.employeeId}_${new Date().toISOString().slice(0, 7)}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
