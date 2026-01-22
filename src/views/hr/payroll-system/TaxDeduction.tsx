// TaxDeduction.tsx
import React from "react";

const TaxDeduction: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Tax Deduction Summary
          </h2>
          <p className="text-sm text-slate-500">
            Statutory deductions for current payroll period
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Total Deduction</p>
          <p className="text-xl font-bold text-red-600">₹45,200</p>
        </div>
      </div>

      {/* Deduction Table */}
      <div className="overflow-hidden border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">
                Deduction Type
              </th>
              <th className="text-right px-4 py-3 font-semibold text-slate-700">
                Employee
              </th>
              <th className="text-right px-4 py-3 font-semibold text-slate-700">
                Employer
              </th>
              <th className="text-right px-4 py-3 font-semibold text-slate-700">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3">Income Tax (TDS)</td>
              <td className="px-4 py-3 text-right">₹25,000</td>
              <td className="px-4 py-3 text-right">—</td>
              <td className="px-4 py-3 text-right font-semibold">₹25,000</td>
            </tr>

            <tr className="border-b bg-slate-50">
              <td className="px-4 py-3">Provident Fund (PF)</td>
              <td className="px-4 py-3 text-right">₹9,600</td>
              <td className="px-4 py-3 text-right">₹9,600</td>
              <td className="px-4 py-3 text-right font-semibold">₹19,200</td>
            </tr>

            <tr className="border-b">
              <td className="px-4 py-3">ESI</td>
              <td className="px-4 py-3 text-right">₹1,200</td>
              <td className="px-4 py-3 text-right">₹2,800</td>
              <td className="px-4 py-3 text-right font-semibold">₹4,000</td>
            </tr>

            <tr className="bg-slate-50">
              <td className="px-4 py-3">Professional Tax</td>
              <td className="px-4 py-3 text-right">₹200</td>
              <td className="px-4 py-3 text-right">—</td>
              <td className="px-4 py-3 text-right font-semibold">₹200</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxDeduction;
