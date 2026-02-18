import React, { useState, useMemo } from "react";
import {
  Plus,
  Save,
  ChevronRight,
  ChevronLeft,
  FileText,
  Users,
  Settings,
  CheckCircle,
  BarChart3,
  Search,
  Play,
  ChevronDown,
  DollarSign,
  Clock,
  UserCheck,
  ArrowUpRight,
  Layers,
  Zap,
} from "lucide-react";
import type { PayrollRecord, PayrollEntry } from "./types";
import { demoEmployees } from "./constants";
import { generatePayrollRecord, recalculatePayroll } from "./utils";
import { PayrollTable } from "./PayrollTable";
import { QuickCreateModal } from "../../../components/Hr/payrollmodal/QuickCreatePayrollModal";
import { EditModal } from "../../../components/Hr/payrollmodal/EditModal";
import { PayslipModal } from "../../../components/Hr/payrollmodal/PayslipModal";
import { OverviewTab, EmployeesTab, AccountingTab } from "./EntryFormTabs";
import { LoanManager, AdvanceManager } from "./LoansAdvances";
import { PayrollReports, ApprovalWorkflowManager } from "./ReportsApprovals";
import TaxDeduction from "./TaxDeduction";
import type { Employee } from "./types";
import { PayrollConfirmationModal } from "../../../components/Hr/payrollmodal/PayrollConfirmationModal";
import { EmployeeDetailPage } from "./Employeedetailpage";
import { useEffect } from "react";
import { getAllEmployees } from "../../../api/employeeapi";



// ─── Compact KPI pill ─────────────────────────────────────────────────────────
const KpiPill: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: "default" | "success" | "warning" | "primary";
  trend?: string;
}> = ({ label, value, icon, accent = "default", trend }) => {
  const accentCls: Record<string, string> = {
    default:  "text-muted bg-app",
    success:  "text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_10%,transparent)]",
    warning:  "text-[var(--warning)] bg-[color-mix(in_srgb,var(--warning)_10%,transparent)]",
    primary:  "text-primary bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]",
  };
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2 bg-card border border-theme rounded-xl">
      <span className={`p-1.5 rounded-lg shrink-0 ${accentCls[accent]}`}>{icon}</span>
      <div>
        <p className="text-[10px] text-muted leading-none mb-0.5 whitespace-nowrap">{label}</p>
        <p className="text-sm font-bold text-main leading-none whitespace-nowrap">{value}</p>
      </div>
      {trend && (
        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[var(--success)] ml-0.5">
          <ArrowUpRight className="w-2.5 h-2.5" />{trend}
        </span>
      )}
    </div>
  );
};

// ─── Button ───────────────────────────────────────────────────────────────────
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
    success: "bg-[var(--success)] text-white hover:opacity-90 shadow-sm",
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

// ─── Top bar (shared) ─────────────────────────────────────────────────────────
type View = "dashboard" | "newEntry"|"reports" ;

const TopBar: React.FC<{
  view: View;
  setView: (v: View) => void;
  onQuickCreate: () => void;
  onNewPayroll: () => void;
}> = ({ view, setView, onQuickCreate, onNewPayroll }) => {
  const nav: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard",       icon: <BarChart3  className="w-3.5 h-3.5" /> },
    { id: "reports",   label: "Reports",         icon: <FileText   className="w-3.5 h-3.5" /> },
    // { id: "loans",     label: "Loans & Advances",icon: <DollarSign className="w-3.5 h-3.5" /> },
    // { id: "approvals", label: "Approvals",       icon: <UserCheck  className="w-3.5 h-3.5" /> },
  ];
  return (
    <header className="h-12 shrink-0 bg-card border-b border-theme px-5 flex items-center justify-between z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-main">Payroll</span>
        </div>
        <span className="text-muted opacity-30 select-none">|</span>
        <nav className="flex items-center gap-0.5">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                ${view === item.id
                  ? "bg-app text-primary border border-theme"
                  : "text-muted hover:text-main hover:bg-app"}`}
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PayrollManagement() {
  const [view, setView]                 = useState<View>("dashboard");
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([
    generatePayrollRecord(demoEmployees[0], "Paid"),
    generatePayrollRecord(demoEmployees[1], "Pending"),
  ]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedDept, setSelectedDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery]   = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRecord, setSelectedRecord]   = useState<PayrollRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<PayrollRecord | null>(null);

  const [editingRecord,  setEditingRecord]    = useState<PayrollRecord | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [tableTab, setTableTab]         = useState<"summary" | "tax">("summary");
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab]       = useState(0);
  const [saved, setSaved]               = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
const [loadingEmployees, setLoadingEmployees] = useState(false);


  const [formData, setFormData] = useState<PayrollEntry>({
    payrollName: "", postingDate: "2026-01-18", currency: "INR",
    company: "Izyane", payrollPayableAccount: "Payroll Payable - I",
    status: "Draft", salarySlipTimesheet: false, deductTaxForProof: false,
    payrollFrequency: "", startDate: "", endDate: "",
    paymentAccount: "", costCenter: "", project: "", letterHead: "",
    selectedEmployees: [],
  });

  const departments = useMemo(() => {
    const depts = new Set(payrollRecords.map((r) => r.department));
    return ["All", ...Array.from(depts)];
  }, [payrollRecords]);

  const filteredRecords = useMemo(() =>
    payrollRecords.filter((r) => {
      const deptOk   = selectedDept   === "All" || r.department === selectedDept;
      const statusOk = filterStatus   === "All" || r.status     === filterStatus;
      const searchOk = !searchQuery   ||
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      return deptOk && statusOk && searchOk;
    }),
  [payrollRecords, selectedDept, filterStatus, searchQuery]);

  const stats = useMemo(() => ({
    total:   filteredRecords.reduce((s, r) => s + r.netPay, 0),
    pending: filteredRecords.filter((r) => r.status === "Pending").length,
    paid:    filteredRecords.filter((r) => r.status === "Paid").length,
  }), [filteredRecords]);

  const pendingRecords = payrollRecords.filter((r) => r.status === "Pending");
  const paidRecords    = payrollRecords.filter((r) => r.status === "Paid");

  const toggleRow = (id: string) =>
    setExpandedRows((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleCreatePayroll = () => {
    if (!selectedEmployees.length) return alert("Select employees");
    const newRecords = selectedEmployees
      .map((id) => { const e = demoEmployees.find((x) => x.id === id); return e ? generatePayrollRecord(e, "Pending") : null; })
      .filter((r): r is PayrollRecord => r !== null);
    setPayrollRecords((p) => [...p, ...newRecords]);
    setSelectedEmployees([]); setShowCreateModal(false);
    alert(`Created payroll for ${newRecords.length} employees`);
  };

  const handleRunPayroll = () => { if (!pendingRecords.length) return alert("No pending payroll"); setShowConfirmModal(true); };

  const handleConfirmPayroll = () => {
    setPayrollRecords((p) => p.map((r) => r.status === "Pending" ? { ...r, status: "Processing" as const } : r));
    setShowConfirmModal(false);
    setTimeout(() => {
      setPayrollRecords((p) => p.map((r) =>
        r.status === "Processing" ? { ...r, status: "Paid" as const, paymentDate: new Date().toLocaleDateString() } : r
      ));
      alert("Payroll processed successfully!");
    }, 2000);
  };

  const handleApprove = (id: string) => {
    setPayrollRecords((p) => p.map((r) => r.id === id
      ? { ...r, status: "Approved" as const, approvedDate: new Date().toISOString(), approvedBy: "MGR001" } : r));
    alert("Payroll approved!");
  };

  const handleReject = (id: string, reason: string) => {
    setPayrollRecords((p) => p.map((r) => r.id === id ? { ...r, status: "Rejected" as const, rejectionReason: reason } : r));
    alert(`Payroll rejected: ${reason}`);
  };

  const saveEdit = () => {
    if (!editingRecord) return;
    const updated = recalculatePayroll(editingRecord);
    setPayrollRecords((p) => p.map((r) => r.id === updated.id ? updated : r));
    setEditingRecord(null);
  };

  const handleFormChange = (field: string, value: any) => { setFormData((p) => ({ ...p, [field]: value })); setSaved(false); };
  const handleSaveEntry  = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleCreateFromEntry = () => {
    if (!formData.selectedEmployees.length) return alert("Select employees");
    const newRecords = formData.selectedEmployees
      .map((id) => { const e = demoEmployees.find((x) => x.id === id); return e ? generatePayrollRecord(e, "Pending") : null; })
      .filter((r): r is PayrollRecord => r !== null);
    setPayrollRecords((p) => [...p, ...newRecords]);
    alert(`Created payroll for ${newRecords.length} employees`);
    setView("dashboard"); setFormData({ ...formData, selectedEmployees: [] });
  };

  const toggleEmployee    = (id: string) => setSelectedEmployees((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);
  const selectAllEmployees = () => {
    const all = demoEmployees.filter((e) => e.isActive).map((e) => e.id);
    setSelectedEmployees(selectedEmployees.length === all.length ? [] : all);
  };
useEffect(() => {
  fetchEmployees();
}, []);

useEffect(() => {
  fetchEmployees();
}, [
  formData.branch,
  formData.department,
  formData.designation,
  formData.grade,
]);

const fetchEmployees = async () => {
  try {
    setLoadingEmployees(true);

    const response = await getAllEmployees(1, 200, "Active");

    console.log("Full API Response:", response);

    const mappedEmployees: Employee[] =
      response?.data?.employees?.map((emp: any) => ({
        id: emp.id,
        name:emp.name,
        designation: emp.designation,
        department: emp.department,
        branch: emp.branch,
        grade: emp.grade,
        basicSalary: emp.basic_salary || 0,
        hra: emp.hra || 0,
        allowances: emp.allowances || 0,
        isActive: emp.status === "Active",
      })) || [];

    setEmployees(mappedEmployees);
  } catch (error) {
    console.error("Error fetching employees:", error);
  } finally {
    setLoadingEmployees(false);
  }
};

  // ── NEW ENTRY ────────────────────────────────────────────────────────────────
  if (view === "newEntry") {
    const entryTabs = [
      { label: "Overview",   icon: <FileText  className="w-3.5 h-3.5" /> },
      { label: "Employees",  icon: <Users     className="w-3.5 h-3.5" /> },
      { label: "Accounting", icon: <Settings  className="w-3.5 h-3.5" /> },
    ];
    return (
      <div className="h-screen flex flex-col bg-app overflow-hidden">
        <header className="h-12 shrink-0 bg-card border-b border-theme px-5 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setView("dashboard")}
              className="p-1.5 rounded-lg hover:bg-app text-muted hover:text-main transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-theme opacity-40" />
            <span className="text-sm font-bold text-main">New Payroll Entry</span>
            <span className="text-xs text-muted opacity-60">· Fill details to create a payroll run</span>
          </div>
          <div className="flex items-center gap-2">
            {saved
              ? <span className="flex items-center gap-1 text-xs font-semibold text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_10%,transparent)] px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Saved
                </span>
              : <span className="text-xs text-muted bg-app border border-theme px-2.5 py-1 rounded-full">Unsaved</span>
            }
            <Btn size="sm" icon={<Save className="w-3.5 h-3.5" />} onClick={handleSaveEntry}>Save Draft</Btn>
          </div>
        </header>

        <div className="flex-1 min-h-0 flex flex-col px-6 py-4">
          <div className="flex-1 min-h-0 bg-card border border-theme rounded-xl overflow-hidden shadow-sm flex flex-col">

            {/* ── Step tabs INSIDE the card ── */}
            <div className="shrink-0 flex items-center border-b border-theme px-6">
              {entryTabs.map((t, i) => (
                <React.Fragment key={i}>
                  <button
                    onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 -mb-px transition-all ${
                      i === activeTab
                        ? "text-primary border-primary"
                        : i < activeTab
                        ? "text-[var(--success)] border-transparent hover:border-theme"
                        : "text-muted border-transparent hover:text-main"
                    }`}
                  >
                    {i < activeTab
                      ? <CheckCircle className="w-3.5 h-3.5 text-[var(--success)]" />
                      : <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          i === activeTab ? "bg-primary text-white" : "bg-app border border-theme text-muted"}`}>
                          {i + 1}
                        </span>
                    }
                    {t.label}
                    {/* connector line between tabs */}
                  </button>
                  {i < entryTabs.length - 1 && (
                    <div className={`flex-1 h-px mx-3 opacity-25 ${i < activeTab ? "bg-[var(--success)]" : "bg-theme"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* ── Tab content ── */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6">
              {activeTab === 0 && <OverviewTab  data={formData} onChange={handleFormChange} />}
              {activeTab === 1 && <EmployeesTab data={formData} onChange={handleFormChange} employees={employees} onEditEmployee={(emp) => setEditEmployee(emp)} />}
              {activeTab === 2 && <AccountingTab data={formData} onChange={handleFormChange} employees={employees} />}
            </div>

            {/* ── Footer nav ── */}
            <div className="shrink-0 border-t border-theme px-6 py-3 bg-app flex justify-between">
              <Btn variant="outline" size="sm" icon={<ChevronLeft className="w-3.5 h-3.5" />}
                onClick={() => setActiveTab((p) => Math.max(0, p - 1))} disabled={activeTab === 0}>
                Previous
              </Btn>
              {activeTab === entryTabs.length - 1
                ? <Btn variant="success" size="sm" icon={<CheckCircle className="w-3.5 h-3.5" />}
                    onClick={handleCreateFromEntry} disabled={!formData.selectedEmployees.length}>
                    Create Payroll ({formData.selectedEmployees.length})
                  </Btn>
                : <Btn size="sm" onClick={() => setActiveTab((p) => Math.min(entryTabs.length - 1, p + 1))}>
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </Btn>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SECONDARY VIEWS ──────────────────────────────────────────────────────────
  const topBarProps = { view, setView, onQuickCreate: () => setShowCreateModal(true), onNewPayroll: () => setView("newEntry") };

  // if (view === "loans") return (
  //   <div className="h-screen flex flex-col bg-app overflow-hidden">
  //     <TopBar {...topBarProps} />
  //     <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
  //       <LoanManager employees={demoEmployees} />
  //       <AdvanceManager employees={demoEmployees} />
  //     </div>
  //   </div>
  // );

  if (view === "reports") return (
    <div className="h-screen flex flex-col bg-app overflow-hidden">
      <TopBar {...topBarProps} />
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <PayrollReports records={payrollRecords} />
      </div>
    </div>
  );

  // if (view === "approvals") return (
  //   <div className="h-screen flex flex-col bg-app overflow-hidden">
  //     <TopBar {...topBarProps} />
  //     <div className="flex-1 overflow-y-auto px-5 py-4">
  //       <ApprovalWorkflowManager records={payrollRecords} onApprove={handleApprove} onReject={handleReject} />
  //     </div>
  //   </div>
  // );
const isDetailView = !!detailRecord;


  // ── DASHBOARD — NO OUTER SCROLL ──────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-app overflow-hidden">
      {isDetailView ? (
  <EmployeeDetailPage
    records={payrollRecords}
    initialRecord={detailRecord!}
    onBack={() => setDetailRecord(null)}
    onViewPayslip={(record) => setSelectedRecord(record)}
  />
) : (
  <>


      {/* 1. Top bar (fixed height) */}
      <TopBar {...topBarProps} />

      {/* 2. KPI strip — single row, minimal height
      <div className="shrink-0 px-5 pt-3 pb-2 flex items-center gap-2 flex-wrap">
        <KpiPill label="Total Employees" value={payrollRecords.length}
          icon={<Users       className="w-3.5 h-3.5" />} accent="primary" trend="+2" />
        <KpiPill label="Total Payout"    value={`₹${stats.total.toLocaleString("en-IN")}`}
          icon={<DollarSign  className="w-3.5 h-3.5" />} accent="default" />
        <KpiPill label="Processed"       value={`${paidRecords.length} / ${payrollRecords.length}`}
          icon={<CheckCircle className="w-3.5 h-3.5" />} accent="success" />
        <KpiPill label="Pending"         value={pendingRecords.length}
          icon={<Clock       className="w-3.5 h-3.5" />} accent={pendingRecords.length > 0 ? "warning" : "default"} />

        <div className="flex-1" />

        {pendingRecords.length > 0 && (
          <button onClick={handleRunPayroll}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:opacity-90 transition shadow-sm">
            <Play className="w-3.5 h-3.5" />
            Run Payroll
            <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-bold">{pendingRecords.length}</span>
          </button>
        )}
      </div> */}

      {/* 3. Filter bar — single row */}
      <div className="shrink-0 px-5 pb-2 flex items-center gap-2">
        {/* <div className="relative w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or ID…"
            className="w-full pl-8 pr-3 py-1.5 bg-card border border-theme rounded-lg text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary transition" />
        </div> */}

        {/* Department */}
        {/* <div className="relative">
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}
            className="appearance-none pl-3 pr-7 py-1.5 bg-card border border-theme rounded-lg text-xs text-main focus:outline-none focus:border-primary cursor-pointer">
            {departments.map((d) => <option key={d}>{d}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
        </div> */}

        {/* Status */}
        {/* <div className="relative">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-3 pr-7 py-1.5 bg-card border border-theme rounded-lg text-xs text-main focus:outline-none focus:border-primary cursor-pointer">
            {["All","Paid","Pending","Processing","Approved","Rejected"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
        </div> */}

        <span className="text-xs text-muted ml-auto">
          {filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* 4. Table — fills ALL remaining height, scrolls internally */}
      <div className="flex-1 min-h-0 px-5 pb-4 flex flex-col">
        <div className="flex-1 min-h-0 bg-card border border-theme rounded-xl overflow-hidden shadow-sm flex flex-col">

          {/* Tab switcher */}
          <div className="shrink-0 flex items-center border-b border-theme px-4">
            {(["summary", "tax"] as const).map((tab) => (
              <button key={tab} onClick={() => setTableTab(tab)}
                className={`px-4 py-2.5 text-xs font-semibold transition-all border-b-2 -mb-px ${
                  tableTab === tab ? "text-primary border-primary" : "text-muted border-transparent hover:text-main"}`}>
                {tab === "summary" ? "Employee Summary" : "Tax Deductions"}
              </button>
            ))}
          </div>

          {/* Scrollable table body */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {tableTab === "summary" && (
              <PayrollTable
                records={filteredRecords}
                expandedRows={expandedRows}
                onToggleRow={toggleRow}
                onViewPayslip={(record) => setSelectedRecord(record)}
                onEditRecord={(record) => setEditingRecord({ ...record })}
                onViewDetails={(record) => setDetailRecord(record)} 
              />
            )}
            {tableTab === "tax" && <div className="p-4"><TaxDeduction />
            </div>}
            </div>
          </div>
        </div>
      </>
         )}

      {/* Modals */}
      <QuickCreateModal show={showCreateModal} onClose={() => setShowCreateModal(false)}
        employees={demoEmployees} selectedEmployees={selectedEmployees}
        onToggleEmployee={toggleEmployee} onSelectAll={selectAllEmployees} onCreate={handleCreatePayroll} />
      <EditModal record={editingRecord} onClose={() => setEditingRecord(null)} onSave={saveEdit}
        onChange={(field, value) => setEditingRecord((p) => p ? { ...p, [field]: value } : null)} />
      <PayrollConfirmationModal show={showConfirmModal} onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmPayroll} records={payrollRecords.filter((r) => r.status === "Pending")} />
      <PayslipModal record={selectedRecord} onClose={() => setSelectedRecord(null)}
        onDownload={() => alert("Downloaded")} onEmail={() => alert(`Email sent to ${selectedRecord?.email}`)} />
    </div>

  );
}