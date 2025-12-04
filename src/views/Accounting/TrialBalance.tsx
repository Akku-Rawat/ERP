import React from "react";
import {
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

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

const nf = (v: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 0 }).format(
    Math.round(v),
  );

const TrialBalance: React.FC<Props> = ({
  trialBalance,
  totalDebit,
  totalCredit,
  reportMonth,
  reportYear,
  setReportMonth,
  setReportYear,
  monthNames,
}) => {
  const balanced = totalDebit === totalCredit;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Trial Balance
            </h2>
            <p className="text-sm text-slate-500">
              {monthNames[reportMonth]} {reportYear} — amounts in USD
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-2 items-center bg-white rounded-lg border border-gray-200 p-2">
              <select
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="px-3 py-2 bg-white rounded-md text-sm focus:outline-none"
              >
                {Object.entries(monthNames).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                className="px-3 py-2 bg-white rounded-md text-sm focus:outline-none"
              >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg shadow-sm hover:bg-slate-900">
              <FaDownload /> Export
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Table area */}
              <div className="flex-1">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-white text-slate-700 text-sm font-medium">
                      <tr>
                        <th className="px-6 py-3 text-left">Account Code</th>
                        <th className="px-6 py-3 text-left">Account Name</th>
                        <th className="px-6 py-3 text-right">Debit</th>
                        <th className="px-6 py-3 text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {trialBalance.map((account, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/30 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-sm text-slate-700">
                            {account.code}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {account.name}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-900">
                            {account.debit > 0 ? nf(account.debit) : "—"}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-900">
                            {account.credit > 0 ? nf(account.credit) : "—"}
                          </td>
                        </tr>
                      ))}

                      {/* Totals */}
                      <tr className="bg-gray-50 font-semibold">
                        <td colSpan={2} className="px-6 py-3">
                          Total
                        </td>
                        <td className="px-6 py-3 text-right">
                          {nf(totalDebit)}
                        </td>
                        <td className="px-6 py-3 text-right">
                          {nf(totalCredit)}
                        </td>
                      </tr>

                      {/* Balance status */}
                      <tr
                        className={`${balanced ? "bg-emerald-50" : "bg-rose-50"} font-semibold`}
                      >
                        <td
                          colSpan={2}
                          className="px-6 py-3 flex items-center gap-3"
                        >
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${balanced ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}
                          >
                            {balanced ? (
                              <FaCheckCircle />
                            ) : (
                              <FaExclamationTriangle />
                            )}
                          </span>
                          <span>
                            {balanced ? "Balanced" : "Out of Balance"}
                          </span>
                        </td>
                        <td colSpan={2} className="px-6 py-3 text-right">
                          {nf(Math.abs(totalDebit - totalCredit))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {trialBalance.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No trial balance data for the selected period.
                  </div>
                )}
              </div>

              {/* Side summary */}
              <aside className="w-full lg:w-72">
                <div className="bg-blue-400 text-white rounded-lg p-4 shadow-md">
                  <div className="text-sm text-slate-100">Totals</div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span>Debit</span>
                      <span className="font-bold">{nf(totalDebit)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Credit</span>
                      <span className="font-bold">{nf(totalCredit)}</span>
                    </div>
                  </div>

                  <div
                    className={`mt-4 p-3 rounded-md ${balanced ? "bg-white/10" : "bg-white/10"}`}
                  >
                    <div className="text-xs">Status</div>
                    <div className="mt-2 font-semibold flex items-center justify-between">
                      <span>{balanced ? "Balanced" : "Difference"}</span>
                      <span>{nf(Math.abs(totalDebit - totalCredit))}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Actions</div>
                  <div className="mt-3 flex flex-col gap-2">
                    <button className="px-3 py-2 rounded-md bg-blue-50 text-slate-700 font-medium">
                      Download CSV
                    </button>
                    <button className="px-3 py-2 rounded-md bg-white border border-gray-200">
                      Print
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;
