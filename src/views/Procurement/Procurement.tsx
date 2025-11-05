import React, { useState } from "react";
import RFQsTable from "./Rfqs";
import PurchaseOrdersTable from "./PurchaseOrders";
import ApprovalsSection from "./Approvals";
import Dashboard from "./ProcurementDashboard";
import RFQModal from "../../components/procurement/RfqModal";
import PurchaseOrderModal from "../../components/procurement/PurchaseOrderModal";
import ApprovalModal from "../../components/procurement/ApprovalModal";
import { 
  FaClipboardList,
  FaCheckCircle,
  FaShoppingBag,
  FaTachometerAlt,
  FaFileSignature,
  FaFileInvoiceDollar,
  FaTruckLoading,
  FaLandmark
} from "react-icons/fa";
import VendorModal from "../../components/procurement/VendorModal";
import VendorManagement from "./VendorManagement";

const procurement = {
  name: "Procurement",
  icon: <FaShoppingBag />,
  defaultTab: "procurementdashboard",
  tabs: [
    {id:"procurementdashboard", name: "Dashboard", icon: <FaTachometerAlt />},
    {id: "vendor", name: "Vendor Management", icon: <FaLandmark/> },
    { id: "rfqs", name: "RFQs", icon: <FaFileSignature /> },
    { id: "orders", name: "Purchase Orders", icon: <FaClipboardList /> },
    { id: "approvals", name: "Approvals", icon: <FaCheckCircle /> },
    { id: "invoicematching", name: "Invoice Matching", icon: <FaFileInvoiceDollar /> },
    { id: "goodsreceipt", name: "Goods Receipt", icon: <FaTruckLoading /> },
  ],
};

const Procurement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(procurement.defaultTab);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showRFQModal, setShowRFQModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showGRModal, setShowGRModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleAdd = () => {
    if (activeTab === "vendor") setShowVendorModal(true);
    else if (activeTab === "rfqs") setShowPOModal(true);
    else if (activeTab === "orders") setShowPOModal(true);
    else if (activeTab === "approvals") setShowApprovalModal(true);
    else if (activeTab === "goodsreceipt") setShowGRModal(true);
    else if (activeTab === "invoicematching") setShowInvoiceModal(true);
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
            onClick={() => setActiveTab(tab.id)}
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
        {activeTab === "vendor" && <VendorManagement onAdd={handleAdd} />}
        {activeTab === "rfqs" && <RFQsTable onAdd={handleAdd} />}
        {activeTab === "orders" && <PurchaseOrdersTable onAdd={handleAdd} />}
        {activeTab === "approvals" && <ApprovalsSection onAdd={handleAdd} />}
        {activeTab === "procurementdashboard" && <Dashboard />}
      </div>

      {/* Modals */}
      <VendorModal
        isOpen={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        onSubmit={(data) => console.log("New RFQ:", data)}
      />
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
