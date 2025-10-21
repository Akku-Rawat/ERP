import React from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// Types
type TrendRangeType = "This Month" | "Last Month" | "This Year";
type TrendDataPoint = { label: string; sales: number };

// KPI Cards
const kpiData = [
  { label: "Leads", value: 42, change: 5 },
  { label: "Tickets", value: 9, change: -1 },
  { label: "Closed Deals", value: 7, change: 3 },
];

// Table Data
const topOpportunities = [
  { name: "Tech Corp", stage: "Proposal Sent", value: "$20,000" },
  { name: "Smartsoft LLC", stage: "Negotiation", value: "$15,000" },
  { name: "Acme Bank", stage: "Demo Scheduled", value: "$9,800" },
  { name: "QuickMart", stage: "Won (Closed)", value: "$6,500" },
];

// Time Ranges + Chart Data
const timeRanges: TrendRangeType[] = ["This Month", "Last Month", "This Year"];

const salesTrendByPeriod: Record<TrendRangeType, TrendDataPoint[]> = {
  "This Month": [
    { label: "Week 1", sales: 5000 },
    { label: "Week 2", sales: 7500 },
    { label: "Week 3", sales: 4000 },
    { label: "Week 4", sales: 9000 },
  ],
  "Last Month": [
    { label: "Week 1", sales: 4000 },
    { label: "Week 2", sales: 6000 },
    { label: "Week 3", sales: 3000 },
    { label: "Week 4", sales: 8000 },
  ],
  "This Year": [
    { label: "Jan", sales: 5000 },
    { label: "Feb", sales: 7500 },
    { label: "Mar", sales: 4000 },
    { label: "Apr", sales: 9000 },
    { label: "May", sales: 11000 },
    { label: "Jun", sales: 9500 },
  ],
};

// Pie chart data for CRM Lead Sources
const leadSources = [
  { name: "Website", value: 26 },
  { name: "Referral", value: 13 },
  { name: "LinkedIn", value: 18 },
  { name: "Events", value: 10 },
  { name: "Email Campaign", value: 8 },
];

const COLORS = ["#2563eb", "#60a5fa", "#a5b4fc", "#818cf8", "#38bdf8"];

type KPIChangeProps = { change: number };

const KPIChange: React.FC<KPIChangeProps> = ({ change }) => (
  <span className={`ml-2 text-[16px] font-semibold ${change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"}`}>
    {change > 0 ? `+${change}% vs last month` : `${change}% vs last month`}
  </span>
);

const CRMDashboard: React.FC = () => {
  const [selectedRange, setSelectedRange] = React.useState<TrendRangeType>("This Month");

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full pb-8">
      <div className="max-w-auto mx-auto px-6">
        {/* KPI CARDS */}
  
<div className="flex gap-5 mb-8 flex-wrap">
  {kpiData.map(({ label, value, change }) => (
    <div
      key={label}
      className="bg-white rounded-xl shadow-sm border p-5 flex-1 min-w-[230px] mt-5"
    >
      <div className="text-gray-500 text-[15px] mb-1 font-medium">{label}</div>
      <div className="text-2xl font-extrabold">{value}</div>
      <KPIChange change={change} />
    </div>
  ))}
</div>


        <div className="flex gap-8 mb-8">
  {/* LEFT: Lead Sources Pie Chart */}
  <div className="w-[40%] min-w-[260px]">
    <div className="bg-white rounded-xl shadow p-8 h-full flex flex-col items-center justify-start">
      <div className="font-semibold text-2xl mb-4 mt-0" style={{ marginTop: "0.5rem" }}>Lead Sources</div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={leadSources}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="43%"
            outerRadius={90}
            innerRadius={58}
            labelLine={false}
          >
            {leadSources.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => {
              const total = leadSources.reduce((sum, item) => sum + item.value, 0);
              const percent = Math.round((value / total) * 100);
              return [`${value} (${percent}%)`, name];
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            formatter={(value) => (
              <span style={{ fontWeight: "bold", fontSize: 18 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* RIGHT: Sales Trend Chart */}
  <div className="w-[60%]">
    <div className="bg-white rounded-xl shadow p-8 h-full">
      <div className="flex gap-2 mb-4">
        {timeRanges.map(range => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`rounded-md px-3 py-1 text-base font-semibold transition ${
              selectedRange === range
                ? "bg-blue-600 text-white border border-blue-600"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
            aria-pressed={selectedRange === range}
          >{range}</button>
        ))}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Monthly Sales Trend</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={salesTrendByPeriod[selectedRange]}>
          <CartesianGrid stroke="#f0f0f0" strokeDasharray="4 4" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={4} dot={{ r: 5 }} animationDuration={1200} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>


        {/* Top Opportunities Table */}
        <div className="bg-white rounded-xl shadow p-8">
          <div className="font-semibold text-lg mb-3">Top Opportunities</div>
          <table className="min-w-full text-left ">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-xs uppercase">
                <th className="px-4 py-3 rounded-l-xl font-bold">Client</th>
                <th className="px-4 py-3 font-bold">Stage</th>
                <th className="px-4 py-3 rounded-r-xl font-bold">Value</th>
              </tr>
            </thead>
            <tbody>
              {topOpportunities.map((op) => (
                <tr key={op.name} className="bg-white group hover:bg-blue-50 transition border-t">
                  <td className="px-4 py-3 font-semibold">{op.name}</td>
                  <td className="px-4 py-3 text-gray-700">{op.stage}</td>
                  <td className="px-4 py-3 text-gray-700">{op.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default CRMDashboard;
