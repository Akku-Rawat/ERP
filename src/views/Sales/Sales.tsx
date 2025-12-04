import React, { useState } from "react";
import QuotationsTable from "./Quotations";
import InvoiceTable from "./Invoices";
import ReportTable from "./Reports";
import POS from "./POS";
import SalesDashboard from "./SalesDashboard";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaCashRegister,
  FaChartBar,
} from "react-icons/fa";
import ProformaInvoicesTable from "./ProformaInvoice";

const sales = {
  name: "Sales",
  icon: <FaMoneyBillWave />,
  defaultTab: "salesdashboard",
  tabs: [
    { id: "salesdashboard", name: "Dashboard", icon: <FaCalendarAlt /> },
    { id: "quotations", name: "Quotations", icon: <FaFileInvoice /> },
    { id: "invoices", name: "Invoices", icon: <FaFileInvoiceDollar /> },
    {
      id: "proformaInvoice",
      name: "Proforma Invoice",
      icon: <FaFileInvoiceDollar />,
    },
    { id: "pos", name: "POS", icon: <FaCashRegister /> },
    { id: "reports", name: "Reports", icon: <FaChartBar /> },
  ],
  quotations: [],
  invoices: [],
  pos: [],
  reports: [],
};

const SalesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState(sales.defaultTab);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <span>{sales.icon}</span> {sales.name}
        </h2>
      </div>

      <div className="flex border-b border-gray-200 mb-4">
        {sales.tabs.map((tab) => (
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

      <div className="bg-white rounded-lg shadow-sm p-4">
        {activeTab === "salesdashboard" && <SalesDashboard />}
        {activeTab === "quotations" && <QuotationsTable />}
        {activeTab === "invoices" && <InvoiceTable />}
        {activeTab === "proformaInvoice" && <ProformaInvoicesTable />}
        {activeTab === "pos" && <POS />}
        {activeTab === "reports" && <ReportTable />}
      </div>
    </div>
  );
};

export default SalesModule;
