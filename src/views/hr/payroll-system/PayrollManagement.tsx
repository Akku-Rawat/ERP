import React, { useState, useEffect } from "react";
import {
  Plus, Save, ChevronLeft,
  FileText, Users, CheckCircle,
  BarChart3, Layers, Zap, X,
} from "lucide-react";

import type { PayrollEntry, Employee } from "../../../types/payrolltypes";
import { getAllEmployees } from "../../../api/employeeapi";

// ── Components ────────────────────────────────────────────────────────────────
import { KPICards } from "./KPICards";
import { OverviewTab, EmployeesTab } from "./EntryFormTabs";

// ── Views ─────────────────────────────────────────────────────────────────────
import EmployeeDetailsPage from "./EmployeeDetailsPage";

// ─────────────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATION (inline, lightweight)
// ─────────────────────────────────────────────────────────────────────────────
interface ToastState { msg: string; type: "success" | "error" | "info" }

const Toast: React.FC<{ toast: ToastState | null }> = ({ toast }) => {
  if (!toast) return null;
  const colors = {
    success: "bg-success text-white",
    error: "bg-danger  text-white",
    info: "bg-primary text-white",
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
    ghost: "text-muted hover:text-main hover:bg-app",
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
  totalEmployees?: number;
}> = ({ view, setView, onQuickCreate, onNewPayroll, totalEmployees }) => {
  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Home", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "reports", label: "Reports", icon: <FileText className="w-3.5 h-3.5" /> },
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${view === item.id
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
        {typeof totalEmployees === "number" && (
          <div className="hidden md:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-lg bg-app border border-theme">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Total Employees</span>
            <span className="text-xs font-extrabold text-main tabular-nums">{totalEmployees}</span>
          </div>
        )}
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
// NEW PAYROLL ENTRY — 2-step wizard
// ─────────────────────────────────────────────────────────────────────────────
const NewPayrollEntry: React.FC<{
  employees: Employee[];
  onBack: () => void;
  onCreatePayroll: (empIds: string[]) => void;
  onViewEmployee: (employeeId: string) => void;
}> = ({ employees, onBack, onCreatePayroll, onViewEmployee }) => {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<PayrollEntry>({
    payrollName: "", postingDate: new Date().toISOString().slice(0, 10),
    currency: "ZMW", company: "Izyane InovSolutions Pvt. Ltd.",
    payrollPayableAccount: "Payroll Payable - I",
    status: "Draft", salarySlipTimesheet: false, deductTaxForProof: false,
    payrollFrequency: "Monthly", startDate: "", endDate: "",
    paymentAccount: "", costCenter: "", project: "", letterHead: "",
    employeeSelectionMode: "multiple",
    selectedEmployees: [],
  });

  const handleFormChange = (field: string, value: any) => {
    setFormData(p => ({ ...p, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { label: "Overview", icon: <FileText className="w-3.5 h-3.5" /> },
    { label: "Employees", icon: <Users className="w-3.5 h-3.5" /> },
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
                  className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold border-b-2 -mb-px transition-all ${i === step
                    ? "text-primary border-primary"
                    : i < step
                      ? "text-success border-transparent hover:border-theme"
                      : "text-muted border-transparent hover:text-main"
                    }`}
                >
                  {i < step
                    ? <CheckCircle className="w-3.5 h-3.5 text-success" />
                    : <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${i === step ? "bg-primary text-white" : "bg-app border border-theme text-muted"
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
            {step === 0 && <OverviewTab data={formData} onChange={handleFormChange} />}
            {step === 1 && (
              <EmployeesTab
                data={formData}
                onChange={handleFormChange}
                employees={employees}
                onViewEmployee={onViewEmployee}
                onCreatePayroll={() => onCreatePayroll(formData.selectedEmployees)}
              />
            )}
          </div>

          <div className="shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default function PayrollManagement() {
  const [view, setView] = useState<View>("dashboard");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  const [employeesSummary, setEmployeesSummary] = useState<{
    totalEmployees: number;
    active: number;
    onLeave: number;
    inactive: number;
  } | null>(null);

  const [detailEmployeeId, setDetailEmployeeId] = useState<string | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (msg: string, type: ToastState["type"] = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [dashboardEntry, setDashboardEntry] = useState<PayrollEntry>({
    payrollName: "",
    postingDate: new Date().toISOString().slice(0, 10),
    currency: "ZMW",
    company: "Izyane InovSolutions Pvt. Ltd.",
    payrollPayableAccount: "Payroll Payable - I",
    status: "Draft",
    salarySlipTimesheet: false,
    deductTaxForProof: false,
    payrollFrequency: "Monthly",
    startDate: "",
    endDate: "",
    paymentAccount: "",
    costCenter: "",
    project: "",
    letterHead: "",
    employeeSelectionMode: "multiple",
    selectedEmployees: [],
  });

  const handleDashboardChange = (field: string, value: any) => {
    setDashboardEntry(p => ({ ...p, [field]: value }));
  };

  const [lastCreatedPayroll, setLastCreatedPayroll] = useState<{
    createdAtIso: string;
    employees: { id: string; name: string; employeeId?: string }[];
  } | null>(null);

  useEffect(() => {
    if (!employeesError) return;
    showToast(employeesError, "error");
  }, [employeesError]);

  useEffect(() => {
    let mounted = true;

    const loadEmployees = async () => {
      setEmployeesLoading(true);
      setEmployeesError(null);
      try {
        const resp = await getAllEmployees({ page: 1, page_size: 200 });
        const list = Array.isArray(resp?.employees) ? resp.employees : [];
        const summary = resp?.summary || null;

        const mapped: Employee[] = list.map((e: any) => {
          const status = String(e?.status ?? "");
          return {
            id: String(e?.id ?? e?.employeeId ?? e?.employee_id ?? ""),
            employeeId: String(e?.employeeId ?? ""),
            name: String(e?.name ?? ""),
            email: String(e?.email ?? ""),
            status: status || undefined,
            department: String(e?.department ?? ""),
            jobTitle: String(e?.jobTitle ?? ""),
            workLocation: String(e?.workLocation ?? ""),
            grossSalary: Number(e?.grossSalary ?? 0),
            isActive: status.toLowerCase() === "active",
          };
        });

        if (!mounted) return;
        setEmployees(mapped.filter(e => !!e.id));
        setEmployeesSummary(
          summary
            ? {
                totalEmployees: Number(summary?.totalEmployees ?? 0),
                active: Number(summary?.active ?? 0),
                onLeave: Number(summary?.onLeave ?? 0),
                inactive: Number(summary?.inactive ?? 0),
              }
            : null,
        );
      } catch (err: any) {
        if (!mounted) return;
        setEmployeesError(err?.message || "Failed to load employees");
      } finally {
        if (!mounted) return;
        setEmployeesLoading(false);
      }
    };

    loadEmployees();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCreatePayroll = (empIds: string[]) => {
    if (!empIds.length) return;

    const createdEmployees = employees
      .filter(e => empIds.includes(e.id))
      .map(e => ({ id: e.id, name: e.name, employeeId: e.employeeId }))
      .slice(0, 30);

    setLastCreatedPayroll({
      createdAtIso: new Date().toISOString(),
      employees: createdEmployees,
    });

    showToast(`Payroll created for ${empIds.length} employee${empIds.length > 1 ? "s" : ""}`);
  };

  const topBarProps = {
    view,
    setView,
    onQuickCreate: () => showToast("Quick Create is disabled until payroll APIs are connected", "info"),
    onNewPayroll: () => setView("newEntry"),
    totalEmployees: employeesSummary?.totalEmployees ?? employees.length,
  };

  if (detailEmployeeId) {
    return (
      <EmployeeDetailsPage
        employeeId={detailEmployeeId}
        onBack={() => setDetailEmployeeId(null)}
      />
    );
  }

  if (view === "newEntry") {
    return employeesLoading
      ? (
        <div className="h-screen flex items-center justify-center bg-app">
          <div className="text-sm text-muted">Loading employees…</div>
        </div>
      )
      : (
        <NewPayrollEntry
          employees={employees}
          onBack={() => setView("dashboard")}
          onCreatePayroll={(ids) => {
            handleCreatePayroll(ids);
            setView("dashboard");
          }}
          onViewEmployee={(id) => setDetailEmployeeId(id)}
        />
      );
  }

  if (view === "reports") {
    return (
      <div className="h-screen flex flex-col bg-app overflow-hidden">
        <TopBar {...topBarProps} />
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="bg-card border border-theme rounded-2xl p-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-app overflow-hidden">
      <Toast toast={toast} />

      <TopBar {...topBarProps} />

      <div className="shrink-0 px-5 pt-4 pb-3">
        <KPICards
          totalEmployees={employeesSummary?.totalEmployees ?? employees.length}
          activeEmployees={employeesSummary?.active ?? employees.filter(e => e.isActive).length}
          inactiveEmployees={employeesSummary?.inactive ?? employees.filter(e => !e.isActive).length}
          onLeaveEmployees={employeesSummary?.onLeave ?? 0}
        />
      </div>

      <div className="flex-1 min-h-0 px-5 pb-4 flex flex-col">
        <div className="flex-1 min-h-0 bg-card border border-theme rounded-2xl overflow-hidden shadow-sm flex flex-col">
          {lastCreatedPayroll && (
            <div className="shrink-0 border-b border-theme bg-app px-5 py-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-main">
                  Payroll created for {lastCreatedPayroll.employees.length} employee{lastCreatedPayroll.employees.length === 1 ? "" : "s"}
                </div>
                <div className="mt-1 text-[11px] text-muted leading-relaxed break-words">
                  {lastCreatedPayroll.employees.map((e, idx) => (
                    <React.Fragment key={e.id}>
                      <span className="font-semibold text-main">{e.name || e.employeeId || e.id}</span>
                      {idx < lastCreatedPayroll.employees.length - 1 ? ", " : ""}
                    </React.Fragment>
                  ))}
                  {lastCreatedPayroll.employees.length >= 30 ? "…" : ""}
                </div>
              </div>
              <Btn
                variant="outline"
                size="sm"
                icon={<X className="w-3.5 h-3.5" />}
                onClick={() => setLastCreatedPayroll(null)}
              >
                Clear
              </Btn>
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <EmployeesTab
              data={dashboardEntry}
              onChange={handleDashboardChange}
              employees={employees}
              onViewEmployee={(id) => setDetailEmployeeId(id)}
              onCreatePayroll={() => handleCreatePayroll(dashboardEntry.selectedEmployees)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}