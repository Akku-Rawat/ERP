import React, { useState } from "react";
import {
  ChevronLeft,
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  Banknote,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import type { PayrollRecord } from "./types";

interface EmployeeDetailPageProps {
  records: PayrollRecord[];
  initialRecord?: PayrollRecord;
  onBack: () => void;
  onViewPayslip: (record: PayrollRecord) => void;
}

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusDot: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    Paid:       "bg-[var(--success)]",
    Pending:    "bg-[var(--warning)]",
    Processing: "bg-primary",
    Approved:   "bg-[var(--success)]",
    Rejected:   "bg-red-400",
  };
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${map[status] ?? "bg-muted"}`} />;
};

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    Paid:       "text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)]",
    Pending:    "text-[var(--warning)] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)]",
    Processing: "text-primary bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]",
    Approved:   "text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)]",
    Rejected:   "text-red-400 bg-[color-mix(in_srgb,#ef4444_12%,transparent)]",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${map[status] ?? "bg-app text-muted"}`}>
      <StatusDot status={status} />
      {status}
    </span>
  );
};

// ── Info row inside detail panels ─────────────────────────────────────────────
const InfoRow: React.FC<{ label: string; value: React.ReactNode; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-theme last:border-0">
    <div className="flex items-center gap-2 text-muted">
      {icon && <span className="opacity-60">{icon}</span>}
      <span className="text-xs">{label}</span>
    </div>
    <span className="text-xs font-semibold text-main text-right max-w-48 truncate">{value}</span>
  </div>
);

export const EmployeeDetailPage: React.FC<EmployeeDetailPageProps> = ({
  records,
  initialRecord,
  onBack,
  onViewPayslip,
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PayrollRecord>(initialRecord ?? records[0]);
  const [activeSection, setActiveSection] = useState<"overview" | "payroll" | "documents">("overview");

  const filtered = records.filter(
    (r) =>
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase())
  );

  const totalDeductions = selected.taxDeduction + selected.pfDeduction + selected.otherDeductions;
  const netPct = selected.grossPay > 0 ? Math.round((selected.netPay / selected.grossPay) * 100) : 0;

  // Avatar initials
  const initials = selected.employeeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="h-screen flex flex-col bg-app overflow-hidden">
      {/* ── Top bar ── */}
      <header className="h-12 shrink-0 bg-card border-b border-theme px-5 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-app text-muted hover:text-main transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-theme opacity-40" />
          <span className="text-sm font-bold text-main">Employee Payroll</span>
          <span className="text-xs text-muted opacity-60">· {records.length} records</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted bg-app border border-theme px-3 py-1.5 rounded-full">
            {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </span>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex">
        {/* ══ LEFT SIDEBAR — employee list ══ */}
        <aside className="w-64 shrink-0 flex flex-col border-r border-theme bg-card">
          {/* Search */}
          <div className="p-3 border-b border-theme">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees…"
                className="w-full pl-8 pr-3 py-2 bg-app border border-theme rounded-lg text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className={`w-full text-left px-4 py-3 border-b border-theme transition-all hover:bg-app
                  ${selected.id === r.id ? "bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] border-l-2 border-l-primary" : "border-l-2 border-l-transparent"}`}
              >
                <div className="flex items-center gap-2.5">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                    {r.employeeName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-main truncate">{r.employeeName}</p>
                    <p className="text-[10px] text-muted truncate">{r.department}</p>
                  </div>
                  <StatusDot status={r.status} />
                </div>
                {selected.id === r.id && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-muted">{r.employeeId}</span>
                    <span className="text-[10px] font-bold font-mono text-primary">₹{r.netPay.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-muted gap-2">
                <User className="w-6 h-6 opacity-30" />
                <p className="text-xs">No employees found</p>
              </div>
            )}
          </div>
        </aside>

        {/* ══ RIGHT — detail panel ══ */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Employee header card */}
          <div className="shrink-0 bg-card border-b border-theme px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Large avatar */}
                <div className="w-12 h-12 rounded-xl bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-primary flex items-center justify-center text-base font-bold">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-main">{selected.employeeName}</h2>
                    <StatusPill status={selected.status} />
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {selected.designation} · {selected.department} · {selected.employeeId}
                  </p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-3">
                <div className="text-right px-4 py-2 bg-[color-mix(in_srgb,var(--success)_8%,transparent)] border border-[color-mix(in_srgb,var(--success)_20%,transparent)] rounded-xl">
                  <p className="text-[9px] text-[var(--success)] uppercase tracking-wide">Gross</p>
                  <p className="text-sm font-bold font-mono text-[var(--success)]">₹{selected.grossPay.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right px-4 py-2 bg-[color-mix(in_srgb,#ef4444_8%,transparent)] border border-[color-mix(in_srgb,#ef4444_20%,transparent)] rounded-xl">
                  <p className="text-[9px] text-red-400 uppercase tracking-wide">Deductions</p>
                  <p className="text-sm font-bold font-mono text-red-400">−₹{totalDeductions.toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right px-4 py-2 bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] rounded-xl">
                  <p className="text-[9px] text-primary uppercase tracking-wide">Net Pay</p>
                  <p className="text-base font-bold font-mono text-primary">₹{selected.netPay.toLocaleString("en-IN")}</p>
                </div>
                <button
                  onClick={() => onViewPayslip(selected)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 transition shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Payslip
                </button>
              </div>
            </div>

            {/* Section tabs */}
            <div className="flex gap-0 mt-4 -mb-4">
              {(["overview", "payroll", "documents"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSection(s)}
                  className={`px-4 py-2.5 text-xs font-semibold capitalize border-b-2 -mb-px transition-all ${
                    activeSection === s
                      ? "text-primary border-primary"
                      : "text-muted border-transparent hover:text-main"
                  }`}
                >
                  {s === "overview" ? "Overview" : s === "payroll" ? "Pay Breakdown" : "Documents"}
                </button>
              ))}
            </div>
          </div>

          {/* ── Section content ── */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6">

            {/* OVERVIEW */}
            {activeSection === "overview" && (
              <div className="grid grid-cols-3 gap-4">
                {/* Personal details */}
                <div className="bg-card border border-theme rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-theme bg-app flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-main uppercase tracking-wide">Personal</span>
                  </div>
                  <div className="px-4 py-1">
                    <InfoRow label="Employee ID"   value={selected.employeeId}    icon={<User className="w-3 h-3" />} />
                    <InfoRow label="Designation"   value={selected.designation}   icon={<Briefcase className="w-3 h-3" />} />
                    <InfoRow label="Department"    value={selected.department}    icon={<MapPin className="w-3 h-3" />} />
                    <InfoRow label="Grade"
                      value={
                        <span className="px-2 py-0.5 bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-primary text-[10px] font-bold rounded">
                          {selected.grade}
                        </span>
                      }
                    />
                    <InfoRow label="Joining Date"  value={selected.joiningDate}   icon={<Calendar className="w-3 h-3" />} />
                  </div>
                </div>

                {/* Compliance */}
                <div className="bg-card border border-theme rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-theme bg-app flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-main uppercase tracking-wide">Compliance</span>
                  </div>
                  <div className="px-4 py-1">
                    <InfoRow label="Tax Regime"    value={selected.taxRegime}     icon={<FileText className="w-3 h-3" />} />
                    <InfoRow label="PF Number"     value={<span className="font-mono">{selected.pfNumber}</span>} icon={<Shield className="w-3 h-3" />} />
                    <InfoRow label="Bank Account"  value={<span className="font-mono text-[10px]">{selected.bankAccount}</span>} icon={<Banknote className="w-3 h-3" />} />
                    <InfoRow label="Working Days"  value={`${selected.workingDays} days`} icon={<Calendar className="w-3 h-3" />} />
                    <InfoRow label="Paid Days"     value={`${selected.paidDays} days`}    icon={<CheckCircle className="w-3 h-3" />} />
                  </div>
                </div>

                {/* Pay summary */}
                <div className="bg-card border border-theme rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-theme bg-app flex items-center gap-2">
                    <Banknote className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-main uppercase tracking-wide">Pay Summary</span>
                  </div>
                  <div className="px-4 pt-4 pb-3">
                    {/* Net pay hero */}
                    <div className="text-center mb-4">
                      <p className="text-[9px] text-muted uppercase tracking-widest mb-1">Net Pay</p>
                      <p className="text-2xl font-bold font-mono text-primary">₹{selected.netPay.toLocaleString("en-IN")}</p>
                    </div>
                    {/* Bar */}
                    <div className="w-full h-1.5 rounded-full bg-app overflow-hidden flex mb-1">
                      <div className="h-full bg-[var(--success)] rounded-l-full" style={{ width: `${netPct}%` }} />
                      <div className="h-full bg-red-400 rounded-r-full" style={{ width: `${100 - netPct}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] mb-4">
                      <span className="text-[var(--success)] font-semibold">Net {netPct}%</span>
                      <span className="text-red-400 font-semibold">Ded. {100 - netPct}%</span>
                    </div>
                    {/* Lines */}
                    <InfoRow label="Gross Pay"       value={<span className="font-mono">₹{selected.grossPay.toLocaleString("en-IN")}</span>} />
                    <InfoRow label="Total Deductions" value={<span className="font-mono text-red-400">−₹{totalDeductions.toLocaleString("en-IN")}</span>} />
                    <InfoRow label="Payment Status"   value={<StatusPill status={selected.status} />} />
                    {selected.paymentDate && (
                      <InfoRow label="Payment Date" value={selected.paymentDate} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PAY BREAKDOWN */}
            {activeSection === "payroll" && (
              <div className="grid grid-cols-2 gap-4">
                {/* Earnings */}
                <div className="bg-card border border-theme rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-theme bg-app flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--success)]" />
                    <span className="text-xs font-bold text-main uppercase tracking-wide">Earnings</span>
                  </div>
                  <div className="px-4 py-1">
                    {[
                      { label: "Basic Salary",  value: selected.basicSalary },
                      { label: "HRA",           value: selected.hra },
                      { label: "Allowances",    value: selected.allowances },
                      ...(selected.arrears > 0 ? [{ label: "Arrears", value: selected.arrears }] : []),
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-theme last:border-0">
                        <span className="text-xs text-muted">{item.label}</span>
                        <span className="text-xs font-semibold font-mono text-main">₹{item.value.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mx-4 mb-4 px-4 py-3 rounded-lg bg-[color-mix(in_srgb,var(--success)_8%,transparent)] border border-[color-mix(in_srgb,var(--success)_20%,transparent)]">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-[var(--success)]">Gross Pay</span>
                      <span className="text-sm font-bold font-mono text-[var(--success)]">₹{selected.grossPay.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-card border border-theme rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-theme bg-app flex items-center gap-2">
                    <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-xs font-bold text-main uppercase tracking-wide">Deductions</span>
                  </div>
                  <div className="px-4 py-1">
                    {[
                      { label: `Income Tax (${selected.taxRegime})`, value: selected.taxDeduction },
                      { label: "Provident Fund",                      value: selected.pfDeduction },
                      { label: "Other Deductions",                    value: selected.otherDeductions },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-theme last:border-0">
                        <span className="text-xs text-muted">{item.label}</span>
                        <span className="text-xs font-semibold font-mono text-red-400">−₹{item.value.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mx-4 mb-4 px-4 py-3 rounded-lg bg-[color-mix(in_srgb,#ef4444_8%,transparent)] border border-[color-mix(in_srgb,#ef4444_20%,transparent)]">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-red-400">Total Deducted</span>
                      <span className="text-sm font-bold font-mono text-red-400">−₹{totalDeductions.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Net pay across full width */}
                <div className="col-span-2 flex items-center justify-between px-6 py-4 bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] rounded-xl">
                  <div>
                    <p className="text-xs text-primary font-semibold mb-0.5">Total Net Pay</p>
                    <p className="text-[10px] text-muted">Gross Earnings − Total Deductions</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusPill status={selected.status} />
                    <span className="text-2xl font-bold font-mono text-primary">₹{selected.netPay.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENTS */}
            {activeSection === "documents" && (
              <div className="space-y-3 max-w-2xl">
                <p className="text-xs text-muted mb-4">All payroll documents for {selected.employeeName}</p>
                {[
                  { label: "Salary Slip — Current Month", sub: `Generated for ${new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`, status: selected.status },
                  { label: "Form 16 — FY 2024–25",         sub: "Annual tax certificate", status: "Paid" },
                  { label: "PF Statement",                  sub: "Provident fund contribution record", status: "Paid" },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3.5 bg-card border border-theme rounded-xl hover:border-primary transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-main">{doc.label}</p>
                        <p className="text-[10px] text-muted">{doc.sub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={doc.status} />
                      <button
                        onClick={() => i === 0 && onViewPayslip(selected)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-app border border-theme rounded-lg text-xs text-muted hover:text-primary hover:border-primary transition opacity-0 group-hover:opacity-100"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};