import React, { useMemo, useState } from 'react';
import { Users, TrendingUp, TrendingDown, Calendar, DollarSign, Download, FileText, Send, CheckCircle, XCircle, Filter, Search, Eye, Printer } from 'lucide-react';

type PayrollRecord = {
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
  paymentDate?: string;
  bankAccount: string;
  workingDays: number;
  paidDays: number;
};

const demoPayrollRecords: PayrollRecord[] = [
  { 
    id: 'PAY001', 
    employeeId: 'EMP101',
    employeeName: 'Sarah Johnson', 
    department: 'Engineering', 
    designation: 'Senior Developer',
    grade: 'G5', 
    basicSalary: 50000,
    hra: 20000,
    allowances: 11000,
    grossPay: 81000, 
    taxDeduction: 12150,
    pfDeduction: 6000,
    otherDeductions: 850,
    netPay: 62000, 
    status: 'Paid',
    paymentDate: 'Nov 01, 2024',
    bankAccount: '****5678',
    workingDays: 22,
    paidDays: 22
  },
  { 
    id: 'PAY002', 
    employeeId: 'EMP102',
    employeeName: 'Michael Chen', 
    department: 'Marketing', 
    designation: 'Marketing Manager',
    grade: 'G4', 
    basicSalary: 45000,
    hra: 18000,
    allowances: 9000,
    grossPay: 72000, 
    taxDeduction: 10800,
    pfDeduction: 5400,
    otherDeductions: 800,
    netPay: 55000, 
    status: 'Pending',
    bankAccount: '****1234',
    workingDays: 22,
    paidDays: 22
  },
  { 
    id: 'PAY003', 
    employeeId: 'EMP103',
    employeeName: 'Emily Davis', 
    department: 'HR', 
    designation: 'HR Specialist',
    grade: 'G3', 
    basicSalary: 40000,
    hra: 16000,
    allowances: 8000,
    grossPay: 64000, 
    taxDeduction: 9600,
    pfDeduction: 4800,
    otherDeductions: 600,
    netPay: 49000, 
    status: 'Pending',
    bankAccount: '****9012',
    workingDays: 22,
    paidDays: 20
  },
  { 
    id: 'PAY004', 
    employeeId: 'EMP104',
    employeeName: 'David Martinez', 
    department: 'Sales', 
    designation: 'Sales Executive',
    grade: 'G3', 
    basicSalary: 38000,
    hra: 15200,
    allowances: 7800,
    grossPay: 61000, 
    taxDeduction: 9150,
    pfDeduction: 4560,
    otherDeductions: 490,
    netPay: 46800, 
    status: 'Processing',
    bankAccount: '****3456',
    workingDays: 22,
    paidDays: 22
  },
  { 
    id: 'PAY005', 
    employeeId: 'EMP105',
    employeeName: 'Lisa Anderson', 
    department: 'Finance', 
    designation: 'Financial Analyst',
    grade: 'G4', 
    basicSalary: 48000,
    hra: 19200,
    allowances: 10800,
    grossPay: 78000, 
    taxDeduction: 11700,
    pfDeduction: 5760,
    otherDeductions: 540,
    netPay: 60000, 
    status: 'Pending',
    bankAccount: '****7890',
    workingDays: 22,
    paidDays: 22
  },
  { 
    id: 'PAY006', 
    employeeId: 'EMP106',
    employeeName: 'Robert Wilson', 
    department: 'Operations', 
    designation: 'Operations Manager',
    grade: 'G5', 
    basicSalary: 52000,
    hra: 20800,
    allowances: 12200,
    grossPay: 85000, 
    taxDeduction: 12750,
    pfDeduction: 6240,
    otherDeductions: 1010,
    netPay: 65000, 
    status: 'Paid',
    paymentDate: 'Nov 01, 2024',
    bankAccount: '****2345',
    workingDays: 22,
    paidDays: 22
  },
];

const Payroll: React.FC = () => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(demoPayrollRecords);
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Pending' | 'Processing' | 'Failed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollRecord | null>(null);
  const [showPayslip, setShowPayslip] = useState(false);
  const [processingModal, setProcessingModal] = useState(false);

  const departments = useMemo(() => {
    const setDepts = new Set<string>();
    payrollRecords.forEach(r => setDepts.add(r.department));
    return ['All Departments', ...Array.from(setDepts)];
  }, [payrollRecords]);

  const filteredRecords = useMemo(() => {
    return payrollRecords.filter(record => {
      const byDept = selectedDept === 'All Departments' ? true : record.department === selectedDept;
      const byStatus = filterStatus === 'All' ? true : record.status === filterStatus;
      const bySearch = searchQuery === '' ? true : 
        record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      return byDept && byStatus && bySearch;
    });
  }, [payrollRecords, selectedDept, filterStatus, searchQuery]);

  const totalGrossPay = filteredRecords.reduce((sum, record) => sum + record.grossPay, 0);
  const totalNetPay = filteredRecords.reduce((sum, record) => sum + record.netPay, 0);
  const totalDeductions = totalGrossPay - totalNetPay;
  const pendingCount = payrollRecords.filter(r => r.status === 'Pending').length;
  const paidCount = payrollRecords.filter(r => r.status === 'Paid').length;

  const handleProcessPayroll = () => {
    setProcessingModal(true);
  };

  const confirmProcessPayroll = () => {
    // Simulate processing
    setPayrollRecords(prev => prev.map(rec => {
      if (rec.status === 'Pending') {
        return { ...rec, status: 'Processing' as const };
      }
      return rec;
    }));
    
    setProcessingModal(false);

    // Simulate completion after 2 seconds
    setTimeout(() => {
      setPayrollRecords(prev => prev.map(rec => {
        if (rec.status === 'Processing') {
          return { 
            ...rec, 
            status: 'Paid' as const,
            paymentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
          };
        }
        return rec;
      }));
    }, 2000);
  };

  const handleViewPayslip = (record: PayrollRecord) => {
    setSelectedEmployee(record);
    setShowPayslip(true);
  };

  const handleDownloadPayslip = () => {
    if (!selectedEmployee) return;
    
    // Create a simple text-based payslip
    const payslipContent = `
═══════════════════════════════════════════════════════
                    PAYSLIP - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
═══════════════════════════════════════════════════════

Employee Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Employee ID      : ${selectedEmployee.employeeId}
Name             : ${selectedEmployee.employeeName}
Designation      : ${selectedEmployee.designation}
Department       : ${selectedEmployee.department}
Grade            : ${selectedEmployee.grade}
Bank Account     : ${selectedEmployee.bankAccount}
Working Days     : ${selectedEmployee.workingDays}
Paid Days        : ${selectedEmployee.paidDays}

Earnings:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Basic Salary     : ₹ ${selectedEmployee.basicSalary.toLocaleString()}
HRA              : ₹ ${selectedEmployee.hra.toLocaleString()}
Allowances       : ₹ ${selectedEmployee.allowances.toLocaleString()}
                   ─────────────────
Gross Pay        : ₹ ${selectedEmployee.grossPay.toLocaleString()}

Deductions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tax Deduction    : ₹ ${selectedEmployee.taxDeduction.toLocaleString()}
PF Deduction     : ₹ ${selectedEmployee.pfDeduction.toLocaleString()}
Other Deductions : ₹ ${selectedEmployee.otherDeductions.toLocaleString()}
                   ─────────────────
Total Deductions : ₹ ${(selectedEmployee.taxDeduction + selectedEmployee.pfDeduction + selectedEmployee.otherDeductions).toLocaleString()}

═══════════════════════════════════════════════════════
NET PAY          : ₹ ${selectedEmployee.netPay.toLocaleString()}
═══════════════════════════════════════════════════════

Status           : ${selectedEmployee.status}
Payment Date     : ${selectedEmployee.paymentDate || 'Pending'}

This is a computer-generated payslip and does not require a signature.
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([payslipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${selectedEmployee.employeeId}_${new Date().toISOString().slice(0, 7)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleEmailPayslip = () => {
    if (!selectedEmployee) return;
    alert(`Payslip sent to ${selectedEmployee.employeeName}'s registered email address!`);
  };

  const exportToCSV = () => {
    const header = ['EmpID', 'Employee', 'Department', 'Designation', 'Grade', 'GrossPay', 'Deductions', 'NetPay', 'Status', 'PaymentDate'];
    const lines = filteredRecords.map(r =>
      [
        r.employeeId,
        `"${r.employeeName}"`,
        r.department,
        r.designation,
        r.grade,
        r.grossPay,
        (r.taxDeduction + r.pfDeduction + r.otherDeductions),
        r.netPay,
        r.status,
        r.paymentDate || 'N/A'
      ].join(',')
    );
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="w-4 h-4" />;
      case 'Failed': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Payroll Management</h1>
            <p className="text-slate-600 mt-1">Process salaries, manage payslips, and track payments</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={exportToCSV}
              className="bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={handleProcessPayroll}
              disabled={pendingCount === 0}
              className={`px-6 py-2.5 rounded-lg font-semibold shadow-lg transition-all flex items-center gap-2 ${
                pendingCount === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-teal-500/30'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Process Payroll ({pendingCount})
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600 w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-slate-800">{payrollRecords.length}</p>
            <p className="text-xs text-slate-500 mt-2">Active on payroll</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CheckCircle className="text-emerald-600 w-6 h-6" />
              </div>
              <TrendingUp className="text-emerald-500 w-5 h-5" />
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Processed This Month</p>
            <p className="text-3xl font-bold text-slate-800">{paidCount}</p>
            <p className="text-xs text-emerald-600 mt-2 font-medium">Successfully paid</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Calendar className="text-amber-600 w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Pending Payments</p>
            <p className="text-3xl font-bold text-slate-800">{pendingCount}</p>
            <p className="text-xs text-amber-600 mt-2 font-medium">Awaiting processing</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="text-purple-600 w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Payroll</p>
            <p className="text-3xl font-bold text-slate-800">₹{(totalNetPay / 1000).toFixed(0)}K</p>
            <p className="text-xs text-slate-500 mt-2">Net disbursement</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or employee ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Employee</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Department</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Designation</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Grade</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Gross Pay</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Deductions</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Net Pay</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-slate-800">{record.employeeName}</p>
                        <p className="text-xs text-slate-500">{record.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700">{record.department}</td>
                    <td className="py-4 px-6 text-sm text-slate-700">{record.designation}</td>
                    <td className="py-4 px-6 text-sm text-slate-700">{record.grade}</td>
                    <td className="py-4 px-6 text-right font-semibold text-slate-800">₹{record.grossPay.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right text-red-600 font-medium">-₹{(record.taxDeduction + record.pfDeduction + record.otherDeductions).toLocaleString()}</td>
                    <td className="py-4 px-6 text-right font-bold text-emerald-600">₹{record.netPay.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleViewPayslip(record)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View Payslip"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="bg-slate-50 border-t-2 border-slate-300 p-6">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total Gross Pay</p>
                <p className="text-2xl font-bold text-slate-800">₹{totalGrossPay.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600">₹{totalDeductions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total Net Pay</p>
                <p className="text-2xl font-bold text-emerald-600">₹{totalNetPay.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payslip Modal */}
        {showPayslip && selectedEmployee && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">Payslip</h2>
                    <p className="text-teal-100 mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                  <button
                    onClick={() => setShowPayslip(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Employee Info */}
                <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Employee ID</p>
                    <p className="font-semibold text-slate-800">{selectedEmployee.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Name</p>
                    <p className="font-semibold text-slate-800">{selectedEmployee.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Designation</p>
                    <p className="font-semibold text-slate-800">{selectedEmployee.designation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Department</p>
                    <p className="font-semibold text-slate-800">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Grade</p>
                    <p className="font-semibold text-slate-800">{selectedEmployee.grade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Bank Account</p>
                    <p className="font-semibold text-slate-800">{selectedEmployee.bankAccount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Working Days</p>
                    <p className="font-semibold text-slate-800">{selectedEmployee.workingDays}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Paid Days</p>
                    <p className="font-semibold text-slate-800">{selectedEmployee.paidDays}</p>
                  </div>
                </div>

                {/* Earnings & Deductions */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Earnings */}
                  <div className="bg-emerald-50 rounded-xl p-6">
                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Earnings
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Basic Salary</span>
                        <span className="font-semibold text-slate-800">₹{selectedEmployee.basicSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">HRA</span>
                        <span className="font-semibold text-slate-800">₹{selectedEmployee.hra.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Allowances</span>
                        <span className="font-semibold text-slate-800">₹{selectedEmployee.allowances.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t-2 border-emerald-200">
                        <span className="font-bold text-emerald-800">Gross Pay</span>
                        <span className="font-bold text-emerald-800">₹{selectedEmployee.grossPay.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="bg-red-50 rounded-xl p-6">
                    <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                      <TrendingDown className="w-5 h-5" />
                      Deductions
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tax Deduction</span>
                        <span className="font-semibold text-slate-800">₹{selectedEmployee.taxDeduction.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">PF Deduction</span>
                        <span className="font-semibold text-slate-800">₹{selectedEmployee.pfDeduction.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Other Deductions</span>
                        <span className="font-semibold text-slate-800">₹{selectedEmployee.otherDeductions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t-2 border-red-200">
                        <span className="font-bold text-red-800">Total Deductions</span>
                        <span className="font-bold text-red-800">₹{(selectedEmployee.taxDeduction + selectedEmployee.pfDeduction + selectedEmployee.otherDeductions).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-teal-100 text-sm mb-1">Net Salary (Take Home)</p>
                      <p className="text-4xl font-bold">₹{selectedEmployee.netPay.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-teal-100 text-sm mb-1">Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedEmployee.status === 'Paid' 
                          ? 'bg-white/20 text-white' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {getStatusIcon(selectedEmployee.status)}
                        {selectedEmployee.status}
                      </span>
                    </div>
                  </div>
                  {selectedEmployee.paymentDate && (
                    <p className="text-teal-100 text-sm mt-3">
                      Payment Date: {selectedEmployee.paymentDate}
                    </p>
                  )}
                </div>

                {/* Footer Note */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-600 text-center">
                    This is a computer-generated payslip and does not require a signature.
                  </p>
                  <p className="text-xs text-slate-500 text-center mt-1">
                    Generated on: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-slate-50 border-t border-slate-200 p-6 rounded-b-2xl flex gap-3">
                <button
                  onClick={handleDownloadPayslip}
                  className="flex-1 bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Payslip
                </button>
                <button
                  onClick={handleEmailPayslip}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Email Payslip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Processing Confirmation Modal */}
        {processingModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">Confirm Payroll Processing</h2>
                <p className="text-teal-100 mt-1">Review details before processing</p>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <div className="text-amber-600 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Processing {pendingCount} pending payments</p>
                    <p className="text-sm text-amber-700">
                      This will initiate salary transfers to all employees with "Pending" status. 
                      Please ensure sufficient funds are available in the payroll account.
                    </p>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Employees</p>
                    <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
                    <p className="text-xs text-slate-600 mt-1">To be paid</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                    <p className="text-xs text-emerald-600 uppercase tracking-wider mb-2">Gross Amount</p>
                    <p className="text-2xl font-bold text-emerald-800">
                      ₹{payrollRecords.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.grossPay, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-5 border border-teal-200">
                    <p className="text-xs text-teal-600 uppercase tracking-wider mb-2">Net Payout</p>
                    <p className="text-2xl font-bold text-teal-800">
                      ₹{payrollRecords.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.netPay, 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-3">Payment Breakdown</h3>
                  <div className="space-y-2">
                    {payrollRecords.filter(r => r.status === 'Pending').slice(0, 3).map(emp => (
                      <div key={emp.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-teal-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{emp.employeeName}</p>
                            <p className="text-xs text-slate-500">{emp.employeeId}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-slate-800">₹{emp.netPay.toLocaleString()}</p>
                      </div>
                    ))}
                    {pendingCount > 3 && (
                      <p className="text-xs text-slate-500 text-center pt-2">
                        +{pendingCount - 3} more employees
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-slate-50 border-t border-slate-200 p-6 rounded-b-2xl flex gap-3">
                <button
                  onClick={() => setProcessingModal(false)}
                  className="flex-1 bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmProcessPayroll}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirm & Process
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;