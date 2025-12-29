import React, { useState } from "react";

import QuotationsTable from "./Quotations";
import InvoiceTable from "./Invoices";
import ReportTable from "./Reports";
import POS from "./POS";
import SalesDashboard from "./SalesDashboard";
import ProformaInvoicesTable from "./ProformaInvoice";

import QuotationModal from "../../components/sales/QuotationModal";
import InvoiceModal from "../../components/sales/InvoiceModal";
import ProformaInvoiceModal from "../../components/sales/ProformaInvoiceModal";
import PosModal from "../../components/sales/PosModal";

import { createSalesInvoice } from "../../api/salesApi";

import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaCashRegister,
  FaChartBar,
} from "react-icons/fa";

type ModalType = null | "quotation" | "invoice" | "proforma" | "pos";

const salesTabs = [
  { id: "salesdashboard", name: "Dashboard", icon: <FaCalendarAlt /> },
  { id: "quotations", name: "Quotations", icon: <FaFileInvoice /> },
  {
    id: "proformaInvoice",
    name: "Proforma Invoice",
    icon: <FaFileInvoiceDollar />,
  },
  { id: "invoices", name: "Invoices", icon: <FaFileInvoiceDollar /> },
  // { id: "pos", name: "POS", icon: <FaCashRegister /> },
  { id: "reports", name: "Reports", icon: <FaChartBar /> },
];

const SalesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState("salesdashboard");
  const [openModal, setOpenModal] = useState<ModalType>(null);

  const TAB_CONFIG: Record<
    string,
    { component: React.ReactNode; onAdd?: () => void }
  > = {
    salesdashboard: {
      component: <SalesDashboard />,
    },
    quotations: {
      component: <QuotationsTable />,
      onAdd: () => setOpenModal("quotation"),
    },
    proformaInvoice: {
      component: <ProformaInvoicesTable />,
      onAdd: () => setOpenModal("proforma"),
    },
    invoices: {
      component: <InvoiceTable />,
      onAdd: () => setOpenModal("invoice"),
    },
    pos: {
      component: <POS />,
      onAdd: () => setOpenModal("pos"),
    },
    reports: {
      component: <ReportTable />,
    },
  };

  const handleInvoiceSubmit = async (payload: any) => {
    console.log("Invoice payload (stub):", payload);

    try {
      const response = await createSalesInvoice(payload);
      console.log("Invoice response (stub):", response);
      alert("Invoice created successfully!");
    } catch (err) {
      console.error("Create invoice error:", err);
    }
  };

  const tab = TAB_CONFIG[activeTab];

  return (
    <div className="p-6 bg-app min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <FaMoneyBillWave /> Sales
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {salesTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="">
        {tab?.onAdd && (
          <div className="flex items-center justify-end gap-4 mb-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              onClick={tab.onAdd}
            >
              + Add
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
              Export
            </button>
          </div>
        )}

        {tab?.component}
      </div>

      {/* Modals */}
      <QuotationModal
        isOpen={openModal === "quotation"}
        onClose={() => setOpenModal(null)}
        onSubmit={(data) => console.log("Quotation", data)}
      />

      <InvoiceModal
        isOpen={openModal === "invoice"}
        onClose={() => setOpenModal(null)}
        onSubmit={handleInvoiceSubmit}
      />

      <ProformaInvoiceModal
        isOpen={openModal === "proforma"}
        onClose={() => setOpenModal(null)}
        onSubmit={(data) => console.log("Proforma Invoice", data)}
      />

      <PosModal
        isOpen={openModal === "pos"}
        onClose={() => setOpenModal(null)}
        onSave={(data) => console.log("POS", data)}
      />
    </div>
  );
};

export default SalesModule;
