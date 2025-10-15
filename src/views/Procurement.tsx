import React, { useState } from "react";
import RFQModal from '../components/procurement/RfqModal';
import PurchaseOrderModal from '../components/procurement/PurchaseOrderModal';
import ApprovalModal from '../components/procurement/ApprovalModal';

const procurement = {
  name: "Procurement",
  icon: "🛒",
  defaultTab: "rfqs",
  tabs: [
    { id: "rfqs", name: "RFQs", icon: "📋" },
    { id: "orders", name: "Purchase Orders", icon: "🛒" },
    { id: "approvals", name: "Approvals", icon: "✅" },
  ],
  rfqs: [
    { id: "RFQ-001", supplier: "TechSupply Co", date: "2025-01-10", amount: 50000, status: "Awaiting Response", dueDate: "2025-01-25" },
    { id: "RFQ-002", supplier: "Office Solutions", date: "2025-01-12", amount: 25000, status: "Received", dueDate: "2025-01-27" },
    { id: "RFQ-003", supplier: "Equipment Plus", date: "2025-01-14", amount: 75000, status: "In Review", dueDate: "2025-01-29" },
  ],
  purchaseOrders: [
    { id: "PO-001", supplier: "TechSupply Co", date: "2025-01-15", amount: 48000, status: "Approved", deliveryDate: "2025-02-01" },
    { id: "PO-002", supplier: "Office Solutions", date: "2025-01-16", amount: 23000, status: "Pending", deliveryDate: "2025-02-05" },
    { id: "PO-003", supplier: "Equipment Plus", date: "2025-01-17", amount: 72000, status: "Draft", deliveryDate: "2025-02-10" },
  ],
};

const Procurement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(procurement.defaultTab);
  const [searchTerm, setSearchTerm] = useState("");

   const [showRFQModal, setShowRFQModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const filteredRFQs = procurement.rfqs.filter(
    (rfq) =>
      rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = procurement.purchaseOrders.filter(
    (po) =>
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

   const handleAdd = () => {
    if (activeTab === "rfqs") setShowRFQModal(true);
    else if (activeTab === "orders") setShowPOModal(true);
    else if (activeTab === "approvals") setShowApprovalModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <span>{procurement.icon}</span> {procurement.name}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {procurement.tabs.map((tab) => (
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

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Search, Add & Export Actions */}
        {activeTab !== "approvals" && (
          <div className="flex items-center justify-between mb-4">
            <input
              type="search"
              placeholder={`Search ${activeTab === "rfqs" ? "RFQs" : "Orders"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={handleAdd}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                + Add
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Export
              </button>
            </div>
          </div>
        )}

        {/* RFQs Table */}
        {activeTab === "rfqs" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">RFQ ID</th>
                  <th className="px-4 py-2 text-left">Supplier</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRFQs.map((rfq) => (
                  <tr key={rfq.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{rfq.id}</td>
                    <td className="px-4 py-2">{rfq.supplier}</td>
                    <td className="px-4 py-2">{rfq.date}</td>
                    <td className="px-4 py-2">${rfq.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">{rfq.status}</td>
                    <td className="px-4 py-2">{rfq.dueDate}</td>
                    <td className="px-4 py-2 text-center">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Purchase Orders Table */}
        {activeTab === "orders" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">PO ID</th>
                  <th className="px-4 py-2 text-left">Supplier</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Delivery Date</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((po) => (
                  <tr key={po.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{po.id}</td>
                    <td className="px-4 py-2">{po.supplier}</td>
                    <td className="px-4 py-2">{po.date}</td>
                    <td className="px-4 py-2">${po.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">{po.status}</td>
                    <td className="px-4 py-2">{po.deliveryDate}</td>
                    <td className="px-4 py-2 text-center">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Approvals Section */}
        {activeTab === "approvals" && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Pending Approvals</h3>
            <p className="text-gray-500">
              Approval workflow interface will be implemented here.
            </p>
            <button
              onClick={handleAdd}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              + Add Approval
            </button>
          </div>
        )}
      </div>

       <RFQModal
        isOpen={showRFQModal}
        onClose={() => setShowRFQModal(false)}
        onSubmit={(data) => console.log("New RFQ:", data)}
      />
      <PurchaseOrderModal
        isOpen={showPOModal}
        onClose={() => setShowPOModal(false)}
        onSubmit={(data) => console.log("New PO:", data)}
      />
      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onSubmit={(data) => console.log("New Approval:", data)}
      />
    </div>
  );
};

export default Procurement;
