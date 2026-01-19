import React, { useState, useMemo } from 'react';
import { Plus, Eye, Save, ChevronRight, ChevronLeft, Calendar, DollarSign, Users, FileText, Settings, CheckCircle, X, Edit2, Clock, Download, Mail, ChevronDown, ChevronUp, Search, FileSpreadsheet, TrendingUp, AlertCircle } from 'lucide-react';

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

interface Bonus {
  id: string;
  label: string;
  amount: number;
  approved: boolean;
  date: string;
}

interface Arrear {
  id: string;
  label: string;
  amount: number;
  fromDate: string;
  toDate: string;
  reason: string;
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
  arrearDetails?: Arrear[];
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

interface PayrollEntry {
  postingDate: string;
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
}

// Demo Data
const demoEmployees: Employee[] = [
  { id: "EMP001", name: "Rajesh Kumar", email: "rajesh.kumar@company.com", department: "Engineering", designation: "Senior Developer", grade: "L5", joiningDate: "2020-03-15", bankAccount: "HDFC-9876543210", pfNumber: "PF123456", taxStatus: "New Regime", isActive: true, basicSalary: 50000, hra: 20000, allowances: 11000 },
  { id: "EMP002", name: "Priya Sharma", email: "priya.sharma@company.com", department: "Sales", designation: "Sales Manager", grade: "L6", joiningDate: "2019-07-22", bankAccount: "ICICI-8765432109", pfNumber: "PF123457", taxStatus: "Old Regime", isActive: true, basicSalary: 60000, hra: 24000, allowances: 16000 },
  { id: "EMP003", name: "Amit Patel", email: "amit.patel@company.com", department: "Engineering", designation: "Tech Lead", grade: "L7", joiningDate: "2018-01-10", bankAccount: "SBI-7654321098", pfNumber: "PF123458", taxStatus: "New Regime", isActive: true, basicSalary: 75000, hra: 30000, allowances: 20000 },
  { id: "EMP004", name: "Sneha Reddy", email: "sneha.reddy@company.com", department: "HR", designation: "HR Manager", grade: "L6", joiningDate: "2021-05-18", bankAccount: "AXIS-6543210987", pfNumber: "PF123459", taxStatus: "Old Regime", isActive: true, basicSalary: 55000, hra: 22000, allowances: 13000 },
  { id: "EMP005", name: "Vikram Singh", email: "vikram.singh@company.com", department: "Finance", designation: "Financial Analyst", grade: "L4", joiningDate: "2022-09-01", bankAccount: "KOTAK-5432109876", pfNumber: "PF123460", taxStatus: "New Regime", isActive: true, basicSalary: 45000, hra: 18000, allowances: 9000 }
];

// Utils
const generatePayrollRecord = (emp: Employee, status: PayrollRecord["status"] = "Draft"): PayrollRecord => {
  const gross = emp.basicSalary + emp.hra + emp.allowances;
  const tax = Math.round(gross * 0.12);
  const pf = Math.round(emp.basicSalary * 0.12);
  const other = 500;
  
  // Sample arrears for demo
  const arrearDetails: Arrear[] = [
    {
      id: 'ARR001',
      label: 'Salary Arrear',
      amount: 5000,
      fromDate: '2025-10-01',
      toDate: '2025-12-31',
      reason: 'Pending increment arrear for Q4 2025'
    }
  ];
  
  const totalArrears = arrearDetails.reduce((sum, arr) => sum + arr.amount, 0);
  
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
    arrears: totalArrears,
    arrearDetails: arrearDetails,
    grossPay: gross + totalArrears,
    taxDeduction: tax,
    pfDeduction: pf,
    otherDeductions: other,
    netPay: gross + totalArrears - tax - pf - other,
    status,
    createdDate: new Date().toISOString(),
    taxRegime: emp.taxStatus === "New Regime" ? "New" : "Old"
  };
};

// New Payroll Entry Form Components
const OverviewTab = ({ data, onChange }: { data: PayrollEntry, onChange: (field: string, value: any) => void }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Posting Date <span className="text-red-500">*</span></label>
        <input type="date" value={data.postingDate} onChange={(e) => onChange('postingDate', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Currency <span className="text-red-500">*</span></label>
        <select value={data.currency} onChange={(e) => onChange('currency', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Company <span className="text-red-500">*</span></label>
        <input type="text" value={data.company} onChange={(e) => onChange('company', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Payroll Payable Account <span className="text-red-500">*</span></label>
        <select value={data.payrollPayableAccount} onChange={(e) => onChange('payrollPayableAccount', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
          <option value="Payroll Payable - I">Payroll Payable - I</option>
          <option value="Payroll Payable - II">Payroll Payable - II</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
        <input type="text" value={data.status} readOnly className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Payroll Frequency <span className="text-red-500">*</span></label>
        <select value={data.payrollFrequency} onChange={(e) => onChange('payrollFrequency', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
          <option value="">Select</option>
          <option value="Monthly">Monthly</option>
          <option value="Biweekly">Biweekly</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <label className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer">
        <input type="checkbox" checked={data.salarySlipTimesheet} onChange={(e) => onChange('salarySlipTimesheet', e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
        <span className="text-sm font-medium">Salary Slip Based on Timesheet</span>
      </label>
      <label className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer">
        <input type="checkbox" checked={data.deductTaxForProof} onChange={(e) => onChange('deductTaxForProof', e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
        <span className="text-sm font-medium">Deduct Tax For Unsubmitted Proof</span>
      </label>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date <span className="text-red-500">*</span></label>
        <input type="date" value={data.startDate} onChange={(e) => onChange('startDate', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">End Date <span className="text-red-500">*</span></label>
        <input type="date" value={data.endDate} onChange={(e) => onChange('endDate', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
      </div>
    </div>
  </div>
);

const EmployeesTabEntry = ({ data, onChange, employees }: { data: PayrollEntry, onChange: (field: string, value: any) => void, employees: Employee[] }) => {
  const toggleEmployee = (empId: string) => {
    const current = data.selectedEmployees || [];
    const updated = current.includes(empId) ? current.filter(id => id !== empId) : [...current, empId];
    onChange('selectedEmployees', updated);
  };

  const selectAll = () => {
    const allIds = employees.filter(e => e.isActive).map(e => e.id);
    onChange('selectedEmployees', data.selectedEmployees?.length === allIds.length ? [] : allIds);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={data.selectedEmployees?.length === employees.filter(e => e.isActive).length} onChange={selectAll} className="w-5 h-5 text-blue-600 rounded" />
          <span className="font-semibold text-blue-900">Select All Employees</span>
        </label>
        <span className="text-sm font-medium text-blue-700">{data.selectedEmployees?.length || 0} selected</span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {employees.filter(e => e.isActive).map(emp => {
          const isSelected = data.selectedEmployees?.includes(emp.id);
          return (
            <div key={emp.id} onClick={() => toggleEmployee(emp.id)}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input type="checkbox" checked={isSelected} onChange={() => {}} className="w-5 h-5 text-blue-600 rounded" />
                  <div>
                    <p className="font-semibold text-slate-800">{emp.name}</p>
                    <p className="text-sm text-slate-600">{emp.id} • {emp.designation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">₹{(emp.basicSalary + emp.hra + emp.allowances).toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Gross</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AccountingTab = ({ data, onChange, employees }: { data: PayrollEntry, onChange: (field: string, value: any) => void, employees: Employee[] }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Account <span className="text-red-500">*</span></label>
        <select value={data.paymentAccount} onChange={(e) => onChange('paymentAccount', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
          <option value="">Select</option>
          <option value="HDFC Bank">HDFC Bank</option>
          <option value="ICICI Bank">ICICI Bank</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Cost Center</label>
        <select value={data.costCenter} onChange={(e) => onChange('costCenter', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
          <option value="">Select</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Project</label>
        <select value={data.project} onChange={(e) => onChange('project', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
          <option value="">Select</option>
          <option value="Project Alpha">Project Alpha</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Letter Head</label>
        <select value={data.letterHead} onChange={(e) => onChange('letterHead', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
          <option value="">Select</option>
          <option value="Company">Company</option>
        </select>
      </div>
    </div>
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
      <h3 className="font-bold text-blue-900 mb-4">Payment Summary</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4">
          <p className="text-xs text-slate-600 mb-1">Employees</p>
          <p className="text-2xl font-bold text-slate-800">{data.selectedEmployees?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-xs text-slate-600 mb-1">Est. Gross</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{(employees.filter(e => data.selectedEmployees?.includes(e.id)).reduce((sum, e) => sum + e.basicSalary + e.hra + e.allowances, 0)).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-xs text-slate-600 mb-1">Est. Net</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{Math.round(employees.filter(e => data.selectedEmployees?.includes(e.id)).reduce((sum, e) => sum + e.basicSalary + e.hra + e.allowances, 0) * 0.76).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Main Payroll Management Component
export default function PayrollManagement() {
  const [view, setView] = useState<'dashboard' | 'newEntry'>('dashboard');
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([
    generatePayrollRecord(demoEmployees[0], "Paid"),
    generatePayrollRecord(demoEmployees[1], "Pending")
  ]);
  
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedDept, setSelectedDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPayslip, setShowPayslip] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // New Entry State
  const [activeTab, setActiveTab] = useState(0);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<PayrollEntry>({
    postingDate: '2026-01-18',
    currency: 'INR',
    company: 'Izyane',
    payrollPayableAccount: 'Payroll Payable - I',
    status: 'Draft',
    salarySlipTimesheet: false,
    deductTaxForProof: false,
    payrollFrequency: '',
    startDate: '',
    endDate: '',
    paymentAccount: '',
    costCenter: '',
    project: '',
    letterHead: '',
    selectedEmployees: []
  });

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
    return { total, pending, paid };
  }, [filteredRecords]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreatePayroll = () => {
    if (selectedEmployees.length === 0) return alert("Select employees");
    const newRecords = selectedEmployees.map(empId => {
      const emp = demoEmployees.find(e => e.id === empId);
      if (!emp) return null;
      return generatePayrollRecord(emp, "Pending");
    }).filter((r): r is PayrollRecord => r !== null);
    
    setPayrollRecords(prev => [...prev, ...newRecords]);
    setSelectedEmployees([]);
    setShowCreateModal(false);
    alert(`Created payroll for ${newRecords.length} employees`);
  };

  const handleRunPayroll = () => {
    const pending = payrollRecords.filter(r => r.status === "Pending");
    if (pending.length === 0) return alert("No pending payroll");
    setPayrollRecords(prev => prev.map(rec => 
      rec.status === "Pending" ? { ...rec, status: "Processing" as const } : rec
    ));
    setTimeout(() => {
      setPayrollRecords(prev => prev.map(rec => 
        rec.status === "Processing" ? { ...rec, status: "Paid" as const, paymentDate: new Date().toLocaleDateString() } : rec
      ));
      alert("Payroll processed!");
    }, 2000);
  };

  const saveEdit = () => {
    if (!editingRecord) return;
    const newGross = editingRecord.basicSalary + editingRecord.hra + editingRecord.allowances + editingRecord.arrears;
    const newTax = Math.round(newGross * 0.12);
    const newPf = Math.round(editingRecord.basicSalary * 0.12);
    const newNet = newGross - newTax - newPf - editingRecord.otherDeductions;
    setPayrollRecords(prev => prev.map(r => 
      r.id === editingRecord.id ? { ...editingRecord, grossPay: newGross, taxDeduction: newTax, pfDeduction: newPf, netPay: newNet } : r
    ));
    setEditingRecord(null);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSaveEntry = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCreateFromEntry = () => {
    if (formData.selectedEmployees.length === 0) return alert("Select employees");
    const newRecords = formData.selectedEmployees.map(empId => {
      const emp = demoEmployees.find(e => e.id === empId);
      if (!emp) return null;
      return generatePayrollRecord(emp, "Pending");
    }).filter((r): r is PayrollRecord => r !== null);
    
    setPayrollRecords(prev => [...prev, ...newRecords]);
    alert(`Created payroll for ${newRecords.length} employees`);
    setView('dashboard');
    setFormData({ ...formData, selectedEmployees: [] });
  };

  const tabs = [
    { name: 'Overview', icon: FileText },
    { name: 'Employees', icon: Users },
    { name: 'Accounting & Payment', icon: Settings }
  ];

  if (view === 'newEntry') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-800">New Payroll Entry</h1>
                  {saved ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />Saved
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full">Not Saved</span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('dashboard')} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
                  Back to Dashboard
                </button>
                <button onClick={handleSaveEntry} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg">
                  <Save className="w-5 h-5" />Save
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 mb-6">
            <div className="flex border-b border-slate-200">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button key={index} onClick={() => setActiveTab(index)}
                    className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeTab === index ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'
                    }`}>
                    <Icon className="w-5 h-5" />{tab.name}
                  </button>
                );
              })}
            </div>

            <div className="p-8">
              {activeTab === 0 && <OverviewTab data={formData} onChange={handleFormChange} />}
              {activeTab === 1 && <EmployeesTabEntry data={formData} onChange={handleFormChange} employees={demoEmployees} />}
              {activeTab === 2 && <AccountingTab data={formData} onChange={handleFormChange} employees={demoEmployees} />}
            </div>

            <div className="border-t border-slate-200 p-6 bg-slate-50 flex justify-between">
              <button onClick={() => setActiveTab(prev => Math.max(0, prev - 1))} disabled={activeTab === 0}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${activeTab === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'}`}>
                <ChevronLeft className="w-5 h-5" />Previous
              </button>
              {activeTab === tabs.length - 1 ? (
                <button onClick={handleCreateFromEntry} disabled={formData.selectedEmployees.length === 0}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                    formData.selectedEmployees.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                  }`}>
                  <CheckCircle className="w-5 h-5" />Create Payroll ({formData.selectedEmployees.length})
                </button>
              ) : (
                <button onClick={() => setActiveTab(prev => Math.min(tabs.length - 1, prev + 1))}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2">
                  Next<ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Payroll Management</h1>
              <p className="text-slate-600 mt-1">Manage employee payroll and salary processing</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setView('newEntry')} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 shadow-lg">
                <Plus className="w-4 h-4" />New Entry Form
              </button>
              <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg">
                <Plus className="w-4 h-4" />Quick Create
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
              <span className="text-xs font-medium text-slate-500">TOTAL</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{payrollRecords.length}</p>
            <p className="text-sm text-slate-600 mt-1">Employees</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="w-6 h-6 text-green-600" /></div>
              <span className="text-xs font-medium text-slate-500">PAID</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            <p className="text-sm text-slate-600 mt-1">Processed</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-amber-100 rounded-lg"><Clock className="w-6 h-6 text-amber-600" /></div>
              <span className="text-xs font-medium text-slate-500">PENDING</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-sm text-slate-600 mt-1">To Process</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-100 rounded-lg"><DollarSign className="w-6 h-6 text-purple-600" /></div>
              <span className="text-xs font-medium text-slate-500">PAYOUT</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">₹{(stats.total / 1000).toFixed(0)}K</p>
            <p className="text-sm text-slate-600 mt-1">Net Amount</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
            {stats.pending > 0 && (
              <button onClick={handleRunPayroll}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center gap-2 shadow-lg">
                <TrendingUp className="w-4 h-4" />Run Payroll ({stats.pending})
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
                    <tr onClick={() => toggleRow(record.id)} className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          <div>
                            <p className="font-semibold text-slate-800">{record.employeeName}</p>
                            <p className="text-xs text-slate-500">{record.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">{record.department}</td>
                      <td className="py-4 px-4 text-right font-semibold text-slate-800">₹{record.grossPay.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right font-medium text-red-600">-₹{totalDeductions.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right font-bold text-green-600">₹{record.netPay.toLocaleString()}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === "Paid" ? "bg-green-100 text-green-700" :
                          record.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {record.status === "Paid" && <CheckCircle className="w-3 h-3" />}
                          {record.status === "Pending" && <Clock className="w-3 h-3" />}
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => { setSelectedRecord(record); setShowPayslip(true); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Payslip">
                            <FileText className="w-4 h-4" />
                          </button>
                          {record.status !== "Paid" && (
                            <button onClick={() => setEditingRecord({...record})}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-b-2 border-blue-200">
                        <td colSpan={7} className="px-6 py-8">
                          <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-3 gap-8 mb-6">
                              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                                <h4 className="font-bold text-slate-800 mb-4">Employee Details</h4>
                                <div className="space-y-3 text-sm">
                                  <div className="flex justify-between"><span className="text-slate-600">Designation:</span><span className="font-semibold">{record.designation}</span></div>
                                  <div className="flex justify-between"><span className="text-slate-600">Grade:</span><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">{record.grade}</span></div>
                                  <div className="flex justify-between"><span className="text-slate-600">Bank:</span><span className="font-semibold text-xs">{record.bankAccount}</span></div>
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-5">
                                <h4 className="font-bold text-green-800 mb-4">Earnings</h4>
                                <div className="space-y-3 text-sm">
                                  <div className="flex justify-between"><span>Basic:</span><span className="font-bold">₹{record.basicSalary.toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span>HRA:</span><span className="font-bold">₹{record.hra.toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span>Allowances:</span><span className="font-bold">₹{record.allowances.toLocaleString()}</span></div>
                                  {record.arrears > 0 && (
                                    <div className="bg-amber-50 border border-amber-200 -mx-2 px-3 py-3 rounded-lg mt-2">
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-amber-900">Arrears:</span>
                                        <span className="font-bold text-amber-700">₹{record.arrears.toLocaleString()}</span>
                                      </div>
                                      {record.arrearDetails && record.arrearDetails.length > 0 && (
                                        <div className="space-y-2 mt-2 pt-2 border-t border-amber-200">
                                          {record.arrearDetails.map((arr) => (
                                            <div key={arr.id} className="text-xs">
                                              <div className="flex justify-between mb-1">
                                                <span className="font-medium text-amber-800">{arr.label}</span>
                                                <span className="font-bold text-amber-700">₹{arr.amount.toLocaleString()}</span>
                                              </div>
                                              <div className="text-amber-600">
                                                <span className="font-medium">Period:</span> {new Date(arr.fromDate).toLocaleDateString()} to {new Date(arr.toDate).toLocaleDateString()}
                                              </div>
                                              <div className="text-amber-600 italic">{arr.reason}</div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  <div className="flex justify-between pt-3 border-t-2 border-green-300"><span className="font-bold">Gross:</span><span className="text-lg font-bold text-green-700">₹{record.grossPay.toLocaleString()}</span></div>
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-sm border border-red-200 p-5">
                                <h4 className="font-bold text-red-800 mb-4">Deductions</h4>
                                <div className="space-y-3 text-sm">
                                  <div className="flex justify-between"><span>Tax:</span><span className="font-bold">₹{record.taxDeduction.toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span>PF:</span><span className="font-bold">₹{record.pfDeduction.toLocaleString()}</span></div>
                                  <div className="flex justify-between pt-3 border-t-2 border-red-300"><span className="font-bold">Total:</span><span className="text-lg font-bold text-red-700">-₹{totalDeductions.toLocaleString()}</span></div>
                                  <div className="mt-4 pt-4 border-t-2 border-slate-300">
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-3 rounded-lg">
                                      <div className="flex justify-between"><span className="text-sm font-bold text-white">Net Pay:</span><span className="text-2xl font-bold text-white">₹{record.netPay.toLocaleString()}</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
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

        {/* Quick Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Quick Create Payroll</h2>
                    <p className="text-blue-100 mt-1">Select employees</p>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                <div className="mb-4 flex items-center gap-3 border rounded-lg p-3 bg-slate-50">
                  <input type="checkbox" 
                    checked={selectedEmployees.length === demoEmployees.filter(e => e.isActive).length}
                    onChange={() => {
                      const allIds = demoEmployees.filter(e => e.isActive).map(e => e.id);
                      setSelectedEmployees(selectedEmployees.length === allIds.length ? [] : allIds);
                    }}
                    className="w-5 h-5 text-blue-600 rounded" />
                  <span className="font-semibold text-slate-700">Select All</span>
                </div>
                <div className="space-y-4">
                  {demoEmployees.filter(e => e.isActive).map(emp => {
                    const isSelected = selectedEmployees.includes(emp.id);
                    return (
                      <div key={emp.id} onClick={() => setSelectedEmployees(prev => prev.includes(emp.id) ? prev.filter(i => i !== emp.id) : [...prev, emp.id])}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <input type="checkbox" checked={isSelected} onChange={() => {}} className="w-5 h-5 text-blue-600 rounded" />
                            <div>
                              <p className="font-semibold text-slate-800">{emp.name}</p>
                              <p className="text-sm text-slate-600">{emp.id} • {emp.designation}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-800">₹{(emp.basicSalary + emp.hra + emp.allowances).toLocaleString()}</p>
                            <p className="text-xs text-slate-500">Gross</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white">Cancel</button>
                <button onClick={handleCreatePayroll} disabled={selectedEmployees.length === 0}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    selectedEmployees.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                  }`}>
                  <CheckCircle className="w-5 h-5" />Create ({selectedEmployees.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingRecord && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                <h2 className="text-2xl font-bold">Edit Salary</h2>
                <p className="text-purple-100 mt-1">{editingRecord.employeeName}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Basic Salary</label>
                    <input type="number" value={editingRecord.basicSalary} 
                      onChange={(e) => setEditingRecord({...editingRecord, basicSalary: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">HRA</label>
                    <input type="number" value={editingRecord.hra} 
                      onChange={(e) => setEditingRecord({...editingRecord, hra: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Allowances</label>
                    <input type="number" value={editingRecord.allowances} 
                      onChange={(e) => setEditingRecord({...editingRecord, allowances: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Arrears</label>
                    <input type="number" value={editingRecord.arrears} 
                      onChange={(e) => setEditingRecord({...editingRecord, arrears: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                
                {editingRecord.arrearDetails && editingRecord.arrearDetails.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Arrear Details
                    </h4>
                    <div className="space-y-3">
                      {editingRecord.arrearDetails.map((arr) => (
                        <div key={arr.id} className="bg-white rounded-lg p-3 border border-amber-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-sm text-slate-800">{arr.label}</span>
                            <span className="font-bold text-amber-700">₹{arr.amount.toLocaleString()}</span>
                          </div>
                          <div className="text-xs text-slate-600 space-y-1">
                            <div><span className="font-medium">Period:</span> {new Date(arr.fromDate).toLocaleDateString()} - {new Date(arr.toDate).toLocaleDateString()}</div>
                            <div className="italic text-amber-700">{arr.reason}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-800 font-semibold">Estimated Net:</span>
                    <span className="text-2xl font-bold text-purple-700">
                      ₹{(editingRecord.basicSalary + editingRecord.hra + editingRecord.allowances + editingRecord.arrears - 
                        Math.round((editingRecord.basicSalary + editingRecord.hra + editingRecord.allowances + editingRecord.arrears) * 0.24) - 500).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
                <button onClick={() => setEditingRecord(null)} className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white">Cancel</button>
                <button onClick={saveEdit} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800">Save</button>
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
                  <button onClick={() => setShowPayslip(false)} className="p-2 hover:bg-white/20 rounded-lg"><X className="w-6 h-6" /></button>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                  <div><p className="text-xs text-slate-500 uppercase mb-1">Employee ID</p><p className="font-semibold text-slate-800">{selectedRecord.employeeId}</p></div>
                  <div><p className="text-xs text-slate-500 uppercase mb-1">Name</p><p className="font-semibold text-slate-800">{selectedRecord.employeeName}</p></div>
                  <div><p className="text-xs text-slate-500 uppercase mb-1">Designation</p><p className="font-semibold text-slate-800">{selectedRecord.designation}</p></div>
                  <div><p className="text-xs text-slate-500 uppercase mb-1">Department</p><p className="font-semibold text-slate-800">{selectedRecord.department}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Earnings
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-700">Basic Salary</span><span className="font-semibold">₹{selectedRecord.basicSalary.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-700">HRA</span><span className="font-semibold">₹{selectedRecord.hra.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-700">Allowances</span><span className="font-semibold">₹{selectedRecord.allowances.toLocaleString()}</span></div>
                      
                      {selectedRecord.arrears > 0 && (
                        <div className="bg-amber-50 border border-amber-300 -mx-3 px-3 py-3 rounded-lg mt-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-amber-900 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              Arrears
                            </span>
                            <span className="font-bold text-amber-700">₹{selectedRecord.arrears.toLocaleString()}</span>
                          </div>
                          {selectedRecord.arrearDetails && selectedRecord.arrearDetails.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-amber-300">
                              {selectedRecord.arrearDetails.map((arr) => (
                                <div key={arr.id} className="bg-white rounded-md p-2 border border-amber-200">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-semibold text-slate-800">{arr.label}</span>
                                    <span className="text-xs font-bold text-amber-700">₹{arr.amount.toLocaleString()}</span>
                                  </div>
                                  <div className="text-xs text-amber-800 space-y-0.5">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      <span className="font-medium">Period:</span> {new Date(arr.fromDate).toLocaleDateString('en-GB')} to {new Date(arr.toDate).toLocaleDateString('en-GB')}
                                    </div>
                                    <div className="italic text-amber-700 text-[11px]">{arr.reason}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-3 border-t-2 border-green-300 mt-2">
                        <span className="font-bold text-green-900">Gross Salary</span>
                        <span className="font-bold text-lg text-green-700">₹{selectedRecord.grossPay.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Deductions
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-700">Tax ({selectedRecord.taxRegime} Regime)</span><span className="font-semibold">₹{selectedRecord.taxDeduction.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-700">Provident Fund</span><span className="font-semibold">₹{selectedRecord.pfDeduction.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-700">Other Deductions</span><span className="font-semibold">₹{selectedRecord.otherDeductions.toLocaleString()}</span></div>
                      <div className="flex justify-between pt-3 border-t-2 border-red-300 mt-2">
                        <span className="font-bold text-red-900">Total Deductions</span>
                        <span className="font-bold text-lg text-red-700">₹{(selectedRecord.taxDeduction + selectedRecord.pfDeduction + selectedRecord.otherDeductions).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-teal-100 text-sm mb-1">Net Salary (Take Home)</p>
                      <p className="text-4xl font-bold">₹{selectedRecord.netPay.toLocaleString()}</p>
                      <p className="text-teal-100 text-xs mt-2">Payment Date: {selectedRecord.paymentDate || 'Pending'}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      selectedRecord.status === 'Paid' ? 'bg-green-500' : 'bg-white/20'
                    }`}>
                      {selectedRecord.status === 'Paid' && <CheckCircle className="w-4 h-4" />}
                      {selectedRecord.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
                <button onClick={() => alert('Downloaded')} className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />Download PDF
                </button>
                <button onClick={() => alert(`Sent to ${selectedRecord.email}`)} className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />Email Payslip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}