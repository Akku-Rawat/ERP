import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEdit,
  FaTrash,
  FaEye,
  FaWarehouse,
  FaTools,
  FaChartLine,
  FaMapMarkerAlt,
} from "react-icons/fa";

const FixedAssets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Sample Data
  const stats = [
    {
      label: "Total Asset Value",
      value: "₹45,00,000",
      change: "+5%",
      trend: "up",
      color: "indigo",
    },
    {
      label: "Monthly Depreciation",
      value: "₹75,000",
      change: "0%",
      trend: "neutral",
      color: "yellow",
    },
    {
      label: "Active Assets",
      value: "156",
      change: "+8",
      trend: "up",
      color: "green",
    },
    {
      label: "In Maintenance",
      value: "12",
      change: "-3",
      trend: "down",
      color: "orange",
    },
  ];

  const assets = [
    {
      id: "FA-001",
      name: "Desktop Computers",
      category: "IT Equipment",
      value: 450000,
      depreciation: 15000,
      location: "Office Floor 1",
      condition: "Good",
      purchaseDate: "2023-01-15",
    },
    {
      id: "FA-002",
      name: "Office Furniture",
      category: "Furniture",
      value: 250000,
      depreciation: 5000,
      location: "Office Floor 2",
      condition: "Excellent",
      purchaseDate: "2023-06-10",
    },
    {
      id: "FA-003",
      name: "Server Equipment",
      category: "IT Equipment",
      value: 850000,
      depreciation: 35000,
      location: "Data Center",
      condition: "Good",
      purchaseDate: "2022-11-20",
    },
    {
      id: "FA-004",
      name: "Vehicles",
      category: "Transportation",
      value: 1200000,
      depreciation: 40000,
      location: "Parking Lot",
      condition: "Fair",
      purchaseDate: "2022-05-05",
    },
    {
      id: "FA-005",
      name: "Manufacturing Equipment",
      category: "Machinery",
      value: 2500000,
      depreciation: 85000,
      location: "Factory Floor",
      condition: "Good",
      purchaseDate: "2021-09-15",
    },
    {
      id: "FA-006",
      name: "Conference Room Tech",
      category: "IT Equipment",
      value: 180000,
      depreciation: 8000,
      location: "Conference Room A",
      condition: "Excellent",
      purchaseDate: "2023-03-22",
    },
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterCategory === "all" || asset.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const getConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categories = [
    "all",
    "IT Equipment",
    "Furniture",
    "Transportation",
    "Machinery",
  ];

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
                <FaWarehouse className={`text-${stat.color}-600 text-xl`} />
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
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  {filterCategory}
                </span>
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setFilterCategory(category);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 capitalize ${
                        filterCategory === category
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 bg-white">
              <FaDownload /> Export
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-sm">
              <FaPlus /> Add Asset
            </button>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Asset ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Asset Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Depreciation
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-medium text-indigo-600">
                      {asset.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {asset.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {asset.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{asset.value.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <FaChartLine className="text-red-500 text-xs" />
                      <span className="text-sm font-medium text-red-600">
                        ₹{asset.depreciation.toLocaleString()}/mo
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-gray-400 text-xs" />
                      <span className="text-sm text-gray-700">
                        {asset.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getConditionColor(asset.condition)}`}
                    >
                      {asset.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Maintenance"
                      >
                        <FaTools />
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

          {filteredAssets.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FaWarehouse className="mx-auto text-4xl mb-3 text-gray-300" />
              <p className="text-sm">No assets found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Asset Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Assets by Category
          </h3>
          <div className="space-y-3">
            {[
              { name: "IT Equipment", value: 1480000, count: 3, color: "blue" },
              { name: "Machinery", value: 2500000, count: 1, color: "purple" },
              {
                name: "Transportation",
                value: 1200000,
                count: 1,
                color: "green",
              },
              { name: "Furniture", value: 250000, count: 1, color: "yellow" },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full bg-${cat.color}-500`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cat.count} asset{cat.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{(cat.value / 100000).toFixed(1)}L
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Depreciation Schedule */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Depreciation Schedule (Next 12 Months)
          </h3>
          <div className="space-y-3">
            {[
              { month: "Jan 2025", amount: 75000 },
              { month: "Feb 2025", amount: 75000 },
              { month: "Mar 2025", amount: 75000 },
              { month: "Apr 2025", amount: 75000 },
              { month: "May 2025", amount: 75000 },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-700">
                  {item.month}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{item.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedAssets;
