import React, { useState } from "react";
import SupplierModal from "../../components/supplier/SupplierModal";
import ContractModal from "../../components/supplier/ContractModal";
import PerformanceModal from "../../components/supplier/PerformanceModal";

import {
  FaBuilding,
  FaFileSignature,
  FaChartLine,
  FaHandshake,
} from "react-icons/fa";

const suppliersModule = {
  name: "Supplier",
  icon: <FaHandshake />,
  defaultTab: "suppliers",
  tabs: [
    { id: "suppliers", name: "Suppliers", icon: <FaBuilding /> },
    { id: "contracts", name: "Contracts", icon: <FaFileSignature /> },
    { id: "performance", name: "Performance", icon: <FaChartLine /> },
  ],
  suppliers: [
    {
      id: "SUP-001",
      name: "TechSupply Co",
      contact: "David Wilson",
      phone: "+260-97-123-4567",
      status: "Active",
      rating: 4.5,
      orders: 15,
    },
    {
      id: "SUP-002",
      name: "Office Solutions",
      contact: "Emma Brown",
      phone: "+260-97-234-5678",
      status: "Active",
      rating: 4.2,
      orders: 8,
    },
    {
      id: "SUP-003",
      name: "Equipment Plus",
      contact: "John Smith",
      phone: "+260-97-345-6789",
      status: "Active",
      rating: 4.7,
      orders: 12,
    },
  ],
};

const SupplierManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(suppliersModule.defaultTab);
  const [searchTerm, setSearchTerm] = useState("");

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

  const filteredSuppliers = suppliersModule.suppliers.filter(
    (supplier) =>
      supplier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAdd = () => {
    if (activeTab === "suppliers") setShowSupplierModal(true);
    else if (activeTab === "contracts") setShowContractModal(true);
    else if (activeTab === "performance") setShowPerformanceModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <span>{suppliersModule.icon}</span> {suppliersModule.name}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {suppliersModule.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm("");
            }}
            className={`px-4 py-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>{tab.icon}</span> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Search, Add, Export */}
        {activeTab === "suppliers" && (
          <div className="flex items-center justify-between mb-4">
            <input
              type="search"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                + Add
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                Export
              </button>
            </div>
          </div>
        )}

        {/* Suppliers Table */}
        {activeTab === "suppliers" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Supplier ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Contact</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Rating</th>
                  <th className="px-4 py-2 text-left">Orders</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{supplier.id}</td>
                    <td className="px-4 py-2">{supplier.name}</td>
                    <td className="px-4 py-2">{supplier.contact}</td>
                    <td className="px-4 py-2">{supplier.phone}</td>
                    <td className="px-4 py-2">{supplier.status}</td>
                    <td className="px-4 py-2">{supplier.rating}</td>
                    <td className="px-4 py-2">{supplier.orders}</td>
                    <td className="px-4 py-2 text-center">
                      <button className="text-blue-600 hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Contracts Section */}
        {activeTab === "contracts" && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Supplier Contracts
            </h3>
            <p className="text-gray-500">
              Contract management interface will be implemented here.
            </p>
            <button
              onClick={handleAdd}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + Add Contract
            </button>
          </div>
        )}

        {/* Performance Section */}
        {activeTab === "performance" && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Supplier Performance
            </h3>
            <p className="text-gray-500">
              Performance metrics and analytics will be displayed here.
            </p>
            <button
              onClick={handleAdd}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + Add Performance Record
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <SupplierModal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        onSubmit={(data) => console.log("New Supplier:", data)}
      />
      <ContractModal
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        onSubmit={(data) => console.log("New Contract:", data)}
      />
      <PerformanceModal
        isOpen={showPerformanceModal}
        onClose={() => setShowPerformanceModal(false)}
        onSubmit={(data) => console.log("New Performance:", data)}
      />
    </div>
  );
};

export default SupplierManagement;
