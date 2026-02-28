import { useMemo, useState } from "react";
import { DollarSign, FileText, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SalarySlipListItem } from "../../../api/salarySlipApi";

const fmtZMW = (n: number) => Number(n || 0).toLocaleString("en-ZM");

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

const KPI_CARD_BASE = "bg-card rounded-xl p-6 flex flex-col items-start shadow-sm";
const CHART_CARD_BASE = KPI_CARD_BASE;

type PeriodPreset = "all" | "this_month" | "last_3" | "last_6" | "last_12" | "custom_month";

const getMonthKey = (d: string) => {
  const s = String(d || "").trim();
  if (!s) return "";
  // Expecting YYYY-MM-DD
  return s.slice(0, 7);
};

const addMonths = (date: Date, deltaMonths: number) => {
  const d = new Date(date);
  const m = d.getMonth() + deltaMonths;
  d.setMonth(m);
  return d;
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const toIsoDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export type PayrollReportsDashboardProps = {
  slips: SalarySlipListItem[];
  loading?: boolean;
  error?: string | null;
};

export default function PayrollReportsDashboard({ slips, loading, error }: PayrollReportsDashboardProps) {
  const safeSlips = Array.isArray(slips) ? slips : [];

  const [period, setPeriod] = useState<PeriodPreset>("last_12");
  const [customMonth, setCustomMonth] = useState<string>("");

  const filteredSlips = useMemo(() => {
    if (period === "all") return safeSlips;

    const today = new Date();
    const thisMonthStart = startOfMonth(today);

    const slipDateIso = (s: SalarySlipListItem) => {
      return String(s.end_date || s.start_date || "").trim();
    };

    if (period === "custom_month") {
      const mk = String(customMonth || "").trim();
      if (!mk) return safeSlips;
      return safeSlips.filter((s) => getMonthKey(slipDateIso(s)) === mk);
    }

    if (period === "this_month") {
      const mk = getMonthKey(toIsoDate(thisMonthStart));
      return safeSlips.filter((s) => getMonthKey(slipDateIso(s)) === mk);
    }

    const monthsBack =
      period === "last_3" ? 3 : period === "last_6" ? 6 : period === "last_12" ? 12 : 12;

    const start = startOfMonth(addMonths(today, -(monthsBack - 1)));
    const startIso = toIsoDate(start);
    return safeSlips.filter((s) => {
      const d = slipDateIso(s);
      if (!d) return false;
      // ISO string compare is safe for YYYY-MM-DD
      return d >= startIso;
    });
  }, [customMonth, period, safeSlips]);

  const kpis = useMemo(() => {
    const totalGross = filteredSlips.reduce((s, r) => s + Number(r.total_earnings ?? 0), 0);
    const totalDed = filteredSlips.reduce((s, r) => s + Number(r.total_deduction ?? 0), 0);
    const totalNet = filteredSlips.reduce((s, r) => s + Number(r.net_pay ?? 0), 0);

    return {
      slipCount: filteredSlips.length,
      totalGross,
      totalDed,
      totalNet,
    };
  }, [filteredSlips]);

  const currencyZMW = useMemo(
    () =>
      new Intl.NumberFormat("en-ZM", {
        style: "currency",
        currency: "ZMW",
        maximumFractionDigits: 2,
      }),
    [],
  );

  const kpiCards = useMemo(
    () => [
      {
        label: "Salary Slips",
        value: loading ? "—" : String(kpis.slipCount.toLocaleString("en-ZM")),
        icon: FileText,
        color: "text-blue-600 bg-blue-50",
      },
      {
        label: "Total Earnings",
        value: loading ? "—" : currencyZMW.format(kpis.totalGross),
        icon: TrendingUp,
        color: "text-emerald-600 bg-emerald-50",
      },
      {
        label: "Total Deductions",
        value: loading ? "—" : currencyZMW.format(kpis.totalDed),
        icon: Users,
        color: "text-amber-600 bg-amber-50",
      },
      {
        label: "Total Net Pay",
        value: loading ? "—" : currencyZMW.format(kpis.totalNet),
        icon: DollarSign,
        color: "text-purple-600 bg-purple-50",
      },
    ],
    [currencyZMW, kpis.slipCount, kpis.totalDed, kpis.totalGross, kpis.totalNet, loading],
  );

  const statusData = useMemo(() => {
    const map = filteredSlips.reduce((acc: Record<string, number>, r) => {
      const raw = String(r.status ?? "").trim();
      const normalized = raw.toLowerCase() === "submitted" ? "Paid" : raw || "Unknown";
      acc[normalized] = (acc[normalized] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(map)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredSlips]);

  const topEmployees = useMemo(() => {
    const netByEmployee = filteredSlips.reduce((acc: Record<string, number>, r) => {
      const emp = String(r.employee ?? "").trim() || "Unknown";
      acc[emp] = (acc[emp] || 0) + Number(r.net_pay ?? 0);
      return acc;
    }, {});

    return Object.entries(netByEmployee)
      .map(([employee, net]) => ({ employee, net: Math.round(net) }))
      .sort((a, b) => b.net - a.net)
      .slice(0, 8);
  }, [filteredSlips]);

  const monthlyTrend = useMemo(() => {
    const map = filteredSlips.reduce(
      (acc: Record<string, { month: string; gross: number; deductions: number; net: number; slips: number }>, r) => {
        const key = getMonthKey(r.end_date) || getMonthKey(r.start_date) || "Unknown";
        if (!acc[key]) acc[key] = { month: key, gross: 0, deductions: 0, net: 0, slips: 0 };
        acc[key].gross += Number(r.total_earnings ?? 0);
        acc[key].deductions += Number(r.total_deduction ?? 0);
        acc[key].net += Number(r.net_pay ?? 0);
        acc[key].slips += 1;
        return acc;
      },
      {},
    );

    return Object.values(map)
      .sort((a, b) => String(a.month).localeCompare(String(b.month)))
      .slice(-12);
  }, [filteredSlips]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2 flex-wrap">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as PeriodPreset)}
          className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 shadow-sm focus:outline-none"
        >
          <option value="last_12">Last 12 months</option>
          <option value="last_6">Last 6 months</option>
          <option value="last_3">Last 3 months</option>
          <option value="this_month">This month</option>
          <option value="custom_month">Select month…</option>
          <option value="all">All time</option>
        </select>

        {period === "custom_month" && (
          <input
            type="month"
            value={customMonth}
            onChange={(e) => setCustomMonth(e.target.value)}
            className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 shadow-sm focus:outline-none"
          />
        )}

        {period === "custom_month" && customMonth && (
          <button
            type="button"
            onClick={() => setCustomMonth("")}
            className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={KPI_CARD_BASE}>
              <div className="flex items-start justify-between w-full">
                <div>
                  <div className="text-xs font-semibold text-muted tracking-wide uppercase">{c.label}</div>
                  <div className="text-xl font-bold text-main mt-1.5 tabular-nums">{c.value}</div>
                </div>
                <div
                  className={`h-10 w-10 rounded-md flex items-center justify-center ${c.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={CHART_CARD_BASE}>
          <div>
            <div className="text-sm font-semibold text-gray-600">Status Distribution</div>
          </div>
          <div className="h-[280px] mt-4">
            {loading ? (
              <div className="h-full rounded-lg bg-muted/5 animate-pulse" />
            ) : statusData.length === 0 ? (
              <div className="text-sm text-muted mt-6">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {statusData.map((_, idx) => (
                      <Cell key={String(idx)} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={CHART_CARD_BASE}>
          <div>
            <div className="text-sm font-semibold text-gray-600">Top Employees by Net Pay</div>
          </div>
          <div className="h-[280px] mt-4">
            {loading ? (
              <div className="h-full rounded-lg bg-muted/5 animate-pulse" />
            ) : topEmployees.length === 0 ? (
              <div className="text-sm text-muted mt-6">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEmployees} margin={{ top: 8, right: 12, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="employee"
                    angle={-25}
                    textAnchor="end"
                    height={55}
                    interval={0}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }}
                    formatter={(v: any) => [`ZMW ${fmtZMW(Number(v || 0))}`, "Net Pay"]}
                  />
                  <Bar dataKey="net" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className={CHART_CARD_BASE}>
        <div>
          <div className="text-sm font-semibold text-gray-600">Monthly Trend</div>
        </div>
        <div className="h-[280px] mt-4">
          {loading ? (
            <div className="h-full rounded-lg bg-muted/5 animate-pulse" />
          ) : monthlyTrend.length === 0 ? (
            <div className="text-sm text-muted mt-6">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} margin={{ top: 8, right: 12, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }}
                  formatter={(v: any, name: any) => {
                    const label = name === "gross" ? "Earnings" : name === "deductions" ? "Deductions" : "Net Pay";
                    return [`ZMW ${fmtZMW(Number(v || 0))}`, label];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="gross"
                  name="Earnings"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                  yAxisId="left"
                />
                <Line
                  type="monotone"
                  dataKey="deductions"
                  name="Deductions"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                  yAxisId="right"
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  name="Net Pay"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                  yAxisId="left"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
