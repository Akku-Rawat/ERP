import React from 'react';
import { ChevronDown, ChevronUp, FileText, Edit2, CheckCircle, Clock } from 'lucide-react';
import type { PayrollRecord } from './types';
import { ExpandedRowDetail } from './ExpandedRowDetail';

interface PayrollTableProps {
  records: PayrollRecord[];
  expandedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onViewPayslip: (record: PayrollRecord) => void;
  onEditSalary: (record: PayrollRecord) => void;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({
  records,
  expandedRows,
  onToggleRow,
  onViewPayslip,
  onEditSalary
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <table className="w-full">
      <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-300">
        <tr>
          <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase">Employee</th>
          <th className="text-left py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Department</th>
          <th className="text-right py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Gross Pay</th>
          <th className="text-right py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Deductions</th>
          <th className="text-right py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Net Pay</th>
          <th className="text-center py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Status</th>
          <th className="text-center py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody>
        {records.map(record => {
          const isExpanded = expandedRows.has(record.id);
          const totalDeductions = record.taxDeduction + record.pfDeduction + record.otherDeductions;
          
          return (
            <React.Fragment key={record.id}>
              <tr 
                onClick={() => onToggleRow(record.id)}
                className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-slate-800">{record.employeeName}</p>
                      <p className="text-xs text-slate-500">{record.employeeId}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-slate-700">{record.department}</td>
                <td className="py-4 px-4 text-right font-semibold text-slate-800">
                  ₹{record.grossPay.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right font-medium text-red-600">
                  -₹{totalDeductions.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right font-bold text-green-600">
                  ₹{record.netPay.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === "Paid" ? "bg-green-100 text-green-700" :
                    record.status === "Pending" ? "bg-amber-100 text-amber-700" :
                    record.status === "Processing" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {record.status === "Paid" && <CheckCircle className="w-3 h-3" />}
                    {record.status === "Pending" && <Clock className="w-3 h-3" />}
                    {record.status}
                  </span>
                </td>
                <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onViewPayslip(record)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Payslip"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    {record.status !== "Paid" && (
                      <button
                        onClick={() => onEditSalary(record)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Salary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              
              {isExpanded && (
                <ExpandedRowDetail 
                  record={record} 
                  onCollapse={() => onToggleRow(record.id)} 
                />
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  </div>
);