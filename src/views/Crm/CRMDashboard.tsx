import React, { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  Building2,
  User,
  Globe,
  BadgeCheck,
  BadgeX,
} from "lucide-react";

import { getCustomerDashboardSummary } from "../../api/customerDashboardApi";


const CRMDashboard: React.FC = () => {
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [cards, setCards] = useState<{
    totalCustomers: number;
    totalIndividualCustomers: number;
    totalCompanyCustomers: number;
    lopCustomers: number;
    exportCustomers: number;
    nonExportCustomers: number;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const resp = await getCustomerDashboardSummary();
        if (!mounted) return;
        setCards(resp.data.cards);
      } catch (e: any) {
        if (!mounted) return;
        setSummaryError(e?.message ?? "Failed to load customer dashboard summary");
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

  const palette = useMemo(
    () => ({
      purple: "#8b5cf6",
      blue: "#3b82f6",
      emerald: "#10b981",
      amber: "#f59e0b",
      red: "#ef4444",
      slate: "#64748b",
    }),
    [],
  );

  const ChartSkeleton = ({ variant }: { variant: "bar" | "pie" }) => {
    if (variant === "pie") {
      return (
        <div className="w-full h-full flex items-center justify-center animate-pulse">
          <div className="h-28 w-28 rounded-full bg-gray-100" />
        </div>
      );
    }

    return (
      <div className="w-full h-full p-3 animate-pulse flex flex-col justify-end gap-2">
        <div className="h-2 w-24 bg-gray-100 rounded" />
        <div className="flex items-end gap-2 h-full">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded w-full"
              style={{ height: `${35 + ((idx * 17) % 60)}%` }}
            />
          ))}
        </div>
      </div>
    );
  };

  const kpiCards = useMemo(
    () =>
      [
        {
          label: "Total Customers",
          value: cards?.totalCustomers ?? 0,
          icon: Users,
          gradient: "from-blue-500 to-blue-600",
        },
        {
          label: "Individual Customers",
          value: cards?.totalIndividualCustomers ?? 0,
          icon: User,
          gradient: "from-purple-500 to-purple-600",
        },
        {
          label: "Company Customers",
          value: cards?.totalCompanyCustomers ?? 0,
          icon: Building2,
          gradient: "from-emerald-500 to-emerald-600",
        },
        {
          label: "Export Customers",
          value: cards?.exportCustomers ?? 0,
          icon: Globe,
          gradient: "from-amber-500 to-amber-600",
        },
        {
          label: "Non-Export Customers",
          value: cards?.nonExportCustomers ?? 0,
          icon: BadgeX,
          gradient: "from-sky-500 to-sky-600",
        },
        {
          label: "LOP Customers",
          value: cards?.lopCustomers ?? 0,
          icon: BadgeCheck,
          gradient: "from-indigo-500 to-indigo-600",
        },
      ],
    [cards],
  );

  const customerTypeBarData = useMemo(
    () => [
      {
        name: "Individual",
        value: Number(cards?.totalIndividualCustomers ?? 0),
      },
      {
        name: "Company",
        value: Number(cards?.totalCompanyCustomers ?? 0),
      },
    ],
    [cards],
  );

  const exportDonutData = useMemo(
    () => [
      { name: "Export", value: Number(cards?.exportCustomers ?? 0) },
      { name: "Non-Export", value: Number(cards?.nonExportCustomers ?? 0) },
    ],
    [cards],
  );

  const lopPieData = useMemo(() => {
    const lop = Number(cards?.lopCustomers ?? 0);
    const total = Number(cards?.totalCustomers ?? 0);
    return [
      { name: "LOP", value: lop },
      { name: "Non-LOP", value: Math.max(0, total - lop) },
    ];
  }, [cards]);

  const totalsOverviewBarData = useMemo(
    () => [
      { name: "Total", value: Number(cards?.totalCustomers ?? 0) },
      { name: "Export", value: Number(cards?.exportCustomers ?? 0) },
      { name: "Non-Export", value: Number(cards?.nonExportCustomers ?? 0) },
      { name: "LOP", value: Number(cards?.lopCustomers ?? 0) },
    ],
    [cards],
  );

  return (
    <div className="bg-app min-h-screen px-4 sm:px-6 pb-6 pt-0 lg:h-screen lg:overflow-hidden">
      <div className="max-w-[1600px] mx-auto lg:h-full flex flex-col lg:min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-3 -mt-3 lg:-mt-3">
          {kpiCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[124px]"
            >
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-sm font-semibold text-gray-600">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-br ${card.gradient} rounded-xl shadow-sm`}>
                  <card.icon className="text-white" size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {summaryLoading && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 text-sm font-semibold">
            Loading customer dashboard summary...
          </div>
        )}

        {summaryError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
            {summaryError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
          <div className="bg-card border border-theme rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-bold text-main">Customer Types</h3>
            </div>

            <div className="h-[180px] sm:h-[200px] lg:h-[200px]">
              {summaryLoading ? (
                <ChartSkeleton variant="bar" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerTypeBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 600 }}
                />
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
                  cursor={{ fill: "var(--primary)", opacity: 0.1 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="value" fill={palette.purple} radius={[6, 6, 0, 0]} name="Customers" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-card border border-theme rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-bold text-main">Export vs Non-Export</h3>
            </div>

            <div className="h-[180px] sm:h-[200px] lg:h-[200px]">
              {summaryLoading ? (
                <ChartSkeleton variant="pie" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
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
                  data={exportDonutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="42%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {exportDonutData.map((_, idx) => (
                    <Cell key={idx} fill={idx === 0 ? palette.emerald : palette.slate} />
                  ))}
                </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-card border border-theme rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-bold text-main">LOP Customers</h3>
            </div>

            <div className="h-[180px] sm:h-[200px] lg:h-[200px]">
              {summaryLoading ? (
                <ChartSkeleton variant="pie" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
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
                  data={lopPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="42%"
                  outerRadius={70}
                >
                  {lopPieData.map((_, idx) => (
                    <Cell key={idx} fill={idx === 0 ? palette.amber : palette.blue} />
                  ))}
                </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-card border border-theme rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-bold text-main">Totals Overview</h3>
            </div>

            <div className="h-[180px] sm:h-[200px] lg:h-[200px]">
              {summaryLoading ? (
                <ChartSkeleton variant="bar" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={totalsOverviewBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 600 }}
                />
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
                  cursor={{ fill: "var(--primary)", opacity: 0.1 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="value" fill={palette.blue} radius={[6, 6, 0, 0]} name="Customers" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;
