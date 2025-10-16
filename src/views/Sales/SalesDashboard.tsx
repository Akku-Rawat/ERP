import * as React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
   FaFileInvoice, FaShoppingCart, FaRegChartBar, FaFileInvoiceDollar,
  FaPercent
} from "react-icons/fa";

// Card colors
const cardColors = {
  quotations: "bg-blue-50 text-blue-800",
  invoices: "bg-green-50 text-green-800",
  pos: "bg-yellow-50 text-yellow-800",
  pricing: "bg-indigo-50 text-indigo-800",
};

const stats = {
  quotations: 3,
  invoices: 5,
  pos: 235,
  pricing: 4,
  revenue: 150000,
  unpaid: 2,
  overdue: 1,
};

const salesTrendData = [
  { name: "Apr", Quotations: 2, Invoices: 1, POS: 25 },
  { name: "May", Quotations: 4, Invoices: 3, POS: 28 },
  { name: "Jun", Quotations: 3, Invoices: 2, POS: 31 },
  { name: "Jul", Quotations: 5, Invoices: 4, POS: 43 },
  { name: "Aug", Quotations: 3, Invoices: 5, POS: 48 },
  { name: "Sep", Quotations: 8, Invoices: 6, POS: 60 },
  { name: "Oct", Quotations: 2, Invoices: 4, POS: 0 }
];

const summaryCards = [
  {
    label: "Quotations",
    value: stats.quotations,
    icon: <FaFileInvoice className="text-xl" />,
    color: cardColors.quotations
  },
  {
    label: "Invoices",
    value: stats.invoices,
    icon: <FaFileInvoiceDollar className="text-xl" />,
    color: cardColors.invoices
  },
  {
    label: "POS Sales",
    value: stats.pos,
    icon: <FaShoppingCart className="text-xl" />,
    color: cardColors.pos
  },
  {
    label: "Pricing & Tax Rules",
    value: stats.pricing,
    icon: <FaPercent className="text-xl" />,
    color: cardColors.pricing
  }
];

const revenueSummary = [
  {
    label: "Total Revenue",
    value: `₹${stats.revenue.toLocaleString()}`,
    icon: <FaRegChartBar className="text-xl text-green-700" />,
    color: "bg-green-50 text-green-800"
  },
  {
    label: "Unpaid Invoices",
    value: stats.unpaid,
    icon: <FaFileInvoiceDollar className="text-xl text-yellow-700" />,
    color: "bg-yellow-50 text-yellow-800"
  },
  {
    label: "Overdue Invoices",
    value: stats.overdue,
    icon: <FaFileInvoiceDollar className="text-xl text-red-700" />,
    color: "bg-red-50 text-red-800"
  }
];

const SalesDashboard: React.FC = () => {
  return (
    <div className="p-8">
      {/* Dashboard Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
        {summaryCards.map(card => (
          <div
            key={card.label}
            className={`rounded-xl shadow-md px-6 py-6 flex items-center gap-4 ${card.color}`}
          >
            {card.icon}
            <div>
              <div className="font-bold text-lg">{card.value}</div>
              <div className="text-sm">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue/Invoice Summary Cards */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        {revenueSummary.map(card => (
          <div
            key={card.label}
            className={`flex-1 rounded-xl shadow px-7 py-5 flex items-center gap-5 ${card.color}`}
          >
            {card.icon}
            <div>
              <div className="font-bold text-xl">{card.value}</div>
              <div className="text-sm">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Bar Chart */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-100 rounded-xl p-7 shadow-lg mb-7">
        <div className="font-bold text-2xl text-blue-700 mb-3">Monthly Sales Activity</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={salesTrendData}
            margin={{ top: 16, right: 16, left: 0, bottom: 28 }}
            barCategoryGap="18%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
            <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: "#cbd5e1" }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={{ stroke: "#cbd5e1" }} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #ddd", fontSize: 13, borderRadius: 8, padding: "8px 10px" }}
              cursor={{ fill: "#ddd6fe", opacity: 0.2 }}
              formatter={(value: any, key: any) => [`${value}`, key]}
            />
             <Legend 
              iconSize={18} 
              wrapperStyle={{ fontSize: 15, marginTop: -12, marginLeft: 0, lineHeight: "22px" }} 
             align="left" 
             verticalAlign="top" 
                 />
            <Bar dataKey="Quotations" fill="#6366f1" barSize={32} />
            <Bar dataKey="Invoices" fill="#22c55e" barSize={32} />
            <Bar dataKey="POS" fill="#eab308" barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-5 mt-2">
        <div className="font-semibold text-lg text-gray-900 mb-2">Recent Sales Records</div>
        <div className="text-gray-500 mb-4">
        </div>
        {/* Map your recent sales items here */}
        <table className="min-w-full table-auto border-separate border-spacing-y-2">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 text-left rounded-l-xl">Type</th>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left rounded-r-xl">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows */}
            <tr className="bg-white border-y group hover:shadow-md transition-all">
              <td className="px-4 py-3 font-semibold">Quotation</td>
              <td className="px-4 py-3">QUO-001</td>
              <td className="px-4 py-3">Acme Corp</td>
              <td className="px-4 py-3">2025-10-14</td>
              <td className="px-4 py-3">₹25,000</td>
              <td className="px-4 py-3">Awaiting Response</td>
            </tr>
            <tr className="bg-white border-y group hover:shadow-md transition-all">
              <td className="px-4 py-3 font-semibold">Invoice</td>
              <td className="px-4 py-3">INV-003</td>
              <td className="px-4 py-3">Initech</td>
              <td className="px-4 py-3">2025-10-05</td>
              <td className="px-4 py-3">₹45,000</td>
              <td className="px-4 py-3">Pending</td>
            </tr>
            <tr className="bg-white border-y group hover:shadow-md transition-all">
              <td className="px-4 py-3 font-semibold">POS</td>
              <td className="px-4 py-3">POS-021</td>
              <td className="px-4 py-3">Retail Walk-in</td>
              <td className="px-4 py-3">2025-10-13</td>
              <td className="px-4 py-3">₹2,150</td>
              <td className="px-4 py-3">Paid</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDashboard;
