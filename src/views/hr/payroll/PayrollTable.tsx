import React from "react";
import { Eye, CheckCircle, XCircle, Plus } from "lucide-react";
import type { PayrollRecord } from "../payroll/types";
import { getStatusColor } from "./utils";

interface PayrollTableProps {
  records: PayrollRecord[];
  onViewPayslip: (record: PayrollRecord) => void;
  onAddBonus?: (record: PayrollRecord) => void; // NEW optional handler
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Paid":
      return <CheckCircle className="w-4 h-4" />;
    case "Failed":
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

export const PayrollTable: React.FC<PayrollTableProps> = ({
  records,
  onViewPayslip,
  onAddBonus,
  totalGrossPay,
  totalDeductions,
  totalNetPay,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Employee
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Department
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Designation
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Grade
              </th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Gross Pay
              </th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Deductions
              </th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Net Pay
              </th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {records.map((record) => {
              const bonusTotal = (record.bonuses || []).reduce(
                (s, b) => s + (b.amount || 0),
                0,
              );
              return (
                <tr
                  key={record.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-800">
                        {record.employeeName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {record.employeeId}
                      </p>

                      {/* Bonuses breakdown (if present) */}
                      {record.bonuses && record.bonuses.length > 0 && (
                        <div className="mt-2 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500">Bonuses</span>
                            <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                              + ₹{bonusTotal.toLocaleString()}
                            </span>
                          </div>
                          <div className="mt-1 space-y-1">
                            {record.bonuses.map((b) => (
                              <div
                                key={b.id}
                                className="flex items-center justify-between text-xs text-slate-600"
                              >
                                <div>
                                  {b.label}
                                  {b.approved ? " • approved" : " • pending"}
                                </div>
                                <div className="font-medium">
                                  + ₹{b.amount.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6 text-sm text-slate-700">
                    {record.department}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-700">
                    {record.designation}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-700">
                    {record.grade}
                  </td>

                  <td className="py-4 px-6 text-right font-semibold text-slate-800">
                    ₹{record.grossPay.toLocaleString()}
                    {/* If bonuses present show small hint (gross already includes bonus if parent updated it) */}
                    {bonusTotal > 0 && (
                      <div className="text-xs text-slate-400 mt-1">
                        Includes bonus: ₹{bonusTotal.toLocaleString()}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right text-red-600 font-medium">
                    -₹
                    {(
                      record.taxDeduction +
                      record.pfDeduction +
                      record.otherDeductions
                    ).toLocaleString()}
                  </td>

                  <td className="py-4 px-6 text-right font-bold text-emerald-600">
                    ₹{record.netPay.toLocaleString()}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}
                    >
                      {getStatusIcon(record.status)}
                      {record.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onViewPayslip(record)}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View Payslip"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* + Bonus button appears only if handler provided and record is not Paid */}
                      {onAddBonus && record.status !== "Paid" && (
                        <button
                          onClick={() => onAddBonus(record)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1 text-sm"
                          title="Add Bonus"
                        >
                          <Plus className="w-4 h-4" />{" "}
                          <span className="hidden sm:inline">+ Bonus</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-slate-50 border-t-2 border-slate-300 p-6">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-slate-600 text-sm font-medium mb-1">
              Total Gross Pay
            </p>
            <p className="text-2xl font-bold text-slate-800">
              ₹{totalGrossPay.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-slate-600 text-sm font-medium mb-1">
              Total Deductions
            </p>
            <p className="text-2xl font-bold text-red-600">
              ₹{totalDeductions.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-slate-600 text-sm font-medium mb-1">
              Total Net Pay
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{totalNetPay.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
