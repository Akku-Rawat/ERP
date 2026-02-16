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
  Eye,
} from "lucide-react";
import type { PayrollRecord } from "./types";
import { calculateDeductions } from "./utils";

interface PayrollTableProps {
  records: PayrollRecord[];
  expandedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onViewPayslip: (record: PayrollRecord) => void;
  onEditRecord: (record: PayrollRecord) => void;
  onViewRunDetails?: (record: PayrollRecord) => void;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({
  records,
  expandedRows,
  onToggleRow,
  onViewPayslip,
  onEditRecord,
  onViewRunDetails,
}) => {
  return (
    <div className="bg-card rounded-xl border border-theme shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="table-head border-b border-theme">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Employee
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase">
              Department
            </th>
            <th className="px-4 py-4 text-center text-xs font-semibold uppercase">
              Attendance
            </th>
            <th className="px-4 py-4 text-right text-xs font-semibold uppercase">
              Gross
            </th>
            <th className="px-4 py-4 text-right text-xs font-semibold uppercase">
              Deductions
            </th>
            <th className="px-4 py-4 text-right text-xs font-semibold uppercase">
              Net Pay
            </th>
            <th className="px-4 py-4 text-center text-xs font-semibold uppercase">
              Status
            </th>
            <th className="px-4 py-4 text-center text-xs font-semibold uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => {
            const expanded = expandedRows.has(record.id);
            const totalDeductions = calculateDeductions(record);

            return (
              <React.Fragment key={record.id}>
                <tr
                  onClick={() => onToggleRow(record.id)}
                  className="border-b border-theme row-hover cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {expanded ? (
                        <ChevronUp className="w-4 h-4 text-muted" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted" />
                      )}
                      <div>
                        <p className="font-semibold text-main">
                          {record.employeeName}
                        </p>
                        <p className="text-xs text-muted">
                          {record.employeeId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-main">
                    {record.department}
                  </td>

                  <td className="px-4 py-4 text-center text-sm font-medium text-main">
                    {record.paidDays}/{record.workingDays}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-main">
                    ₹{record.grossPay.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-danger">
                    -₹{totalDeductions.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-right font-bold text-success">
                    ₹{record.netPay.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === "Paid"
                          ? "bg-success text-white"
                          : record.status === "Pending"
                            ? "bg-warning text-white"
                            : record.status === "Approved"
                              ? "bg-info text-white"
                              : "bg-danger text-white"
                      }`}
                    >
                      {record.status === "Paid" && (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      {record.status === "Pending" && (
                        <Clock className="w-3 h-3" />
                      )}
                      {record.status}
                    </span>
                  </td>

                  <td
                    className="px-4 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-center gap-2">
                      {onViewRunDetails && (
                        <button
                          onClick={() => onViewRunDetails(record)}
                          className="p-2 rounded-lg text-primary row-hover"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onViewPayslip(record)}
                        className="p-2 rounded-lg text-info row-hover"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      {record.status !== "Paid" && (
                        <button
                          onClick={() => onEditRecord(record)}
                          className="p-2 rounded-lg text-muted row-hover"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {expanded && (
                  <tr className="bg-app border-b border-theme">
                    <td colSpan={8} className="px-6 py-8">
                      <div className="grid grid-cols-4 gap-6 mb-8">
                        <InfoCard title="Employee Details" icon={Users}>
                          <InfoRow
                            label="Designation"
                            value={record.designation}
                          />
                          <InfoRow label="Grade" value={record.grade} badge />
                          <InfoRow label="PAN" value={record.panNumber} />
                        </InfoCard>

                        <InfoCard title="Attendance" icon={Calendar}>
                          <InfoRow
                            label="Working Days"
                            value={record.workingDays}
                          />
                          <InfoRow label="Paid Days" value={record.paidDays} />
                          <InfoRow
                            label="LOP Days"
                            value={record.absentDays + record.leaveDays}
                            danger
                          />
                        </InfoCard>

                        <InfoCard title="Bank Details" icon={CreditCard}>
                          <InfoRow
                            label="Account No."
                            value={record.bankAccount}
                          />
                          <InfoRow label="IFSC" value={record.ifscCode} />
                        </InfoCard>

                        <InfoCard title="Tax Regime" icon={DollarSign}>
                          <InfoRow
                            label="Regime"
                            value={record.taxRegime}
                            badge
                          />
                          <InfoRow
                            label="Taxable Income"
                            value={`₹${(record.taxableIncome / 1000).toFixed(
                              0,
                            )}K / year`}
                          />
                        </InfoCard>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <SectionCard
                          title="Earnings Breakdown"
                          icon={TrendingUp}
                          color="green"
                        >
                          <MoneyRow
                            label="Basic Salary"
                            value={record.basicSalary}
                          />
                          <MoneyRow label="HRA" value={record.hra} />
                          <MoneyRow
                            label="Allowances"
                            value={record.allowances}
                          />
                          {record.overtimePay > 0 && (
                            <MoneyRow
                              label="Overtime"
                              value={record.overtimePay}
                              highlight
                            />
                          )}
                          {record.totalBonus > 0 && (
                            <MoneyRow
                              label="Bonus"
                              value={record.totalBonus}
                              highlight
                            />
                          )}
                          {record.arrears > 0 && (
                            <MoneyRow
                              label="Arrears"
                              value={record.arrears}
                              highlight
                            />
                          )}
                          <Divider />
                          <MoneyRow
                            label="Gross Pay"
                            value={record.grossPay}
                            bold
                          />
                        </SectionCard>

                        <SectionCard
                          title="Deductions Breakdown"
                          icon={AlertCircle}
                          color="red"
                        >
                          <MoneyRow
                            label={`Income Tax (${record.taxRegime})`}
                            value={record.taxDeduction}
                          />
                          <MoneyRow
                            label="Provident Fund"
                            value={record.pfDeduction}
                          />
                          {record.esiDeduction > 0 && (
                            <MoneyRow label="ESI" value={record.esiDeduction} />
                          )}
                          <MoneyRow
                            label="Professional Tax"
                            value={record.professionalTax}
                          />
                          {record.loanDeduction > 0 && (
                            <MoneyRow
                              label="Loan EMI"
                              value={record.loanDeduction}
                            />
                          )}
                          {record.advanceDeduction > 0 && (
                            <MoneyRow
                              label="Advance Recovery"
                              value={record.advanceDeduction}
                            />
                          )}
                          <MoneyRow
                            label="Other Deductions"
                            value={record.otherDeductions}
                          />
                          <Divider />
                          <MoneyRow
                            label="Total Deductions"
                            value={totalDeductions}
                            bold
                            negative
                          />
                          <Divider />
                          <NetPay value={record.netPay} />
                        </SectionCard>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const InfoCard = ({ title, icon: Icon, children }: any) => (
  <div className="bg-card border border-theme rounded-xl p-5 shadow-sm">
    <h4 className="font-bold mb-4 flex items-center gap-2 text-main">
      <Icon className="w-5 h-5 text-info" />
      {title}
    </h4>
    <div className="space-y-2 text-sm">{children}</div>
  </div>
);

const InfoRow = ({ label, value, badge, danger }: any) => (
  <div className="flex justify-between">
    <span className="text-muted">{label}</span>
    <span
      className={`font-semibold ${
        danger ? "text-danger" : "text-main"
      } ${badge ? "px-2 py-0.5 bg-info text-white rounded text-xs" : ""}`}
    >
      {value}
    </span>
  </div>
);

const SectionCard = ({ title, icon: Icon, children, color }: any) => (
  <div
    className={`rounded-xl border border-theme p-5 shadow-sm ${
      color === "green"
        ? "bg-success"
        : "bg-danger"
    }`}
  >
    <h4 className="font-bold mb-4 flex items-center gap-2 text-white">
      <Icon className="w-5 h-5" />
      {title}
    </h4>
    <div className="space-y-2 text-sm">{children}</div>
  </div>
);

const MoneyRow = ({ label, value, bold, highlight, negative }: any) => (
  <div
    className={`flex justify-between text-white ${
      highlight ? "bg-white/10 px-2 py-1 rounded" : ""
    }`}
  >
    <span>{label}</span>
    <span
      className={`font-${bold ? "bold" : "semibold"} ${
        negative ? "" : ""
      }`}
    >
      ₹{value.toLocaleString()}
    </span>
  </div>
);

const Divider = () => <div className="border-t border-white/20 my-2" />;

const NetPay = ({ value }: any) => (
  <div className="bg-card text-success rounded-lg px-4 py-3 mt-3 flex justify-between items-center">
    <span className="font-semibold">Net Pay (Take Home)</span>
    <span className="text-xl font-bold">₹{value.toLocaleString()}</span>
  </div>
);