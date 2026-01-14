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
import { createQuotation } from "../../api/quotationApi";

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
  const [refreshKey, setRefreshKey] = useState(0);

  const TAB_CONFIG: Record<
    string,
    { component: React.ReactNode; onAdd?: () => void }
  > = {
    salesdashboard: {
      component: <SalesDashboard />,
    },
    quotations: {
      component: (
        <QuotationsTable
          key={refreshKey}
          onAddQuotation={() => setOpenModal("quotation")}
          onExportQuotation={() => {
            console.log("Export quotations");
          }}
        />
      ),
    },
    proformaInvoice: {
      component: (
        <ProformaInvoicesTable
          refreshKey={refreshKey}
          onAddProformaInvoice={() => setOpenModal("proforma")}
          onExportProformaInvoice={() => {
            console.log("Export proforma invoices");
          }}
        />
      ),
    },
    invoices: {
      component: (
        <InvoiceTable
          onAddInvoice={() => setOpenModal("invoice")}
          onExportInvoice={() => {
            console.log("Export invoices");
          }}
        />
      ),
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
    console.log("📤 Invoice payload:", payload);

    try {
      const response = await createSalesInvoice(payload);
      
      alert("Invoice created successfully!");
      setOpenModal(null);
    } catch (err) {
      
      alert("Failed to create invoice. Please try again.");
    }
  };

  const handleQuotationSubmit = async (payload: any) => {
    console.log("📤 Quotation payload:", payload);

    try {
      const response = await createQuotation(payload);
      
      
      if (response.status_code === 200 || response.status_code === 201) {
        alert("Quotation created successfully!");
        setRefreshKey((prev) => prev + 1); // Refresh quotations table
        setOpenModal(null); // Close modal
      } else {
        throw new Error(response.message || "Failed to create quotation");
      }
    } catch (err: any) {
      
      alert(err.message || "Failed to create quotation. Please try again.");
    }
  };

  const handleProformaCreated = () => {
    setRefreshKey((prev) => prev + 1);
    setOpenModal(null);
  };

  const tab = TAB_CONFIG[activeTab];

  return (
    <div className="p-6 bg-app min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-main">
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
            {/* Add button if needed */}
          </div>
        )}

        {tab?.component}
      </div>

      {/* Modals */}
      <QuotationModal
        isOpen={openModal === "quotation"}
        onClose={() => setOpenModal(null)}
        onSubmit={handleQuotationSubmit}
      />

      <InvoiceModal
        isOpen={openModal === "invoice"}
        onClose={() => setOpenModal(null)}
        onSubmit={handleInvoiceSubmit}
      />

      <ProformaInvoiceModal
        isOpen={openModal === "proforma"}
        onClose={() => setOpenModal(null)}
        onSubmit={handleProformaCreated}
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