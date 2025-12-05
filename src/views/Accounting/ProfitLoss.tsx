import React, { useMemo, useState } from "react";
import { FaDownload, FaChartPie } from "react-icons/fa";

type Account = {
  code: string;
  name: string;
  type: string;
  balance: number;
};

type ProfitLossData = {
  revenue?: number;
  expenses?: number;
  grossProfit?: number;
  operatingExpenses?: number;
  netIncome?: number;
  activeAccounts?: Account[];
};

type Props = {
  profitLoss?: ProfitLossData;
  reportPeriod: string;
  setReportPeriod: (v: string) => void;
  reportYear: string;
  setReportYear: (v: string) => void;
  reportMonth: string;
  setReportMonth: (v: string) => void;
  monthNames: { [key: string]: string };
};

// keep values identical, only formatting
const nf = (v?: number) => {
  const n = typeof v === "number" && !Number.isNaN(v) ? Math.round(v) : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
};

export default function ProfitLossImproved({
  profitLoss,
  reportPeriod,
  setReportPeriod,
  reportYear,
  setReportYear,
  reportMonth,
  setReportMonth,
  monthNames,
}: Props) {
  const safeProfitLoss: Required<ProfitLossData> = {
    revenue: profitLoss?.revenue ?? 0,
    expenses: profitLoss?.expenses ?? 0,
    grossProfit: profitLoss?.grossProfit ?? 0,
    operatingExpenses: profitLoss?.operatingExpenses ?? 0,
    netIncome: profitLoss?.netIncome ?? 0,
    activeAccounts: profitLoss?.activeAccounts ?? [],
  };

  const [showRevenue, setShowRevenue] = useState(true);
  const [showExpenses, setShowExpenses] = useState(true);

  const revenueAccounts = useMemo(
    () => safeProfitLoss.activeAccounts.filter((a) => a.type === "Revenue"),
    [safeProfitLoss.activeAccounts],
  );
  const expenseAccounts = useMemo(
    () => safeProfitLoss.activeAccounts.filter((a) => a.type === "Expense"),
    [safeProfitLoss.activeAccounts],
  );

  const monthLabel = monthNames?.[reportMonth] ?? reportMonth ?? "";
  const title =
    reportPeriod === "monthly"
      ? `${monthLabel} ${reportYear}`
      : `${reportYear}`;
  const cogsAccount = safeProfitLoss.activeAccounts.find(
    (a) => a.code === "5000",
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-3 items-center">
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {reportPeriod === "monthly" && (
            <select
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              {Object.entries(monthNames).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )}

          <select
            value={reportYear}
            onChange={(e) => setReportYear(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <button className="px-3 py-2 rounded-lg border border-transparent bg-indigo-600 shadow-sm text-sm hover:bg-indigo-700 text-white flex items-center gap-2">
            <FaDownload />
            Export
          </button>
          <div className="p-1 rounded-lg bg-white border border-gray-100 shadow-sm">
            <button className="px-3 py-2 rounded-md bg-rose-500 text-white text-sm hover:bg-rose-600">
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Card container styled like balance sheet */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Profit & Loss — summary (values unchanged)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-white border border-gray-100 text-center shadow-sm min-w-[140px]">
                <div className="text-xs text-gray-500">Revenue</div>
                <div className="text-lg font-semibold text-indigo-800">
                  {nf(safeProfitLoss.revenue)}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-gray-100 text-center shadow-sm min-w-[140px]">
                <div className="text-xs text-gray-500">Gross Profit</div>
                <div className="text-lg font-semibold text-emerald-800">
                  {nf(safeProfitLoss.grossProfit)}
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border shadow-sm text-center min-w-[140px] ${
                  safeProfitLoss.netIncome >= 0
                    ? "border-emerald-100 bg-emerald-50"
                    : "border-rose-100 bg-rose-50"
                }`}
              >
                <div className="text-xs text-gray-500">Net Income</div>
                <div
                  className={`text-lg font-semibold ${safeProfitLoss.netIncome >= 0 ? "text-emerald-700" : "text-rose-700"}`}
                >
                  {nf(safeProfitLoss.netIncome)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Revenue & COGS */}
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <FaChartPie className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-indigo-900">
                    REVENUE & COGS
                  </h4>
                </div>

                <div className="flex-1">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-gray-700">
                        Revenue
                      </div>
                      <div className="text-sm font-medium text-indigo-800">
                        {nf(safeProfitLoss.revenue)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {showRevenue && (
                        <div className="grid grid-cols-1 gap-2">
                          {revenueAccounts.map((acc) => (
                            <div
                              key={acc.code}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-gray-600">{acc.name}</span>
                              <span className="text-gray-900 font-medium">
                                {nf(acc.balance)}
                              </span>
                            </div>
                          ))}

                          {revenueAccounts.length === 0 && (
                            <div className="text-sm text-gray-500">
                              No revenue accounts available
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 font-semibold text-indigo-700">
                        <span>Gross Profit</span>
                        <span>{nf(safeProfitLoss.grossProfit)}</span>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => setShowRevenue((s) => !s)}
                          className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-white"
                        >
                          {showRevenue ? "Hide details" : "Show details"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Expenses & Net Income */}
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <span className="text-white font-bold">E</span>
                  </div>
                  <h4 className="text-xl font-bold text-emerald-900">
                    OPERATING EXPENSES
                  </h4>
                </div>

                <div className="flex-1">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-gray-700">
                        Operating Expenses
                      </div>
                      <div className="text-sm font-medium text-emerald-800">
                        {nf(safeProfitLoss.operatingExpenses)}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      {showExpenses && (
                        <table className="w-full text-sm table-auto">
                          <thead>
                            <tr className="text-left text-xs text-gray-500 uppercase">
                              <th className="p-2">Account</th>
                              <th className="p-2">Code</th>
                              <th className="p-2 text-right">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expenseAccounts
                              .filter((a) => a.code !== "5000")
                              .map((acc) => (
                                <tr
                                  key={acc.code}
                                  className="bg-white border-b"
                                >
                                  <td className="p-2">{acc.name}</td>
                                  <td className="p-2">{acc.code}</td>
                                  <td className="p-2 text-right font-medium">
                                    {nf(acc.balance)}
                                  </td>
                                </tr>
                              ))}

                            {expenseAccounts.filter((a) => a.code !== "5000")
                              .length === 0 && (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="p-3 text-sm text-gray-500"
                                >
                                  No operating expense accounts available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 font-bold text-emerald-700">
                      <span>Net Income</span>
                      <span
                        className={
                          safeProfitLoss.netIncome >= 0
                            ? "text-emerald-800"
                            : "text-rose-700"
                        }
                      >
                        {nf(safeProfitLoss.netIncome)}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => setShowExpenses((s) => !s)}
                        className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-white"
                      >
                        {showExpenses ? "Hide rows" : "Show rows"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom summary */}
          <div
            className={`mt-6 p-4 rounded-lg ${safeProfitLoss.netIncome >= 0 ? "bg-emerald-50" : "bg-rose-50"}`}
          >
            <div className="flex items-center justify-between text-lg font-bold">
              <div className="text-gray-800">Net Income</div>
              <div
                className={
                  safeProfitLoss.netIncome >= 0
                    ? "text-emerald-700"
                    : "text-rose-700"
                }
              >
                {nf(safeProfitLoss.netIncome)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
