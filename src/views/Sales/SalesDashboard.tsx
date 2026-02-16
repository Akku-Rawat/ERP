import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Users, Package, DollarSign } from "lucide-react";

type TimeRange = "Today" | "This Week" | "This Month";
type SalesDataPoint = { name: string; ThisYear: number; LastYear: number };

const kpiStats = [
  {
    label: "Total Revenue",
    value: "$125.5k",
    change: "+12%",
    trend: "up",
    icon: DollarSign,
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    label: "Orders Placed",
    value: "320",
    change: "-5%",
    trend: "down",
    icon: Package,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    label: "Average Order Value",
    value: "$392",
    change: "+8%",
    trend: "up",
    icon: TrendingUp,
    gradient: "from-purple-500 to-purple-600",
  },
];

const salesTrendData: Record<TimeRange, SalesDataPoint[]> = {
  Today: [
    { name: "12AM", ThisYear: 3, LastYear: 1 },
    { name: "4AM", ThisYear: 4, LastYear: 2 },
    { name: "8AM", ThisYear: 7, LastYear: 2 },
    { name: "12PM", ThisYear: 9, LastYear: 5 },
    { name: "4PM", ThisYear: 12, LastYear: 7 },
    { name: "8PM", ThisYear: 7, LastYear: 3 },
  ],
  "This Week": [
    { name: "Mon", ThisYear: 10, LastYear: 5 },
    { name: "Tue", ThisYear: 16, LastYear: 7 },
    { name: "Wed", ThisYear: 11, LastYear: 8 },
    { name: "Thu", ThisYear: 22, LastYear: 10 },
    { name: "Fri", ThisYear: 28, LastYear: 12 },
    { name: "Sat", ThisYear: 21, LastYear: 11 },
    { name: "Sun", ThisYear: 15, LastYear: 6 },
  ],
  "This Month": [
    { name: "1", ThisYear: 2, LastYear: 1 },
    { name: "5", ThisYear: 6, LastYear: 2 },
    { name: "10", ThisYear: 7, LastYear: 3 },
    { name: "15", ThisYear: 12, LastYear: 8 },
    { name: "20", ThisYear: 13, LastYear: 9 },
    { name: "25", ThisYear: 16, LastYear: 11 },
    { name: "30", ThisYear: 11, LastYear: 6 },
  ],
};

const topProducts = [
  { name: "Product A", category: "Electronics", units: 150, revenue: "30,000" },
  { name: "Product B", category: "Clothing", units: 200, revenue: "25,000" },
  { name: "Product C", category: "Home Goods", units: 100, revenue: "20,000" },
  { name: "Product D", category: "Books", units: 250, revenue: "15,000" },
  { name: "Product E", category: "Toys", units: 180, revenue: "10,000" },
];

const timeRanges: TimeRange[] = ["Today", "This Week", "This Month"];

const CustomerVolumeCard: React.FC = () => {
  const percentage = 15;
  const currentCustomer = 85;
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-card border border-theme rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-center h-full">
      <div className="font-bold text-lg mb-6 text-main">Customer Volume</div>
      <div className="relative flex justify-center items-center mb-6" style={{ height: 220, width: 220 }}>
        <svg width={220} height={220} className="transform -rotate-90">
          <circle
            cx={110}
            cy={110}
            r={90}
            stroke="var(--border)"
            strokeWidth={16}
            fill="none"
            opacity={0.3}
          />
          <circle
            cx={110}
            cy={110}
            r={90}
            stroke="url(#customerGradient)"
            strokeWidth={16}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ 
              transition: "stroke-dashoffset 0.6s ease",
              filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))"
            }}
          />
          <defs>
            <linearGradient id="customerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            +{percentage}%
          </span>
          <span className="text-lg mt-2 text-muted font-semibold">New Customer</span>
        </div>
      </div>
      <div className="flex flex-col w-full gap-3 mt-4">
        <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-200"></span>
            <span className="text-main text-sm font-semibold">Current</span>
          </div>
          <span className="font-bold text-main">{currentCustomer}%</span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 bg-blue-600/10 rounded-lg border border-blue-600/30">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <span className="text-main text-sm font-semibold">New</span>
          </div>
          <span className="font-bold text-blue-600">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

const SalesDashboard: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("This Month");

  return (
    <div className="bg-app w-full min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
       

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {kpiStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-theme rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-lg shadow-sm group-hover:scale-110 transition-transform`}>
                  <stat.icon className="text-white" size={20} />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  stat.trend === "up" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}>
                  {stat.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </div>
              </div>
              <div className="text-muted text-sm font-semibold mb-1">{stat.label}</div>
              <div className="text-3xl font-bold text-main">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Sales Trends + Customer Volume */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Customer Volume - 2 columns */}
          <div className="lg:col-span-2">
            <CustomerVolumeCard />
          </div>

          {/* Sales Chart - 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-theme rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="text-lg font-bold text-main">Sales Trends</h3>
                <div className="flex gap-2">
                  {timeRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedRange(range)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedRange === range
                          ? "bg-primary text-white shadow-sm"
                          : "bg-app text-muted border border-theme hover:border-primary/30"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500"></span>
                  <span className="text-xs font-bold text-main">This Year</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1.5 rounded-full bg-gray-400"></span>
                  <span className="text-xs font-bold text-muted">Last Year</span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={salesTrendData[selectedRange]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                    </linearGradient>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--muted)', fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--muted)', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
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
                  <Area
                    type="monotone"
                    dataKey="ThisYear"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#colorThisYear)"
                    filter="url(#shadow)"
                  />
                  <Area
                    type="monotone"
                    dataKey="LastYear"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    fill="none"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-card border border-theme rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-theme bg-gradient-to-r from-app/50 to-transparent">
            <h3 className="text-lg font-bold text-main">Top Products</h3>
            <p className="text-xs text-muted mt-0.5">Best performing products this month</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="table-head">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold rounded-tl-xl">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-bold">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold">Units Sold</th>
                  <th className="px-6 py-4 text-left text-xs font-bold rounded-tr-xl">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {topProducts.map((p, idx) => (
                  <tr key={p.name} className="row-hover transition-all cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform">
                          {idx + 1}
                        </div>
                        <span className="font-bold text-main text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-app rounded-lg text-xs font-semibold text-main border border-theme">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-primary font-bold text-sm">{p.units}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-600 text-sm">₹{p.revenue}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {topProducts.length === 0 && (
            <div className="text-center py-12 text-muted">No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;