import React from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const kpiData = [
  { label: "Leads", value: 42, change: 5 },
  { label: "Tickets", value: 9, change: -1 },
  { label: "Closed Deals", value: 7, change: 3 },
];

const salesTrend = [
  { month: "Jan", sales: 5000 },
  { month: "Feb", sales: 7500 },
  { month: "Mar", sales: 4000 },
  { month: "Apr", sales: 9000 },
  { month: "May", sales: 11000 },
  { month: "Jun", sales: 9500 },
];


type KPIChangeProps = {
  change: number;
};

const KPIChange = ({ change }: KPIChangeProps) => (
  <span className={`ml-2 text-xl font-semibold ${
    change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
  }`}>
    {change > 0 ? `+${change}% vs last month` : `${change}% vs last month`}
  </span>
);

const CRMDashboard = () => (
  <div className="bg-[#f8fafc] min-h-screen w-full p-8">
    {/* KPIs*/}
    <div className="flex gap-8 mb-10 flex-wrap">
      {kpiData.map(({ label, value, change }) => (
        <div
          key={label}
          className="bg-white rounded-[28px] border border-black p-8 flex-1 min-w-[90px] min-h-[100px] flex flex-col justify-center"
        >
          <div className="text-2xl font-semibold text-gray-500 mb-1">{label}</div>
          <div className="text-[30px] leading-tight font-extrabold text-black mb-1">{value}</div>
          <KPIChange change={change} />
        </div>
      ))}
    </div>

    {/* Sales Trend Line Chart */}
    <div className="bg-white rounded-xl shadow p-8 mt-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Sales Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesTrend}>
          <CartesianGrid stroke="#f0f0f0" strokeDasharray="4 4" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#38bdf8" strokeWidth={4} animationDuration={1200} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default CRMDashboard;
