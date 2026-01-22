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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-100 border-b border-slate-300">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
              Employee
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase text-slate-600">
              Department
            </th>
            <th className="px-4 py-4 text-center text-xs font-semibold uppercase text-slate-600">
              Attendance
            </th>
            <th className="px-4 py-4 text-right text-xs font-semibold uppercase text-slate-600">
              Gross
            </th>
            <th className="px-4 py-4 text-right text-xs font-semibold uppercase text-slate-600">
              Deductions
            </th>
            <th className="px-4 py-4 text-right text-xs font-semibold uppercase text-slate-600">
              Net Pay
            </th>
            <th className="px-4 py-4 text-center text-xs font-semibold uppercase text-slate-600">
              Status
            </th>
            <th className="px-4 py-4 text-center text-xs font-semibold uppercase text-slate-600">
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
                {/* SUMMARY ROW */}
                <tr
                  onClick={() => onToggleRow(record.id)}
                  className="border-b hover:bg-slate-50 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {expanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-800">
                          {record.employeeName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {record.employeeId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-700">
                    {record.department}
                  </td>

                  <td className="px-4 py-4 text-center text-sm font-medium">
                    {record.paidDays}/{record.workingDays}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold">
                    ₹{record.grossPay.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-red-600">
                    -₹{totalDeductions.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-right font-bold text-green-600">
                    ₹{record.netPay.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : record.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : record.status === "Approved"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
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
                          className="p-2 rounded-lg text-purple-600 hover:bg-purple-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onViewPayslip(record)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      {record.status !== "Paid" && (
                        <button
                          onClick={() => onEditRecord(record)}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* EXPANDED DETAILS */}
                {expanded && (
                  <tr className="bg-slate-50 border-b">
                    <td colSpan={8} className="px-6 py-8">
                      {/* TOP INFO CARDS */}
                      <div className="grid grid-cols-4 gap-6 mb-8">
                        <InfoCard title="Employee Details" icon={Users}>
                          <InfoRow label="Designation" value={record.designation} />
                          <InfoRow label="Grade" value={record.grade} badge />
                          <InfoRow label="PAN" value={record.panNumber} />
                        </InfoCard>

                        <InfoCard title="Attendance" icon={Calendar}>
                          <InfoRow label="Working Days" value={record.workingDays} />
                          <InfoRow label="Paid Days" value={record.paidDays} />
                          <InfoRow
                            label="LOP Days"
                            value={record.absentDays + record.leaveDays}
                            danger
                          />
                        </InfoCard>

                        <InfoCard title="Bank Details" icon={CreditCard}>
                          <InfoRow label="Account No." value={record.bankAccount} />
                          <InfoRow label="IFSC" value={record.ifscCode} />
                        </InfoCard>

                        <InfoCard title="Tax Regime" icon={DollarSign}>
                          <InfoRow label="Regime" value={record.taxRegime} badge />
                          <InfoRow
                            label="Taxable Income"
                            value={`₹${(record.taxableIncome / 1000).toFixed(
                              0
                            )}K / year`}
                          />
                        </InfoCard>
                      </div>

                      {/* EARNINGS & DEDUCTIONS */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* Earnings */}
                        <SectionCard
                          title="Earnings Breakdown"
                          icon={TrendingUp}
                          color="green"
                        >
                          <MoneyRow label="Basic Salary" value={record.basicSalary} />
                          <MoneyRow label="HRA" value={record.hra} />
                          <MoneyRow label="Allowances" value={record.allowances} />
                          {record.overtimePay > 0 && (
                            <MoneyRow label="Overtime" value={record.overtimePay} highlight />
                          )}
                          {record.totalBonus > 0 && (
                            <MoneyRow label="Bonus" value={record.totalBonus} highlight />
                          )}
                          {record.arrears > 0 && (
                            <MoneyRow label="Arrears" value={record.arrears} highlight />
                          )}
                          <Divider />
                          <MoneyRow
                            label="Gross Pay"
                            value={record.grossPay}
                            bold
                          />
                        </SectionCard>

                        {/* Deductions */}
                        <SectionCard
                          title="Deductions Breakdown"
                          icon={AlertCircle}
                          color="red"
                        >
                          <MoneyRow
                            label={`Income Tax (${record.taxRegime})`}
                            value={record.taxDeduction}
                          />
                          <MoneyRow label="Provident Fund" value={record.pfDeduction} />
                          {record.esiDeduction > 0 && (
                            <MoneyRow label="ESI" value={record.esiDeduction} />
                          )}
                          <MoneyRow
                            label="Professional Tax"
                            value={record.professionalTax}
                          />
                          {record.loanDeduction > 0 && (
                            <MoneyRow label="Loan EMI" value={record.loanDeduction} />
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

/* ---------- Reusable ERP UI Components ---------- */

const InfoCard = ({ title, icon: Icon, children }: any) => (
  <div className="bg-white border rounded-xl p-5 shadow-sm">
    <h4 className="font-bold mb-4 flex items-center gap-2">
      <Icon className="w-5 h-5 text-blue-600" />
      {title}
    </h4>
    <div className="space-y-2 text-sm">{children}</div>
  </div>
);

const InfoRow = ({ label, value, badge, danger }: any) => (
  <div className="flex justify-between">
    <span className="text-slate-600">{label}</span>
    <span
      className={`font-semibold ${
        danger ? "text-red-600" : ""
      } ${badge ? "px-2 py-0.5 bg-blue-100 rounded text-xs" : ""}`}
    >
      {value}
    </span>
  </div>
);

const SectionCard = ({ title, icon: Icon, children, color }: any) => (
  <div
    className={`rounded-xl border p-5 shadow-sm ${
      color === "green"
        ? "bg-green-50 border-green-200"
        : "bg-red-50 border-red-200"
    }`}
  >
    <h4 className="font-bold mb-4 flex items-center gap-2">
      <Icon className="w-5 h-5" />
      {title}
    </h4>
    <div className="space-y-2 text-sm">{children}</div>
  </div>
);

const MoneyRow = ({ label, value, bold, highlight, negative }: any) => (
  <div
    className={`flex justify-between ${
      highlight ? "bg-white/60 px-2 py-1 rounded" : ""
    }`}
  >
    <span>{label}</span>
    <span
      className={`font-${bold ? "bold" : "semibold"} ${
        negative ? "text-red-600" : ""
      }`}
    >
      ₹{value.toLocaleString()}
    </span>
  </div>
);

const Divider = () => <div className="border-t my-2" />;

const NetPay = ({ value }: any) => (
  <div className="bg-emerald-600 text-white rounded-lg px-4 py-3 mt-3 flex justify-between items-center">
    <span className="font-semibold">Net Pay (Take Home)</span>
    <span className="text-xl font-bold">₹{value.toLocaleString()}</span>
  </div>
);
