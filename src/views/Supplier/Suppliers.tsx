// src/pages/Suppliers.tsx
import React, { useState } from "react";
import {
  FaHandshake,
  FaBuilding,
  FaFileInvoiceDollar,
  FaMoneyBill ,
  FaChartBar,
} from "react-icons/fa";

import SupplierManagement from "./SupplierManagment";
import SupplierLedger from "./SupplierLedger";
import SupplierPayments from "./SupplierPayments";
import Performance from "./Performance";

const suppliersModule = {
  name: "Suppliers",
  icon: <FaHandshake className="text-teal-600" />,
  defaultTab: "suppliers",
  tabs: [
    { id: "suppliers", name: "Suppliers", icon: <FaBuilding /> },
    { id: "supplierLedger", name: "Supplier Ledger", icon: <FaFileInvoiceDollar /> },
    { id: "supplierPayments", name: "Supplier Payments", icon: <FaMoneyBill  /> },
    { id: "performance", name: "Performance", icon: <FaChartBar /> },
  ],
};

const Suppliers: React.FC = () => {
  const [activeTab, setActiveTab] = useState(suppliersModule.defaultTab);

  return (
    <div className="bg-gray-50 h-screen overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <span className="text-2xl">{suppliersModule.icon}</span>
          {suppliersModule.name}
        </h2>
      </div>

      <div className="flex border-b border-gray-200 px-6 mt-6">
        {suppliersModule.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap
              ${activeTab === tab.id
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      <div className={activeTab === "suppliers" ? "p-6" : "p-6"}>
        <div className={activeTab === "suppliers" ? "" : "bg-white rounded-lg shadow-sm p-4"}>
          {activeTab === "suppliers" && <SupplierManagement />}
          {activeTab === "supplierLedger" && <SupplierLedger />}
          {activeTab === "supplierPayments" && <SupplierPayments />}
          {activeTab === "performance" && <Performance />}
        </div>
      </div>
    </div>
  );
};

export default Suppliers;