import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  DollarSign,
  FileText,
  FileSignature,
  Receipt,
  ScrollText,
} from "lucide-react";

import { getSalesDashboardSummary } from "../../api/salesDashboardApi";

const SalesDashboard: React.FC = () => {
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<{
    totalProformaInvoices: number;
    totalQuotations: number;
    totalSalesInvoices: number;
    totalSalesCreditNotes: number;
    totalSalesDebitNotes: number;
    recentSales: Array<{
      name: string;
      customer: string;
      posting_date: string;
      grand_total: number;
    }>;
    monthlySalesGraph: { labels: string[]; data: number[] };
  } | null>(null);

  const currencyZMW = useMemo(
    () =>
      new Intl.NumberFormat("en-ZM", {
        style: "currency",
        currency: "ZMW",
        maximumFractionDigits: 2,
      }),
    [],
  );

  const currencyZMWCompact = useMemo(
    () =>
      new Intl.NumberFormat("en-ZM", {
        style: "currency",
        currency: "ZMW",
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
      }),
    [],
  );

  const dateWithDay = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [],
  );

  const recentSalesRows = summaryData?.recentSales ?? [];

  const monthlyTrendData = useMemo(() => {
    const labels = summaryData?.monthlySalesGraph?.labels ?? [];
    const values = summaryData?.monthlySalesGraph?.data ?? [];
    if (!labels.length || labels.length !== values.length) return [];
    return labels.map((name, i) => ({ name, revenue: Number(values[i] ?? 0) }));
  }, [summaryData]);

  const topCustomersChartData = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of recentSalesRows) {
      const key = r.customer ?? "Unknown";
      map.set(key, (map.get(key) ?? 0) + Number(r.grand_total ?? 0));
    }
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [recentSalesRows]);

  const dailySalesChartData = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of recentSalesRows) {
      const key = r.posting_date ?? "";
      if (!key) continue;
      map.set(key, (map.get(key) ?? 0) + Number(r.grand_total ?? 0));
    }

    return Array.from(map.entries())
      .map(([posting_date, total]) => {
        const d = new Date(posting_date);
        const label = Number.isNaN(d.getTime()) ? posting_date : dateWithDay.format(d);
        return { name: label, total };
      })
      .sort((a, b) => {
        const da = new Date(a.name);
        const db = new Date(b.name);
        if (!Number.isNaN(da.getTime()) && !Number.isNaN(db.getTime())) {
          return da.getTime() - db.getTime();
        }
        return a.name.localeCompare(b.name);
      })
      .slice(-10);
  }, [recentSalesRows, dateWithDay]);

  const customerSharePieData = useMemo(() => {
    const base = topCustomersChartData;
    if (!base.length) return [];

    const top = base.slice(0, 5);
    const restTotal = base.slice(5).reduce((sum, r) => sum + Number(r.total ?? 0), 0);
    return restTotal > 0 ? [...top, { name: "Others", total: restTotal }] : top;
  }, [topCustomersChartData]);

  const documentTotalsDonutData = useMemo(
    () => [
      {
        name: "Proforma Invoices",
        total: Number(summaryData?.totalProformaInvoices ?? 0),
      },
      {
        name: "Quotations",
        total: Number(summaryData?.totalQuotations ?? 0),
      },
      {
        name: "Sales Invoices",
        total: Number(summaryData?.totalSalesInvoices ?? 0),
      },
      {
        name: "Credit Notes",
        total: Number(summaryData?.totalSalesCreditNotes ?? 0),
      },
      {
        name: "Debit Notes",
        total: Number(summaryData?.totalSalesDebitNotes ?? 0),
      },
    ],
    [summaryData],
  );

  const pieColors = ["#8b5cf6", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#14b8a6"];

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const resp = await getSalesDashboardSummary();
        if (!mounted) return;
        const d = resp.data;
        setSummaryData({
          totalProformaInvoices: d.totalProformaInvoices,
          totalQuotations: d.totalQuotations,
          totalSalesInvoices: d.totalSalesInvoices,
          totalSalesCreditNotes: d.totalSalesCreditNotes,
          totalSalesDebitNotes: d.totalSalesDebitNotes,
          recentSales: d.recentSales,
          monthlySalesGraph: d.monthlySalesGraph,
        });
      } catch (e: any) {
        if (!mounted) return;
        setSummaryError(e?.message ?? "Failed to load sales dashboard summary");
      } finally {
        if (!mounted) return;
        setSummaryLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const ChartSkeleton = ({ variant }: { variant: "line" | "bar" | "pie" }) => {
    if (variant === "pie") {
      return (
        <div className="w-full h-full flex items-center justify-center animate-pulse">
          <div className="h-32 w-32 rounded-full bg-gray-100" />
        </div>
      );
    }

    return (
      <div className="w-full h-full p-3 animate-pulse flex flex-col justify-end gap-2">
        <div className="h-2 w-24 bg-gray-100 rounded" />
        <div className="flex items-end gap-2 h-full">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded w-full"
              style={{ height: `${30 + ((idx * 13) % 70)}%` }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-app min-h-screen px-4 sm:px-6 pb-6 pt-3 lg:h-screen lg:overflow-hidden">
      <div className="max-w-[1600px] mx-auto lg:h-full flex flex-col lg:min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
          {[
            {
              label: "Proforma Invoices",
              value: String(summaryData?.totalProformaInvoices ?? 0),
              icon: FileSignature,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              label: "Quotations",
              value: String(summaryData?.totalQuotations ?? 0),
              icon: ScrollText,
              gradient: "from-amber-500 to-amber-600",
            },
            {
              label: "Sales Invoices",
              value: String(summaryData?.totalSalesInvoices ?? 0),
              icon: Receipt,
              gradient: "from-emerald-500 to-emerald-600",
            },
            {
              label: "Credit Notes",
              value: String(summaryData?.totalSalesCreditNotes ?? 0),
              icon: FileText,
              gradient: "from-sky-500 to-sky-600",
            },
            {
              label: "Debit Notes",
              value: String(summaryData?.totalSalesDebitNotes ?? 0),
              icon: DollarSign,
              gradient: "from-purple-500 to-purple-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[124px]"
            >
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-sm`}>
                  <stat.icon className="text-white" size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {summaryLoading && (
          <div className="mb-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 text-sm font-semibold">
            Loading sales dashboard summary...
          </div>
        )}

        {summaryError && (
          <div className="mb-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
            {summaryError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Monthly Sales</h3>
            </div>

            <div className="h-[180px] sm:h-[200px] lg:h-[200px] rounded-lg border border-gray-200 bg-white">
              {summaryLoading ? (
                <ChartSkeleton variant="line" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData} margin={{ top: 16, right: 18, left: 6, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => currencyZMWCompact.format(Number(v))}
                      tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip
                      formatter={(v: any) => currencyZMW.format(Number(v ?? 0))}
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        padding: "8px 12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ color: "var(--text)", fontSize: 12, fontWeight: 600 }}
                      cursor={{ fill: "var(--primary)", opacity: 0.1 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={false} name="Sales" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Daily Sales (Recent)</h3>
            </div>

            <div className="h-[180px] sm:h-[200px] lg:h-[200px] rounded-lg border border-gray-200 bg-white">
              {summaryLoading ? (
                <ChartSkeleton variant="bar" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySalesChartData} margin={{ top: 16, right: 18, left: 6, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted)", fontSize: 11, fontWeight: 600 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={54}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip
                      formatter={(v: any) => currencyZMW.format(Number(v ?? 0))}
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        padding: "8px 12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ color: "var(--text)", fontSize: 12, fontWeight: 600 }}
                      cursor={{ fill: "var(--primary)", opacity: 0.1 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="total" fill="#10b981" radius={[6, 6, 0, 0]} name="Sales" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Document Totals</h3>
            </div>

            <div className="h-[180px] sm:h-[200px] lg:h-[200px] rounded-lg border border-gray-200 bg-white">
              {summaryLoading ? (
                <ChartSkeleton variant="pie" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Tooltip
                      formatter={(v: any) => Number(v ?? 0)}
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        padding: "8px 12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ color: "var(--text)", fontSize: 12, fontWeight: 600 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} verticalAlign="bottom" height={28} align="center" />
                    <Pie
                      data={documentTotalsDonutData}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="42%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {documentTotalsDonutData.map((_, idx) => (
                        <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Sales Breakdown</h3>
            </div>

            <div className="h-[180px] sm:h-[200px] lg:h-[200px] rounded-lg border border-gray-200 bg-white">
              {summaryLoading ? (
                <ChartSkeleton variant="pie" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Tooltip
                      formatter={(v: any) => currencyZMW.format(Number(v ?? 0))}
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        padding: "8px 12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ color: "var(--text)", fontSize: 12, fontWeight: 600 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} verticalAlign="bottom" height={34} align="center" />
                    <Pie
                      data={customerSharePieData}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {customerSharePieData.map((_, idx) => (
                        <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;