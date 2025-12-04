
import React from 'react';
import { Users, CheckCircle, Calendar, DollarSign, ArrowUp, Eye, XCircle } from 'lucide-react';

interface KPICardsProps {
  totalEmployees: number;
  paidCount: number;
  pendingCount: number;
  totalNetPay: number;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalEmployees,
  paidCount,
  pendingCount,
  totalNetPay
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <p className="text-slate-600 text-sm font-medium mb-1">Total Employees</p>
        <p className="text-3xl font-bold text-slate-800">{totalEmployees}</p>
        <p className="text-xs text-slate-500 mt-2">Active on payroll</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="text-emerald-500">
            <ArrowUp className="w-5 h-5" />
          </div>
        </div>
        <p className="text-slate-600 text-sm font-medium mb-1">Processed This Month</p>
        <p className="text-3xl font-bold text-slate-800">{paidCount}</p>
        <p className="text-xs text-emerald-600 mt-2 font-medium">Successfully paid</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
        <p className="text-slate-600 text-sm font-medium mb-1">Pending Payments</p>
        <p className="text-3xl font-bold text-slate-800">{pendingCount}</p>
        <p className="text-xs text-amber-600 mt-2 font-medium">Awaiting processing</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
        <p className="text-slate-600 text-sm font-medium mb-1">Total Payroll</p>
        <p className="text-3xl font-bold text-slate-800">₹{(totalNetPay / 1000).toFixed(0)}K</p>
        <p className="text-xs text-slate-500 mt-2">Net disbursement</p>
      </div>
    </div>
  );
};

interface PayrollRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  grade: string;
  grossPay: number;
  taxDeduction: number;
  pfDeduction: number;
  otherDeductions: number;
  netPay: number;
  status: 'Paid' | 'Failed' | 'Pending' | string;
}

interface PayrollTableProps {
  records: PayrollRecord[];
  onViewPayslip: (record: PayrollRecord) => void;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Paid': return <CheckCircle className="w-4 h-4" />;
    case 'Failed': return <XCircle className="w-4 h-4" />;
    default: return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'Failed':
      return 'bg-red-50 text-red-600 border-red-100';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

export const PayrollTable: React.FC<PayrollTableProps> = ({
  records,
  onViewPayslip,
  totalGrossPay,
  totalDeductions,
  totalNetPay
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Employee</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Department</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Designation</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Grade</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Gross Pay</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Deductions</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Net Pay</th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {records.map(record => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-slate-800">{record.employeeName}</p>
                    <p className="text-xs text-slate-500">{record.employeeId}</p>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-700">{record.department}</td>
                <td className="py-4 px-6 text-sm text-slate-700">{record.designation}</td>
                <td className="py-4 px-6 text-sm text-slate-700">{record.grade}</td>
                <td className="py-4 px-6 text-right font-semibold text-slate-800">₹{record.grossPay.toLocaleString()}</td>
                <td className="py-4 px-6 text-right text-red-600 font-medium">-₹{(record.taxDeduction + record.pfDeduction + record.otherDeductions).toLocaleString()}</td>
                <td className="py-4 px-6 text-right font-bold text-emerald-600">₹{record.netPay.toLocaleString()}</td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-slate-50 border-t-2 border-slate-300 p-6">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Gross Pay</p>
            <p className="text-2xl font-bold text-slate-800">₹{totalGrossPay.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Deductions</p>
            <p className="text-2xl font-bold text-red-600">₹{totalDeductions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Net Pay</p>
            <p className="text-2xl font-bold text-emerald-600">₹{totalNetPay.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};