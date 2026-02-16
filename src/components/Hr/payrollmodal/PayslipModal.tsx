// PayslipModal.tsx
import React, { useState } from "react";
import {
  X,
  CheckCircle,
  Download,
  Mail,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import type { PayrollRecord } from "../../../views/hr/payroll-system/types";

interface PayslipModalProps {
  record: PayrollRecord | null;
  onClose: () => void;
  onDownload: () => void;
  onEmail: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  record,
  onClose,
  onDownload,
  onEmail,
}) => {
  const [emailSent, setEmailSent] = useState(false);

  if (!record) return null;

  const handleEmail = () => {
    onEmail();
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-primary text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Salary Slip</h2>
              <p className="opacity-90 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 hover:bg-white/20 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-theme">
            <div>
              <p className="text-xs text-muted uppercase mb-1">Employee ID</p>
              <p className="font-semibold text-main">{record.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase mb-1">Name</p>
              <p className="font-semibold text-main">{record.employeeName}</p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase mb-1">Designation</p>
              <p className="font-semibold text-main">{record.designation}</p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase mb-1">Department</p>
              <p className="font-semibold text-main">{record.department}</p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase mb-1">Days Worked</p>
              <p className="font-semibold text-main">
                {record.paidDays}/{record.workingDays}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase mb-1">PAN Number</p>
              <p className="font-semibold text-main">{record.panNumber}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-success rounded-xl p-6 border border-theme">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Earnings
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white">
                  <span>Basic Salary</span>
                  <span className="font-semibold">
                    ₹{record.basicSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-white">
                  <span>HRA</span>
                  <span className="font-semibold">
                    ₹{record.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Allowances</span>
                  <span className="font-semibold">
                    ₹{record.allowances.toLocaleString()}
                  </span>
                </div>
                {record.overtimePay > 0 && (
                  <div className="flex justify-between text-white">
                    <span>Overtime</span>
                    <span className="font-semibold">
                      ₹{record.overtimePay.toLocaleString()}
                    </span>
                  </div>
                )}
                {record.totalBonus > 0 && (
                  <div className="flex justify-between text-white">
                    <span>Bonuses</span>
                    <span className="font-semibold">
                      ₹{record.totalBonus.toLocaleString()}
                    </span>
                  </div>
                )}
                {record.arrears > 0 && (
                  <div className="flex justify-between text-white">
                    <span>Arrears</span>
                    <span className="font-semibold">
                      ₹{record.arrears.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-white/30 mt-2">
                  <span className="font-bold text-white">Gross Salary</span>
                  <span className="font-bold text-lg text-white">
                    ₹{record.grossPay.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-danger rounded-xl p-6 border border-theme">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Deductions
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white">
                  <span>Tax ({record.taxRegime})</span>
                  <span className="font-semibold">
                    ₹{record.taxDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Provident Fund</span>
                  <span className="font-semibold">
                    ₹{record.pfDeduction.toLocaleString()}
                  </span>
                </div>
                {record.esiDeduction > 0 && (
                  <div className="flex justify-between text-white">
                    <span>ESI</span>
                    <span className="font-semibold">
                      ₹{record.esiDeduction.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-white">
                  <span>Professional Tax</span>
                  <span className="font-semibold">
                    ₹{record.professionalTax.toLocaleString()}
                  </span>
                </div>
                {record.loanDeduction > 0 && (
                  <div className="flex justify-between text-white">
                    <span>Loan EMI</span>
                    <span className="font-semibold">
                      ₹{record.loanDeduction.toLocaleString()}
                    </span>
                  </div>
                )}
                {record.advanceDeduction > 0 && (
                  <div className="flex justify-between text-white">
                    <span>Advance</span>
                    <span className="font-semibold">
                      ₹{record.advanceDeduction.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-white/30 mt-2">
                  <span className="font-bold text-white">
                    Total Deductions
                  </span>
                  <span className="font-bold text-lg text-white">
                    ₹{record.totalDeductions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-primary rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="opacity-90 text-sm mb-1">
                  Net Salary (Take Home)
                </p>
                <p className="text-4xl font-bold">
                  ₹{record.netPay.toLocaleString()}
                </p>
                <p className="opacity-90 text-xs mt-2">
                  Payment Date: {record.paymentDate || "Pending"}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  record.status === "Paid" ? "bg-success" : "bg-white/20"
                }`}
              >
                {record.status === "Paid" && (
                  <CheckCircle className="w-4 h-4" />
                )}
                {record.status}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-theme p-6 bg-app flex gap-3">
          <button
            onClick={onDownload}
            className="flex-1 px-6 py-3 border border-theme text-main rounded-lg row-hover flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={handleEmail}
            disabled={emailSent}
            className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center gap-2 ${
              emailSent
                ? "bg-success"
                : "bg-primary hover:bg-[var(--primary-600)]"
            } text-white`}
          >
            <Mail className="w-5 h-5" />
            {emailSent ? "Email Sent!" : "Email Payslip"}
          </button>
        </div>
      </div>
    </div>
  );
};