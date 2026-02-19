// PayrollManagement.tsx — Root orchestrator for the Payroll module
// Component-wise, clean separation. No inline logic in JSX.

import React, { useState, useMemo, useEffect } from "react";
import {
  Plus, Save, ChevronLeft, ChevronRight,
  FileText, Users, Settings, CheckCircle,
  BarChart3, Layers, Zap,
} from "lucide-react";

import type { PayrollRecord, PayrollEntry, Employee } from "../../../types/payrolltypes";
import { demoEmployees } from "./constants";
import { generatePayrollRecord, recalculatePayroll, runPayrollValidation } from "./utils";

// ── Components ────────────────────────────────────────────────────────────────
import { KPICards }      from "./KPICards";
import { FilterBar }     from "./FilterBar";
import { PayrollTable }  from "./PayrollTable";
import TaxDeduction      from "./TaxDeduction";
import { OverviewTab, EmployeesTab, AccountingTab } from "./EntryFormTabs";

// ── Modals ────────────────────────────────────────────────────────────────────
import { PayslipModal }            from "../../../components/Hr/payrollmodal/PayslipModal";
import { EditModal }               from "../../../components/Hr/payrollmodal/EditModal";
import { QuickCreateModal }        from "../../../components/Hr/payrollmodal/QuickCreatePayrollModal";
import { PayrollValidationModal }  from "../../../components/Hr/payrollmodal/payrollvalidationmodal";

// ── Views ─────────────────────────────────────────────────────────────────────
import { PayrollReports }     from "./ReportsApprovals";
import { EmployeeDetailPage } from "./Employeedetailpage";

// ─────────────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATION (inline, lightweight)
// ─────────────────────────────────────────────────────────────────────────────
interface ToastState { msg: string; type: "success" | "error" | "info" }

const Toast: React.FC<{ toast: ToastState | null }> = ({ toast }) => {
  if (!toast) return null;
  const colors = {
    success: "bg-success text-white",
    error:   "bg-danger  text-white",
    info:    "bg-primary text-white",
  };
  return (
    <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${colors[toast.type]} animate-[slideUp_0.2s_ease]`}>
      <CheckCircle className="w-4 h-4 shrink-0" />
      {toast.msg}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const Btn: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "outline" | "success" | "ghost";
  size?: "sm" | "md";
  className?: string;
}> = ({ onClick, disabled, children, icon, variant = "primary", size = "md", className = "" }) => {
  const v: Record<string, string> = {
    primary: "bg-primary text-white hover:opacity-90 shadow-sm",
    outline: "bg-card text-main border border-theme hover:bg-app",
    success: "bg-success text-white hover:opacity-90 shadow-sm",
    ghost:   "text-muted hover:text-main hover:bg-app",
  };
  const s = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg font-semibold transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed ${v[variant]} ${s} ${className}`}
    >
      {icon}{children}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TOP NAVIGATION BAR (shared across views)
// ─────────────────────────────────────────────────────────────────────────────
type View = "dashboard" | "newEntry" | "reports";

const TopBar: React.FC<{
  view: View;
  setView: (v: View) => void;
  onQuickCreate: () => void;
  onNewPayroll: () => void;
}> = ({ view, setView, onQuickCreate, onNewPayroll }) => {
  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "reports",   label: "Reports",   icon: <FileText  className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="h-12 shrink-0 bg-card border-b border-theme px-5 flex items-center justify-between z-30 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-extrabold text-main">Payroll</span>
        </div>
        <span className="text-muted opacity-30 select-none">|</span>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                view === item.id
                  ? "bg-app text-primary border border-theme"
                  : "text-muted hover:text-main hover:bg-app"
              }`}
            >
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Btn variant="outline" size="sm" icon={<Zap className="w-3.5 h-3.5" />} onClick={onQuickCreate}>
          Quick Create
        </Btn>
        <Btn size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onNewPayroll}>
          New Payroll
        </Btn>
      </div>
    </header>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// NEW PAYROLL ENTRY — 3-step wizard
// ─────────────────────────────────────────────────────────────────────────────
const NewPayrollEntry: React.FC<{
  employees: Employee[];
  onBack: () => void;
  onCreatePayroll: (empIds: string[]) => void;
}> = ({ employees, onBack, onCreatePayroll }) => {
  const [step, setStep]   = useState(0);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<PayrollEntry>({
    payrollName: "", postingDate: new Date().toISOString().slice(0, 10),
    currency: "INR", company: "Izyane InovSolutions Pvt. Ltd.",
    payrollPayableAccount: "Payroll Payable - I",
    status: "Draft", salarySlipTimesheet: false, deductTaxForProof: false,
    payrollFrequency: "Monthly", startDate: "", endDate: "",
    paymentAccount: "", costCenter: "", project: "", letterHead: "",
    selectedEmployees: [],
  });

  const handleFormChange = (field: string, value: any) => {
    setFormData(p => ({ ...p, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { label: "Overview",   icon: <FileText  className="w-3.5 h-3.5" /> },
    { label: "Employees",  icon: <Users     className="w-3.5 h-3.5" /> },
    { label: "Accounting", icon: <Settings  className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-screen flex flex-col bg-app overflow-hidden">
      {/* Header */}
      <header className="h-12 shrink-0 bg-card border-b border-theme px-5 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-app text-muted hover:text-main transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-theme opacity-40" />
          <span className="text-sm font-extrabold text-main">New Payroll Entry</span>
          <span className="text-xs text-muted opacity-60">· Fill all details to create a payroll run</span>
        </div>
        <div className="flex items-center gap-2">
          {saved
            ? <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Saved</span>
            : <span className="text-xs text-muted bg-app border border-theme px-2.5 py-1 rounded-full">Unsaved</span>
          }
          <Btn variant="outline" size="sm" icon={<Save className="w-3.5 h-3.5" />} onClick={handleSave}>
            Save Draft
          </Btn>
        </div>
      </header>

      <div className="flex-1 min-h-0 px-6 py-4 flex flex-col">
        <div className="flex-1 min-h-0 bg-card border border-theme rounded-xl overflow-hidden shadow-sm flex flex-col">

          {/* Step tabs */}
          <div className="shrink-0 flex items-center border-b border-theme px-6">
            {tabs.map((t, i) => (
              <React.Fragment key={i}>
                <button
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold border-b-2 -mb-px transition-all ${
                    i === step
                      ? "text-primary border-primary"
                      : i < step
                      ? "text-success border-transparent hover:border-theme"
                      : "text-muted border-transparent hover:text-main"
                  }`}
                >
                  {i < step
                    ? <CheckCircle className="w-3.5 h-3.5 text-success" />
                    : <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                        i === step ? "bg-primary text-white" : "bg-app border border-theme text-muted"
                      }`}>{i + 1}</span>
                  }
                  {t.label}
                </button>
                {i < tabs.length - 1 && (
                  <div className={`flex-1 h-px mx-3 opacity-30 max-w-[60px] ${i < step ? "bg-success" : "bg-theme"}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            {step === 0 && <OverviewTab   data={formData} onChange={handleFormChange} />}
            {step === 1 && <EmployeesTab  data={formData} onChange={handleFormChange} employees={employees} />}
            {step === 2 && <AccountingTab data={formData} onChange={handleFormChange} employees={employees} />}
          </div>

          {/* Footer navigation */}
          <div className="shrink-0 border-t border-theme px-6 py-3 bg-app flex items-center justify-between">
            <Btn variant="outline" size="sm" icon={<ChevronLeft className="w-3.5 h-3.5" />}
              onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0}>
              Previous
            </Btn>

            {/* Step dots */}
            <div className="flex items-center gap-1.5">
              {tabs.map((_, i) => (
                <div key={i} className={`rounded-full transition-all ${
                  i === step ? "w-5 h-2 bg-primary" : i < step ? "w-2 h-2 bg-success" : "w-2 h-2 bg-theme"
                }`} />
              ))}
            </div>

            {step === tabs.length - 1
              ? <Btn variant="success" size="sm" icon={<CheckCircle className="w-3.5 h-3.5" />}
                  onClick={() => onCreatePayroll(formData.selectedEmployees)}
                  disabled={!formData.selectedEmployees.length}>
                  Create Payroll ({formData.selectedEmployees.length})
                </Btn>
              : <Btn size="sm" onClick={() => setStep(p => Math.min(tabs.length - 1, p + 1))}>
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Btn>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — PayrollManagement
// ─────────────────────────────────────────────────────────────────────────────
export default function PayrollManagement() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [view, setView] = useState<View>("dashboard");
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([
    generatePayrollRecord(demoEmployees[0], "Paid"),
    generatePayrollRecord(demoEmployees[1], "Pending"),
    generatePayrollRecord(demoEmployees[2], "Paid"),
    generatePayrollRecord(demoEmployees[3], "Pending"),
  ]);

  const [expandedRows,      setExpandedRows]      = useState<Set<string>>(new Set());
  const [searchQuery,       setSearchQuery]        = useState("");
  const [selectedDept,      setSelectedDept]       = useState("All");
  const [filterStatus,      setFilterStatus]       = useState("All");
  const [tableTab,          setTableTab]           = useState<"summary" | "tax">("summary");

  // Modals
  const [showCreateModal,   setShowCreateModal]    = useState(false);
  const [showValidation,    setShowValidation]     = useState(false);
  const [selectedEmployees, setSelectedEmployees]  = useState<string[]>([]);
  const [selectedRecord,    setSelectedRecord]     = useState<PayrollRecord | null>(null);
  const [editingRecord,     setEditingRecord]      = useState<PayrollRecord | null>(null);
  const [detailRecord,      setDetailRecord]       = useState<PayrollRecord | null>(null);

  // Validation
  const [validationResult,  setValidationResult]   = useState<ReturnType<typeof runPayrollValidation> | null>(null);
  const [isProcessing,      setIsProcessing]       = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (msg: string, type: ToastState["type"] = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const departments = useMemo(() => {
    const depts = new Set(payrollRecords.map(r => r.department));
    return ["All", ...Array.from(depts)];
  }, [payrollRecords]);

  const filteredRecords = useMemo(() =>
    payrollRecords.filter(r => {
      const deptOk   = selectedDept   === "All" || r.department === selectedDept;
      const statusOk = filterStatus   === "All" || r.status     === filterStatus;
      const searchOk = !searchQuery   ||
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      return deptOk && statusOk && searchOk;
    }),
  [payrollRecords, selectedDept, filterStatus, searchQuery]);

  const pendingRecords = payrollRecords.filter(r => r.status === "Pending");
  const paidRecords    = payrollRecords.filter(r => r.status === "Paid");
  const totalNet       = payrollRecords.reduce((s, r) => s + r.netPay, 0);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggleRow = (id: string) =>
    setExpandedRows(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleEmployee = (id: string) =>
    setSelectedEmployees(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const selectAllEmployees = () => {
    const all = demoEmployees.filter(e => e.isActive).map(e => e.id);
    setSelectedEmployees(selectedEmployees.length === all.length ? [] : all);
  };

  const handleCreatePayroll = (empIds: string[]) => {
    if (!empIds.length) return;
    const newRecs = empIds
      .map(id => { const e = demoEmployees.find(x => x.id === id); return e ? generatePayrollRecord(e, "Pending") : null; })
      .filter((r): r is PayrollRecord => r !== null);
    setPayrollRecords(p => [...p, ...newRecs]);
    setSelectedEmployees([]);
    setShowCreateModal(false);
    showToast(`Payroll created for ${newRecs.length} employee${newRecs.length > 1 ? "s" : ""}`);
  };

  /**
   * "Run Payroll" button flow:
   *  1. Run validation engine against all pending records
   *  2. Show PayrollValidationModal with results
   *  3. If canProceed → user clicks "Confirm & Process"
   *  4. Update status Pending → Processing → Paid
   */
  const handleRunPayroll = () => {
    if (!pendingRecords.length) return;
    const result = runPayrollValidation(pendingRecords);
    setValidationResult(result);
    setShowValidation(true);
  };

  const handleRevalidate = () => {
    const result = runPayrollValidation(pendingRecords);
    setValidationResult(result);
  };

  const handleConfirmPayroll = () => {
    setIsProcessing(true);
    const ids = pendingRecords.map(r => r.id);

    // Step 1: set Processing
    setPayrollRecords(p => p.map(r => ids.includes(r.id) ? { ...r, status: "Processing" as const } : r));

    setTimeout(() => {
      // Step 2: set Paid
      setPayrollRecords(p => p.map(r =>
        ids.includes(r.id)
          ? { ...r, status: "Paid" as const, paymentDate: new Date().toLocaleDateString("en-IN") }
          : r,
      ));
      setIsProcessing(false);
      setShowValidation(false);
      setValidationResult(null);
      showToast(`Payroll processed for ${ids.length} employee${ids.length > 1 ? "s" : ""}. Salary slips generated.`);
    }, 2500);
  };

  const saveEdit = () => {
    if (!editingRecord) return;
    const updated = recalculatePayroll(editingRecord);
    setPayrollRecords(p => p.map(r => r.id === updated.id ? updated : r));
    setEditingRecord(null);
    showToast("Salary updated and recalculated");
  };

  // ── SUB-VIEWS ──────────────────────────────────────────────────────────────
  const topBarProps = {
    view, setView,
    onQuickCreate: () => setShowCreateModal(true),
    onNewPayroll:  () => setView("newEntry"),
  };

  if (view === "newEntry") return (
    <NewPayrollEntry
      employees={demoEmployees}
      onBack={() => setView("dashboard")}
      onCreatePayroll={(ids) => { handleCreatePayroll(ids); setView("dashboard"); }}
    />
  );

  if (view === "reports") return (
    <div className="h-screen flex flex-col bg-app overflow-hidden">
      <TopBar {...topBarProps} />
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <PayrollReports records={payrollRecords} />
      </div>
    </div>
  );

  if (detailRecord) return (
    <EmployeeDetailPage
      records={payrollRecords}
      initialRecord={detailRecord}
      onBack={() => setDetailRecord(null)}
      onViewPayslip={r => setSelectedRecord(r)}
    />
  );

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-app overflow-hidden">
      <Toast toast={toast} />

      {/* 1. Top bar */}
      <TopBar {...topBarProps} />

      {/* 2. KPI cards */}
      <div className="shrink-0 px-5 pt-4 pb-3">
        <KPICards
          totalRecords={payrollRecords.length}
          paidCount={paidRecords.length}
          pendingCount={pendingRecords.length}
          totalPayout={totalNet}
        />
      </div>

      {/* 3. Filter bar */}
      <div className="shrink-0 px-5 pb-3">
        <FilterBar
          searchQuery={searchQuery}   onSearchChange={setSearchQuery}
          selectedDept={selectedDept} onDeptChange={setSelectedDept}
          departments={departments}
          filterStatus={filterStatus} onStatusChange={setFilterStatus}
          pendingCount={pendingRecords.length}
          onRunPayroll={handleRunPayroll}
          totalShown={filteredRecords.length}
        />
      </div>

      {/* 4. Main table card — fills remaining space, scrolls internally */}
      <div className="flex-1 min-h-0 px-5 pb-4 flex flex-col">
        <div className="flex-1 min-h-0 bg-card border border-theme rounded-2xl overflow-hidden shadow-sm flex flex-col">

          {/* Tab switcher */}
          <div className="shrink-0 flex items-center border-b border-theme px-4">
            {(["summary", "tax"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTableTab(t)}
                className={`px-5 py-3 text-xs font-bold border-b-2 -mb-px transition-all ${
                  tableTab === t
                    ? "text-primary border-primary"
                    : "text-muted border-transparent hover:text-main"
                }`}
              >
                {t === "summary" ? "Employee Summary" : "Tax Deductions"}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {tableTab === "summary" && (
              <PayrollTable
                records={filteredRecords}
                expandedRows={expandedRows}
                onToggleRow={toggleRow}
                onViewPayslip={r => setSelectedRecord(r)}
                onEditRecord={r => setEditingRecord({ ...r })}
                onViewDetails={r => setDetailRecord(r)}
              />
            )}
            {tableTab === "tax" && (
              <div className="p-5">
                <TaxDeduction records={payrollRecords} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}

      {/* Quick create */}
      <QuickCreateModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        employees={demoEmployees}
        selectedEmployees={selectedEmployees}
        onToggleEmployee={toggleEmployee}
        onSelectAll={selectAllEmployees}
        onCreate={() => handleCreatePayroll(selectedEmployees)}
      />

      {/* Edit salary */}
      <EditModal
        record={editingRecord}
        onClose={() => setEditingRecord(null)}
        onSave={saveEdit}
        onChange={(field, val) => setEditingRecord(p => p ? { ...p, [field]: val } : null)}
      />

      {/* PRE-PAYROLL VALIDATION — the ERP validation screen */}
      <PayrollValidationModal
        show={showValidation}
        result={validationResult}
        isRunning={isProcessing}
        onClose={() => { setShowValidation(false); setValidationResult(null); }}
        onProceed={handleConfirmPayroll}
        onRevalidate={handleRevalidate}
      />

      {/* Payslip viewer */}
      <PayslipModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onDownload={() => { showToast(`Payslip downloaded for ${selectedRecord?.employeeName}`); }}
        onEmail={() => { showToast(`Payslip emailed to ${selectedRecord?.email}`); }}
      />
    </div>
  );
}