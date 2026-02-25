// EntryFormTabs.tsx — New Payroll Entry: Overview, Employees, Accounting tabs
import React, { useMemo, useState } from "react";
import { Edit2, Eye } from "lucide-react";
import type { PayrollEntry, Employee } from "../../../types/payrolltypes";
import HrDateInput from "../../../components/Hr/HrDateInput";


// ── Primitives ────────────────────────────────────────────────────────────────
const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <label className="block text-[10px] font-extrabold text-muted mb-1.5 uppercase tracking-wider">
    {children}{required && <span className="text-danger ml-0.5">*</span>}
  </label>
);

const inputCls = "w-full px-3 py-2.5 bg-app border border-theme rounded-lg text-sm text-main placeholder:text-muted focus:outline-none focus:border-primary transition";
const selectCls = "w-full px-3 py-2.5 bg-app border border-theme rounded-lg text-sm text-main focus:outline-none focus:border-primary transition cursor-pointer";

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW TAB
// ─────────────────────────────────────────────────────────────────────────────
interface OverviewTabProps {
  data: PayrollEntry;
  onChange: (field: string, value: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, onChange }) => (
  <div className="space-y-5 animate-[fadeIn_0.2s_ease]">
    <div className="grid grid-cols-3 gap-5">
      <div>
        <Label required>Payroll Name</Label>
        <input type="text" value={data.payrollName} onChange={e => onChange("payrollName", e.target.value)}
          placeholder="e.g. January 2026 Payroll" className={inputCls} />
      </div>
      <div>
        <Label required>Posting Date</Label>
        <HrDateInput
          value={data.postingDate}
          onChange={(v: string) => onChange("postingDate", v)}
          placeholder="DD/MM/YYYY"
          inputClassName={inputCls}
        />
      </div>
      <div>
        <Label required>Payroll Frequency</Label>
        <select value={data.payrollFrequency} onChange={e => onChange("payrollFrequency", e.target.value)} className={selectCls}>
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
        <select value={data.currency} onChange={e => onChange("currency", e.target.value)} className={selectCls}>
          <option value="ZMW">ZMW — Zambian Kwacha</option>
          <option value="USD">USD — US Dollar</option>
          <option value="EUR">EUR — Euro</option>
        </select>
      </div>
      <div>
        <Label required>Company</Label>
        <input type="text" value={data.company} onChange={e => onChange("company", e.target.value)} className={inputCls} />
      </div>
      <div>
        <Label required>Payroll Payable Account</Label>
        <select value={data.payrollPayableAccount} onChange={e => onChange("payrollPayableAccount", e.target.value)} className={selectCls}>
          <option value="Payroll Payable - I">Payroll Payable - I</option>
          <option value="Payroll Payable - II">Payroll Payable - II</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-5">
      <div>
        <Label required>Pay Period Start</Label>
        <HrDateInput
          value={data.startDate}
          onChange={(v: string) => onChange("startDate", v)}
          placeholder="DD/MM/YYYY"
          inputClassName={inputCls}
        />
      </div>
      <div>
        <Label required>Pay Period End</Label>
        <HrDateInput
          value={data.endDate}
          onChange={(v: string) => onChange("endDate", v)}
          placeholder="DD/MM/YYYY"
          inputClassName={inputCls}
        />
      </div>
    </div>

    {/* Toggles */}
    <div className="grid grid-cols-2 gap-4">
      {[
        { field: "deductTaxForProof", label: "Deduct Tax for Proof Submission", desc: "Apply TDS based on submitted investment proofs" },
        { field: "salarySlipTimesheet", label: "Salary Slip Based on Timesheet", desc: "Calculate pay using logged timesheet hours" },
      ].map(({ field, label, desc }) => (
        <label key={field} className="flex items-start gap-3 p-4 bg-app border border-theme rounded-xl cursor-pointer hover:border-primary/40 transition">
          <input
            type="checkbox"
            checked={!!(data as any)[field]}
            onChange={e => onChange(field, e.target.checked)}
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

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYEES TAB
// ─────────────────────────────────────────────────────────────────────────────
interface EmployeesTabProps {
  data: PayrollEntry;
  onChange: (field: string, value: any) => void;
  employees: Employee[];
  onEditEmployee?: (emp: Employee) => void;
  onViewEmployee?: (employeeId: string) => void;
  onCreatePayroll?: (empIds: string[]) => void;
}

export const EmployeesTab: React.FC<EmployeesTabProps> = ({
  data, onChange, employees, onEditEmployee, onViewEmployee, onCreatePayroll,
}) => {
  const active = employees.filter(e => e.isActive);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const miniInputCls = "w-56 px-2.5 py-2 bg-app border border-theme rounded-lg text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary transition";
  const miniSelectCls = "w-56 px-2.5 py-2 bg-app border border-theme rounded-lg text-xs text-main focus:outline-none focus:border-primary transition cursor-pointer";

  const selectionMode: "single" | "multiple" = (data.employeeSelectionMode || "multiple");

  const toggleEmp = (id: string) => {
    if (selectionMode === "single") {
      onChange("selectedEmployees", data.selectedEmployees[0] === id ? [] : [id]);
      return;
    }

    const next = data.selectedEmployees.includes(id)
      ? data.selectedEmployees.filter(i => i !== id)
      : [...data.selectedEmployees, id];
    onChange("selectedEmployees", next);
  };
  const selectAll = () => {
    const all = filtered.map(e => e.id);
    onChange("selectedEmployees", data.selectedEmployees.length === all.length ? [] : all);
  };

  const filtered = useMemo(() => {
    const q = String((data as any).nameSearch ?? "").trim().toLowerCase();
    const job = String((data as any).jobTitleFilter ?? "").trim().toLowerCase();
    const dept = String((data as any).departmentFilter ?? "").trim().toLowerCase();

    return active.filter(e => {
      const name = String(e.name ?? "").toLowerCase();
      const jobTitle = String(e.jobTitle ?? e.designation ?? "").toLowerCase();
      const department = String(e.department ?? "").toLowerCase();

      if (q && !name.includes(q)) return false;
      if (job && !jobTitle.includes(job)) return false;
      if (dept && !department.includes(dept)) return false;

      return true;
    });
  }, [active, data]);

  const jobTitleOptions = useMemo(() => {
    const set = new Set<string>();
    active.forEach(e => {
      const v = String(e.jobTitle ?? e.designation ?? "").trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [active]);

  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    active.forEach(e => {
      const v = String(e.department ?? "").trim();
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

  return (
    <div className="space-y-4 animate-[fadeIn_0.2s_ease]">
      {/* Select-all bar */}
      <div className="flex items-center justify-between py-2.5 px-4 bg-app border border-theme rounded-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectionMode("single")}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition ${selectionMode === "single" ? "bg-primary text-white border-primary" : "bg-card text-muted border-theme hover:bg-app"}`}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => setSelectionMode("multiple")}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition ${selectionMode === "multiple" ? "bg-primary text-white border-primary" : "bg-card text-muted border-theme hover:bg-app"}`}
            >
              Multiple
            </button>
          </div>

          {selectionMode === "multiple" && (
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
        </div>
        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
          {data.selectedEmployees.length}/{filtered.length} selected
        </span>
      </div>

      {/* Employee list */}
      <div className="border border-theme rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-card border-b border-theme">
            <div className="flex items-center gap-3 overflow-x-auto flex-nowrap min-w-0">
              <div className="text-xs text-muted whitespace-nowrap shrink-0">{filtered.length} employees</div>

              <input
                type="text"
                value={(data as any).nameSearch ?? ""}
                onChange={e => updateFilter("nameSearch", e.target.value)}
                placeholder="Search name"
                className={miniInputCls}
              />

              <select
                value={(data as any).jobTitleFilter ?? ""}
                onChange={e => updateFilter("jobTitleFilter", e.target.value)}
                className={miniSelectCls}
              >
                <option value="">Job title (All)</option>
                {jobTitleOptions.map(j => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>

              <select
                value={(data as any).departmentFilter ?? ""}
                onChange={e => updateFilter("departmentFilter", e.target.value)}
                className={miniSelectCls}
              >
                <option value="">Department (All)</option>
                {departmentOptions.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => onCreatePayroll?.(data.selectedEmployees)}
              disabled={!data.selectedEmployees.length}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success text-white text-xs font-extrabold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create Payroll ({data.selectedEmployees.length})
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-app border-b border-theme">
              <tr>
                {["", "ID", "Employee ID", "Name", "Job Title", "Department", "Work Location", "Gross Salary", "Status", ""].map((h, i) => (
                  <th
                    key={String(i)}
                    className={`px-4 py-3 text-[10px] font-extrabold text-muted uppercase tracking-wider whitespace-nowrap ${i >= 7 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageEmployees.length === 0 ? (
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
                      className={`border-b border-theme last:border-0 cursor-pointer transition-colors ${isSel ? "bg-primary/5" : i % 2 === 1 ? "bg-app hover:bg-primary/3" : "bg-card hover:bg-app"}`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
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
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{emp.jobTitle || emp.designation || "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{emp.department || "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{emp.workLocation || emp.branch || "—"}</td>
                      <td className="px-4 py-3 text-right text-xs font-extrabold text-main tabular-nums whitespace-nowrap">ZMW {gross.toLocaleString("en-ZM")}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${statusLabel.toLowerCase() === "active"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-warning/10 text-warning border-warning/20"}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
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

          {filtered.length > 0 && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-app border-t border-theme">
              <div className="text-xs text-muted">Page {pageSafe} of {totalPages}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={pageSafe <= 1}
                  className="px-3 py-2 text-xs font-bold rounded-lg border border-theme bg-card text-main disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// ACCOUNTING TAB
// ─────────────────────────────────────────────────────────────────────────────
interface AccountingTabProps {
  data: PayrollEntry;
  onChange: (field: string, value: any) => void;
  employees: Employee[];
}

export const AccountingTab: React.FC<AccountingTabProps> = ({ data, onChange, employees }) => {
  const selectedEmps = employees.filter(e => data.selectedEmployees.includes(e.id));
  const totalGross = selectedEmps.reduce((s, e) => s + Number(e.grossSalary ?? 0), 0);

  return (
    <div className="space-y-5 animate-[fadeIn_0.2s_ease]">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>Payment Account</Label>
          <select value={(data as any).paymentAccount ?? ""} onChange={e => onChange("paymentAccount", e.target.value)} className={selectCls}>
            <option value="">Select account</option>
            <option value="current">Current Account</option>
            <option value="salary">Salary Account</option>
          </select>
        </div>
        <div>
          <Label>Cost Center</Label>
          <input type="text" value={(data as any).costCenter ?? ""} onChange={e => onChange("costCenter", e.target.value)}
            placeholder="e.g. HQ-Operations" className={inputCls} />
        </div>
        <div>
          <Label>Project</Label>
          <input type="text" value={(data as any).project ?? ""} onChange={e => onChange("project", e.target.value)}
            placeholder="e.g. Internal Payroll" className={inputCls} />
        </div>
        <div>
          <Label>Letter Head</Label>
          <input type="text" value={(data as any).letterHead ?? ""} onChange={e => onChange("letterHead", e.target.value)}
            placeholder="e.g. Company Letterhead" className={inputCls} />
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