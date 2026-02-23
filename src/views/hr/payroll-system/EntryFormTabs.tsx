// EntryFormTabs.tsx — New Payroll Entry: Overview, Employees, Accounting tabs
import React from "react";
import { Edit2 } from "lucide-react";
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
          <option value="INR">INR — Indian Rupee</option>
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
        { field: "deductTaxForProof",   label: "Deduct Tax for Proof Submission", desc: "Apply TDS based on submitted investment proofs" },
        { field: "salarySlipTimesheet", label: "Salary Slip Based on Timesheet",  desc: "Calculate pay using logged timesheet hours" },
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
}

export const EmployeesTab: React.FC<EmployeesTabProps> = ({
  data, onChange, employees, onEditEmployee,
}) => {
  const active = employees.filter(e => e.isActive);
  const toggleEmp = (id: string) => {
    const next = data.selectedEmployees.includes(id)
      ? data.selectedEmployees.filter(i => i !== id)
      : [...data.selectedEmployees, id];
    onChange("selectedEmployees", next);
  };
  const selectAll = () => {
    const all = active.map(e => e.id);
    onChange("selectedEmployees", data.selectedEmployees.length === all.length ? [] : all);
  };

  return (
    <div className="space-y-4 animate-[fadeIn_0.2s_ease]">
      {/* Filter row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { field: "branch",      label: "Branch",      ph: "All branches" },
          { field: "department",  label: "Department",  ph: "All departments" },
          { field: "designation", label: "Designation", ph: "All designations" },
          { field: "grade",       label: "Grade",       ph: "All grades" },
        ].map(({ field, label, ph }) => (
          <div key={field}>
            <Label>{label}</Label>
            <input
              type="text"
              value={(data as any)[field] ?? ""}
              onChange={e => onChange(field, e.target.value)}
              placeholder={ph}
              className={inputCls}
            />
          </div>
        ))}
      </div>

      {/* Select-all bar */}
      <div className="flex items-center justify-between py-2.5 px-4 bg-app border border-theme rounded-xl">
        <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-main">
          <input
            type="checkbox"
            checked={data.selectedEmployees.length === active.length && active.length > 0}
            onChange={selectAll}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
          Select All Employees
        </label>
        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
          {data.selectedEmployees.length}/{active.length} selected
        </span>
      </div>

      {/* Employee list */}
      <div className="border border-theme rounded-xl overflow-hidden">
        {active.length === 0 ? (
          <div className="py-12 text-center text-muted text-sm">No active employees found</div>
        ) : (
          active.map((emp, i) => {
            const isSel  = data.selectedEmployees.includes(emp.id);
            const gross  = emp.basicSalary + emp.hra + emp.allowances;
            const initials = emp.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

            return (
              <div
                key={emp.id}
                onClick={() => toggleEmp(emp.id)}
                className={`flex items-center gap-4 p-4 border-b border-theme last:border-0 cursor-pointer transition-colors ${
                  isSel ? "bg-primary/5" : i % 2 === 1 ? "bg-app hover:bg-primary/3" : "bg-card hover:bg-app"
                }`}
              >
                <input type="checkbox" checked={isSel} onChange={() => {}} className="w-4 h-4 accent-primary cursor-pointer shrink-0" />

                <div className={`w-9 h-9 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 transition-colors ${
                  isSel ? "bg-primary text-white" : "bg-app text-muted"
                }`}>
                  {initials}
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-5 gap-2 items-center">
                  <div className="col-span-2">
                    <p className="text-sm font-bold text-main leading-tight">{emp.name}</p>
                    <p className="text-[11px] text-muted">{emp.id}</p>
                  </div>
                  <p className="text-xs text-muted">{emp.department}</p>
                  <p className="text-xs text-muted">{emp.designation}</p>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-main tabular-nums">₹{gross.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-muted">Gross</p>
                  </div>
                </div>

                {onEditEmployee && (
                  <button
                    onClick={e => { e.stopPropagation(); onEditEmployee(emp); }}
                    className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
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
  const totalGross   = selectedEmps.reduce((s, e) => s + e.basicSalary + e.hra + e.allowances, 0);

  return (
    <div className="space-y-5 animate-[fadeIn_0.2s_ease]">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>Payment Account</Label>
          <select value={data.paymentAccount} onChange={e => onChange("paymentAccount", e.target.value)} className={selectCls}>
            <option value="">Select account</option>
            <option value="current-hdfc">Current A/C — HDFC Bank</option>
            <option value="current-icici">Current A/C — ICICI Bank</option>
            <option value="current-sbi">Current A/C — SBI</option>
          </select>
        </div>
        <div>
          <Label>Cost Center</Label>
          <input type="text" value={data.costCenter} onChange={e => onChange("costCenter", e.target.value)}
            placeholder="e.g. HQ-Operations" className={inputCls} />
        </div>
        <div>
          <Label>Project</Label>
          <input type="text" value={data.project} onChange={e => onChange("project", e.target.value)}
            placeholder="e.g. Internal Payroll Q1" className={inputCls} />
        </div>
        <div>
          <Label>Letter Head</Label>
          <input type="text" value={data.letterHead} onChange={e => onChange("letterHead", e.target.value)}
            placeholder="e.g. Izyane Official" className={inputCls} />
        </div>
      </div>

      {/* Summary card */}
      {data.selectedEmployees.length > 0 && (
        <div className="rounded-xl border border-success/30 bg-success/5 p-5">
          <p className="text-xs font-extrabold text-success uppercase tracking-wider mb-4">Payroll Summary</p>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Employees",   value: data.selectedEmployees.length },
              { label: "Est. Gross",  value: `₹${totalGross.toLocaleString("en-IN")}` },
              { label: "Currency",    value: data.currency },
              { label: "Frequency",   value: data.payrollFrequency || "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-success/70 uppercase tracking-wider">{label}</p>
                <p className="text-lg font-extrabold text-success mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statutory note */}
      <div className="rounded-xl bg-info/5 border border-info/20 p-4">
        <p className="text-xs font-extrabold text-info mb-2">Statutory Deductions (Auto-calculated)</p>
        <div className="grid grid-cols-3 gap-3 text-xs text-info/70">
          <div>• Provident Fund (PF) — 12% of Basic</div>
          <div>• ESI — 0.75% (if gross ≤ ₹21,000)</div>
          <div>• Professional Tax — ₹200/month</div>
          <div>• Income Tax — As per IT Declaration</div>
          <div>• Employer PF — 12% (additional)</div>
          <div>• Employer ESI — 3.25%</div>
        </div>
      </div>
    </div>
  );
};