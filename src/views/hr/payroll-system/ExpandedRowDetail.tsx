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
    <tr className="bg-app border-b-2 border-primary">
      <td colSpan={7} className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8 mb-6">
            <div className="bg-card rounded-xl shadow-sm border border-theme p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-theme">
                <Users className="w-5 h-5 text-info" />
                <h4 className="font-bold text-main">Employee Details</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Designation:</span>
                  <span className="text-sm font-semibold text-main">
                    {record.designation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Grade:</span>
                  <span className="px-2 py-1 bg-info text-white text-xs font-bold rounded">
                    {record.grade}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Joining:</span>
                  <span className="text-sm font-semibold text-main">
                    {record.joiningDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Bank:</span>
                  <span className="text-xs font-semibold text-main">
                    {record.bankAccount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">PF:</span>
                  <span className="text-xs font-semibold text-main">
                    {record.pfNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-success rounded-xl shadow-sm border border-theme p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/20">
                <TrendingUp className="w-5 h-5 text-white" />
                <h4 className="font-bold text-white">Earnings</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white">Basic:</span>
                  <span className="text-sm font-bold text-white">
                    ₹{record.basicSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white">HRA:</span>
                  <span className="text-sm font-bold text-white">
                    ₹{record.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white">Allowances:</span>
                  <span className="text-sm font-bold text-white">
                    ₹{record.allowances.toLocaleString()}
                  </span>
                </div>
                {record.arrears > 0 && (
                  <div className="flex justify-between bg-white/10 -mx-2 px-2 py-2 rounded">
                    <span className="text-sm text-white font-medium">
                      Arrears:
                    </span>
                    <span className="text-sm font-bold text-white">
                      ₹{record.arrears.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-white/30 bg-white/10 -mx-2 px-2 py-2.5 rounded">
                  <span className="font-bold text-white">Gross:</span>
                  <span className="text-lg font-bold text-white">
                    ₹{record.grossPay.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-danger rounded-xl shadow-sm border border-theme p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/20">
                <AlertCircle className="w-5 h-5 text-white" />
                <h4 className="font-bold text-white">Deductions</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white">
                    Tax ({record.taxRegime}):
                  </span>
                  <span className="text-sm font-bold text-white">
                    ₹{record.taxDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white">PF:</span>
                  <span className="text-sm font-bold text-white">
                    ₹{record.pfDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white">Other:</span>
                  <span className="text-sm font-bold text-white">
                    ₹{record.otherDeductions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-white/30 bg-white/10 -mx-2 px-2 py-2.5 rounded">
                  <span className="font-bold text-white">Total:</span>
                  <span className="text-lg font-bold text-white">
                    -₹{totalDeductions.toLocaleString()}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-white/30">
                  <div className="bg-card -mx-2 px-3 py-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-success">
                        Net Pay:
                      </span>
                      <span className="text-2xl font-bold text-success">
                        ₹{record.netPay.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-theme p-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-info" />
                <span className="text-sm text-main">
                  Working: <strong>{record.workingDays}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm text-main">
                  Paid: <strong>{record.paidDays}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted" />
                <span className="text-sm text-main">
                  Created:{" "}
                  <strong>
                    {new Date(record.createdDate).toLocaleDateString()}
                  </strong>
                </span>
              </div>
            </div>
            <button
              onClick={onCollapse}
              className="text-sm text-primary hover:text-[var(--primary-600)] font-medium flex items-center gap-1"
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