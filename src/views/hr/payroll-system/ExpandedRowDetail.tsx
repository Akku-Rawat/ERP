import React from "react";
import {
  Users,
  TrendingUp,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  ChevronUp,
} from "lucide-react";
import type { PayrollRecord } from "./types";

interface ExpandedRowDetailProps {
  record: PayrollRecord;
  onCollapse: () => void;
}

export const ExpandedRowDetail: React.FC<ExpandedRowDetailProps> = ({
  record,
  onCollapse,
}) => {
  const totalDeductions =
    record.taxDeduction + record.pfDeduction + record.otherDeductions;

  return (
    <tr className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-b-2 border-blue-200">
      <td colSpan={7} className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8 mb-6">
            {/* Employee Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                <Users className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-800">Employee Details</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Designation:</span>
                  <span className="text-sm font-semibold">
                    {record.designation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Grade:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                    {record.grade}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Joining:</span>
                  <span className="text-sm font-semibold">
                    {record.joiningDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Bank:</span>
                  <span className="text-xs font-semibold">
                    {record.bankAccount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">PF:</span>
                  <span className="text-xs font-semibold">
                    {record.pfNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Earnings Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-200">
                <TrendingUp className="w-5 h-5 text-green-700" />
                <h4 className="font-bold text-green-800">Earnings</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-green-800">Basic:</span>
                  <span className="text-sm font-bold">
                    ₹{record.basicSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-800">HRA:</span>
                  <span className="text-sm font-bold">
                    ₹{record.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-800">Allowances:</span>
                  <span className="text-sm font-bold">
                    ₹{record.allowances.toLocaleString()}
                  </span>
                </div>
                {record.arrears > 0 && (
                  <div className="flex justify-between bg-amber-50 -mx-2 px-2 py-2 rounded">
                    <span className="text-sm text-amber-800 font-medium">
                      Arrears:
                    </span>
                    <span className="text-sm font-bold text-amber-700">
                      ₹{record.arrears.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-green-300 bg-green-100 -mx-2 px-2 py-2.5 rounded">
                  <span className="font-bold">Gross:</span>
                  <span className="text-lg font-bold text-green-700">
                    ₹{record.grossPay.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Deductions Card */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-sm border border-red-200 p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-red-200">
                <AlertCircle className="w-5 h-5 text-red-700" />
                <h4 className="font-bold text-red-800">Deductions</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-red-800">
                    Tax ({record.taxRegime}):
                  </span>
                  <span className="text-sm font-bold">
                    ₹{record.taxDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-red-800">PF:</span>
                  <span className="text-sm font-bold">
                    ₹{record.pfDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-red-800">Other:</span>
                  <span className="text-sm font-bold">
                    ₹{record.otherDeductions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-red-300 bg-red-100 -mx-2 px-2 py-2.5 rounded">
                  <span className="font-bold">Total:</span>
                  <span className="text-lg font-bold text-red-700">
                    -₹{totalDeductions.toLocaleString()}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-slate-300">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 -mx-2 px-3 py-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-white">
                        Net Pay:
                      </span>
                      <span className="text-2xl font-bold text-white">
                        ₹{record.netPay.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm">
                  Working: <strong>{record.workingDays}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">
                  Paid: <strong>{record.paidDays}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm">
                  Created:{" "}
                  <strong>
                    {new Date(record.createdDate).toLocaleDateString()}
                  </strong>
                </span>
              </div>
            </div>
            <button
              onClick={onCollapse}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <ChevronUp className="w-4 h-4" />
              Collapse
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};
