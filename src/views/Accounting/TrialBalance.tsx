import React from "react";

// Type definition for account row
type TrialBalanceAccount = {
  code: string;
  name: string;
  debit: number;
  credit: number;
};

type Props = {
  trialBalance: TrialBalanceAccount[];
  totalDebit: number;
  totalCredit: number;
  reportMonth: string;
  reportYear: string;
  setReportMonth: (month: string) => void;
  setReportYear: (year: string) => void;
  monthNames: { [key: string]: string };
};

const TrialBalance: React.FC<Props> = ({
  trialBalance,
  totalDebit,
  totalCredit,
  reportMonth,
  reportYear,
  setReportMonth,
  setReportYear,
  monthNames,
}) => (
  <div className="p-6 bg-gray-50 min-h-screen">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Trial Balance Report</h2>
        <div className="flex gap-3">
          <select
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            className="px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(monthNames).map(([value, label]: [string, string]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={reportYear}
            onChange={(e) => setReportYear(e.target.value)}
            className="px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-6 py-4 text-left">Account Code</th>
              <th className="px-6 py-4 text-left">Account Name</th>
              <th className="px-6 py-4 text-right">Debit</th>
              <th className="px-6 py-4 text-right">Credit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trialBalance.map((account: TrialBalanceAccount, idx: number) => (
              <tr
                key={idx}
                className="hover:bg-indigo-50/50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                  {account.code}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {account.name}
                </td>
                <td className="px-6 py-4 text-right font-medium text-gray-900">
                  {account.debit > 0 ? account.debit.toLocaleString() : "—"}
                </td>
                <td className="px-6 py-4 text-right font-medium text-gray-900">
                  {account.credit > 0 ? account.credit.toLocaleString() : "—"}
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-gray-100 font-bold">
              <td className="px-6 py-4 text-sm" colSpan={2}>
                Total
              </td>
              <td className="px-6 py-4 text-sm text-right">
                {totalDebit.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-right">
                {totalCredit.toLocaleString()}
              </td>
            </tr>
            {/* Balance Status Row */}
            <tr
              className={`${
                totalDebit === totalCredit ? "bg-green-50" : "bg-red-50"
              } font-semibold`}
            >
              <td className="px-6 py-4 text-sm" colSpan={2}>
                {totalDebit === totalCredit ? "Balanced ✓" : "Out of Balance ⚠"}
              </td>
              <td className="px-6 py-4 text-sm text-right" colSpan={2}>
                {Math.abs(totalDebit - totalCredit).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        {trialBalance.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No trial balance data for the selected period.
          </div>
        )}
      </div>
    </div>
  </div>
);

export default TrialBalance;
