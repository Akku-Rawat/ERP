import React from "react";
import { X, Download, Mail, CheckCircle } from "lucide-react";
import type { PayrollRecord } from "./types";

interface PayslipModalProps {
  show: boolean;
  record: PayrollRecord | null;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  show,
  record,
  onClose,
}) => {
  if (!show || !record) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Salary Slip</h2>
              <p className="text-teal-100 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-200">
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">
                Employee ID
              </p>
              <p className="font-semibold text-slate-800">
                {record.employeeId}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">Name</p>
              <p className="font-semibold text-slate-800">
                {record.employeeName}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">
                Designation
              </p>
              <p className="font-semibold text-slate-800">
                {record.designation}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">
                Department
              </p>
              <p className="font-semibold text-slate-800">
                {record.department}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">
                Joining Date
              </p>
              <p className="font-semibold text-slate-800">
                {record.joiningDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">PF Number</p>
              <p className="font-semibold text-slate-800">{record.pfNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="font-bold text-green-800 mb-4">Earnings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Basic</span>
                  <span className="font-semibold">
                    ₹{record.basicSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>HRA</span>
                  <span className="font-semibold">
                    ₹{record.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Allowances</span>
                  <span className="font-semibold">
                    ₹{record.allowances.toLocaleString()}
                  </span>
                </div>
                {record.arrears > 0 && (
                  <div className="flex justify-between bg-amber-100 -mx-3 px-3 py-2 rounded">
                    <span className="font-medium text-amber-800">Arrears</span>
                    <span className="font-bold text-amber-700">
                      ₹{record.arrears.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-green-200">
                  <span className="font-bold">Gross</span>
                  <span className="font-bold text-green-700">
                    ₹{record.grossPay.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="font-bold text-red-800 mb-4">Deductions</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Tax ({record.taxRegime})</span>
                  <span className="font-semibold">
                    ₹{record.taxDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>PF</span>
                  <span className="font-semibold">
                    ₹{record.pfDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Other</span>
                  <span className="font-semibold">
                    ₹{record.otherDeductions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-red-200">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-red-700">
                    ₹
                    {(
                      record.taxDeduction +
                      record.pfDeduction +
                      record.otherDeductions
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-teal-100 text-sm mb-1">Net Salary</p>
                <p className="text-4xl font-bold">
                  ₹{record.netPay.toLocaleString()}
                </p>
              </div>
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold flex items-center gap-2">
                {record.status === "Paid" && (
                  <CheckCircle className="w-4 h-4" />
                )}
                {record.status}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
          <button
            onClick={() => alert("Downloaded")}
            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
          <button
            onClick={() => alert(`Sent to ${record.email}`)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Email
          </button>
        </div>
      </div>
    </div>
  );
};
