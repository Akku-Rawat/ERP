// EntryFormTabs.tsx — Landscape layout, no vertical scroll

import React from "react";
import type { PayrollEntry, Employee } from "./types";
import { Edit2, CheckSquare } from "lucide-react";

// ─── Shared field primitives ──────────────────────────────────────────────────
const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="block text-[11px] font-semibold text-muted mb-1 uppercase tracking-wide">
    {children}
    {required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const inputCls =
  "w-full px-3 py-2 bg-app border border-theme rounded-lg text-sm text-main " +
  "placeholder:text-muted focus:outline-none focus:border-primary transition";

const selectCls =
  "w-full px-3 py-2 bg-app border border-theme rounded-lg text-sm text-main " +
  "focus:outline-none focus:border-primary transition cursor-pointer";

// ─── Overview Tab — 3-column grid, everything above the fold ─────────────────
interface OverviewTabProps {
  data: PayrollEntry;
  onChange: (field: string, value: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, onChange }) => (
  <div className="space-y-4">
    {/* Row 1 — 3 cols */}
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label required>Payroll Name</Label>
        <input
          type="text"
          value={data.payrollName}
          onChange={(e) => onChange("payrollName", e.target.value)}
          placeholder="e.g. March Payroll"
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
        </select>
      </div>
    </div>

    {/* Row 2 — 3 cols */}
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label required>Currency</Label>
        <select
          value={data.currency}
          onChange={(e) => onChange("currency", e.target.value)}
          className={selectCls}
        >
          <option value="INR">INR — Indian Rupee</option>
          <option value="USD">USD — US Dollar</option>
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
          <option value="Payroll Payable - I">Payroll Payable - I</option>
          <option value="Payroll Payable - II">Payroll Payable - II</option>
        </select>
      </div>
    </div>

    {/* Row 3 — date range + status + checkboxes */}
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label required>Start Date</Label>
        <input
          type="date"
          value={data.startDate}
          onChange={(e) => onChange("startDate", e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <Label required>End Date</Label>
        <input
          type="date"
          value={data.endDate}
          onChange={(e) => onChange("endDate", e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <Label>Status</Label>
        <div className="flex items-center gap-2 px-3 py-2 bg-app border border-theme rounded-lg">
          <span className="w-2 h-2 rounded-full bg-[var(--warning)] shrink-0" />
          <span className="text-sm text-muted">{data.status}</span>
        </div>
      </div>
    </div>

    {/* Row 4 — checkboxes inline */}
    <div className="grid grid-cols-2 gap-4">
      <label className="flex items-center gap-3 px-4 py-3 bg-app border border-theme rounded-lg hover:border-primary cursor-pointer transition group">
        <input
          type="checkbox"
          checked={data.salarySlipTimesheet}
          onChange={(e) => onChange("salarySlipTimesheet", e.target.checked)}
          className="w-4 h-4 accent-[var(--primary)] rounded"
        />
        <span className="text-sm text-main font-medium group-hover:text-primary transition">
          Salary Slip Based on Timesheet
        </span>
      </label>
      <label className="flex items-center gap-3 px-4 py-3 bg-app border border-theme rounded-lg hover:border-primary cursor-pointer transition group">
        <input
          type="checkbox"
          checked={data.deductTaxForProof}
          onChange={(e) => onChange("deductTaxForProof", e.target.checked)}
          className="w-4 h-4 accent-[var(--primary)] rounded"
        />
        <span className="text-sm text-main font-medium group-hover:text-primary transition">
          Deduct Tax For Unsubmitted Proof
        </span>
      </label>
    </div>
  </div>
);

// ─── Employees Tab — left filters + right scrollable list ─────────────────────
interface EmployeesTabProps {
  data: PayrollEntry;
  onChange: (field: string, value: any) => void;
  employees: Employee[];
  onEditEmployee?: (employee: Employee) => void;
}

export const EmployeesTab: React.FC<EmployeesTabProps> = ({
  data,
  onChange,
  employees,
  onEditEmployee,
}) => {
  const toggleEmployee = (empId: string) => {
    const current = data.selectedEmployees || [];
    onChange(
      "selectedEmployees",
      current.includes(empId)
        ? current.filter((id) => id !== empId)
        : [...current, empId],
    );
  };

  const filteredEmployees = employees;

  const allIds = filteredEmployees.map((e) => e.id);
  const selectedCount = data.selectedEmployees?.length || 0;
  const allSelected = selectedCount === allIds.length && allIds.length > 0;

  const selectAll = () =>
    onChange("selectedEmployees", allSelected ? [] : allIds);

  return (
    // Two-column: narrow filter panel | wide employee list
    <div className="flex gap-4 h-full">
      {/* ── Filter sidebar ── */}
      <div className="w-52 shrink-0 flex flex-col gap-2">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1">
          Filter Employees
        </p>
        <input
          placeholder="Branch"
          value={data.branch || ""}
          onChange={(e) => onChange("branch", e.target.value)}
          className={inputCls}
        />
        <input
          placeholder="Designation"
          value={data.designation || ""}
          onChange={(e) => onChange("designation", e.target.value)}
          className={inputCls}
        />
        <input
          placeholder="Department"
          value={data.department || ""}
          onChange={(e) => onChange("department", e.target.value)}
          className={inputCls}
        />
        <input
          placeholder="Grade"
          value={data.grade || ""}
          onChange={(e) => onChange("grade", e.target.value)}
          className={inputCls}
        />
        <div className="mt-auto pt-2 border-t border-theme text-xs text-muted">
          <span className="font-semibold text-primary">{filteredEmployees.length}</span> employees found
        </div>
      </div>

      {/* ── Employee list ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Select all header */}
        <label className="flex items-center justify-between px-4 py-2.5 bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] rounded-lg mb-2 cursor-pointer shrink-0">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={selectAll}
              className="w-4 h-4 accent-[var(--primary)] rounded"
            />
            <span className="text-sm font-semibold text-main">Select All</span>
          </div>
          <span className="text-xs font-semibold text-primary bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] px-2 py-0.5 rounded-full">
            {selectedCount} selected
          </span>
        </label>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filteredEmployees.map((emp) => {
            const isSelected = data.selectedEmployees?.includes(emp.id);
            const gross = emp.basicSalary + emp.hra + emp.allowances;
            return (
              <div
                key={emp.id}
                onClick={() => toggleEmployee(emp.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]"
                    : "border-theme bg-app hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={!!isSelected}
                    readOnly
                    className="w-3.5 h-3.5 accent-[var(--primary)] rounded shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-main truncate">{emp.name}</p>
                    <p className="text-[11px] text-muted truncate">
                      {emp.id} · {emp.designation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-main">₹{gross.toLocaleString()}</p>
                    <p className="text-[10px] text-muted">Gross</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditEmployee?.(emp); }}
                    className="p-1.5 rounded-md hover:bg-app border border-transparent hover:border-theme text-muted hover:text-main transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Accounting Tab — 2-col form + compact summary ────────────────────────────
interface AccountingTabProps {
  data: PayrollEntry;
  onChange: (field: string, value: any) => void;
  employees: Employee[];
}

export const AccountingTab: React.FC<AccountingTabProps> = ({
  data,
  onChange,
  employees,
}) => {
  const selectedEmps = employees.filter((e) =>
    data.selectedEmployees?.includes(e.id),
  );
  const grossTotal = selectedEmps.reduce(
    (s, e) => s + e.basicSalary + e.hra + e.allowances,
    0,
  );
  const netTotal = Math.round(grossTotal * 0.76);

  return (
    <div className="flex gap-6 h-full">
      {/* ── Left: form fields ── */}
      <div className="flex-1 grid grid-cols-2 gap-4 content-start">
        <div>
          <Label required>Payment Account</Label>
          <select
            value={data.paymentAccount}
            onChange={(e) => onChange("paymentAccount", e.target.value)}
            className={selectCls}
          >
            <option value="">Select bank account</option>
            <option value="HDFC Bank">HDFC Bank</option>
            <option value="ICICI Bank">ICICI Bank</option>
          </select>
        </div>
        <div>
          <Label>Cost Center</Label>
          <select
            value={data.costCenter}
            onChange={(e) => onChange("costCenter", e.target.value)}
            className={selectCls}
          >
            <option value="">Select cost center</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div>
          <Label>Project</Label>
          <select
            value={data.project}
            onChange={(e) => onChange("project", e.target.value)}
            className={selectCls}
          >
            <option value="">Select project</option>
            <option value="Project Alpha">Project Alpha</option>
          </select>
        </div>
        <div>
          <Label>Letter Head</Label>
          <select
            value={data.letterHead}
            onChange={(e) => onChange("letterHead", e.target.value)}
            className={selectCls}
          >
            <option value="">Select letter head</option>
            <option value="Company">Company</option>
          </select>
        </div>
      </div>

      {/* ── Right: payment summary card ── */}
      <div className="w-60 shrink-0 bg-app border border-theme rounded-xl p-4 flex flex-col gap-3">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-wide">
          Payment Summary
        </p>

        <div className="flex-1 flex flex-col gap-2">
          {/* Employees */}
          <div className="flex items-center justify-between py-2 border-b border-theme">
            <span className="text-xs text-muted">Employees</span>
            <span className="text-sm font-bold text-main">
              {data.selectedEmployees?.length || 0}
            </span>
          </div>
          {/* Gross */}
          <div className="flex items-center justify-between py-2 border-b border-theme">
            <span className="text-xs text-muted">Est. Gross</span>
            <span className="text-sm font-bold text-main">
              ₹{grossTotal.toLocaleString()}
            </span>
          </div>
          {/* Net */}
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-muted">Est. Net Pay</span>
            <span className="text-base font-bold text-primary">
              ₹{netTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-theme">
          <p className="text-[10px] text-muted opacity-60 leading-relaxed">
            Net estimated after ~24% deductions (PF, ESI, TDS)
          </p>
        </div>
      </div>
    </div>
  );
};