// PayrollTable.tsx
import React from "react";
import { ChevronDown, CheckCircle, Clock, FileText, Edit2, Users, RefreshCw } from "lucide-react";
import type { PayrollRecord } from "../../../types/payrolltypes";
import { calculateDeductions, fmtINR } from "./utils";
import { ExpandedRowDetail } from "./ExpandedRowDetail";

interface PayrollTableProps {
  records: PayrollRecord[];
  expandedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onViewPayslip: (record: PayrollRecord) => void;
  onEditRecord: (record: PayrollRecord) => void;
  onViewDetails: (record: PayrollRecord) => void;
}

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    Paid:       "bg-success/10 text-success",
    Pending:    "bg-warning/10 text-warning",
    Processing: "bg-primary/10 text-primary",
    Approved:   "bg-success/10 text-success",
    Rejected:   "bg-danger/10 text-danger",
    Draft:      "bg-app text-muted",
    Failed:     "bg-danger/10 text-danger",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${map[status] ?? "bg-app text-muted"}`}>
      {status === "Paid"       && <CheckCircle className="w-3 h-3" />}
      {status === "Pending"    && <Clock       className="w-3 h-3" />}
      {status === "Processing" && <RefreshCw   className="w-3 h-3 animate-spin" />}
      {status}
    </span>
  );
};

const Th: React.FC<{ children: React.ReactNode; align?: "left" | "right" | "center" }> = ({
  children, align = "left",
}) => (
  <th className={`px-4 py-3 text-[10px] font-extrabold text-muted uppercase tracking-wider whitespace-nowrap text-${align}`}>
    {children}
  </th>
);

export const PayrollTable: React.FC<PayrollTableProps> = ({
  records, expandedRows, onToggleRow, onViewPayslip, onEditRecord, onViewDetails,
}) => {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
        <Users className="w-10 h-10 opacity-20" />
        <p className="text-sm">No payroll records found</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="sticky top-0 z-10 bg-card border-b-2 border-theme">
        <tr>
          <Th>Employee</Th>
          <Th>Department</Th>
          <Th align="center">Attendance</Th>
          <Th align="right">Gross</Th>
          <Th align="right">Deductions</Th>
          <Th align="right">Net Pay</Th>
          <Th align="center">Status</Th>
          <Th align="center">Actions</Th>
        </tr>
      </thead>
      <tbody>
        {records.map(record => {
          const expanded     = expandedRows.has(record.id);
          const totalDed     = calculateDeductions(record);
          const initials     = record.employeeName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
          const attendancePct = record.workingDays > 0 ? (record.paidDays / record.workingDays) * 100 : 0;

          return (
            <React.Fragment key={record.id}>
              {/* Main row */}
              <tr
                onClick={() => onToggleRow(record.id)}
                className={`border-b border-theme cursor-pointer transition-colors ${
                  expanded ? "bg-primary/[0.03]" : "hover:bg-app"
                }`}
              >
                {/* Employee */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`transition-transform duration-150 shrink-0 ${expanded ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-3.5 h-3.5 text-muted" />
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-[11px] font-extrabold flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-main leading-tight">{record.employeeName}</p>
                      <p className="text-[10px] text-muted">{record.employeeId} · {record.grade}</p>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td className="px-4 py-3">
                  <span className="text-xs bg-app px-2 py-0.5 rounded-md font-medium text-main">{record.department}</span>
                </td>

                {/* Attendance with mini progress bar */}
                <td className="px-4 py-3 text-center">
                  <p className="text-xs font-extrabold text-main tabular-nums">
                    {record.paidDays}<span className="text-muted font-normal">/{record.workingDays}</span>
                  </p>
                  <div className="h-1.5 bg-theme rounded-full mt-1 w-16 mx-auto overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${attendancePct}%` }}
                    />
                  </div>
                </td>

                {/* Gross */}
                <td className="px-4 py-3 text-right">
                  <span className="text-xs font-bold text-main tabular-nums font-mono">₹{fmtINR(record.grossPay)}</span>
                </td>

                {/* Deductions */}
                <td className="px-4 py-3 text-right">
                  <span className="text-xs font-bold text-danger tabular-nums font-mono">−₹{fmtINR(totalDed)}</span>
                </td>

                {/* Net Pay */}
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-extrabold text-success tabular-nums font-mono">₹{fmtINR(record.netPay)}</span>
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  <StatusPill status={record.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onViewPayslip(record)}
                      title="View Payslip"
                      className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/8 transition border border-transparent hover:border-primary/20"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    {record.status !== "Paid" && (
                      <button
                        onClick={() => onEditRecord(record)}
                        title="Edit"
                        className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-app transition border border-transparent hover:border-theme"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>

              {/* Expanded row */}
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