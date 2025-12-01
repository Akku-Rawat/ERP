import React from "react";
import {
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#6366F1", "#06b6d4", "#f59e42", "#65A30D", "#EA580C"];

const dashboardData = {
  stats: [
    {
      label: "Open RFQs",
      value: 8,
      delta: 2,
      icon: <FaClipboardList className="text-blue-500 w-5 h-5" />,
      bg: "bg-blue-50",
    },
    {
      label: "Open Purchase Orders",
      value: 12,
      delta: -1,
      icon: <FaTruck className="text-teal-600 w-5 h-5" />,
      bg: "bg-teal-50",
    },
    {
      label: "Invoices Pending Match",
      value: 3,
      delta: 1,
      icon: <FaMoneyCheckAlt className="text-indigo-600 w-5 h-5" />,
      bg: "bg-indigo-50",
    },
    {
      label: "Goods Receipts Pending",
      value: 2,
      delta: 0,
      icon: <FaExclamationTriangle className="text-yellow-500 w-5 h-5" />,
      bg: "bg-yellow-50",
    },
  ],
  spendByCategory: [
    { category: "Raw Materials", value: 140000 },
    { category: "Capex", value: 50000 },
    { category: "IT Equipment", value: 35000 },
    { category: "Services", value: 22000 },
  ],
  approvalBottlenecks: [
    { user: "Priya Verma", count: 3, color: "bg-pink-100 text-pink-700" },
    { user: "Sandeep Rana", count: 2, color: "bg-blue-100 text-blue-700" },
  ],
  topSuppliers: [
    { supplier: "TechSupply Co", value: 73000 },
    { supplier: "Office Solutions", value: 46000 },
  ],
};

const ProcurementDashboard: React.FC = () => (
  <div className="space-y-8">
    {/* Stat Cards Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {dashboardData.stats.map((stat, i) => (
        <div
          key={i}
          className={`rounded-xl shadow-md p-5 flex flex-col items-center justify-center ${stat.bg} hover:shadow-lg transition`}
        >
          <div className="mb-2">{stat.icon}</div>
          <div className="text-3xl font-bold flex items-center gap-2">
            {stat.value}
            {stat.delta !== undefined && (
              <span
                className={`flex items-center text-xs font-semibold ${stat.delta > 0 ? "text-red-500" : stat.delta < 0 ? "text-green-600" : "text-gray-400"}`}
              >
                {stat.delta > 0 && <FaChevronUp />}
                {stat.delta < 0 && <FaChevronDown />}
                {Math.abs(stat.delta)}
              </span>
            )}
          </div>
          <div className="text-gray-700 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>

    {/* Lower Analytics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Spend by Category Panel */}
      <div className="bg-white rounded-xl p-6 shadow space-y-4 border col-span-1 md:col-span-2">
        <div className="font-semibold text-lg mb-2">Spend By Category</div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/2 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.spendByCategory}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  labelLine={false}
                >
                  {dashboardData.spendByCategory.map((entry, idx) => (
                    <Cell
                      key={entry.category}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.spendByCategory.map((row, i) => (
                  <tr key={i} className="border-b last:border-none">
                    <td className="p-2">{row.category}</td>
                    <td className="p-2 text-right">
                      {row.value.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Approval Bottlenecks & Top Suppliers */}
      <div className="space-y-7">
        <div className="bg-white rounded-xl p-6 shadow border">
          <div className="font-semibold text-lg mb-2">Approval Bottlenecks</div>
          {dashboardData.approvalBottlenecks.length === 0 ? (
            <div className="text-gray-400 text-sm">No bottlenecks 🎉</div>
          ) : (
            <ul className="space-y-2">
              {dashboardData.approvalBottlenecks.map((row, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div className={`flex items-center gap-2`}>
                    <span
                      className={`inline-block rounded-full w-7 h-7 flex items-center justify-center font-bold uppercase ${row.color}`}
                    >
                      {row.user
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    </span>
                    <span>{row.user}</span>
                  </div>
                  <span className="font-bold">
                    <FaExclamationTriangle className="inline text-yellow-500 mr-1" />
                    {row.count} pending
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-xl p-6 shadow border">
          <div className="font-semibold text-lg mb-2">
            Top Suppliers This Quarter
          </div>
          <ul className="space-y-2">
            {dashboardData.topSuppliers.map((row, i) => (
              <li key={i} className="flex justify-between items-center">
                <span className="font-medium">{row.supplier}</span>
                <span className="font-semibold">
                  &#8377; {row.value.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    {/* Footer */}
    <div className="text-xs text-gray-400 text-right pt-2">
      Data as of {new Date().toLocaleDateString()}
    </div>
  </div>
);

export default ProcurementDashboard;
