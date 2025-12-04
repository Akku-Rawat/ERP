import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  // --- Data Sets ---
  const revenueData = [
    { month: "Feb", earned: 50, forecasted: 40 },
    { month: "Mar", earned: 80, forecasted: 60 },
    { month: "Apr", earned: 70, forecasted: 90 },
    { month: "May", earned: 90, forecasted: 70 },
    { month: "Jun", earned: 60, forecasted: 100 },
    { month: "Jul", earned: 100, forecasted: 80 },
  ];

  const vendorData = [
    { day: "M", vendors: 200 },
    { day: "T", vendors: 300 },
    { day: "W", vendors: 250 },
    { day: "Th", vendors: 280 },
    { day: "F", vendors: 300 },
    { day: "S", vendors: 100 },
  ];

  const commodityData = [
    { name: "Payable", value: 2500 },
    { name: "Receivable", value: 35000 },
  ];

  const categoryData = [
    { name: "Clothes", value: 35 },
    { name: "Software", value: 25 },
    { name: "Travel", value: 15 },
    { name: "Rental", value: 25 },
  ];

  const pendingApprovals = [
    {
      id: "PO-001",
      description: "Office Supplies Purchase",
      amount: "K1,200",
      date: "2023-10-15",
    },
    {
      id: "PO-002",
      description: "Marketing Materials",
      amount: "K3,500",
      date: "2023-10-14",
    },
    {
      id: "PO-003",
      description: "Equipment Rental",
      amount: "K850",
      date: "2023-10-13",
    },
    {
      id: "PO-004",
      description: "Software License",
      amount: "K2,000",
      date: "2023-10-12",
    },
    {
      id: "PO-005",
      description: "Travel Expenses",
      amount: "K1,450",
      date: "2023-10-11",
    },
  ];

  const topCustomers = [
    {
      id: "CUST-001",
      name: "Customer A",
      revenue: "K45,000",
      lastPurchase: "2023-10-16",
    },
    {
      id: "CUST-002",
      name: "Customer B",
      revenue: "K38,000",
      lastPurchase: "2023-10-15",
    },
    {
      id: "CUST-003",
      name: "Customer C",
      revenue: "K32,000",
      lastPurchase: "2023-10-14",
    },
    {
      id: "CUST-004",
      name: "Customer D",
      revenue: "K28,000",
      lastPurchase: "2023-10-13",
    },
    {
      id: "CUST-005",
      name: "Customer E",
      revenue: "K25,000",
      lastPurchase: "2023-10-12",
    },
  ];

  const topSuppliers = [
    {
      id: "SUP-001",
      name: "Supplier X",
      spend: "K55,000",
      lastTransaction: "2023-10-16",
    },
    {
      id: "SUP-002",
      name: "Supplier Y",
      spend: "K42,000",
      lastTransaction: "2023-10-15",
    },
    {
      id: "SUP-003",
      name: "Supplier Z",
      spend: "K38,000",
      lastTransaction: "2023-10-14",
    },
    {
      id: "SUP-004",
      name: "Supplier W",
      spend: "K30,000",
      lastTransaction: "2023-10-13",
    },
    {
      id: "SUP-005",
      name: "Supplier V",
      spend: "K27,000",
      lastTransaction: "2023-10-12",
    },
  ];

  const COLORS = ["#10b981", "#f59e0b"]; // green and dark yellow

  const netCashFlow = 35000 - 2500;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h1 className="text-2xl font-semibold text-gray-700">
          Dashboard Overview
        </h1>
      </div>

      {/* BUSINESS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Revenue",
            value: "K124,800",
            change: "+8.2% this month",
            changeColor: "text-green-600",
          },
          {
            title: "Total Expense",
            value: "3,482",
            change: "+6.1% this week",
            changeColor: "text-red-600",
          },
          {
            title: "Pending Approval",
            value: "845",
            change: "−15 items this week",
            changeColor: "text-red-600",
          },
          {
            title: "Active Customers",
            value: "1,294",
            change: "+2.5% this week",
            changeColor: "text-green-600",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl shadow flex items-center space-x-4 hover:shadow-md transition"
          >
            <div>
              <h3 className="text-gray-500 text-sm">{card.title}</h3>
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className={`text-xs ${card.changeColor}`}>{card.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* Payable and Receivable */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col">
          <h2 className="font-semibold text-gray-700 mb-4">
            Payable and Receivable
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 overflow-auto">
            {/* Text Summary */}
            <div className="flex-1 space-y-3 w-full md:w-1/2 min-w-[220px]">
              <div className="flex justify-between text-gray-600">
                <span>Total Payable</span>
                <span className="font-semibold text-gray-800">K2,500</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Receivable</span>
                <span className="font-semibold text-gray-800">K35,000</span>
              </div>
              <hr className="my-2 border-gray-200" />
              <div className="flex justify-between text-gray-600">
                <span>Net Cash Flow</span>
                <span className="font-semibold text-green-600">K32,500</span>
              </div>
            </div>

            {/* Chart Section */}
            <div className="w-full md:w-[70%] h-[230px] min-w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={commodityData}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#6b7280", fontSize: 13 }}
                    width={90}
                  />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {commodityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Selling Categories Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col min-w-full lg:min-w-0">
          <h2 className="font-semibold text-gray-700 mb-4">
            Top Selling Categories
          </h2>
          <div className="flex-grow overflow-auto min-w-[300px]">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "#6b7280", fontSize: 13 }}
                  width={80}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lists Section: Pending Approvals, Top Customers, Top Suppliers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Pending Approval List */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Pending Approvals</h2>
            <select className="border rounded-lg px-3 py-1 text-sm">
              <option>This week</option>
              <option>Last week</option>
            </select>
          </div>
          <div className="flex-grow overflow-y-auto max-h-[320px]">
            <ul className="space-y-3">
              {pendingApprovals.map((item) => (
                <li key={item.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{item.id}</p>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item.amount}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top 5 Customers */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">
              Top 5 Customers (by Revenue)
            </h2>
            <select className="border rounded-lg px-3 py-1 text-sm">
              <option>This month</option>
              <option>Last month</option>
            </select>
          </div>
          <div className="flex-grow overflow-y-auto max-h-[320px]">
            <ul className="space-y-3">
              {topCustomers.map((cust) => (
                <li key={cust.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{cust.id}</p>
                      <p className="text-sm text-gray-500">{cust.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {cust.revenue}
                      </p>
                      <p className="text-xs text-gray-400">
                        {cust.lastPurchase}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top 5 Suppliers */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">
              Top 5 Suppliers (by Spend)
            </h2>
            <select className="border rounded-lg px-3 py-1 text-sm">
              <option>This month</option>
              <option>Last month</option>
            </select>
          </div>
          <div className="flex-grow overflow-y-auto max-h-[320px]">
            <ul className="space-y-3">
              {topSuppliers.map((sup) => (
                <li key={sup.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{sup.id}</p>
                      <p className="text-sm text-gray-500">{sup.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{sup.spend}</p>
                      <p className="text-xs text-gray-400">
                        {sup.lastTransaction}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
