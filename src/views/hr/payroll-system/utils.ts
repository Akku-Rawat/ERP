import type  { Employee, PayrollRecord } from './types';

export const generatePayrollRecord = (
  emp: Employee, 
  status: PayrollRecord["status"] = "Draft"
): PayrollRecord => {
  const gross = emp.basicSalary + emp.hra + emp.allowances;
  const tax = Math.round(gross * 0.12);
  const pf = Math.round(emp.basicSalary * 0.12);
  const other = 500;
  
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
    pfNumber: emp.pfNumber,
    workingDays: 22,
    paidDays: 22,
    basicSalary: emp.basicSalary,
    hra: emp.hra,
    allowances: emp.allowances,
    bonuses: [],
    arrears: 0,
    grossPay: gross,
    taxDeduction: tax,
    pfDeduction: pf,
    otherDeductions: other,
    netPay: gross - tax - pf - other,
    status,
    createdDate: new Date().toISOString(),
    taxRegime: emp.taxStatus === "New Regime" ? "New" : "Old"
  };
};

export const exportToCSV = (records: PayrollRecord[]) => {
  const csvContent = [
    ["Employee ID", "Name", "Department", "Gross Pay", "Deductions", "Net Pay", "Status"].join(","),
    ...records.map(r => 
      [r.employeeId, r.employeeName, r.department, r.grossPay, 
       r.taxDeduction + r.pfDeduction + r.otherDeductions, r.netPay, r.status].join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payroll-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};

export const generateTaxReport = (records: PayrollRecord[]) => {
  const reportDate = new Date().toISOString().split('T')[0];
  const totalTax = records.reduce((sum, r) => sum + r.taxDeduction, 0);
  const totalPF = records.reduce((sum, r) => sum + r.pfDeduction, 0);
  const totalGross = records.reduce((sum, r) => sum + r.grossPay, 0);
  const totalNet = records.reduce((sum, r) => sum + r.netPay, 0);
  
  let report = `TAX PROCESS REPORT - ${reportDate}\n`;
  report += `${'='.repeat(120)}\n\n`;
  report += `SUMMARY\n${'-'.repeat(120)}\n`;
  report += `Total Employees: ${records.length}\n`;
  report += `Total Gross: ₹${totalGross.toLocaleString()}\n`;
  report += `Total Tax (TDS): ₹${totalTax.toLocaleString()}\n`;
  report += `Total PF: ₹${totalPF.toLocaleString()}\n`;
  report += `Total Net: ₹${totalNet.toLocaleString()}\n\n`;
  
  report += `DETAILED REPORT\n${'-'.repeat(120)}\n`;
  report += `${'EmpID'.padEnd(12)} | ${'Name'.padEnd(20)} | ${'PF#'.padEnd(10)} | ${'Regime'.padEnd(8)} | ${'Gross'.padEnd(12)} | ${'Tax'.padEnd(12)} | ${'PF'.padEnd(12)} | ${'Net'.padEnd(12)}\n`;
  report += `${'-'.repeat(120)}\n`;
  
  records.forEach(r => {
    report += `${r.employeeId.padEnd(12)} | ${r.employeeName.padEnd(20)} | ${r.pfNumber.padEnd(10)} | ${r.taxRegime.padEnd(8)} | ₹${r.grossPay.toLocaleString().padEnd(11)} | ₹${r.taxDeduction.toLocaleString().padEnd(11)} | ₹${r.pfDeduction.toLocaleString().padEnd(11)} | ₹${r.netPay.toLocaleString().padEnd(11)}\n`;
  });
  
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Tax_Report_${reportDate}.txt`;
  a.click();
  
  // CSV version
  const csv = [
    ["Employee ID", "Name", "PF Number", "Tax Regime", "Gross", "Tax", "PF", "Net"].join(","),
    ...records.map(r => [r.employeeId, r.employeeName, r.pfNumber, r.taxRegime, r.grossPay, r.taxDeduction, r.pfDeduction, r.netPay].join(","))
  ].join("\n");
  
  const csvBlob = new Blob([csv], { type: 'text/csv' });
  const csvUrl = URL.createObjectURL(csvBlob);
  const csvA = document.createElement('a');
  csvA.href = csvUrl;
  csvA.download = `Tax_Report_${reportDate}.csv`;
  csvA.click();
};
