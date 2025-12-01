import React, { useMemo, useState } from "react";

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

// Format currency in USD
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-3 items-center">
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {reportPeriod === "monthly" && (
            <select
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <button className="px-3 py-2 rounded-lg border border-transparent bg-white shadow-sm text-sm hover:bg-gray-50">
            Export CSV
          </button>
          <button className="px-3 py-2 rounded-lg bg-teal-600 text-white text-sm shadow-sm hover:bg-teal-700">
            Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Profit & Loss summary
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
              <div className="p-3 rounded-lg bg-white border border-gray-100 shadow-sm text-center min-w-[160px]">
                <div className="text-xs text-gray-500">Revenue</div>
                <div className="text-lg font-semibold text-gray-800">
                  {nf(safeProfitLoss.revenue)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-gray-100 shadow-sm text-center min-w-[160px]">
                <div className="text-xs text-gray-500">Gross Profit</div>
                <div className="text-lg font-semibold text-gray-800">
                  {nf(safeProfitLoss.grossProfit)}
                </div>
              </div>
              <div
                className={`p-3 rounded-lg border shadow-sm text-center min-w-[160px] ${
                  safeProfitLoss.netIncome >= 0
                    ? "border-green-100 bg-green-50"
                    : "border-red-100 bg-red-50"
                }`}
              >
                <div className="text-xs text-gray-500">Net Income</div>
                <div
                  className={`text-lg font-semibold ${safeProfitLoss.netIncome >= 0 ? "text-green-700" : "text-red-700"}`}
                >
                  {nf(safeProfitLoss.netIncome)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-800">Revenue</h4>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  Total: {nf(safeProfitLoss.revenue)}
                </div>
                <button
                  onClick={() => setShowRevenue((s) => !s)}
                  className="text-sm px-2 py-1 rounded-md border border-gray-200 bg-white"
                >
                  {showRevenue ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {showRevenue && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {revenueAccounts.map((acc) => (
                    <div
                      key={acc.code}
                      className="flex justify-between text-sm bg-white p-3 rounded-md border"
                    >
                      <div className="text-gray-700">{acc.name}</div>
                      <div className="font-medium text-gray-900">
                        {nf(acc.balance)}
                      </div>
                    </div>
                  ))}
                  {revenueAccounts.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No revenue accounts available
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h4 className="text-base font-semibold text-gray-800">
              Cost of Sales
            </h4>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700">Cost of Goods Sold</div>
                <div className="text-sm font-medium text-gray-900">
                  {nf(cogsAccount?.balance)}
                </div>
              </div>

              <div className="mt-3 p-3 rounded-lg bg-blue-50 flex justify-between items-center font-semibold">
                <div>Gross Profit</div>
                <div className="text-blue-700">
                  {nf(safeProfitLoss.grossProfit)}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-800">
                Operating Expenses
              </h4>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  Total: {nf(safeProfitLoss.operatingExpenses)}
                </div>
                <button
                  onClick={() => setShowExpenses((s) => !s)}
                  className="text-sm px-2 py-1 rounded-md border border-gray-200 bg-white"
                >
                  {showExpenses ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {showExpenses && (
              <div className="overflow-x-auto bg-gray-50 p-3 rounded-lg">
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
                        <tr key={acc.code} className="bg-white border-b">
                          <td className="p-2">{acc.name}</td>
                          <td className="p-2">{acc.code}</td>
                          <td className="p-2 text-right font-medium">
                            {nf(acc.balance)}
                          </td>
                        </tr>
                      ))}
                    {expenseAccounts.filter((a) => a.code !== "5000").length ===
                      0 && (
                      <tr>
                        <td colSpan={3} className="p-3 text-sm text-gray-500">
                          No operating expense accounts available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div
            className={`p-4 rounded-lg ${safeProfitLoss.netIncome >= 0 ? "bg-green-50" : "bg-red-50"}`}
          >
            <div className="flex items-center justify-between text-lg font-bold">
              <div className="text-gray-800">Net Income</div>
              <div
                className={
                  safeProfitLoss.netIncome >= 0
                    ? "text-green-700"
                    : "text-red-700"
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
