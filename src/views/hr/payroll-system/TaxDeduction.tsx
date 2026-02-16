
import React from "react";

const TaxDeduction: React.FC = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-theme p-6 space-y-6">
      <div className="flex items-center justify-between bg-app border border-theme rounded-lg p-4">
        <div>
          <h2 className="text-lg font-bold text-main">
            Tax Deduction Summary
          </h2>
          <p className="text-sm text-muted">
            Statutory deductions for current payroll period
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Total Deduction</p>
          <p className="text-xl font-bold text-danger">₹45,200</p>
        </div>
      </div>

      <div className="overflow-hidden border border-theme rounded-lg">
        <table className="w-full text-sm">
          <thead className="table-head border-b border-theme">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">
                Deduction Type
              </th>
              <th className="text-right px-4 py-3 font-semibold">
                Employee
              </th>
              <th className="text-right px-4 py-3 font-semibold">
                Employer
              </th>
              <th className="text-right px-4 py-3 font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="px-4 py-3 text-main">Income Tax (TDS)</td>
              <td className="px-4 py-3 text-right text-main">₹25,000</td>
              <td className="px-4 py-3 text-right text-main">—</td>
              <td className="px-4 py-3 text-right font-semibold text-main">₹25,000</td>
            </tr>

            <tr className="border-b border-theme bg-app">
              <td className="px-4 py-3 text-main">Provident Fund (PF)</td>
              <td className="px-4 py-3 text-right text-main">₹9,600</td>
              <td className="px-4 py-3 text-right text-main">₹9,600</td>
              <td className="px-4 py-3 text-right font-semibold text-main">₹19,200</td>
            </tr>

            <tr className="border-b border-theme">
              <td className="px-4 py-3 text-main">ESI</td>
              <td className="px-4 py-3 text-right text-main">₹1,200</td>
              <td className="px-4 py-3 text-right text-main">₹2,800</td>
              <td className="px-4 py-3 text-right font-semibold text-main">₹4,000</td>
            </tr>

            <tr className="bg-app">
              <td className="px-4 py-3 text-main">Professional Tax</td>
              <td className="px-4 py-3 text-right text-main">₹200</td>
              <td className="px-4 py-3 text-right text-main">—</td>
              <td className="px-4 py-3 text-right font-semibold text-main">₹200</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxDeduction;