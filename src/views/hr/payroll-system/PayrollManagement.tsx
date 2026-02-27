import React, { useState, useEffect, useMemo } from "react";
import {
  Plus, ChevronLeft,
  FileText, Users, CheckCircle,
  Layers, X,
} from "lucide-react";

import type { PayrollEntry, Employee } from "../../../types/payrolltypes";
import { getAllEmployees } from "../../../api/employeeapi";
import { getSalarySlipById, getSalarySlips, type SalarySlipDetail, type SalarySlipListItem } from "../../../api/salarySlipApi";

// ── Components ────────────────────────────────────────────────────────────────
import { KPICards } from "./KPICards";
import { EmployeesTab } from "./EntryFormTabs";
import SalaryStructureTab from "../tabs/SalaryStructureTab";
import SalaryStructureAssignmentsDashboardTab from "./SalaryStructureAssignmentsDashboardTab";

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
type View = "dashboard" | "newEntry" | "salaryStructure" | "assignments" | "reports";

const TopBar: React.FC<{
  view: View;
  setView: (v: View) => void;
  onNewPayroll: () => void;
  totalEmployees?: number;
}> = ({ view, setView, onNewPayroll, totalEmployees }) => {
  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "salaryStructure", label: "Salary Structure", icon: <Users className="w-3.5 h-3.5" /> },
    { id: "assignments", label: "Employee Assignment", icon: <Users className="w-3.5 h-3.5" /> },
    { id: "reports", label: "Reports", icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="h-12 shrink-0 bg-card border-b border-theme px-5 flex items-center justify-between z-30 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => setView("dashboard")}
          className={`flex items-center gap-2 rounded-md px-1.5 py-1 transition ${
            view === "dashboard" ? "text-primary" : "text-main hover:text-primary"
          }`}
        >
          <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-extrabold">Payroll</span>
        </button>
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
        {view === "dashboard" && typeof totalEmployees === "number" && (
          <div className="hidden md:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-lg bg-app border border-theme">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Total Employees</span>
            <span className="text-xs font-extrabold text-main tabular-nums">{totalEmployees}</span>
          </div>
        )}
        {view === "dashboard" && (
          <Btn size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onNewPayroll}>
            New Payroll
          </Btn>
        )}
      </div>
    </header>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// NEW PAYROLL ENTRY — 2-step wizard
// ─────────────────────────────────────────────────────────────────────────────
const NewPayrollEntry: React.FC<{
  employees: Employee[];
  loading?: boolean;
  onBack: () => void;
  onCreatePayroll: (empIds: string[]) => void;
  onViewEmployee: (employeeId: string) => void;
}> = ({ employees, loading, onBack, onCreatePayroll, onViewEmployee }) => {

  const [formData, setFormData] = useState<PayrollEntry>({
    payrollName: "", postingDate: new Date().toISOString().slice(0, 10),
    currency: "ZMW", company: "Izyane",
    payrollPayableAccount: "Payroll Payable - Izyane - I",
    status: "Draft", salarySlipTimesheet: false, deductTaxForProof: false,

    payrollFrequency: "Monthly", startDate: "", endDate: "",
    paymentAccount: "", costCenter: "", project: "", letterHead: "",
    employeeSelectionMode: "multiple",
    selectedEmployees: [],
  });

  const handleFormChange = (field: string, value: any) => {
    setFormData(p => ({ ...p, [field]: value }));
  };

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
      </header>

      <div className="flex-1 min-h-0 px-6 py-4 flex flex-col">
        <div className="flex-1 min-h-0 bg-card border border-theme rounded-xl overflow-hidden shadow-sm flex flex-col">

          {/* Tab content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            <EmployeesTab
              data={formData}
              onChange={handleFormChange}
              employees={employees}
              loading={loading}
              onViewEmployee={onViewEmployee}
              onCreatePayroll={() => onCreatePayroll(formData.selectedEmployees)}
            />
          </div>

          <div className="shrink-0" />
        </div>
      </div>
    </div>
  );
};

const StatusChip: React.FC<{ status?: string }> = ({ status }) => {
  const raw = String(status ?? "").trim();
  const normalized = raw.toLowerCase() === "submitted" ? "Paid" : raw;
  const s = String(normalized ?? "").toLowerCase();
  const cls =
    s === "paid"
      ? "bg-success/10 text-success border-success/20"
      : s === "draft"
        ? "bg-warning/10 text-warning border-warning/20"
        : "bg-app text-muted border-theme";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${cls}`}>
      {normalized || "—"}
    </span>
  );
};

const SalarySlipDetailsModal: React.FC<{
  open: boolean;
  slipId: string | null;
  onClose: () => void;
}> = ({ open, slipId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SalarySlipDetail | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!open || !slipId) return;
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const resp = await getSalarySlipById(slipId);
        if (!mounted) return;
        setData(resp);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Failed to load salary slip");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [open, slipId]);

  if (!open) return null;

  const earnings = Array.isArray(data?.earnings) ? data?.earnings : [];
  const deductions = Array.isArray(data?.deductions) ? data?.deductions : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-lg font-semibold">Salary Slip</div>
            <div className="text-xs text-white/80 mt-0.5 break-words">{slipId}</div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          {loading && <div className="text-sm text-muted">Loading...</div>}

          {!loading && data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-app border border-theme rounded-xl p-4">
                  <div className="text-[11px] font-extrabold text-muted uppercase tracking-wider">Employee</div>
                  <div className="text-sm font-bold text-main mt-1">{data.employee_name || data.employee}</div>
                  <div className="text-xs text-muted mt-0.5">{data.employee}</div>
                </div>
                <div className="bg-app border border-theme rounded-xl p-4">
                  <div className="text-[11px] font-extrabold text-muted uppercase tracking-wider">Period</div>
                  <div className="text-sm font-bold text-main mt-1">{data.start_date} → {data.end_date}</div>
                  <div className="text-xs text-muted mt-0.5">{data.salary_structure}</div>
                </div>
                <div className="bg-app border border-theme rounded-xl p-4">
                  <div className="text-[11px] font-extrabold text-muted uppercase tracking-wider">Net Pay</div>
                  <div className="text-xl font-extrabold text-main mt-1 tabular-nums">ZMW {Number(data.net_pay ?? 0).toLocaleString("en-ZM")}</div>
                  <div className="mt-2"><StatusChip status={data.status} /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-theme rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-app border-b border-theme flex items-center justify-between">
                    <div className="text-xs font-extrabold text-main uppercase tracking-wide">Earnings</div>
                    <div className="text-xs font-extrabold text-main">ZMW {Number(data.total_earnings ?? 0).toLocaleString("en-ZM")}</div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-card border-b border-theme">
                        <tr>
                          <th className="px-4 py-3 text-[10px] font-extrabold text-muted uppercase tracking-wider text-left">Component</th>
                          <th className="px-4 py-3 text-[10px] font-extrabold text-muted uppercase tracking-wider text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {earnings.length === 0 ? (
                          <tr><td colSpan={2} className="px-4 py-8 text-center text-sm text-muted">No earnings</td></tr>
                        ) : earnings.map((r: any, idx: number) => (
                          <tr key={`${r?.component}-${idx}`} className="border-b border-theme last:border-0">
                            <td className="px-4 py-3 text-xs font-semibold text-main">{String(r?.component ?? "")}</td>
                            <td className="px-4 py-3 text-right text-xs font-extrabold text-main tabular-nums">{Number(r?.amount ?? 0).toLocaleString("en-ZM")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border border-theme rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-app border-b border-theme flex items-center justify-between">
                    <div className="text-xs font-extrabold text-main uppercase tracking-wide">Deductions</div>
                    <div className="text-xs font-extrabold text-main">ZMW {Number(data.total_deduction ?? 0).toLocaleString("en-ZM")}</div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-card border-b border-theme">
                        <tr>
                          <th className="px-4 py-3 text-[10px] font-extrabold text-muted uppercase tracking-wider text-left">Component</th>
                          <th className="px-4 py-3 text-[10px] font-extrabold text-muted uppercase tracking-wider text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deductions.length === 0 ? (
                          <tr><td colSpan={2} className="px-4 py-8 text-center text-sm text-muted">No deductions</td></tr>
                        ) : deductions.map((r: any, idx: number) => (
                          <tr key={`${r?.component}-${idx}`} className="border-b border-theme last:border-0">
                            <td className="px-4 py-3 text-xs font-semibold text-main">{String(r?.component ?? "")}</td>
                            <td className="px-4 py-3 text-right text-xs font-extrabold text-main tabular-nums">{Number(r?.amount ?? 0).toLocaleString("en-ZM")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-theme bg-app flex justify-end">
          <Btn variant="outline" onClick={onClose}>Close</Btn>
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

  const [lastCreatedPayroll, setLastCreatedPayroll] = useState<{
    createdAtIso: string;
    employees: { id: string; name: string; employeeId?: string }[];
  } | null>(null);

  const [salarySlips, setSalarySlips] = useState<SalarySlipListItem[]>([]);
  const [slipsLoading, setSlipsLoading] = useState(false);
  const [slipsError, setSlipsError] = useState<string | null>(null);
  const [slipsPage, setSlipsPage] = useState(1);
  const [slipsPageSize] = useState(10);
  const [slipsTotalPages, setSlipsTotalPages] = useState(1);
  const [slipDetailsOpen, setSlipDetailsOpen] = useState(false);
  const [slipDetailsId, setSlipDetailsId] = useState<string | null>(null);
  const [slipsSearch, setSlipsSearch] = useState("");

  useEffect(() => {
    setSlipsPage(1);
  }, [slipsSearch]);

  const filteredSalarySlips = useMemo(() => {
    const q = String(slipsSearch ?? "").trim().toLowerCase();
    if (!q) return salarySlips;
    return salarySlips.filter((s) => {
      const status = String(s.status ?? "").trim();
      const normalizedStatus = status.toLowerCase() === "submitted" ? "paid" : status.toLowerCase();
      const hay = [
        String(s.name ?? ""),
        String(s.employee ?? ""),
        String(s.salary_structure ?? ""),
        normalizedStatus,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [salarySlips, slipsSearch]);

  useEffect(() => {
    if (!employeesError) return;
    showToast(employeesError, "error");
  }, [employeesError]);

  useEffect(() => {
    if (!slipsError) return;
    showToast(slipsError, "error");
  }, [slipsError]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setSlipsLoading(true);
        setSlipsError(null);
        const resp = await getSalarySlips({ page: slipsPage, page_size: slipsPageSize });
        if (!mounted) return;
        const list = Array.isArray(resp?.salary_slips) ? resp.salary_slips : [];
        setSalarySlips(list);
        setSlipsTotalPages(Number(resp?.pagination?.total_pages ?? 1) || 1);
      } catch (e: any) {
        if (!mounted) return;
        setSalarySlips([]);
        setSlipsTotalPages(1);
        setSlipsError(e?.message || "Failed to load salary slips");
      } finally {
        if (!mounted) return;
        setSlipsLoading(false);
      }
    };

    if (view === "dashboard") run();
    return () => {
      mounted = false;
    };
  }, [view, slipsPage, slipsPageSize]);

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
    return (
      <NewPayrollEntry
        employees={employees}
        loading={employeesLoading}
        onBack={() => setView("dashboard")}
        onCreatePayroll={(ids) => {
          handleCreatePayroll(ids);
          setView("dashboard");
        }}
        onViewEmployee={(id) => setDetailEmployeeId(id)}
      />
    );
  }

  if (view === "salaryStructure") {
    return (
      <div className="h-screen flex flex-col bg-app overflow-hidden">
        <TopBar {...topBarProps} />
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5">
          <SalaryStructureTab />
        </div>
      </div>
    );
  }

  if (view === "assignments") {
    return (
      <div className="h-screen flex flex-col bg-app overflow-hidden">
        <TopBar {...topBarProps} />
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5">
          <SalaryStructureAssignmentsDashboardTab />
        </div>
      </div>
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
            <div className="mt-4 border border-theme rounded-xl overflow-hidden bg-card">
              <div className="px-4 py-3 bg-app border-b border-theme flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-main uppercase tracking-wide">Salary Slips</div>
                  <div className="text-[11px] text-muted mt-0.5">Latest payroll runs</div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={slipsSearch}
                    onChange={(e) => setSlipsSearch(e.target.value)}
                    placeholder="Search slips…"
                    className="w-64 px-2.5 py-2 bg-card border border-theme rounded-lg text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary transition"
                  />
                  <div className="text-xs text-muted whitespace-nowrap">Page {slipsPage} of {slipsTotalPages}</div>
                </div>
              </div>

              {slipsError && (
                <div className="px-4 py-3 bg-danger/10 text-danger text-sm border-b border-theme">{slipsError}</div>
              )}

              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-app border-b border-theme">
                    <tr>
                      {[
                        "Slip ID",
                        "Employee",
                        "Structure",
                        "Start",
                        "End",
                        "Status",
                        "Earnings",
                        "Deductions",
                        "Net",
                        "",
                      ].map((h, i) => (
                        <th
                          key={String(i)}
                          className={`px-4 py-3 text-[10px] font-extrabold text-muted uppercase tracking-wider whitespace-nowrap ${
                            i >= 6 && i <= 8 ? "text-right" : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slipsLoading ? (
                      Array.from({ length: 6 }).map((_, skIdx) => (
                        <tr key={`sk-${skIdx}`} className={skIdx % 2 === 1 ? "bg-app" : "bg-card"}>
                          <td className="px-4 py-3"><div className="h-3 w-28 bg-theme/60 rounded animate-pulse" /></td>
                          <td className="px-4 py-3"><div className="h-3 w-20 bg-theme/60 rounded animate-pulse" /></td>
                          <td className="px-4 py-3"><div className="h-3 w-24 bg-theme/60 rounded animate-pulse" /></td>
                          <td className="px-4 py-3"><div className="h-3 w-16 bg-theme/60 rounded animate-pulse" /></td>
                          <td className="px-4 py-3"><div className="h-3 w-16 bg-theme/60 rounded animate-pulse" /></td>
                          <td className="px-4 py-3"><div className="h-5 w-16 bg-theme/60 rounded-full animate-pulse" /></td>
                          <td className="px-4 py-3 text-right"><div className="h-3 w-16 bg-theme/60 rounded animate-pulse ml-auto" /></td>
                          <td className="px-4 py-3 text-right"><div className="h-3 w-16 bg-theme/60 rounded animate-pulse ml-auto" /></td>
                          <td className="px-4 py-3 text-right"><div className="h-3 w-16 bg-theme/60 rounded animate-pulse ml-auto" /></td>
                          <td className="px-4 py-3 text-right"><div className="h-7 w-16 bg-theme/60 rounded-lg animate-pulse ml-auto" /></td>
                        </tr>
                      ))
                    ) : filteredSalarySlips.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-4 py-10 text-center text-sm text-muted">
                          {String(slipsSearch ?? "").trim() ? "No matching salary slips" : "No salary slips found"}
                        </td>
                      </tr>
                    ) : (
                      filteredSalarySlips.map((s, idx) => (
                        <tr
                          key={s.name}
                          className={`border-b border-theme last:border-0 ${idx % 2 === 1 ? "bg-app" : "bg-card"}`}
                        >
                          <td className="px-4 py-3 text-xs font-semibold text-main break-words">{s.name}</td>
                          <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{s.employee}</td>
                          <td className="px-4 py-3 text-xs text-muted break-words">{s.salary_structure}</td>
                          <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{s.start_date}</td>
                          <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{s.end_date}</td>
                          <td className="px-4 py-3"><StatusChip status={s.status} /></td>
                          <td className="px-4 py-3 text-right text-xs font-extrabold text-main tabular-nums">{Number(s.total_earnings ?? 0).toLocaleString("en-ZM")}</td>
                          <td className="px-4 py-3 text-right text-xs font-extrabold text-main tabular-nums">{Number(s.total_deduction ?? 0).toLocaleString("en-ZM")}</td>
                          <td className="px-4 py-3 text-right text-xs font-extrabold text-main tabular-nums">{Number(s.net_pay ?? 0).toLocaleString("en-ZM")}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                setSlipDetailsId(s.name);
                                setSlipDetailsOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-extrabold border border-theme bg-card text-main hover:bg-app"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-3 bg-app border-t border-theme flex items-center justify-between">
                <div className="text-xs text-muted">Showing {filteredSalarySlips.length} slips</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSlipsPage((p) => Math.max(1, p - 1))}
                    disabled={slipsPage <= 1}
                    className="px-3 py-2 text-xs font-bold rounded-lg border border-theme bg-card text-main disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlipsPage((p) => Math.min(slipsTotalPages, p + 1))}
                    disabled={slipsPage >= slipsTotalPages}
                    className="px-3 py-2 text-xs font-bold rounded-lg border border-theme bg-card text-main disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SalarySlipDetailsModal
        open={slipDetailsOpen}
        slipId={slipDetailsId}
        onClose={() => {
          setSlipDetailsOpen(false);
          setSlipDetailsId(null);
        }}
      />
    </div>
  );
}