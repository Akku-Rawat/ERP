import React from "react";
import { ChevronUp, ArrowRight } from "lucide-react";
import type { PayrollRecord } from "./types";

interface ExpandedRowDetailProps {
  record: PayrollRecord;
  onCollapse: () => void;
  onViewDetails: (record: PayrollRecord) => void;
}

export const ExpandedRowDetail: React.FC<ExpandedRowDetailProps> = ({
  record,
  onCollapse,
  onViewDetails,
}) => {
  const totalDed = record.taxDeduction + record.pfDeduction + record.otherDeductions;

  return (
  <tr>
    <td
      colSpan={7}
      className="border-b border-theme bg-app"
    >
      <div className="px-8 py-6">

        {/* Top Summary Strip */}
        <div className="flex items-end justify-between border-b border-theme pb-5 mb-6">

          <div className="flex gap-12">

            <SummaryItem
              label="Gross Pay"
              value={record.grossPay}
            />

            <SummaryItem
              label="Total Deductions"
              value={totalDed}
              danger
            />

            <SummaryItem
              label="Net Pay"
              value={record.netPay}
              success
              large
            />

          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onViewDetails(record)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:opacity-90 transition"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onCollapse}
              className="flex items-center gap-1 px-4 py-2 text-sm border border-theme rounded-lg text-muted hover:text-main transition"
            >
              <ChevronUp className="w-4 h-4" />
              Collapse
            </button>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-3 gap-12 text-sm">

          {/* Earnings */}
          <FinancialBlock title="Earnings">
            <MoneyRow label="Basic Salary" value={record.basicSalary} />
            <MoneyRow label="HRA" value={record.hra} />
            <MoneyRow label="Allowances" value={record.allowances} />

            {record.arrears > 0 && (
              <MoneyRow label="Arrears" value={record.arrears} highlight />
            )}
          </FinancialBlock>

          {/* Deductions */}
          <FinancialBlock title="Deductions">
            <MoneyRow label="Income Tax" value={record.taxDeduction} danger />
            <MoneyRow label="Provident Fund" value={record.pfDeduction} danger />
            <MoneyRow label="Other Deductions" value={record.otherDeductions} danger />
          </FinancialBlock>

          {/* Attendance */}
          <FinancialBlock title="Attendance">
            <MetaRow
              label="Paid Days"
              value={`${record.paidDays}/${record.workingDays}`}
            />
            <MetaRow
              label="Absent / Leave"
              value={record.absentDays + record.leaveDays}
            />
          </FinancialBlock>

        </div>
      </div>
    </td>
  </tr>
);

};
const SummaryItem = ({ label, value, danger, success, large }: any) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-muted mb-1">
      {label}
    </p>
    <p
      className={`font-mono ${
        large ? "text-2xl font-bold" : "text-lg font-semibold"
      } ${
        danger
          ? "text-danger"
          : success
          ? "text-success"
          : "text-main"
      }`}
    >
      ₹{value.toLocaleString("en-IN")}
    </p>
  </div>
);

const FinancialBlock = ({ title, children }: any) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
      {title}
    </p>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const MoneyRow = ({ label, value, danger, highlight }: any) => (
  <div
    className={`flex justify-between items-center ${
      highlight ? "bg-warning/10 px-2 py-1 rounded" : ""
    }`}
  >
    <span className="text-muted">{label}</span>
    <span
      className={`font-mono font-semibold ${
        danger ? "text-danger" : "text-main"
      }`}
    >
      ₹{value.toLocaleString("en-IN")}
    </span>
  </div>
);

const MetaRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center">
    <span className="text-muted">{label}</span>
    <span className="font-semibold text-main">{value}</span>
  </div>
);
