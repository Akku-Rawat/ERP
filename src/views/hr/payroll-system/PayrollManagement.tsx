// PayrollManagement.tsx - Main comprehensive payroll management component

import React, { useState, useMemo } from 'react';
import { Plus, Save, ChevronRight, ChevronLeft, FileText, Users, Settings, CheckCircle, Calendar, CreditCard, BarChart3, Clock } from 'lucide-react';
import type { PayrollRecord, PayrollEntry } from './types';
import { demoEmployees } from './constants';
import { generatePayrollRecord, recalculatePayroll } from './utils';
import { KPICards } from './KPICards';
import { FilterBar } from './FilterBar';
import { PayrollTable } from './PayrollTable';
import { QuickCreateModal, EditModal, PayslipModal } from './Modals';
import { OverviewTab, EmployeesTab, AccountingTab } from './EntryFormTabs';
// import { AttendanceManager, LeaveManager } from './AttendanceLeaves';
import { LoanManager, AdvanceManager } from './LoansAdvances';
import { PayrollReports, ApprovalWorkflowManager } from './ReportsApprovals';
import TaxDeduction from "./TaxDeduction";
import type { Employee } from "./types";
import EditEmployeePayrollModal from "./EditEmployeePayrollModal";


export default function PayrollManagement() {
  const [view, setView] = useState<'dashboard' | 'newEntry' | 'attendance' | 'loans' | 'reports' | 'approvals'>('dashboard');
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([
    generatePayrollRecord(demoEmployees[0], "Paid"),
    generatePayrollRecord(demoEmployees[1], "Pending")
  ]);
  
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedDept, setSelectedDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
 
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [tableTab, setTableTab] = useState<'summary' | 'tax'>('summary');
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  


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
        rec.status === "Processing" 
          ? { ...rec, status: "Paid" as const, paymentDate: new Date().toLocaleDateString() } 
          : rec
      ));
      alert("Payroll processed successfully!");
    }, 2000);
  };

  const handleApprove = (id: string) => {
    setPayrollRecords(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'Approved' as const, approvedDate: new Date().toISOString(), approvedBy: 'MGR001' } : r
    ));
    alert('Payroll approved!');
  };

  const handleReject = (id: string, reason: string) => {
    setPayrollRecords(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'Rejected' as const, rejectionReason: reason } : r
    ));
    alert(`Payroll rejected: ${reason}`);
  };

  const saveEdit = () => {
    if (!editingRecord) return;
    const updated = recalculatePayroll(editingRecord);
    setPayrollRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
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

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllEmployees = () => {
    const allIds = demoEmployees.filter(e => e.isActive).map(e => e.id);
    setSelectedEmployees(selectedEmployees.length === allIds.length ? [] : allIds);
  };

  const tabs = [
    { name: 'Overview', icon: FileText },
    { name: 'Employees', icon: Users },
    { name: 'Accounting & Payment', icon: Settings }
  ];

  // Navigation Header
  const NavHeader = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Payroll Management System</h1>
          <p className="text-slate-600 mt-1">Complete payroll processing with attendance & compliance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            <BarChart3 className="w-4 h-4" />Dashboard
          </button>
          {/* <button onClick={() => setView('attendance')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${view === 'attendance' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            <Calendar className="w-4 h-4" />Attendance
          </button>
          <button onClick={() => setView('loans')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${view === 'loans' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            <CreditCard className="w-4 h-4" />Loans
          </button> */}
          <button onClick={() => setView('reports')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${view === 'reports' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            <FileText className="w-4 h-4" />Reports
          </button>
          {/* <button onClick={() => setView('approvals')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${view === 'approvals' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            <Clock className="w-4 h-4" />Approvals
            {stats.pending > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{stats.pending}</span>}
          </button> */}
        </div>
      </div>
    </div>
  );



  // New Entry View
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
                  Back
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
              {activeTab === 1 && <EmployeesTab data={formData} onChange={handleFormChange} employees={demoEmployees} onEditEmployee={(emp) => setEditEmployee(emp)}
  />}
              {activeTab === 2 && <AccountingTab data={formData} onChange={handleFormChange} employees={demoEmployees} />}
            </div>

            <div className="border-t border-slate-200 p-6 bg-slate-50 flex justify-between">
              <button onClick={() => setActiveTab(prev => Math.max(0, prev - 1))} disabled={activeTab === 0}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                  activeTab === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}>
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

  // Attendance View
  if (view === 'attendance') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <NavHeader />
          <div className="grid grid-cols-1 gap-6">
            <AttendanceManager employees={demoEmployees} />
            <LeaveManager employees={demoEmployees} />
          </div>
        </div>
      </div>
    );
  }

  // Loans View
  if (view === 'loans') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <NavHeader />
          <div className="grid grid-cols-1 gap-6">
            <LoanManager employees={demoEmployees} />
            <AdvanceManager employees={demoEmployees} />
          </div>
        </div>
      </div>
    );
  }

  // Reports View
  if (view === 'reports') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <NavHeader />
          <PayrollReports records={payrollRecords} />
        </div>
      </div>
    );
  }

  // Approvals View
  if (view === 'approvals') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <NavHeader />
          <ApprovalWorkflowManager 
            records={payrollRecords}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    );
  }

 
// Dashboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <NavHeader />
        
        <div className="flex gap-3 justify-end">
          <button onClick={() => setView('newEntry')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" />New Entry Form
          </button>
          <button onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" />Quick Create
          </button>
        </div>

        <KPICards totalRecords={payrollRecords.length} paidCount={stats.paid} pendingCount={stats.pending} totalPayout={stats.total} />

        <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedDept={selectedDept} onDeptChange={setSelectedDept}
          departments={departments} filterStatus={filterStatus} onStatusChange={setFilterStatus} pendingCount={stats.pending} onRunPayroll={handleRunPayroll} />
         {/* Table Tabs */}
<div className="bg-white rounded-xl shadow-sm border border-slate-200">
  <div className="flex border-b border-slate-200">
    <button
      onClick={() => setTableTab('summary')}
      className={`flex-1 px-6 py-3 text-sm font-semibold transition ${
        tableTab === 'summary'
          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      Employee Summary
    </button>

    <button
      onClick={() => setTableTab('tax')}
      className={`flex-1 px-6 py-3 text-sm font-semibold transition ${
        tableTab === 'tax'
          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      Tax Deduction
    </button>
    
  </div>
  
</div>
{tableTab === "summary" && (
  <PayrollTable
    records={filteredRecords}
    expandedRows={expandedRows}
    onToggleRow={toggleRow}
    onViewPayslip={(record) => setSelectedRecord(record)}
    onEditRecord={(record) => setEditingRecord({ ...record })}
    onViewRunDetails={(record) => {
      setSelectedPayrollRun(record.id);
      setView("runDetails");
    }}
  />
)}

{tableTab === "tax" && <TaxDeduction />}


        <QuickCreateModal show={showCreateModal} onClose={() => setShowCreateModal(false)} employees={demoEmployees}
          selectedEmployees={selectedEmployees} onToggleEmployee={toggleEmployee} onSelectAll={selectAllEmployees} onCreate={handleCreatePayroll} />

        <EditModal record={editingRecord} onClose={() => setEditingRecord(null)} onSave={saveEdit}
          onChange={(field, value) => setEditingRecord(prev => prev ? {...prev, [field]: value} : null)} />

        <PayslipModal
  record={selectedRecord}
  onClose={() => setSelectedRecord(null)}   // ✅ THIS IS THE FIX
  onDownload={() => alert('Downloaded')}
  onEmail={() => alert(`Email sent to ${selectedRecord?.email}`)}
/>

      </div>
    </div>
  );
}