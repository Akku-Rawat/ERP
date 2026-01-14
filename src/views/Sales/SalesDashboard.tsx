import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Types for time range and sales trend data
type TimeRange = "Today" | "This Week" | "This Month";
type SalesDataPoint = { name: string; ThisYear: number; LastYear: number };

const kpiStats = [
  {
    label: "Total Revenue",
    value: "$125.5k",
    change: "+12% vs last month",
    changeColor: "text-green-600",
  },
  {
    label: "Orders Placed",
    value: "320",
    change: "-5% vs last month",
    changeColor: "text-red-500",
  },
  {
    label: "Average Order Value",
    value: "$392",
    change: "+8% vs last month",
    changeColor: "text-green-600",
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
  {
    name: "Product A",
    category: "Electronics",
    units: 150,
    revenue: "$30,000",
  },
  { name: "Product B", category: "Clothing", units: 200, revenue: "$25,000" },
  { name: "Product C", category: "Home Goods", units: 100, revenue: "$20,000" },
  { name: "Product D", category: "Books", units: 250, revenue: "$15,000" },
  { name: "Product E", category: "Toys", units: 180, revenue: "$10,000" },
];

const timeRanges: TimeRange[] = ["Today", "This Week", "This Month"];

// Customer Volume Card component
const CustomerVolumeCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center h-full">
    <div className="font-semibold text-xl mb-6">Customer Volume</div>
    <div
      className="relative flex justify-center items-center mb-6"
      style={{ height: 220, width: 220 }}
    >
      {/*  SVG Circle */}
      <svg width={210} height={210}>
        <circle
          cx={110}
          cy={110}
          r={90}
          stroke="#e5e7eb"
          strokeWidth={14}
          fill="none"
        />
        <circle
          cx={110}
          cy={110}
          r={90}
          stroke="#2563eb"
          strokeWidth={14}
          fill="none"
          strokeDasharray={`${Math.PI * 2 * 85 * 0.15} ${Math.PI * 2 * 85 * 0.85}`}
          strokeDashoffset={Math.PI * 2 * 85 * 0.325}
          style={{ transition: "stroke-dasharray 0.4s" }}
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-blue-600">+15%</span>
        <span className="text-xl mt-2 text-gray-600 font-medium">
          New Customer
        </span>
      </div>
    </div>
    <div className="flex w-full justify-around items-center mt-2">
      <div className="flex items-center gap-1">
        <span className="inline-block w-4 h-4 rounded bg-blue-100"></span>
        <span className="text-gray-600 text-m">Current Customer</span>
        <span className="mr-15 font-semibold text-gray-900 text-m">85%</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="inline-block w-4 h-4 rounded bg-blue-600"></span>
        <span className="text-gray-600 text-m">New Customer</span>
        <span className="mr-15 font-semibold text-blue-600 text-m">15%</span>
      </div>
    </div>
  </div>
);

const SalesDashboard: React.FC = () => {
  const [selectedRange, setSelectedRange] =
    React.useState<TimeRange>("This Month");

  return (
    <div className="bg-app w-full pb-8">
      <div className="max-w-auto mx-auto px-6">
        {/* KPI Cards */}
        <div className="flex gap-5 mb-8 flex-wrap">
          {kpiStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border p-5 flex-1 min-w-[230px] mt-5"
            >
              <div className="text-gray-500 text-[15px] mb-1 font-medium">
                {stat.label}
              </div>
              <div className="text-2xl font-extrabold">{stat.value}</div>
              <div className={`text-xs font-semibold mt-1 ${stat.changeColor}`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>
        {/* Sales Trends + Customer Volume side-by-side */}
        <div className="flex gap-8 mb-8">
          {/* Customer Volume Card  */}
          <div className="w-[40%] min-w-[260px] flex flex-col">
            <CustomerVolumeCard />
          </div>

          {/* Chart */}
          <div className="w-[60%]">
            <div className="bg-white rounded-xl shadow p-8 h-full">
              {/* Time range selector and trends chart */}
              <div className="flex gap-2 mb-4">
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`rounded-md px-3 py-1 font-semibold ${
                      selectedRange === range
                        ? "bg-blue-600 text-white border border-blue-600"
                        : "bg-white text-gray-600 border border-gray-200"
                    }`}
                    aria-pressed={selectedRange === range}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <div className="font-semibold text-2xl mb-3">Sales Trends</div>
              <div className="flex justify-end items-center mb-4">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-1"></span>
                <span className="mr-3 text-md text-blue-600 font-bold">
                  This Year
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                <span className="text-md text-gray-500 font-bold">
                  Last Year
                </span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={salesTrendData[selectedRange]}>
                  <defs>
                    <linearGradient
                      id="colorThisYear"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.5} />
                      <stop
                        offset="95%"
                        stopColor="#2563eb"
                        stopOpacity={0.03}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    className="text-sm"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-sm"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #ddd",
                      fontSize: 13,
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                    cursor={{ fill: "#ddd6fe", opacity: 0.12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ThisYear"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#colorThisYear)"
                  />
                  <Area
                    type="monotone"
                    dataKey="LastYear"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
          <div className="font-semibold text-lg mb-4">Top Products</div>
          <table className="min-w-full">
            <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
              <tr>
                <th className="px-6 py-4 text-left rounded-l-xl">Product</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Units Sold</th>
                <th className="px-6 py-4 text-left rounded-r-xl">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((p) => (
                <tr
                  key={p.name}
                  className="hover:bg-indigo-50/70 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{p.category}</td>
                  <td className="px-6 py-4 text-indigo-700">{p.units}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    ₹{p.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {topProducts.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No top products found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
