// EntryFormTabs.tsx — New Payroll Entry: Overview, Employees, Accounting tabs

import React, { useMemo, useState } from "react";

import { Download, Edit2, Eye } from "lucide-react";

import toast from "react-hot-toast";

import type { PayrollEntry, Employee } from "../../../types/payrolltypes";

import { runSingleEmployeePayroll } from "../../../api/singleEmployeePayrollApi";

import { createMultipleEmployeesPayroll } from "../../../api/multiplePayrollApi";

import { getSalarySlips } from "../../../api/salarySlipApi";

import { getSalaryStructureAssignments } from "../../../api/salaryStructureAssignmentApi";

import PayrollPreviewModal from "./payrollPreview";

import MultiPayrollPreviewModal from "./multiPayrollPreview";

const toCsv = (rows: Array<Record<string, any>>): string => {
  const colSet = new Set<string>();
  rows.forEach((r) => {
    Object.keys(r || {}).forEach((k) => colSet.add(k));
  });
  const cols = Array.from(colSet);

  const esc = (v: any) => {
    const s = v === null || v === undefined ? "" : String(v);
    const needs = /[\n\r,\"]/g.test(s);
    const out = s.replace(/\"/g, '""');
    return needs ? `"${out}"` : out;
  };

  const header = cols.map(esc).join(",");
  const lines = rows.map((r) => cols.map((c) => esc((r as any)?.[c])).join(","));
  return [header, ...lines].join("\n");
};

const downloadCsv = (filename: string, csvContent: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <label className="block text-[10px] font-extrabold text-muted mb-1.5 uppercase tracking-wider">
    {children}
    {required && <span className="text-danger ml-0.5">*</span>}
  </label>
);

const inputCls =
  "w-full px-3 py-2.5 bg-app border border-theme rounded-lg text-sm text-main placeholder:text-muted focus:outline-none focus:border-primary transition";

const selectCls =
  "w-full px-3 py-2.5 bg-app border border-theme rounded-lg text-sm text-main focus:outline-none focus:border-primary transition cursor-pointer";

interface OverviewTabProps {
  data: PayrollEntry;
  onChange: (field: string, value: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, onChange }) => (
  <div className="space-y-5 animate-[fadeIn_0.2s_ease]">
    <div className="grid grid-cols-3 gap-5">
      <div>
        <Label required>Payroll Name</Label>
        <input
          type="text"
          value={data.payrollName}
          onChange={(e) => onChange("payrollName", e.target.value)}
          placeholder="e.g. January 2026 Payroll"
          className={inputCls}
        />
      </div>
      <div>
        <Label required>Posting Date</Label>
        <input
          type="date"
          value={data.postingDate}
          onChange={(e) => onChange("postingDate", e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <Label required>Payroll Frequency</Label>
        <select
          value={data.payrollFrequency}
          onChange={(e) => onChange("payrollFrequency", e.target.value)}
          className={selectCls}
        >
          <option value="">Select frequency</option>
          <option value="Monthly">Monthly</option>
          <option value="Biweekly">Biweekly</option>
          <option value="Weekly">Weekly</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-5">
      <div>
        <Label required>Currency</Label>
        <select value={data.currency} onChange={(e) => onChange("currency", e.target.value)} className={selectCls}>
          <option value="ZMW">ZMW — Zambian Kwacha</option>
          <option value="USD">USD — US Dollar</option>
          <option value="EUR">EUR — Euro</option>
        </select>
      </div>
      <div>
        <Label required>Company</Label>
        <input
          type="text"
          value={data.company}
          onChange={(e) => onChange("company", e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <Label required>Payroll Payable Account</Label>
        <select
          value={data.payrollPayableAccount}
          onChange={(e) => onChange("payrollPayableAccount", e.target.value)}
          className={selectCls}
        >
          <option value="Payroll Payable - Izyane - I">Payroll Payable - Izyane - I</option>
          <option value="Payroll Payable - I">Payroll Payable - I</option>
          <option value="Payroll Payable - II">Payroll Payable - II</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-5">
      <div>
        <Label required>Pay Period Start</Label>
        <input
          type="date"
          value={data.startDate}
          onChange={(e) => onChange("startDate", e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <Label required>Pay Period End</Label>
        <input
          type="date"
          value={data.endDate}
          onChange={(e) => onChange("endDate", e.target.value)}
          className={inputCls}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {[

        {

          field: "deductTaxForProof",

          label: "Deduct Tax for Proof Submission",

          desc: "Apply TDS based on submitted investment proofs",

        },

        {

          field: "salarySlipTimesheet",

          label: "Salary Slip Based on Timesheet",

          desc: "Calculate pay using logged timesheet hours",

        },

      ].map(({ field, label, desc }) => (
        <label
          key={field}
          className="flex items-start gap-3 p-4 bg-app border border-theme rounded-xl cursor-pointer hover:border-primary/40 transition"
        >
          <input
            type="checkbox"
            checked={!!(data as any)[field]}
            onChange={(e) => onChange(field, e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-primary cursor-pointer shrink-0"
          />
          <div>
            <p className="text-xs font-bold text-main">{label}</p>
            <p className="text-[10px] text-muted mt-0.5">{desc}</p>
          </div>
        </label>
      ))}
    </div>
  </div>
);

interface EmployeesTabProps {
  data: PayrollEntry;
  onChange: (field: string, value: any) => void;
  employees: Employee[];
  loading?: boolean;
  onEditEmployee?: (emp: Employee) => void;
  onViewEmployee?: (employeeId: string) => void;
  onCreatePayroll?: (empIds: string[]) => void;
  onOpenPayrollPreview?: (employeeId: string) => void;
}

export const EmployeesTab: React.FC<EmployeesTabProps> = ({
  data,
  onChange,
  employees,
  loading,
  onEditEmployee,
  onViewEmployee,
  onOpenPayrollPreview,
}) => {
  const active = employees.filter((e) => e.isActive);

  const isLoading = Boolean(loading);

  const [page, setPage] = useState(1);

  const pageSize = 10;

  const [singleSubmitting, setSingleSubmitting] = useState(false);

  const [multiSubmitting, setMultiSubmitting] = useState(false);

  const [singleModalOpen, setSingleModalOpen] = useState(false);

  const [multiModalOpen, setMultiModalOpen] = useState(false);

  const miniInputCls =
    "w-56 px-2.5 py-2 bg-app border border-theme rounded-lg text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary transition";

  const miniSelectCls =
    "w-56 px-2.5 py-2 bg-app border border-theme rounded-lg text-xs text-main focus:outline-none focus:border-primary transition cursor-pointer";

  const selectionMode: "single" | "multiple" = data.employeeSelectionMode || "multiple";

  const selectedSingleEmployeeId =
    selectionMode === "single" ? String(data.selectedEmployees?.[0] ?? "") : "";

  const selectedSingleEmployeeRow = useMemo(() => {
    if (!selectedSingleEmployeeId) return null;

    return active.find((e) => String(e.id) === selectedSingleEmployeeId) ?? null;
  }, [active, selectedSingleEmployeeId]);

  const selectedSingleEmployeeCode = useMemo(() => {
    if (!selectedSingleEmployeeId) return "";

    const row = selectedSingleEmployeeRow;

    return String((row as any)?.employeeId ?? row?.id ?? "").trim();
  }, [selectedSingleEmployeeId, selectedSingleEmployeeRow]);

  const fallbackSalaryStructureName = "Interns Feb 2026";

  const [singleSalaryStructureName, setSingleSalaryStructureName] = useState<string>("");

  React.useEffect(() => {
    if (selectionMode !== "single") {
      setSingleModalOpen(false);
      setSingleSalaryStructureName("");
      return;
    }

    if (selectedSingleEmployeeId) {
      setSingleModalOpen(true);
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const toIso = (d: Date) => d.toISOString().slice(0, 10);
      onChange("startDate", toIso(start));
      onChange("endDate", toIso(end));
    }
  }, [selectedSingleEmployeeId, selectionMode]);

  React.useEffect(() => {
    if (selectionMode !== "multiple") {
      setMultiModalOpen(false);
      setMultiSubmitting(false);
      return;
    }
  }, [selectionMode]);

  const canRunSinglePayroll = useMemo(() => {
    if (selectionMode !== "single") return false;
    if (!selectedSingleEmployeeCode) return false;
    if (!String(data.company ?? "").trim()) return false;
    if (!String(data.currency ?? "").trim()) return false;
    if (!String(data.payrollFrequency ?? "").trim()) return false;
    if (!String(data.payrollPayableAccount ?? "").trim()) return false;
    if (!String(data.startDate ?? "").trim()) return false;
    if (!String(data.endDate ?? "").trim()) return false;
    return true;
  }, [
    data.company,
    data.currency,
    data.endDate,
    data.payrollFrequency,
    data.payrollPayableAccount,
    data.startDate,
    selectedSingleEmployeeCode,
    selectionMode,
  ]);

  const canRunMultiplePayroll = useMemo(() => {
    if (selectionMode !== "multiple") return false;
    if (!Array.isArray(data.selectedEmployees) || data.selectedEmployees.length === 0) return false;
    if (!String(data.company ?? "").trim()) return false;
    if (!String(data.currency ?? "").trim()) return false;
    if (!String(data.payrollFrequency ?? "").trim()) return false;
    if (!String(data.payrollPayableAccount ?? "").trim()) return false;
    if (!String(data.startDate ?? "").trim()) return false;
    if (!String(data.endDate ?? "").trim()) return false;
    return true;
  }, [
    data.company,
    data.currency,
    data.endDate,
    data.payrollFrequency,
    data.payrollPayableAccount,
    data.selectedEmployees,
    data.startDate,
    selectionMode,
  ]);

  const runSinglePayroll = async () => {
    if (!canRunSinglePayroll) {
      toast.error("Please fill required fields");
      return;
    }

    setSingleSubmitting(true);

    try {
      await runSingleEmployeePayroll({
        employee: selectedSingleEmployeeCode,
        company: String(data.company),
        start_date: String(data.startDate),
        end_date: String(data.endDate),
        payroll_type: String(data.payrollFrequency),
        currency: String(data.currency),
        exchange_rate: 1,
        payroll_payable_account: String(data.payrollPayableAccount),
      });

      toast.success("Single payroll run created");
      setSingleModalOpen(false);
      onChange("selectedEmployees", []);
    } catch (e: any) {
      const serverMessage =
        e?.response?.data?.message ??
        e?.response?.data?.exc ??
        e?.response?.data?._server_messages ??
        e?.response?.data?.error?.message ??
        e?.message;

      const safeMessage = String(serverMessage ?? "").trim();

      toast.error(safeMessage || "Failed to run single payroll");
    } finally {
      setSingleSubmitting(false);
    }
  };

  const runMultiplePayroll = async () => {
    if (!canRunMultiplePayroll) {
      toast.error("Please select employees and fill required fields");
      return;
    }

    setMultiSubmitting(true);
    try {
      const selectedEmployeeData = active.filter((e) => data.selectedEmployees.includes(e.id));
      const employeeIds = selectedEmployeeData.map((e) => e.employeeId || e.id).filter(Boolean);

      if (employeeIds.length === 0) {
        toast.error("No valid employee IDs found");
        return;
      }

      const startDate = String(data.startDate);
      const endDate = String(data.endDate);

      const effectiveStart = String(startDate ?? "").trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(effectiveStart)) {
        const assignments = await getSalaryStructureAssignments();
        const list = Array.isArray(assignments) ? assignments : [];
        const hasEffective = (empCode: string) => {
          const code = String(empCode ?? "").trim();
          if (!code) return false;
          return list.some((r: any) => {
            if (String(r?.employee ?? "").trim() !== code) return false;
            const fd = String(r?.from_date ?? "");
            if (!/^\d{4}-\d{2}-\d{2}$/.test(fd)) return false;
            return fd <= effectiveStart;
          });
        };

        const withStructure = employeeIds.filter((id) => hasEffective(id));
        const noStructure = employeeIds.filter((id) => !hasEffective(id));

        if (noStructure.length > 0) {
          toast(
            `Skipping ${noStructure.length} employee${noStructure.length > 1 ? "s" : ""} (no salary structure applicable on/before ${effectiveStart})`,
          );
        }

        if (withStructure.length === 0) {
          toast.error("No selected employees have an applicable salary structure for this period");
          return;
        }

        // Continue with only employees that have an effective assignment
        employeeIds.splice(0, employeeIds.length, ...withStructure);
      }

      const toIso = (d: Date) => d.toISOString().slice(0, 10);
      const normalizeMonthRange = (iso: string): { start: string; end: string } | null => {
        const s = String(iso ?? "").trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
        const [y, m] = s.split("-").map((v) => Number(v));
        if (!y || !m) return null;
        const start = new Date(y, m - 1, 1);
        const end = new Date(y, m, 0);
        return { start: toIso(start), end: toIso(end) };
      };

      const monthRange = normalizeMonthRange(startDate) ?? normalizeMonthRange(endDate);
      const checkStart = monthRange?.start ?? startDate;
      const checkEnd = monthRange?.end ?? endDate;

      const existing = await getSalarySlips({
        start_date: checkStart,
        end_date: checkEnd,
        page: 1,
        page_size: 2000,
      });

      const existingEmployees = new Set(
        (Array.isArray(existing?.salary_slips) ? existing.salary_slips : [])
          .map((s) => String(s.employee ?? "").trim())
          .filter(Boolean),
      );

      const toRun = employeeIds.filter((id) => !existingEmployees.has(String(id).trim()));
      const skipped = employeeIds.filter((id) => existingEmployees.has(String(id).trim()));

      if (skipped.length > 0) {
        toast(
          `Skipping ${skipped.length} employee${skipped.length > 1 ? "s" : ""} (already has payroll for this period)`,
        );
      }

      if (toRun.length === 0) {
        toast.error("All selected employees already have payroll for this period");
        return;
      }

      const resp = await createMultipleEmployeesPayroll({
        employees: toRun,
        start_date: startDate,
        end_date: endDate,
      });

      const msg = String((resp as any)?.message ?? "").trim();
      toast.success(msg || `Multiple payroll created for ${toRun.length} employee${toRun.length > 1 ? "s" : ""}`);
      setMultiModalOpen(false);
      onChange("selectedEmployees", []);
    } catch (e: any) {
      const serverMessage =
        e?.response?.data?.message ??
        e?.response?.data?.exc ??
        e?.response?.data?._server_messages ??
        e?.response?.data?.error?.message ??
        e?.message;

      const safeMessage = String(serverMessage ?? "").trim();
      toast.error(safeMessage || "Failed to run multiple payroll");
    } finally {
      setMultiSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = String((data as any).nameSearch ?? "").trim().toLowerCase();
    const job = String((data as any).jobTitleFilter ?? "").trim().toLowerCase();

    return active.filter((e) => {
      const name = String(e.name ?? "").toLowerCase();
      const jobTitle = String(e.jobTitle ?? (e as any).designation ?? "").toLowerCase();

      if (q && !name.includes(q)) return false;
      if (job && !jobTitle.includes(job)) return false;
      return true;
    });
  }, [active, data]);

  const toggleEmp = (id: string) => {
    if (selectionMode === "single") {
      onChange("selectedEmployees", data.selectedEmployees[0] === id ? [] : [id]);
      return;
    }

    const next = data.selectedEmployees.includes(id)
      ? data.selectedEmployees.filter((i) => i !== id)
      : [...data.selectedEmployees, id];

    onChange("selectedEmployees", next);
  };

  const selectAll = () => {
    const all = filtered.map((e) => e.id);
    onChange(
      "selectedEmployees",
      data.selectedEmployees.length === all.length ? [] : all,
    );
  };

  const updateFilter = (field: string, value: any) => {
    onChange(field, value);
    setPage(1);
  };

  const setSelectionMode = (mode: "single" | "multiple") => {
    onChange("employeeSelectionMode", mode);
    if (mode === "single" && data.selectedEmployees.length > 1) {
      onChange("selectedEmployees", data.selectedEmployees.slice(0, 1));
    }
  };

  const jobTitleOptions = useMemo(() => {
    const set = new Set<string>();
    active.forEach((e) => {
      const v = String(e.jobTitle ?? (e as any).designation ?? "").trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [active]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const pageSafe = Math.min(page, totalPages);

  const pageEmployees = useMemo(
    () => filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize),
    [filtered, pageSafe],
  );

  return (
    <div className="flex flex-col gap-4 min-h-0 animate-[fadeIn_0.2s_ease]">
      <MultiPayrollPreviewModal
        open={multiModalOpen}
        employees={active}
        selectedEmployeeIds={data.selectedEmployees}
        structureName={String((fallbackSalaryStructureName || "").trim())}
        currency={String(data.currency ?? "")}
        payPeriodStart={String(data.startDate ?? "")}
        payPeriodEnd={String(data.endDate ?? "")}
        onPayPeriodStartChange={(v: string) => onChange("startDate", v)}
        onPayPeriodEndChange={(v: string) => onChange("endDate", v)}
        onClose={() => setMultiModalOpen(false)}
        onRunPayroll={runMultiplePayroll}
        runPayrollDisabled={!canRunMultiplePayroll || multiSubmitting}
        runPayrollLoading={multiSubmitting}
      />

      <PayrollPreviewModal
        open={singleModalOpen}
        structureName={String((singleSalaryStructureName || fallbackSalaryStructureName || "").trim())}
        currency={String(data.currency ?? "")}
        payPeriodStart={String(data.startDate ?? "")}
        payPeriodEnd={String(data.endDate ?? "")}
        onPayPeriodStartChange={(v: string) => onChange("startDate", v)}
        onPayPeriodEndChange={(v: string) => onChange("endDate", v)}
        onClose={() => {
          setSingleModalOpen(false);
          onChange("selectedEmployees", []);
        }}
        onRunPayroll={runSinglePayroll}
        runPayrollDisabled={!canRunSinglePayroll || singleSubmitting}
        runPayrollLoading={singleSubmitting}
      />

      <div className="border border-theme rounded-xl overflow-hidden flex flex-col min-h-0 flex-1">
        <div className="shrink-0 px-4 py-3 bg-card border-b border-theme">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {isLoading ? (
                <div className="h-9 w-44 bg-theme/60 rounded-lg animate-pulse" />
              ) : (
                <select
                  value={selectionMode}
                  onChange={(e) => setSelectionMode(e.target.value as any)}
                  className={miniSelectCls}
                >
                  <option value="multiple">Multiple Payroll</option>
                  <option value="single">Single Payroll</option>
                </select>
              )}

              {selectionMode === "multiple" && !isLoading && (
                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-main">
                  <input
                    type="checkbox"
                    checked={data.selectedEmployees.length === filtered.length && filtered.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  Select All Employees
                </label>
              )}

              {isLoading ? (
                <div className="h-4 w-24 bg-theme/60 rounded animate-pulse" />
              ) : (
                <div className="text-xs text-muted whitespace-nowrap">{filtered.length} employees</div>
              )}

              {isLoading ? (
                <div className="h-9 w-56 bg-theme/60 rounded-lg animate-pulse" />
              ) : (
                <input
                  type="text"
                  value={(data as any).nameSearch ?? ""}
                  onChange={(e) => updateFilter("nameSearch", e.target.value)}
                  placeholder="Search name"
                  className={miniInputCls}
                />
              )}

              {isLoading ? (
                <div className="h-9 w-56 bg-theme/60 rounded-lg animate-pulse" />
              ) : (
                <select
                  value={(data as any).jobTitleFilter ?? ""}
                  onChange={(e) => updateFilter("jobTitleFilter", e.target.value)}
                  className={miniSelectCls}
                >
                  <option value="">Job title (All)</option>
                  {jobTitleOptions.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center justify-end">
              {isLoading ? (
                <div className="h-6 w-24 bg-theme/60 rounded-full animate-pulse" />
              ) : (
                <div className="flex items-center gap-2">
                  {selectionMode === "multiple" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!data.selectedEmployees.length) {
                          toast.error("Please select employees");
                          return;
                        }

                        if (!String(data.startDate ?? "").trim() || !String(data.endDate ?? "").trim()) {
                          const now = new Date();
                          const start = new Date(now.getFullYear(), now.getMonth(), 1);
                          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                          onChange("startDate", start.toISOString().slice(0, 10));
                          onChange("endDate", end.toISOString().slice(0, 10));
                        }
                        setMultiModalOpen(true);
                      }}
                      disabled={data.selectedEmployees.length === 0}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-40"
                    >
                      Preview Payroll
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const rows = pageEmployees.map((e) => ({
                        id: e.id,
                        employee_id: (e as any).employeeId,
                        name: e.name,
                        job_title: (e as any).jobTitle,
                        department: (e as any).department,
                        status: (e as any).status,
                        gross_salary: (e as any).grossSalary,
                        email: (e as any).email,
                      }));
                      downloadCsv(
                        `employees_${new Date().toISOString().slice(0, 10)}.csv`,
                        toCsv(rows),
                      );
                    }}
                    disabled={pageEmployees.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-theme bg-card text-main hover:bg-app disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                    {data.selectedEmployees.length}/{filtered.length} selected
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full">
            <thead className="bg-app border-b border-theme">
              <tr>
                {[
                  "",
                  "ID",
                  "Employee ID",
                  "Name",
                  "Job Title",
                  "Department",
                  "Work Location",
                  "Gross Salary",
                  "Status",
                  "",
                ].map((h, i) => (
                  <th
                    key={String(i)}
                    className={`px-4 py-3 text-[10px] font-extrabold text-muted uppercase tracking-wider whitespace-nowrap ${
                      i >= 7 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, skIdx) => (
                  <tr key={`sk-${skIdx}`} className={skIdx % 2 === 1 ? "bg-app" : "bg-card"}>
                    {Array.from({ length: 10 }).map((__, cIdx) => (
                      <td key={String(cIdx)} className="px-4 py-3">
                        <div
                          className={`h-3 bg-theme/60 rounded animate-pulse ${
                            cIdx === 0 ? "w-4" : cIdx === 3 ? "w-32" : "w-20"
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageEmployees.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-muted">
                    Doesn't exist
                  </td>
                </tr>
              ) : (
                pageEmployees.map((emp, i) => {
                  const isSel = data.selectedEmployees.includes(emp.id);

                  const gross = Number(emp.grossSalary ?? 0);

                  const statusLabel = String(emp.status ?? (emp.isActive ? "Active" : "Inactive"));

                  return (
                    <tr
                      key={emp.id}
                      onClick={() => toggleEmp(emp.id)}
                      className={`border-b border-theme last:border-0 cursor-pointer transition-colors ${
                        isSel ? "bg-primary/5" : i % 2 === 1 ? "bg-app hover:bg-primary/3" : "bg-card hover:bg-app"
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleEmp(emp.id)}
                          className="w-4 h-4 accent-primary cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-main whitespace-nowrap">{emp.id}</td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{emp.employeeId || "—"}</td>
                      <td className="px-4 py-3 text-xs font-bold text-main whitespace-nowrap">{emp.name || "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                        {emp.jobTitle || emp.designation || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{emp.department || "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                        {emp.workLocation || emp.branch || "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-extrabold text-main tabular-nums whitespace-nowrap">
                        ZMW {gross.toLocaleString("en-ZM")}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                            statusLabel.toLowerCase() === "active"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewEmployee?.(emp.id)}
                            className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition shrink-0"
                            aria-label="View employee details"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {onEditEmployee && (
                            <button
                              onClick={() => onEditEmployee(emp)}
                              className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition shrink-0"
                              aria-label="Edit employee"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 bg-app border-t border-theme">

            <div className="text-xs text-muted">Page {pageSafe} of {totalPages}</div>

            <div className="flex items-center gap-2">

              <button

                type="button"

                onClick={() => setPage((p) => Math.max(1, p - 1))}

                disabled={pageSafe <= 1}

                className="px-3 py-2 text-xs font-bold rounded-lg border border-theme bg-card text-main disabled:opacity-40"

              >

                Previous

              </button>

              <button

                type="button"

                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}

                disabled={pageSafe >= totalPages}

                className="px-3 py-2 text-xs font-bold rounded-lg border border-theme bg-card text-main disabled:opacity-40"

              >

                Next

              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};



interface AccountingTabProps {

  data: PayrollEntry;

  onChange: (field: string, value: any) => void;

  employees: Employee[];

}



export const AccountingTab: React.FC<AccountingTabProps> = ({ data, onChange, employees }) => {

  const selectedEmps = employees.filter((e) => data.selectedEmployees.includes(e.id));

  const totalGross = selectedEmps.reduce((s, e) => s + Number(e.grossSalary ?? 0), 0);



  return (

    <div className="space-y-5 animate-[fadeIn_0.2s_ease]">

      <div className="grid grid-cols-2 gap-5">

        <div>

          <Label>Payment Account</Label>

          <select

            value={(data as any).paymentAccount ?? ""}

            onChange={(e) => onChange("paymentAccount", e.target.value)}

            className={selectCls}

          >

            <option value="">Select account</option>

            <option value="current">Current Account</option>

            <option value="salary">Salary Account</option>

          </select>

        </div>

        <div>

          <Label>Cost Center</Label>

          <input

            type="text"

            value={(data as any).costCenter ?? ""}

            onChange={(e) => onChange("costCenter", e.target.value)}

            placeholder="e.g. HQ-Operations"

            className={inputCls}

          />

        </div>

        <div>

          <Label>Project</Label>

          <input

            type="text"

            value={(data as any).project ?? ""}

            onChange={(e) => onChange("project", e.target.value)}

            placeholder="e.g. Internal Payroll"

            className={inputCls}

          />

        </div>

        <div>

          <Label>Letter Head</Label>

          <input

            type="text"

            value={(data as any).letterHead ?? ""}

            onChange={(e) => onChange("letterHead", e.target.value)}

            placeholder="e.g. Company Letterhead"

            className={inputCls}

          />

        </div>

      </div>



      {data.selectedEmployees.length > 0 && (

        <div className="rounded-xl border border-success/30 bg-success/5 p-5">

          <p className="text-xs font-extrabold text-success uppercase tracking-wider mb-4">Payroll Summary</p>

          <div className="grid grid-cols-4 gap-4">

            {[

              { label: "Employees", value: data.selectedEmployees.length },

              { label: "Est. Gross", value: `ZMW ${totalGross.toLocaleString("en-ZM")}` },

              { label: "Currency", value: (data as any).currency || "—" },

              { label: "Frequency", value: (data as any).payrollFrequency || "—" },

            ].map(({ label, value }) => (

              <div key={label}>

                <p className="text-[10px] text-success/70 uppercase tracking-wider">{label}</p>

                <p className="text-lg font-extrabold text-success mt-0.5">{value}</p>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>

  );

};