import * as React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Dummy data (adjust as needed)
const kpiStats = [
  {
    label: "Total Revenue",
    value: "$125.5k",
    change: "+12% vs last month",
    changeColor: "text-green-600"
  },
  {
    label: "Orders Placed",
    value: "320",
    change: "-5% vs last month",
    changeColor: "text-red-500"
  },
  {
    label: "Average Order Value",
    value: "$392",
    change: "+8% vs last month",
    changeColor: "text-green-600"
  }
];

const salesTrendData = [
  { name: "Jan", ThisYear: 30, LastYear: 24 },
  { name: "Feb", ThisYear: 40, LastYear: 22 },
  { name: "Mar", ThisYear: 35, LastYear: 27 },
  { name: "Apr", ThisYear: 50, LastYear: 39 },
  { name: "May", ThisYear: 45, LastYear: 37 },
  { name: "Jun", ThisYear: 43, LastYear: 41 },
  { name: "Jul", ThisYear: 47, LastYear: 39 },
  { name: "Aug", ThisYear: 38, LastYear: 36 },
  { name: "Sep", ThisYear: 65, LastYear: 36 },
  { name: "Oct", ThisYear: 56, LastYear: 44 },
  { name: "Nov", ThisYear: 36, LastYear: 39 },
  { name: "Dec", ThisYear: 62, LastYear: 43 }
];

const topProducts = [
  { name: "Product A", category: "Electronics", units: 150, revenue: "$30,000" },
  { name: "Product B", category: "Clothing", units: 200, revenue: "$25,000" },
  { name: "Product C", category: "Home Goods", units: 100, revenue: "$20,000" },
  { name: "Product D", category: "Books", units: 250, revenue: "$15,000" },
  { name: "Product E", category: "Toys", units: 180, revenue: "$10,000" }
];

const timeRanges = ["Today", "This Week", "This Month", "This Year"];

const SalesDashboard: React.FC = () => {
  const [selectedRange, setSelectedRange] = React.useState("This Month");

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full pb-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* KPI Cards Row */}
        <div className="flex gap-5 mb-8 flex-wrap">
          {kpiStats.map(stat => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border p-5 flex-1 min-w-[230px] mt-5"
            >
              <div className="text-gray-500 text-[15px] mb-1 font-medium">{stat.label}</div>
              <div className="text-2xl font-extrabold">{stat.value}</div>
              <div className={`text-xs font-semibold mt-1 ${stat.changeColor}`}>{stat.change}</div>
            </div>
          ))}
        </div>
        {/* Time Range Tabs */}
        <div className="flex gap-1 mb-6">
          {timeRanges.map(range => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`rounded-md px-3 py-1 font-semibold
                ${selectedRange === range 
                  ? "bg-blue-600 text-white border border-blue-600" 
                  : "bg-white text-gray-600 border border-gray-200"
                }`}
              aria-pressed={selectedRange === range}
            >
              {range}
            </button>
          ))}
        </div>
        {/* Sales Trends Area Chart */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="font-semibold text-lg mb-4">Sales Trends</div>
          <div className="flex justify-end items-center mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-1"></span>
            <span className="mr-3 text-xs text-blue-600 font-bold">This Year</span>
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
            <span className="text-xs text-gray-500 font-bold">Last Year</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesTrendData}>
              <defs>
                <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-sm"/>
              <YAxis axisLine={false} tickLine={false} className="text-sm"/>
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #ddd", fontSize: 13, borderRadius: 8, padding: "8px 10px" }}
                cursor={{ fill: "#ddd6fe", opacity: 0.12 }}
              />
              <Area type="monotone" dataKey="ThisYear" stroke="#2563eb" strokeWidth={3} fill="url(#colorThisYear)" />
              <Area type="monotone" dataKey="LastYear" stroke="#94a3b8" strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Top Products Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-semibold text-lg mb-3">Top Products</div>
          <table className="min-w-full ">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-xs uppercase">
                <th className="px-4 py-3 text-left rounded-l-xl font-bold">Product</th>
                <th className="px-4 py-3 text-left font-bold">Category</th>
                <th className="px-4 py-3 text-left font-bold">Units Sold</th>
                <th className="px-4 py-3 text-left rounded-r-xl font-bold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.name} className="bg-white group hover:bg-blue-50 transition border-t">
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="px-4 py-3 text-gray-700">{p.category}</td>
                  <td className="px-4 py-3 text-gray-700">{p.units}</td>
                  <td className="px-4 py-3 text-gray-700">{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <footer className="mt-10 pb-3 flex justify-between items-center text-xs text-gray-400">
          <span>© 2024 Sales Dashboard. All rights reserved.</span>
          <span className="space-x-3">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline ml-2">Terms of Service</a>
            <a href="#" className="hover:underline ml-2">Contact Us</a>
          </span>
        </footer>
      </div>
    </div>
  );
};

export default SalesDashboard;
