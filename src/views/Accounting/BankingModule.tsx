import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEdit,
  FaUniversity,
  FaExchangeAlt,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const Banking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("all");

  // Sample Data
  const bankAccounts = [
    {
      id: "ACC-001",
      name: "HDFC Current Account",
      number: "****1234",
      balance: 1850000,
      type: "Current",
      color: "blue",
    },
    {
      id: "ACC-002",
      name: "ICICI Savings Account",
      number: "****5678",
      balance: 650000,
      type: "Savings",
      color: "green",
    },
    {
      id: "ACC-003",
      name: "Axis Business Account",
      number: "****9012",
      balance: 2150000,
      type: "Business",
      color: "purple",
    },
  ];

  const stats = [
    {
      label: "Total Balance",
      value: "₹46,50,000",
      change: "+8.5%",
      trend: "up",
      color: "green",
    },
    {
      label: "Total Inflow (MTD)",
      value: "₹18,25,000",
      change: "+15%",
      trend: "up",
      color: "blue",
    },
    {
      label: "Total Outflow (MTD)",
      value: "₹12,40,000",
      change: "-3%",
      trend: "down",
      color: "red",
    },
    {
      label: "Pending Reconciliation",
      value: "23",
      change: "-5",
      trend: "down",
      color: "yellow",
    },
  ];

  const transactions = [
    {
      id: "TXN-001",
      date: "2025-01-10",
      description: "Customer Payment - ABC Corp",
      type: "Credit",
      amount: 125000,
      account: "HDFC Current",
      status: "Cleared",
      category: "Revenue",
    },
    {
      id: "TXN-002",
      date: "2025-01-09",
      description: "Supplier Payment - Tech Services",
      type: "Debit",
      amount: 85000,
      account: "ICICI Savings",
      status: "Cleared",
      category: "Expense",
    },
    {
      id: "TXN-003",
      date: "2025-01-09",
      description: "Office Rent Payment",
      type: "Debit",
      amount: 65000,
      account: "HDFC Current",
      status: "Pending",
      category: "Expense",
    },
    {
      id: "TXN-004",
      date: "2025-01-08",
      description: "Sales Revenue - Invoice #1234",
      type: "Credit",
      amount: 250000,
      account: "Axis Business",
      status: "Cleared",
      category: "Revenue",
    },
    {
      id: "TXN-005",
      date: "2025-01-08",
      description: "Utility Bill Payment",
      type: "Debit",
      amount: 12000,
      account: "HDFC Current",
      status: "Cleared",
      category: "Expense",
    },
    {
      id: "TXN-006",
      date: "2025-01-07",
      description: "Equipment Purchase",
      type: "Debit",
      amount: 180000,
      account: "Axis Business",
      status: "Pending",
      category: "Asset",
    },
  ];

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || txn.type.toLowerCase() === filterType;
    const matchesAccount =
      selectedAccount === "all" || txn.account === selectedAccount;
    return matchesSearch && matchesType && matchesAccount;
  });

  const getTypeColor = (type) => {
    return type === "Credit" ? "text-green-600" : "text-red-600";
  };

  const getStatusColor = (status) => {
    return status === "Cleared"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="space-y-6">
      {/* Bank Accounts Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bankAccounts.map((account) => (
          <div
            key={account.id}
            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {account.type} Account
                </p>
                <p className="text-lg font-semibold">{account.name}</p>
                <p className="text-sm text-gray-400 font-mono mt-1">
                  {account.number}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-lg bg-${account.color}-600 flex items-center justify-center`}
              >
                <FaUniversity className="text-white" />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-1">Available Balance</p>
              <p className="text-2xl font-bold">
                ₹{account.balance.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

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
                      ? "text-green-600"
                      : stat.trend === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}
              >
                <FaExchangeAlt className={`text-${stat.color}-600 text-xl`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            {/* Account Filter */}
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Accounts</option>
              {bankAccounts.map((acc) => (
                <option key={acc.id} value={acc.name}>
                  {acc.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative flex-1 sm:w-80">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 bg-white"
              >
                <FaFilter className="text-gray-600" />
                <span className="text-gray-700 font-medium capitalize">
                  {filterType}
                </span>
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {["all", "credit", "debit"].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 capitalize ${
                        filterType === type
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 bg-white">
              <FaDownload /> Export
            </button>
            <button className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 shadow-sm">
              <FaPlus /> New Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
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
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-medium text-blue-600">
                      {txn.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{txn.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {txn.description}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{txn.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{txn.account}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {txn.type === "Credit" ? (
                        <FaArrowDown className="text-green-500 text-xs" />
                      ) : (
                        <FaArrowUp className="text-red-500 text-xs" />
                      )}
                      <span
                        className={`text-sm font-medium ${getTypeColor(txn.type)}`}
                      >
                        {txn.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-sm font-bold ${getTypeColor(txn.type)}`}
                    >
                      {txn.type === "Debit" ? "-" : "+"}₹
                      {txn.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(txn.status)}`}
                    >
                      {txn.status === "Cleared" ? (
                        <FaCheckCircle />
                      ) : (
                        <FaClock />
                      )}
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FaExchangeAlt className="mx-auto text-4xl mb-3 text-gray-300" />
              <p className="text-sm">
                No transactions found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cash Flow Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Cash Flow
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600 mb-1">Total Inflow</p>
            <p className="text-2xl font-bold text-green-700">₹18.25L</p>
            <p className="text-xs text-gray-500 mt-1">125 transactions</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-gray-600 mb-1">Total Outflow</p>
            <p className="text-2xl font-bold text-red-700">₹12.40L</p>
            <p className="text-xs text-gray-500 mt-1">87 transactions</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Net Cash Flow</p>
            <p className="text-2xl font-bold text-blue-700">₹5.85L</p>
            <p className="text-xs text-green-600 mt-1 font-medium">
              +47.2% from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banking;
