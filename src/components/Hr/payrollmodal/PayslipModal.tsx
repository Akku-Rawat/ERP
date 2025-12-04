import React from 'react';
import { XCircle, Download, Send, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import type { PayrollRecord } from '../../../views/hr/payroll/types';
import { downloadPayslip } from '../../../views/hr/payroll/utils';

interface PayslipModalProps {
  show: boolean;
  onClose: () => void;
  employee: PayrollRecord | null;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Paid': return <CheckCircle className="w-4 h-4" />;
    default: return null;
  }
};

export const PayslipModal: React.FC<PayslipModalProps> = ({
  show,
  onClose,
  employee
}) => {
  if (!show || !employee) return null;

  const handleEmailPayslip = () => {
    alert(`Payslip sent to ${employee.employeeName}'s registered email address!`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Payslip</h2>
              <p className="text-teal-100 mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-200">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Employee ID</p>
              <p className="font-semibold text-slate-800">{employee.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Name</p>
              <p className="font-semibold text-slate-800">{employee.employeeName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Designation</p>
              <p className="font-semibold text-slate-800">{employee.designation}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Department</p>
              <p className="font-semibold text-slate-800">{employee.department}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Grade</p>
              <p className="font-semibold text-slate-800">{employee.grade}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Bank Account</p>
              <p className="font-semibold text-slate-800">{employee.bankAccount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Working Days</p>
              <p className="font-semibold text-slate-800">{employee.workingDays}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Paid Days</p>
              <p className="font-semibold text-slate-800">{employee.paidDays}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-emerald-50 rounded-xl p-6">
              <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <ArrowUp className="w-6 h-6" />
                Earnings
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-semibold text-slate-800">₹{employee.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">HRA</span>
                  <span className="font-semibold text-slate-800">₹{employee.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Allowances</span>
                  <span className="font-semibold text-slate-800">₹{employee.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-emerald-200">
                  <span className="font-bold text-emerald-800">Gross Pay</span>
                  <span className="font-bold text-emerald-800">₹{employee.grossPay.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                <ArrowDown className="w-6 h-6" />
                Deductions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax Deduction</span>
                  <span className="font-semibold text-slate-800">₹{employee.taxDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">PF Deduction</span>
                  <span className="font-semibold text-slate-800">₹{employee.pfDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Other Deductions</span>
                  <span className="font-semibold text-slate-800">₹{employee.otherDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-red-200">
                  <span className="font-bold text-red-800">Total Deductions</span>
                  <span className="font-bold text-red-800">₹{(employee.taxDeduction + employee.pfDeduction + employee.otherDeductions).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-teal-100 text-sm mb-1">Net Salary (Take Home)</p>
                <p className="text-4xl font-bold">₹{employee.netPay.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-teal-100 text-sm mb-1">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${
                  employee.status === 'Paid' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {getStatusIcon(employee.status)}
                  {employee.status}
                </span>
              </div>
            </div>
            {employee.paymentDate && (
              <p className="text-teal-100 text-sm mt-3">
                Payment Date: {employee.paymentDate}
              </p>
            )}
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 text-center">
              This is a computer-generated payslip and does not require a signature.
            </p>
            <p className="text-xs text-slate-500 text-center mt-1">
              Generated on: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-6 rounded-b-2xl flex gap-3">
          <button
            onClick={() => downloadPayslip(employee)}
            className="flex-1 bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Payslip
          </button>
          <button
            onClick={handleEmailPayslip}
            className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Email Payslip
          </button>
        </div>
      </div>
    </div>
  );
};