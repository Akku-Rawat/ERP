import React, { useState } from "react";
import QuotationModal from '../components/sales/QuotationModal';
import InvoiceModal from "../components/sales/InvoiceModal";
import PosModal from "../components/sales/POSModal";


const sales = {
  name: "Sales",
  icon: "💸",
  defaultTab: "quotations",
  tabs: [
    { id: "quotations", name: "Quotations", icon: "📄" },
    { id: "invoices", name: "Invoices", icon: "🧾" },
    { id: "pos", name: "POS", icon: "📦" },
    { id: "reports", name: "Reports", icon: "📊" },
  ],
  quotations: [
    { id: "QUO-001", customer: "Acme Corp", date: "2025-10-14", amount: 25000, opportunityStage: "Awaiting Response" },
    { id: "QUO-002", customer: "Globex Ltd", date: "2025-10-15", amount: 35000, opportunityStage: "Approved" },
    { id: "QUO-003", customer: "Initech", date: "2025-10-16", amount: 45000, opportunityStage: "Rejected" },
  ],
  invoices: [],
  pos: [],
  reports: [],
};

const SalesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState(sales.defaultTab);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPosModal, setShowPosModal] = useState(false);

  const filteredQuotations = sales.quotations.filter(
    (q) =>
      q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>{tab.icon}</span> {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <input
            type="search"
            placeholder={`Search ${activeTab === "quotations" ? "Quotations" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center gap-2">
            {/* Only one "+ Add" button is visible depending on activeTab */}
            {activeTab === "quotations" && (
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                onClick={() => setShowModal(true)}
              >
                + Add
              </button>
            )}
            {activeTab === "invoices" && (
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                onClick={() => setShowInvoiceModal(true)}
              >
                + Add
              </button>
            )}
            {activeTab === "pos" && (
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                onClick={() => setShowPosModal(true)}
              >
                + Add
              </button>
            )}
            {/* Export button always shown */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Export
            </button>
          </div>
        </div>

        {/* Table only for quotations for now */}
        {activeTab === "quotations" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Quotation ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Follow-Up Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Opportunity Stage</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotations.map((q) => (
                  <tr key={q.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{q.id}</td>
                    <td className="px-4 py-2">{q.customer}</td>
                    <td className="px-4 py-2">{q.date}</td>
                    <td className="px-4 py-2">₹{q.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">{q.opportunityStage}</td>
          
                    <td className="px-4 py-2 text-center">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab !== "quotations" && (
          <div className="py-8 text-center text-gray-400">
            No data available for this section.
          </div>
        )}
      </div>

      {/* Modals (always mounted, visibility by isOpen flags) */}
      <QuotationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={data => console.log('Final form', data)}
      />
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSave={data => console.log('Invoice data', data)}
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
