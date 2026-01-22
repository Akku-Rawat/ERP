import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEdit,
  FaTrash,
  FaEye,
  FaMoneyCheckAlt,
  FaClock,
} from "react-icons/fa";

const AccountsPayable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Sample Data
  const stats = [
    {
      label: "Total Payables",
      value: "₹8,75,000",
      change: "+8%",
      trend: "up",
      color: "purple",
    },
    {
      label: "Due This Week",
      value: "₹2,15,000",
      change: "-10%",
      trend: "down",
      color: "orange",
    },
    {
      label: "Avg Payment Days",
      value: "38 days",
      change: "-2 days",
      trend: "down",
      color: "blue",
    },
    {
      label: "Current Month Expenses",
      value: "₹6,25,000",
      change: "+15%",
      trend: "up",
      color: "red",
    },
  ];

  const bills = [
    {
      id: "BILL-001",
      vendor: "Office Supplies Co",
      amount: 45000,
      due: "2025-01-18",
      status: "Approved",
      days: 8,
      priority: "medium",
    },
    {
      id: "BILL-002",
      vendor: "Tech Services Inc",
      amount: 125000,
      due: "2025-01-14",
      status: "Pending",
      days: 4,
      priority: "high",
    },
    {
      id: "BILL-003",
      vendor: "Utilities Provider",
      amount: 35000,
      due: "2025-01-22",
      status: "Scheduled",
      days: 12,
      priority: "low",
    },
    {
      id: "BILL-004",
      vendor: "Equipment Rental",
      amount: 85000,
      due: "2025-01-16",
      status: "Approved",
      days: 6,
      priority: "medium",
    },
    {
      id: "BILL-005",
      vendor: "Marketing Agency",
      amount: 195000,
      due: "2025-01-12",
      status: "Pending",
      days: 2,
      priority: "high",
    },
    {
      id: "BILL-006",
      vendor: "Cleaning Services",
      amount: 25000,
      due: "2025-01-20",
      status: "Approved",
      days: 10,
      priority: "low",
    },
  ];

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || bill.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p
                  className={`text-sm font-medium ${
                    stat.trend === "up"
                      ? "text-red-600"
                      : stat.trend === "down"
                        ? "text-green-600"
                        : "text-gray-600"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}
              >
                <FaMoneyCheckAlt className={`text-${stat.color}-600 text-xl`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-80">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bills or vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 bg-white"
              >
                <FaFilter className="text-gray-600" />
                <span className="text-gray-700 font-medium capitalize">
                  {filterStatus}
                </span>
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {["all", "pending", "approved", "scheduled", "paid"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 capitalize ${
                          filterStatus === status
                            ? "bg-purple-50 text-purple-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {status}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 bg-white">
              <FaDownload /> Export
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 shadow-sm">
              <FaPlus /> New Bill
            </button>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Bill ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Days Left
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredBills.map((bill) => (
                <tr
                  key={bill.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-medium text-purple-600">
                      {bill.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {bill.vendor}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{bill.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{bill.due}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <FaClock className="text-gray-400 text-xs" />
                      <span
                        className={`text-sm font-medium ${
                          bill.days <= 3
                            ? "text-red-600"
                            : bill.days <= 7
                              ? "text-yellow-600"
                              : "text-gray-600"
                        }`}
                      >
                        {bill.days} days
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(bill.priority)}`}
                    >
                      {bill.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}
                    >
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBills.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FaMoneyCheckAlt className="mx-auto text-4xl mb-3 text-gray-300" />
              <p className="text-sm">No bills found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Payment Schedule - Next 30 Days
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-gray-600 mb-1">This Week</p>
            <p className="text-xl font-bold text-red-700">₹2.15L</p>
            <p className="text-xs text-gray-500 mt-1">3 bills</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-gray-600 mb-1">Week 2</p>
            <p className="text-xl font-bold text-orange-700">₹1.8L</p>
            <p className="text-xs text-gray-500 mt-1">2 bills</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-gray-600 mb-1">Week 3</p>
            <p className="text-xl font-bold text-yellow-700">₹2.5L</p>
            <p className="text-xs text-gray-500 mt-1">4 bills</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600 mb-1">Week 4+</p>
            <p className="text-xl font-bold text-green-700">₹2.3L</p>
            <p className="text-xs text-gray-500 mt-1">5 bills</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPayable;
