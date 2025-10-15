import React from "react";
import { Line } from "react-chartjs-2";
import { Doughnut, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

import {
  FaUserClock,
  FaClipboardCheck,
  FaSearch,
  FaShoppingCart,
  FaMoneyBillWave,
  FaUsers,
  FaBoxes,
  FaFileInvoiceDollar,
  FaHandHoldingUsd,
} from "react-icons/fa";

const Dashboard = () => {
  // --- Invoice Analysis (Bar Chart) ---
  const invoiceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Paid Invoices",
        backgroundColor: "#0d9488",
        data: [420, 380, 440, 500, 460, 480, 520],
      },
      {
        label: "Unpaid Invoices",
        backgroundColor: "#f59e0b",
        data: [120, 160, 100, 140, 180, 130, 90],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
    scales: { y: { beginAtZero: true } },
    maintainAspectRatio: false,
  };

  // --- Sales Overview (Doughnut Chart) ---
  const salesData = {
    labels: ["Online Sales", "In-Store Sales", "Wholesale"],
    datasets: [
      {
        data: [55, 30, 15],
        backgroundColor: ["#16a34a", "#3b82f6", "#facc15"],
        borderWidth: 0,
      },
    ],
  };

  const salesOptions = {
    cutout: "70%",
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  const chartHeight = 250; // Unified height for consistency

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Dashboard Overview</h1>
        <button className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition">
          Today
        </button>
      </div>

      {/* BUSINESS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
        {[
          {
            title: "Total Revenue",
            value: "K124,800",
            change: "+8.2% this month",
            icon: <FaMoneyBillWave className="text-green-500 text-2xl" />,
          },
          {
            title: "Total Orders",
            value: "3,482",
            change: "+6.1% this week",
            icon: <FaShoppingCart className="text-blue-500 text-2xl" />,
          },
          {
            title: "Active Customers",
            value: "1,294",
            change: "+2.5% this week",
            icon: <FaUsers className="text-yellow-500 text-2xl" />,
          },
          {
            title: "Stocks Available",
            value: "845",
            change: "−15 items this week",
            icon: <FaBoxes className="text-purple-500 text-2xl" />,
          },
          {
            title: "Accounts Receivable",
            value: "K38,900",
            change: "Pending +5.3%",
            icon: <FaFileInvoiceDollar className="text-orange-500 text-2xl" />,
          },
          {
            title: "Accounts Payable",
            value: "K21,400",
            change: "Due in 15 days",
            icon: <FaHandHoldingUsd className="text-red-500 text-2xl" />,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl shadow flex items-center space-x-4"
          >
            {card.icon}
            <div>
              <h3 className="text-gray-500 text-sm">{card.title}</h3>
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-xs text-gray-400">{card.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Total Revenue Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Total Revenue</h2>
            <select className="border rounded-lg px-3 py-1 text-sm">
              <option>6 months</option>
              <option>12 months</option>
            </select>
          </div>
          <p className="text-xl font-bold mb-2">€102.5M</p>
          <div className="flex-grow">
            <Line
              height={chartHeight}
              data={{
                labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [
                  {
                    label: "Earned",
                    data: [50, 80, 70, 90, 60, 100],
                    borderColor: "#6366f1",
                    backgroundColor: "rgba(99,102,241,0.1)",
                    tension: 0.4,
                  },
                  {
                    label: "Forecasted",
                    data: [40, 60, 90, 70, 100, 80],
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16,185,129,0.1)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        {/* Commodity Sold Donut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col">
          <h2 className="font-semibold text-gray-700 mb-4">Commodity Sold</h2>
          <div className="flex-grow flex items-center justify-center">
            <div className="w-48 h-48">
              <Doughnut
                data={{
                  labels: ["Sold", "Produced"],
                  datasets: [
                    {
                      data: [10000, 4000],
                      backgroundColor: ["#6366f1", "#10b981"],
                    },
                  ],
                }}
                options={{ cutout: "70%", plugins: { legend: { display: false } }, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p className="flex justify-between w-32"><span>Sold</span> <span>10K</span></p>
            <p className="flex justify-between w-32"><span>Produced</span> <span>4K</span></p>
          </div>
        </div>
      </div>

      {/* Vendor Activity + Top Categories + Sales by City */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Vendor Activity */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Vendor Activity</h2>
            <select className="border rounded-lg px-3 py-1 text-sm">
              <option>This week</option>
              <option>Last week</option>
            </select>
          </div>
          <div className="flex-grow">
            <Bar
              height={chartHeight}
              data={{
                labels: ["M", "T", "W", "Th", "F", "S"],
                datasets: [
                  {
                    label: "Vendors",
                    data: [200, 300, 250, 280, 300, 100],
                    backgroundColor: "#6366f1",
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }}
            />
          </div>
        </div>

        {/* Top Selling Categories */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Top Selling Categories</h2>
            <select className="border rounded-lg px-3 py-1 text-sm">
              <option>This week</option>
              <option>Last week</option>
            </select>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <div className="w-48 h-48">
              <Doughnut
                data={{
                  labels: ["Item 1", "Item 2", "Item 3", "Item 4"],
                  datasets: [
                    {
                      data: [35, 25, 15, 25],
                      backgroundColor: ["#6366f1", "#818cf8", "#10b981", "#a78bfa"],
                    },
                  ],
                }}
                options={{ cutout: "70%", plugins: { legend: { position: "bottom" } }, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        {/* Sales by City */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col">
          <h2 className="font-semibold text-gray-700 mb-4">Sales by City</h2>
          <div className="flex-grow overflow-y-auto">
            {[
              { city: "Berlin", value: 80 },
              { city: "Hamburg", value: 60 },
              { city: "Munich", value: 40 },
              { city: "Bonn", value: 50 },
              { city: "Köln", value: 70 },
              { city: "Frankfurt", value: 90 },
            ].map((c, i) => (
              <div key={i} className="mb-4">
                <p className="text-sm text-gray-500 mb-1">{c.city}</p>
                <div className="w-full bg-gray-200 h-3 rounded-full">
                  <div
                    className="bg-purple-600 h-3 rounded-full"
                    style={{ width: `${c.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;