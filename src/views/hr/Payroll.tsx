import React, { useState, useMemo } from "react";
import { 
  ChevronDown, ChevronUp, Download, Send, Plus, X, 
  FileSpreadsheet, CheckCircle, Clock, AlertCircle,
  Mail, Calendar, DollarSign, TrendingUp, Users,
  Filter, Search, Eye, Edit2, FileText, Settings
} from "lucide-react";

// Types
interface Employee {
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

interface TaxConfig {
  employeeId: string;
  regime: "Old" | "New";
  section80C: number;
  section80D: number;
  hra: number;
  otherDeductions: number;
}

interface Bonus {
  id: string;
  label: string;
  amount: number;
  approved: boolean;
  date: string;
}

interface PayrollRecord {
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

// Demo Data
const demoEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@company.com",
    department: "Engineering",
    designation: "Senior Developer",
    grade: "L5",
    joiningDate: "2020-03-15",
    bankAccount: "HDFC-9876543210",
    pfNumber: "PF123456",
    taxStatus: "New Regime",
    isActive: true,
    basicSalary: 50000,
    hra: 20000,
    allowances: 11000
  },
  {
    id: "EMP002",
    name: "Priya Sharma",
    email: "priya.sharma@company.com",
    department: "Sales",
    designation: "Sales Manager",
    grade: "L6",
    joiningDate: "2019-07-22",
    bankAccount: "ICICI-8765432109",
    pfNumber: "PF123457",
    taxStatus: "Old Regime",
    isActive: true,
    basicSalary: 60000,
    hra: 24000,
    allowances: 16000
  },
  {
    id: "EMP003",
    name: "Amit Patel",
    email: "amit.patel@company.com",
    department: "Engineering",
    designation: "Tech Lead",
    grade: "L7",
    joiningDate: "2018-01-10",
    bankAccount: "SBI-7654321098",
    pfNumber: "PF123458",
    taxStatus: "New Regime",
    isActive: true,
    basicSalary: 75000,
    hra: 30000,
    allowances: 20000
  },
  {
    id: "EMP004",
    name: "Sneha Reddy",
    email: "sneha.reddy@company.com",
    department: "HR",
    designation: "HR Manager",
    grade: "L6",
    joiningDate: "2021-05-18",
    bankAccount: "AXIS-6543210987",
    pfNumber: "PF123459",
    taxStatus: "Old Regime",
    isActive: true,
    basicSalary: 55000,
    hra: 22000,
    allowances: 13000
  },
  {
    id: "EMP005",
    name: "Vikram Singh",
    email: "vikram.singh@company.com",
    department: "Finance",
    designation: "Financial Analyst",
    grade: "L4",
    joiningDate: "2022-09-01",
    bankAccount: "KOTAK-5432109876",
    pfNumber: "PF123460",
    taxStatus: "New Regime",
    isActive: true,
    basicSalary: 45000,
    hra: 18000,
    allowances: 9000
  }
];

const generatePayrollRecord = (emp: Employee, status: PayrollRecord["status"] = "Draft"): PayrollRecord => {
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

// Main Component
export default function EnhancedPayroll() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([
    generatePayrollRecord(demoEmployees[0], "Paid"),
    generatePayrollRecord(demoEmployees[1], "Pending")
  ]);
  
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedDept, setSelectedDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPayslip, setShowPayslip] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Computed values
  const departments = useMemo(() => {
    const depts = new Set(payrollRecords.map(r => r.department));
    return ["All", ...Array.from(depts)];
  }, [payrollRecords]);

  const filteredRecords = useMemo(() => {
    return payrollRecords.filter(record => {
      const deptMatch = selectedDept === "All" || record.department === selectedDept;
      const statusMatch = filterStatus === "All" || record.status === filterStatus;
      const searchMatch = !searchQuery || 
        record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      return deptMatch && statusMatch && searchMatch;
    });
  }, [payrollRecords, selectedDept, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const total = filteredRecords.reduce((sum, r) => sum + r.netPay, 0);
    const pending = filteredRecords.filter(r => r.status === "Pending").length;
    const paid = filteredRecords.filter(r => r.status === "Paid").length;
    const totalGross = filteredRecords.reduce((sum, r) => sum + r.grossPay, 0);
    return { total, pending, paid, totalGross };
  }, [filteredRecords]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreatePayroll = () => {
    if (selectedEmployees.length === 0) {
      alert("Please select at least one employee");
      return;
    }

    const newRecords = selectedEmployees.map(empId => {
      const emp = demoEmployees.find(e => e.id === empId)!;
      return generatePayrollRecord(emp, "Pending");
    });

    setPayrollRecords(prev => [...prev, ...newRecords]);
    setSelectedEmployees([]);
    setShowCreateModal(false);
    alert(`Payroll created for ${newRecords.length} employee(s). Status set to 'Pending' - ready for processing.`);
  };

  const handleRunPayroll = () => {
    const pendingRecords = payrollRecords.filter(r => r.status === "Pending");
    if (pendingRecords.length === 0) {
      alert("No pending payroll to process");
      return;
    }

    setPayrollRecords(prev =>
      prev.map(rec => 
        rec.status === "Pending" 
          ? { ...rec, status: "Processing" as const }
          : rec
      )
    );

    setTimeout(() => {
      const processedRecords = payrollRecords.filter(r => r.status === "Processing");
      
      setPayrollRecords(prev =>
        prev.map(rec => 
          rec.status === "Processing"
            ? { 
                ...rec, 
                status: "Paid" as const,
                paymentDate: new Date().toLocaleDateString()
              }
            : rec
        )
      );

      // Generate Tax Process Report
      generateTaxProcessReport(processedRecords);
      
      alert(`Payroll processed successfully!\n- Salary slips sent to employee emails\n- Tax process report generated and downloaded`);
    }, 2000);
  };

  const generateTaxProcessReport = (records: PayrollRecord[]) => {
    const reportDate = new Date().toISOString().split('T')[0];
    
    // Tax Summary
    const totalTax = records.reduce((sum, r) => sum + r.taxDeduction, 0);
    const totalPF = records.reduce((sum, r) => sum + r.pfDeduction, 0);
    const totalGross = records.reduce((sum, r) => sum + r.grossPay, 0);
    const totalNet = records.reduce((sum, r) => sum + r.netPay, 0);
    
    // Generate detailed report
    let report = `TAX PROCESS REPORT - ${reportDate}\n`;
    report += `${'='.repeat(120)}\n\n`;
    
    report += `SUMMARY\n`;
    report += `${'-'.repeat(120)}\n`;
    report += `Total Employees Processed: ${records.length}\n`;
    report += `Total Gross Pay: ₹${totalGross.toLocaleString()}\n`;
    report += `Total Tax Deducted (TDS): ₹${totalTax.toLocaleString()}\n`;
    report += `Total PF Deducted: ₹${totalPF.toLocaleString()}\n`;
    report += `Total Net Pay: ₹${totalNet.toLocaleString()}\n\n`;
    
    report += `DETAILED EMPLOYEE TAX REPORT\n`;
    report += `${'-'.repeat(120)}\n`;
    report += `${'Employee ID'.padEnd(15)} | ${'Name'.padEnd(25)} | ${'PF Number'.padEnd(12)} | ${'Tax Regime'.padEnd(12)} | ${'Gross Pay'.padEnd(15)} | ${'Tax (TDS)'.padEnd(15)} | ${'PF'.padEnd(15)} | ${'Net Pay'.padEnd(15)}\n`;
    report += `${'-'.repeat(120)}\n`;
    
    records.forEach(r => {
      report += `${r.employeeId.padEnd(15)} | ${r.employeeName.padEnd(25)} | ${r.pfNumber.padEnd(12)} | ${r.taxRegime.padEnd(12)} | ₹${r.grossPay.toLocaleString().padEnd(14)} | ₹${r.taxDeduction.toLocaleString().padEnd(14)} | ₹${r.pfDeduction.toLocaleString().padEnd(14)} | ₹${r.netPay.toLocaleString().padEnd(14)}\n`;
    });
    
    report += `\n${'='.repeat(120)}\n\n`;
    
    // Tax Regime Breakdown
    const oldRegime = records.filter(r => r.taxRegime === "Old");
    const newRegime = records.filter(r => r.taxRegime === "New");
    
    report += `TAX REGIME BREAKDOWN\n`;
    report += `${'-'.repeat(120)}\n`;
    report += `Old Regime Employees: ${oldRegime.length} | Total Tax: ₹${oldRegime.reduce((s, r) => s + r.taxDeduction, 0).toLocaleString()}\n`;
    report += `New Regime Employees: ${newRegime.length} | Total Tax: ₹${newRegime.reduce((s, r) => s + r.taxDeduction, 0).toLocaleString()}\n\n`;
    
    // PF Summary
    report += `PROVIDENT FUND (PF) SUMMARY\n`;
    report += `${'-'.repeat(120)}\n`;
    report += `Total PF Contribution (Employee): ₹${totalPF.toLocaleString()}\n`;
    report += `Total PF Contribution (Employer): ₹${totalPF.toLocaleString()}\n`;
    report += `Total PF to be Deposited: ₹${(totalPF * 2).toLocaleString()}\n\n`;
    
    // Department-wise Tax Summary
    const deptMap = new Map<string, { count: number; tax: number; pf: number; gross: number }>();
    records.forEach(r => {
      const existing = deptMap.get(r.department) || { count: 0, tax: 0, pf: 0, gross: 0 };
      deptMap.set(r.department, {
        count: existing.count + 1,
        tax: existing.tax + r.taxDeduction,
        pf: existing.pf + r.pfDeduction,
        gross: existing.gross + r.grossPay
      });
    });
    
    report += `DEPARTMENT-WISE TAX SUMMARY\n`;
    report += `${'-'.repeat(120)}\n`;
    report += `${'Department'.padEnd(20)} | ${'Employees'.padEnd(12)} | ${'Gross Pay'.padEnd(15)} | ${'Tax Deducted'.padEnd(15)} | ${'PF Deducted'.padEnd(15)}\n`;
    report += `${'-'.repeat(120)}\n`;
    
    deptMap.forEach((data, dept) => {
      report += `${dept.padEnd(20)} | ${String(data.count).padEnd(12)} | ₹${data.gross.toLocaleString().padEnd(14)} | ₹${data.tax.toLocaleString().padEnd(14)} | ₹${data.pf.toLocaleString().padEnd(14)}\n`;
    });
    
    report += `\n${'='.repeat(120)}\n`;
    report += `Report Generated: ${new Date().toLocaleString()}\n`;
    report += `Generated by: Payroll Management System\n`;
    report += `${'='.repeat(120)}\n`;
    
    // Download the report
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tax_Process_Report_${reportDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Also generate CSV for Excel
    generateTaxCSV(records, reportDate);
  };

  const generateTaxCSV = (records: PayrollRecord[], reportDate: string) => {
    const csvContent = [
      // Header
      ["TAX PROCESS REPORT", reportDate].join(","),
      [],
      ["Employee ID", "Name", "Department", "Designation", "PF Number", "Tax Regime", "Gross Pay", "Basic Salary", "HRA", "Allowances", "Arrears", "Tax Deducted (TDS)", "PF Deducted", "Other Deductions", "Total Deductions", "Net Pay", "Payment Date"].join(","),
      // Data
      ...records.map(r => [
        r.employeeId,
        r.employeeName,
        r.department,
        r.designation,
        r.pfNumber,
        r.taxRegime,
        r.grossPay,
        r.basicSalary,
        r.hra,
        r.allowances,
        r.arrears || 0,
        r.taxDeduction,
        r.pfDeduction,
        r.otherDeductions,
        r.taxDeduction + r.pfDeduction + r.otherDeductions,
        r.netPay,
        r.paymentDate || ''
      ].join(",")),
      [],
      ["SUMMARY"],
      ["Total Employees", records.length],
      ["Total Gross Pay", records.reduce((s, r) => s + r.grossPay, 0)],
      ["Total Tax Deducted", records.reduce((s, r) => s + r.taxDeduction, 0)],
      ["Total PF Deducted", records.reduce((s, r) => s + r.pfDeduction, 0)],
      ["Total Net Pay", records.reduce((s, r) => s + r.netPay, 0)]
    ].map(row => Array.isArray(row) ? row.join(",") : row).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tax_Process_Report_${reportDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEditSalary = (record: PayrollRecord) => {
    setEditingRecord({...record});
  };

  const saveEdit = () => {
    if (!editingRecord) return;
    
    const newGross = editingRecord.basicSalary + editingRecord.hra + editingRecord.allowances + editingRecord.arrears;
    const newTax = Math.round(newGross * 0.12);
    const newPf = Math.round(editingRecord.basicSalary * 0.12);
    const newNet = newGross - newTax - newPf - editingRecord.otherDeductions;

    setPayrollRecords(prev =>
      prev.map(r => 
        r.id === editingRecord.id
          ? {
              ...editingRecord,
              grossPay: newGross,
              taxDeduction: newTax,
              pfDeduction: newPf,
              netPay: newNet
            }
          : r
      )
    );
    setEditingRecord(null);
  };

  const exportToExcel = () => {
    const csvContent = [
      ["Employee ID", "Name", "Department", "Gross Pay", "Deductions", "Net Pay", "Status"].join(","),
      ...filteredRecords.map(r => 
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Payroll Management</h1>
              <p className="text-slate-600 mt-1">Manage employee payroll, bonuses, and salary slips</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview Summary
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Create Payroll
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-slate-500">TOTAL</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{payrollRecords.length}</p>
            <p className="text-sm text-slate-600 mt-1">Employees</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-slate-500">PAID</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            <p className="text-sm text-slate-600 mt-1">Processed</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-slate-500">PENDING</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-sm text-slate-600 mt-1">To Process</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-slate-500">TOTAL PAYOUT</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">₹{(stats.total / 1000).toFixed(0)}K</p>
            <p className="text-sm text-slate-600 mt-1">Net Amount</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>

            <button
              onClick={exportToExcel}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export
            </button>

            {stats.pending > 0 && (
              <button
                onClick={handleRunPayroll}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center gap-2 shadow-lg"
              >
                <TrendingUp className="w-4 h-4" />
                Run Payroll ({stats.pending})
              </button>
            )}
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-300">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase">Employee</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Department</th>
                <th className="text-right py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Gross Pay</th>
                <th className="text-right py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Deductions</th>
                <th className="text-right py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Net Pay</th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => {
                const isExpanded = expandedRows.has(record.id);
                const totalDeductions = record.taxDeduction + record.pfDeduction + record.otherDeductions;
                
                return (
                  <React.Fragment key={record.id}>
                    <tr 
                      onClick={() => toggleRow(record.id)}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-semibold text-slate-800">{record.employeeName}</p>
                            <p className="text-xs text-slate-500">{record.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">{record.department}</td>
                      <td className="py-4 px-4 text-right font-semibold text-slate-800">
                        ₹{record.grossPay.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-red-600">
                        -₹{totalDeductions.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-green-600">
                        ₹{record.netPay.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === "Paid" ? "bg-green-100 text-green-700" :
                          record.status === "Pending" ? "bg-amber-100 text-amber-700" :
                          record.status === "Processing" ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {record.status === "Paid" && <CheckCircle className="w-3 h-3" />}
                          {record.status === "Pending" && <Clock className="w-3 h-3" />}
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setSelectedRecord(record);
                              setShowPayslip(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Payslip"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          {record.status !== "Paid" && (
                            <button
                              onClick={() => handleEditSalary(record)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Salary"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Detail View */}
                    {isExpanded && (
                      <tr className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-b-2 border-blue-200">
                        <td colSpan={7} className="px-6 py-8">
                          <div className="max-w-6xl mx-auto">
                            {/* Header Row */}
                            <div className="grid grid-cols-3 gap-8 mb-6">
                              {/* Employee Details Card */}
                              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                                  <Users className="w-5 h-5 text-blue-600" />
                                  <h4 className="font-bold text-slate-800">Employee Details</h4>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Designation:</span>
                                    <span className="text-sm font-semibold text-slate-800">{record.designation}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Grade:</span>
                                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                      {record.grade}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Joining Date:</span>
                                    <span className="text-sm font-semibold text-slate-800">{record.joiningDate}</span>
                                  </div>
                                  <div className="flex justify-between items-start pt-2 border-t border-slate-100">
                                    <span className="text-sm text-slate-600">Email:</span>
                                    <span className="text-xs font-medium text-slate-700 text-right max-w-[180px] break-words">
                                      {record.email}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Bank Account:</span>
                                    <span className="text-xs font-semibold text-slate-800">{record.bankAccount}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">PF Number:</span>
                                    <span className="text-xs font-semibold text-slate-800">{record.pfNumber}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Earnings Breakdown Card */}
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-5">
                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-200">
                                  <TrendingUp className="w-5 h-5 text-green-700" />
                                  <h4 className="font-bold text-green-800">Earnings Breakdown</h4>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-green-800">Basic Salary:</span>
                                    <span className="text-sm font-bold text-green-900">₹{record.basicSalary.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-green-800">HRA:</span>
                                    <span className="text-sm font-bold text-green-900">₹{record.hra.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-green-800">Allowances:</span>
                                    <span className="text-sm font-bold text-green-900">₹{record.allowances.toLocaleString()}</span>
                                  </div>
                                  {record.arrears > 0 && (
                                    <div className="flex justify-between items-center bg-amber-50 -mx-2 px-2 py-2 rounded">
                                      <span className="text-sm text-amber-800 font-medium">Arrears:</span>
                                      <span className="text-sm font-bold text-amber-700">₹{record.arrears.toLocaleString()}</span>
                                    </div>
                                  )}
                                  {record.bonuses && record.bonuses.length > 0 && (
                                    <div className="pt-2 border-t border-green-200 space-y-1.5">
                                      {record.bonuses.map(b => (
                                        <div key={b.id} className="flex justify-between items-center bg-teal-50 -mx-2 px-2 py-1.5 rounded">
                                          <span className="text-xs text-teal-800">{b.label}:</span>
                                          <span className="text-xs font-bold text-teal-700">+₹{b.amount.toLocaleString()}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-green-300 bg-green-100 -mx-2 px-2 py-2.5 rounded-lg">
                                    <span className="font-bold text-green-900">Gross Pay:</span>
                                    <span className="text-lg font-bold text-green-700">₹{record.grossPay.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Deductions Breakdown Card */}
                              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-sm border border-red-200 p-5">
                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-red-200">
                                  <AlertCircle className="w-5 h-5 text-red-700" />
                                  <h4 className="font-bold text-red-800">Deductions Breakdown</h4>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-red-800">Income Tax ({record.taxRegime}):</span>
                                    <span className="text-sm font-bold text-red-900">₹{record.taxDeduction.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-red-800">PF Deduction:</span>
                                    <span className="text-sm font-bold text-red-900">₹{record.pfDeduction.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-red-800">Other Deductions:</span>
                                    <span className="text-sm font-bold text-red-900">₹{record.otherDeductions.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-red-300 bg-red-100 -mx-2 px-2 py-2.5 rounded-lg">
                                    <span className="font-bold text-red-900">Total Deductions:</span>
                                    <span className="text-lg font-bold text-red-700">-₹{totalDeductions.toLocaleString()}</span>
                                  </div>
                                  
                                  {/* Net Pay Section */}
                                  <div className="mt-4 pt-4 border-t-2 border-slate-300">
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 -mx-2 px-3 py-3 rounded-lg shadow-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-white">Net Pay:</span>
                                        <span className="text-2xl font-bold text-white">₹{record.netPay.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Attendance & Date Info Footer */}
                            <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between">
                              <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-slate-600">Working Days:</span>
                                  <span className="font-bold text-slate-800 text-sm">{record.workingDays}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-sm text-slate-600">Paid Days:</span>
                                  <span className="font-bold text-green-700 text-sm">{record.paidDays}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm text-slate-600">Created:</span>
                                  <span className="font-semibold text-slate-800 text-sm">
                                    {new Date(record.createdDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => toggleRow(record.id)}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                              >
                                <ChevronUp className="w-4 h-4" />
                                Collapse
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Create Payroll Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Create New Payroll</h2>
                    <p className="text-blue-100 mt-1">Select employees for payroll processing</p>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                <div className="space-y-4">
                  {demoEmployees.filter(e => e.isActive).map(emp => {
                    const alreadyExists = payrollRecords.some(
                      r => r.employeeId === emp.id && (r.status === "Pending" || r.status === "Draft")
                    );
                    const isSelected = selectedEmployees.includes(emp.id);

                    return (
                      <div
                        key={emp.id}
                        onClick={() => {
                          if (!alreadyExists) {
                            setSelectedEmployees(prev =>
                              prev.includes(emp.id)
                                ? prev.filter(id => id !== emp.id)
                                : [...prev, emp.id]
                            );
                          }
                        }}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          alreadyExists
                            ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                            : isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={alreadyExists}
                              onChange={() => {}}
                              className="w-5 h-5 text-blue-600 rounded"
                            />
                            <div>
                              <p className="font-semibold text-slate-800">{emp.name}</p>
                              <p className="text-sm text-slate-600">{emp.id} • {emp.designation}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-800">
                              ₹{(emp.basicSalary + emp.hra + emp.allowances).toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">Gross Salary</p>
                          </div>
                        </div>
                        {alreadyExists && (
                          <p className="text-xs text-amber-600 mt-2">Already in payroll</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePayroll}
                  disabled={selectedEmployees.length === 0}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold ${
                    selectedEmployees.length === 0
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                  }`}
                >
                  Create Payroll ({selectedEmployees.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Salary Modal */}
        {editingRecord && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                <h2 className="text-2xl font-bold">Edit Salary Components</h2>
                <p className="text-purple-100 mt-1">{editingRecord.employeeName}</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Basic Salary</label>
                    <input
                      type="number"
                      value={editingRecord.basicSalary}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        basicSalary: Number(e.target.value)
                      })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">HRA</label>
                    <input
                      type="number"
                      value={editingRecord.hra}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        hra: Number(e.target.value)
                      })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Allowances</label>
                    <input
                      type="number"
                      value={editingRecord.allowances}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        allowances: Number(e.target.value)
                      })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Arrears</label>
                    <input
                      type="number"
                      value={editingRecord.arrears}
                      onChange={(e) => setEditingRecord({
                        ...editingRecord,
                        arrears: Number(e.target.value)
                      })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-800 font-semibold">Estimated Net Pay:</span>
                    <span className="text-2xl font-bold text-purple-700">
                      ₹{(
                        editingRecord.basicSalary + 
                        editingRecord.hra + 
                        editingRecord.allowances + 
                        editingRecord.arrears -
                        Math.round((editingRecord.basicSalary + editingRecord.hra + editingRecord.allowances + editingRecord.arrears) * 0.24) - 500
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
                <button
                  onClick={() => setEditingRecord(null)}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payslip Modal */}
        {showPayslip && selectedRecord && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Salary Slip</h2>
                    <p className="text-teal-100 mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                  <button onClick={() => setShowPayslip(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Employee Info */}
                <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Employee ID</p>
                    <p className="font-semibold text-slate-800">{selectedRecord.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Name</p>
                    <p className="font-semibold text-slate-800">{selectedRecord.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Designation</p>
                    <p className="font-semibold text-slate-800">{selectedRecord.designation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Department</p>
                    <p className="font-semibold text-slate-800">{selectedRecord.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Joining Date</p>
                    <p className="font-semibold text-slate-800">{selectedRecord.joiningDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">PF Number</p>
                    <p className="font-semibold text-slate-800">{selectedRecord.pfNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Bank Account</p>
                    <p className="font-semibold text-slate-800">{selectedRecord.bankAccount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Email</p>
                    <p className="font-semibold text-slate-800 text-sm">{selectedRecord.email}</p>
                  </div>
                </div>

                {/* Earnings & Deductions */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="font-bold text-green-800 mb-4">Earnings</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Basic Salary</span>
                        <span className="font-semibold">₹{selectedRecord.basicSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HRA</span>
                        <span className="font-semibold">₹{selectedRecord.hra.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Allowances</span>
                        <span className="font-semibold">₹{selectedRecord.allowances.toLocaleString()}</span>
                      </div>
                      {selectedRecord.arrears > 0 && (
                        <div className="flex justify-between bg-amber-100 -mx-3 px-3 py-2 rounded">
                          <span className="font-medium text-amber-800">Arrears</span>
                          <span className="font-bold text-amber-700">₹{selectedRecord.arrears.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedRecord.bonuses && selectedRecord.bonuses.length > 0 && (
                        <div className="pt-2 border-t border-green-200 space-y-2">
                          {selectedRecord.bonuses.map(b => (
                            <div key={b.id} className="flex justify-between bg-teal-50 -mx-3 px-3 py-1.5 rounded">
                              <span className="text-xs font-medium text-teal-800">{b.label}</span>
                              <span className="text-xs font-bold text-teal-700">+₹{b.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between pt-3 border-t-2 border-green-200">
                        <span className="font-bold">Gross Pay</span>
                        <span className="font-bold text-green-700">₹{selectedRecord.grossPay.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-xl p-6">
                    <h3 className="font-bold text-red-800 mb-4">Deductions</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Income Tax ({selectedRecord.taxRegime})</span>
                        <span className="font-semibold">₹{selectedRecord.taxDeduction.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PF Deduction</span>
                        <span className="font-semibold">₹{selectedRecord.pfDeduction.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other</span>
                        <span className="font-semibold">₹{selectedRecord.otherDeductions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t-2 border-red-200">
                        <span className="font-bold">Total Deductions</span>
                        <span className="font-bold text-red-700">
                          ₹{(selectedRecord.taxDeduction + selectedRecord.pfDeduction + selectedRecord.otherDeductions).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-teal-100 text-sm mb-1">Net Salary (Take Home)</p>
                      <p className="text-4xl font-bold">₹{selectedRecord.netPay.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-teal-100 text-sm mb-1">Status</p>
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">
                        {selectedRecord.status === "Paid" && <CheckCircle className="w-4 h-4" />}
                        {selectedRecord.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center">
                  <p className="text-xs text-slate-600">This is a computer-generated salary slip</p>
                  <p className="text-xs text-slate-500 mt-1">Generated on: {new Date().toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
                <button
                  onClick={() => {
                    const content = `Salary Slip - ${selectedRecord.employeeName}`;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `payslip-${selectedRecord.employeeId}.txt`;
                    a.click();
                  }}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={() => alert(`Salary slip sent to ${selectedRecord.email}`)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Email Payslip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Summary Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Payroll Summary & Pre-Validation</h2>
                    <p className="text-indigo-100 mt-1">Review and validate all records before processing</p>
                  </div>
                  <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <p className="text-xs text-blue-600 uppercase font-semibold">Total Employees</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">{filteredRecords.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <p className="text-xs text-green-600 uppercase font-semibold">Gross Amount</p>
                    </div>
                    <p className="text-3xl font-bold text-green-700">₹{stats.totalGross.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <p className="text-xs text-purple-600 uppercase font-semibold">Net Payout</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-700">₹{stats.total.toLocaleString()}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <p className="text-xs text-amber-600 uppercase font-semibold">Validation Status</p>
                    </div>
                    <p className="text-xl font-bold text-amber-700">
                      {filteredRecords.filter(r => !r.bankAccount || !r.email).length} Issues
                    </p>
                  </div>
                </div>

                {/* Validation Issues Alert */}
                {filteredRecords.some(r => !r.bankAccount || !r.email) && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-red-800 mb-2">Validation Errors Detected</h4>
                        <p className="text-sm text-red-700 mb-3">
                          The following employees have missing or invalid information. Please fix before processing payroll.
                        </p>
                        <div className="space-y-2">
                          {filteredRecords
                            .filter(r => !r.bankAccount || !r.email)
                            .map(r => (
                              <div key={r.id} className="bg-white rounded-lg p-3 border border-red-200">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold text-slate-800">{r.employeeName} ({r.employeeId})</p>
                                    <div className="flex gap-3 mt-1">
                                      {!r.bankAccount && (
                                        <span className="text-xs text-red-600 flex items-center gap-1">
                                          <X className="w-3 h-3" />
                                          Missing Bank Account
                                        </span>
                                      )}
                                      {!r.email && (
                                        <span className="text-xs text-red-600 flex items-center gap-1">
                                          <X className="w-3 h-3" />
                                          Missing Email
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium">
                                    Fix Now
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Records Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Detailed Payroll Records</h3>
                  </div>
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700">Employee</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700">Bank Details</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700">Gross</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700">Arrears</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700">Deductions</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700">Net</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-slate-700">Status</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-slate-700">Validation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.map(r => {
                          const hasIssues = !r.bankAccount || !r.email;
                          return (
                            <tr key={r.id} className={`border-t border-slate-200 ${hasIssues ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                              <td className="py-3 px-4">
                                <p className="font-medium text-slate-800">{r.employeeName}</p>
                                <p className="text-xs text-slate-500">{r.employeeId}</p>
                                <p className="text-xs text-slate-600 mt-1">{r.department}</p>
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-xs text-slate-700">{r.bankAccount || <span className="text-red-600">Not Set</span>}</p>
                                <p className="text-xs text-slate-600 mt-1">{r.email || <span className="text-red-600">Not Set</span>}</p>
                              </td>
                              <td className="py-3 px-4 text-right font-semibold">₹{r.grossPay.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">
                                {r.arrears > 0 ? (
                                  <span className="font-semibold text-amber-600">₹{r.arrears.toLocaleString()}</span>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right text-red-600 font-medium">
                                -₹{(r.taxDeduction + r.pfDeduction + r.otherDeductions).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right font-bold text-green-600">₹{r.netPay.toLocaleString()}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  r.status === "Paid" ? "bg-green-100 text-green-700" :
                                  r.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                  "bg-slate-100 text-slate-700"
                                }`}>
                                  {r.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {hasIssues ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                    <X className="w-3 h-3" />
                                    Failed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    <CheckCircle className="w-3 h-3" />
                                    Passed
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
                <button
                  onClick={exportToExcel}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  Export Excel for Review
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    if (filteredRecords.filter(r => !r.bankAccount || !r.email).length === 0) {
                      handleRunPayroll();
                    } else {
                      alert("Please fix validation errors before processing payroll!");
                    }
                  }}
                  disabled={filteredRecords.some(r => !r.bankAccount || !r.email)}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    filteredRecords.some(r => !r.bankAccount || !r.email)
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800"
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  Proceed to Process
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}