// Enhanced PayrollTable.tsx - Updated with View Run Details button

import React from 'react';
import { ChevronUp, ChevronDown, CheckCircle, Clock, FileText, Edit2, AlertCircle, TrendingUp, Users, Calendar, CreditCard, DollarSign, Eye } from 'lucide-react';
import type { PayrollRecord } from './types';
import { calculateDeductions } from './utils';

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
  onViewRunDetails
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-300">
          <tr>
            <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase">Employee</th>
            <th className="text-left py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Department</th>
            <th className="text-center py-4 px-4 text-xs font-semibold text-slate-700 uppercase">Days</th>
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
            const totalDeductions = calculateDeductions(record);
            
            return (
              <React.Fragment key={record.id}>
                <tr
                  onClick={() => onToggleRow(record.id)}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-800">{record.employeeName}</p>
                        <p className="text-xs text-slate-500">{record.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-700">{record.department}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-semibold text-slate-800">{record.paidDays}/{record.workingDays}</span>
                  </td>
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
                      record.status === "Approved" ? "bg-blue-100 text-blue-700" :
                      record.status === "Pending" ? "bg-amber-100 text-amber-700" :
                      record.status === "Rejected" ? "bg-red-100 text-red-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {record.status === "Paid" && <CheckCircle className="w-3 h-3" />}
                      {record.status === "Pending" && <Clock className="w-3 h-3" />}
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2 justify-center">
                      {onViewRunDetails && (
                        <button
                          onClick={() => onViewRunDetails(record)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                          title="View Run Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onViewPayslip(record)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Payslip"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      {record.status !== "Paid" && (
                        <button
                          onClick={() => onEditRecord(record)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                
                {isExpanded && (
                  <tr className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-b-2 border-blue-200">
                    <td colSpan={8} className="px-6 py-8">
                      <div className="max-w-7xl mx-auto">
                        {/* Employee & Attendance Info */}
                        <div className="grid grid-cols-4 gap-6 mb-6">
                          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                              <Users className="w-5 h-5 text-blue-600" />
                              Employee Details
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Designation:</span>
                                <span className="font-semibold">{record.designation}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Grade:</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                  {record.grade}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">PAN:</span>
                                <span className="font-semibold text-xs">{record.panNumber}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-purple-600" />
                              Attendance
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Working Days:</span>
                                <span className="font-bold text-slate-800">{record.workingDays}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Paid Days:</span>
                                <span className="font-bold text-green-600">{record.paidDays}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Absent/Leave:</span>
                                <span className="font-bold text-red-600">{record.absentDays + record.leaveDays}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-teal-600" />
                              Bank Details
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div>
                                <p className="text-slate-600 text-xs mb-1">Account Number</p>
                                <p className="font-semibold">{record.bankAccount}</p>
                              </div>
                              <div>
                                <p className="text-slate-600 text-xs mb-1">IFSC Code</p>
                                <p className="font-semibold">{record.ifscCode}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-amber-600" />
                              Tax Regime
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Regime:</span>
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                                  {record.taxRegime}
                                </span>
                              </div>
                              <div>
                                <p className="text-slate-600 text-xs mb-1">Taxable Income</p>
                                <p className="font-semibold">₹{(record.taxableIncome / 1000).toFixed(0)}K/year</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Earnings & Deductions */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-5">
                            <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              Earnings Breakdown
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span>Basic Salary:</span>
                                <span className="font-bold">₹{record.basicSalary.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>HRA:</span>
                                <span className="font-bold">₹{record.hra.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Allowances:</span>
                                <span className="font-bold">₹{record.allowances.toLocaleString()}</span>
                              </div>
                              
                              {record.overtimePay > 0 && (
                                <div className="flex justify-between bg-blue-50 -mx-2 px-3 py-2 rounded">
                                  <span className="text-blue-800">Overtime Pay:</span>
                                  <span className="font-bold text-blue-800">₹{record.overtimePay.toLocaleString()}</span>
                                </div>
                              )}

                              {record.totalBonus > 0 && (
                                <div className="bg-purple-50 -mx-2 px-3 py-3 rounded-lg">
                                  <div className="flex justify-between mb-2">
                                    <span className="font-semibold text-purple-900">Bonuses:</span>
                                    <span className="font-bold text-purple-700">₹{record.totalBonus.toLocaleString()}</span>
                                  </div>
                                  {record.bonuses && record.bonuses.length > 0 && (
                                    <div className="space-y-1 pt-2 border-t border-purple-200">
                                      {record.bonuses.map((bonus) => (
                                        <div key={bonus.id} className="flex justify-between text-xs">
                                          <span className="text-purple-800">{bonus.label}:</span>
                                          <span className="font-bold text-purple-700">₹{bonus.amount.toLocaleString()}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {record.arrears > 0 && (
                                <div className="bg-amber-50 border border-amber-200 -mx-2 px-3 py-3 rounded-lg">
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-amber-900">Arrears:</span>
                                    <span className="font-bold text-amber-700">₹{record.arrears.toLocaleString()}</span>
                                  </div>
                                  {record.arrearDetails && record.arrearDetails.length > 0 && (
                                    <div className="space-y-2 pt-2 border-t border-amber-200">
                                      {record.arrearDetails.map((arr) => (
                                        <div key={arr.id} className="text-xs">
                                          <div className="flex justify-between mb-1">
                                            <span className="font-medium text-amber-800">{arr.label}</span>
                                            <span className="font-bold text-amber-700">₹{arr.amount.toLocaleString()}</span>
                                          </div>
                                          <div className="text-amber-600">
                                            <span className="font-medium">Period:</span> {new Date(arr.fromDate).toLocaleDateString()} to {new Date(arr.toDate).toLocaleDateString()}
                                          </div>
                                          <div className="text-amber-600 italic">{arr.reason}</div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex justify-between pt-3 border-t-2 border-green-300">
                                <span className="font-bold">Gross Pay:</span>
                                <span className="text-lg font-bold text-green-700">₹{record.grossPay.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-sm border border-red-200 p-5">
                            <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                              <AlertCircle className="w-5 h-5" />
                              Deductions Breakdown
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span>Income Tax ({record.taxRegime}):</span>
                                <span className="font-bold">₹{record.taxDeduction.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Provident Fund:</span>
                                <span className="font-bold">₹{record.pfDeduction.toLocaleString()}</span>
                              </div>
                              {record.esiDeduction > 0 && (
                                <div className="flex justify-between">
                                  <span>ESI:</span>
                                  <span className="font-bold">₹{record.esiDeduction.toLocaleString()}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Professional Tax:</span>
                                <span className="font-bold">₹{record.professionalTax.toLocaleString()}</span>
                              </div>
                              
                              {record.loanDeduction > 0 && (
                                <div className="flex justify-between bg-orange-50 -mx-2 px-3 py-2 rounded">
                                  <span className="text-orange-800">Loan EMI:</span>
                                  <span className="font-bold text-orange-800">₹{record.loanDeduction.toLocaleString()}</span>
                                </div>
                              )}
                              
                              {record.advanceDeduction > 0 && (
                                <div className="flex justify-between bg-teal-50 -mx-2 px-3 py-2 rounded">
                                  <span className="text-teal-800">Advance Recovery:</span>
                                  <span className="font-bold text-teal-800">₹{record.advanceDeduction.toLocaleString()}</span>
                                </div>
                              )}
                              
                              <div className="flex justify-between">
                                <span>Other Deductions:</span>
                                <span className="font-bold">₹{record.otherDeductions.toLocaleString()}</span>
                              </div>
                              
                              <div className="flex justify-between pt-3 border-t-2 border-red-300">
                                <span className="font-bold">Total Deductions:</span>
                                <span className="text-lg font-bold text-red-700">-₹{totalDeductions.toLocaleString()}</span>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t-2 border-slate-300">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-3 rounded-lg">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-bold text-white">Net Pay (Take Home):</span>
                                    <span className="text-2xl font-bold text-white">₹{record.netPay.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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