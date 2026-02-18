import React from "react";
import {
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Clock,
  FileText,
  Edit2,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  DollarSign,
} from "lucide-react";
import type { PayrollRecord } from "./types";
import { calculateDeductions } from "./utils";
import { ExpandedRowDetail } from "./ExpandedRowDetail";


interface PayrollTableProps {
  records: PayrollRecord[];
  expandedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onViewPayslip: (record: PayrollRecord) => void;
  onEditRecord: (record: PayrollRecord) => void;
  onViewDetails: (record: PayrollRecord) => void;
  onViewRunDetails?: (record: PayrollRecord) => void;
}

// ── Status pill ───────────────────────────────────────────────────────────────
const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    Paid:       "bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)]",
    Pending:    "bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] text-[var(--warning)]",
    Processing: "bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-primary",
    Approved:   "bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)]",
    Rejected:   "bg-[color-mix(in_srgb,#ef4444_12%,transparent)] text-red-400",
    Draft:      "bg-app text-muted",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${map[status] ?? "bg-app text-muted"}`}>
      {status === "Paid"    && <CheckCircle className="w-3 h-3" />}
      {status === "Pending" && <Clock       className="w-3 h-3" />}
      {status}
    </span>
  );
};

export const PayrollTable: React.FC<PayrollTableProps> = ({
  records,
  expandedRows,
  onToggleRow,
  onViewPayslip,
  onEditRecord,
  onViewDetails,
}) => {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted gap-3">
        <Users className="w-8 h-8 opacity-20" />
        <p className="text-sm">No payroll records found</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="sticky top-0 z-10 bg-card border-b border-theme">
        <tr>
          <th className="px-6 py-3 text-left text-[11px] font-bold text-muted uppercase tracking-wide">Employee</th>
          <th className="px-4 py-3 text-left text-[11px] font-bold text-muted uppercase tracking-wide">Department</th>
          <th className="px-4 py-3 text-center text-[11px] font-bold text-muted uppercase tracking-wide">Attendance</th>
          <th className="px-4 py-3 text-right text-[11px] font-bold text-muted uppercase tracking-wide">Gross</th>
          <th className="px-4 py-3 text-right text-[11px] font-bold text-muted uppercase tracking-wide">Deductions</th>
          <th className="px-4 py-3 text-right text-[11px] font-bold text-muted uppercase tracking-wide">Net Pay</th>
          <th className="px-4 py-3 text-center text-[11px] font-bold text-muted uppercase tracking-wide">Status</th>
          <th className="px-4 py-3 text-center text-[11px] font-bold text-muted uppercase tracking-wide">Actions</th>
        </tr>
      </thead>

      <tbody>
        {records.map((record) => {
          const expanded = expandedRows.has(record.id);
          const totalDeductions = calculateDeductions(record);

          return (
            <React.Fragment key={record.id}>
              {/* ── Main row ── */}
              <tr
                onClick={() => onToggleRow(record.id)}
                className={`border-b border-theme cursor-pointer transition-colors hover:bg-app ${expanded ? "bg-[color-mix(in_srgb,var(--primary)_3%,transparent)]" : ""}`}
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className={`transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-3.5 h-3.5 text-muted" />
                    </span>
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                      {record.employeeName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-main leading-tight">{record.employeeName}</p>
                      <p className="text-[11px] text-muted">{record.employeeId}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3.5">
                  <span className="text-xs text-main">{record.department}</span>
                </td>

                <td className="px-4 py-3.5 text-center">
                  <span className="text-xs font-mono font-semibold text-main">{record.paidDays}</span>
                  <span className="text-xs text-muted">/{record.workingDays}</span>
                </td>

                <td className="px-4 py-3.5 text-right">
                  <span className="text-xs font-mono font-semibold text-main">₹{record.grossPay.toLocaleString("en-IN")}</span>
                </td>

                <td className="px-4 py-3.5 text-right">
                  <span className="text-xs font-mono font-semibold text-red-400">−₹{totalDeductions.toLocaleString("en-IN")}</span>
                </td>

                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm font-mono font-bold text-[var(--success)]">₹{record.netPay.toLocaleString("en-IN")}</span>
                </td>

                <td className="px-4 py-3.5 text-center">
                  <StatusPill status={record.status} />
                </td>

                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center items-center gap-1">
                    <button
                      onClick={() => onViewPayslip(record)}
                      title="View Payslip"
                      className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    {record.status !== "Paid" && (
                      <button
                        onClick={() => onEditRecord(record)}
                        title="Edit"
                        className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-app transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>

              {/* ── Expanded detail row ── */}
              {expanded && (
                <ExpandedRowDetail
                  record={record}
                  onCollapse={() => onToggleRow(record.id)}
                  onViewDetails={onViewDetails}
                />
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};