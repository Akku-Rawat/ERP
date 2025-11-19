import React, { useState } from "react";
import QuotationsTable from "./Quotations";
import InvoiceTable from "./Invoices";
import ReportTable from "./Reports";
import POS from "./POS";
import QuotationModal from '../../components/sales/QuotationModal';
import InvoiceModal from "../../components/sales/InvoiceModal";
import PosModal from "../../components/sales/PosModal";
import SalesDashboard  from "./SalesDashboard";

import {
  FaMoneyBillWave ,
  FaCalendarAlt,   
  FaFileInvoice,   
  FaFileInvoiceDollar,
  FaCashRegister,
  FaChartBar,
  FaCog
} from "react-icons/fa";
import ProformaInvoicesTable from "./ProformaInvoice";
import ProformaInvoiceModal from "../../components/sales/ProformaInvoiceModal";


const sales = {
  name: "Sales",
  icon: <FaMoneyBillWave />,
  defaultTab: "salesdashboard",
  tabs: [
    { id: "salesdashboard", name: "Dashboard", icon: <FaCalendarAlt /> },
    { id: "quotations", name: "Quotations", icon: <FaFileInvoice /> },
    { id: "invoices", name: "Invoices", icon: <FaFileInvoiceDollar /> },
    { id: "proformaInvoice", name: "Profroma Invoice", icon: <FaFileInvoiceDollar /> },
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
  const [showModal, setShowModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showProformaInvoiceModal, setShowProformaInvoiceModal] = useState(false);
  const [showPosModal, setShowPosModal] = useState(false);

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
        {activeTab === "quotations" && (
          <>
            <div className="flex items-center justify-end gap-4 mb-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => setShowModal(true)}>
                + Add
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                Export
              </button>
            </div>
            <QuotationsTable />

              </>
        )}

        {/* Invoices */}
        {activeTab === "invoices" && (
          <>
            <div className="flex items-center justify-end gap-4 mb-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => setShowInvoiceModal(true)}>
                + Add
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                Export
              </button>
            </div>
            <InvoiceTable />
          </>
        )}
        {activeTab === "proformaInvoice" && (
          <>
            <div className="flex items-center justify-end gap-4 mb-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => setShowProformaInvoiceModal(true)}>
                + Add
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                Export
              </button>
            </div>
            <ProformaInvoicesTable/>
          </>
        )}

        {/* POS */}
        {activeTab === "pos" && (
          <>
            <div className="flex items-center justify-end gap-4 mb-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => setShowPosModal(true)}>
                + Add
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                Export
              </button>
            </div>
            <POS />
          </>
        )}

          
      {activeTab === "reports" && (
      <ReportTable />
        )}

      </div>

      {/* Modals */}
      <QuotationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={data => console.log('Final form', data)}
      />
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSubmit={data => console.log('Invoice data', data)}
      />
      <ProformaInvoiceModal
        isOpen={showProformaInvoiceModal}
        onClose={() => setShowProformaInvoiceModal(false)}
        onSubmit={data => console.log('Invoice data', data)}
      />
      <PosModal
        isOpen={showPosModal}
        onClose={() => setShowPosModal(false)}
        onSave={data => console.log('POS data', data)}
      />
    </div>
  );
};

export default SalesModule;
