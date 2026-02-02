import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Edit,
  FileText,
  Receipt,
  Plus,
  Building2,
} from "lucide-react";
import type { SupplierFormData, Supplier } from "../../types/Supply/supplier";
import SupplierStatement from "./SupplierStatement";
import PurchaseInvoiceModal from "../../components/procurement/PurchaseInvoiceModal";
import PurchaseOrderModal from "../../components/procurement/PurchaseOrderModal";

interface Props {
  supplier: Supplier;
  suppliers: Supplier[];
  onBack: () => void;
  onSupplierSelect: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
}

const SupplierDetailView: React.FC<Props> = ({
  supplier,
  suppliers,
  onBack,
  onSupplierSelect,
  onEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "purchase-orders" | "bills" | "statement"
  >("overview");
  const supplierDetail = supplier;
  const [loading, setLoading] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
const [showInvoiceModal, setShowInvoiceModal] = useState(false);



  const filteredSuppliers = suppliers.filter(
    (s) =>
      (s.supplierName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.supplierCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.tpin || "").toLowerCase().includes(searchTerm.toLowerCase())
  );


const renderActionButton = () => {
  switch (activeTab) {
    case "purchase-orders":
      return (
        <button
          onClick={() => setShowPOModal(true)}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md"
        >
          <Plus size={14} /> New Purchase Order
        </button>
      );

    case "bills":
      return (
        <button
          onClick={() => setShowInvoiceModal(true)}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md"
        >
          <Plus size={14} /> New Purchase Invoice
        </button>
      );

    default:
      return null;
  }
};




  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success";
      case "inactive":
        return "bg-danger text-danger";
      case "pending":
        return "bg-warning text-warning";
      default:
        return "bg-muted text-main";

    }
  };

  const formatAddress = () => {
    const parts = [
      supplierDetail?.billingAddressLine1,
      supplierDetail?.billingAddressLine2,
      supplierDetail?.billingCity,
      supplierDetail?.district,
      supplierDetail?.province,
      supplierDetail?.billingPostalCode,
      supplierDetail?.billingCountry,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  return (
    <div className="flex flex-col bg-app text-main">

      {/* Header */}
      <div className="bg-card px-6 py-4 flex items-center justify-between border-b border-theme">
        <h1 className="text-2xl font-bold text-main flex items-center gap-3">
          <Building2 className="w-7 h-7 text-primary" />
          Supplier Details
        </h1>

        <div className="flex items-center gap-3">
          {renderActionButton()}
          <button
            onClick={onBack}
            className="p-2 row-hover rounded-lg transition"
          >
            <X className="w-6 h-6 text-muted" />
          </button>
        </div>
      </div>


      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Supplier List */}
        <div className="w-80 bg-sidebar border-r border-theme flex flex-col">

          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="search"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm bg-app border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredSuppliers.map((s) => (
              <div
                key={s.supplierId || s.supplierCode || s.supplierName}
                onClick={() => onSupplierSelect(s)}
                className={`p-4 border-b border-theme cursor-pointer transition-all ${s.supplierName === supplierDetail?.supplierName
                    ? "bg-primary/10 border-l-4 border-l-[var(--primary)]"
                    : "bg-primary/5 hover:bg-primary/10"

                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${s.supplierName === supplierDetail?.supplierName
                        ? "bg-primary"
                        : "bg-border"
                      }`}
                  >
                    {(s.supplierName || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-main truncate">
                      {s.supplierName}
                    </p>
                    <p className="text-xs text-muted">
                      {s.supplierCode || s.tpin || "No code/TPIN"}
                    </p>
                  </div>
                  {s.status && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        s.status,
                      )}`}
                    >
                      {s.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-card border-b border-theme">

            <div className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "overview"
                    ? "border-[var(--primary)] text-primary"
                    : "border-transparent text-gray-600 hover:text-main"
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("purchase-orders")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === "purchase-orders"
                    ? "border-[var(--primary)] text-primary"
                    : "border-transparent text-gray-600 hover:text-main"
                  }`}
              >
                <FileText className="w-4 h-4" />
                Purchase Orders
              </button>
              <button
                onClick={() => setActiveTab("bills")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === "bills"
                    ? "border-[var(--primary)] text-primary"
                    : "border-transparent text-gray-600 hover:text-main"
                  }`}
              >
                <Receipt className="w-4 h-4" />
                Bills
              </button>
              <button
  onClick={() => setActiveTab("statement")}
  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
    activeTab === "statement"
      ? "border-[var(--primary)] text-primary"
      : "border-transparent text-gray-600 hover:text-main"
  }`}
>
  <FileText className="w-4 h-4" />
  Statement
</button>

            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-app">

            {activeTab === "overview" && (
              <div className="max-w-5xl mx-auto">
                <div className="bg-card rounded-xl border border-theme p-8">

                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-main">
                        {supplierDetail?.supplierName}
                      </h2>
                      {supplierDetail?.supplierCode && (
                        <p className="text-sm text-muted font-mono mt-1">
                          Code: {supplierDetail?.supplierCode}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onEdit(supplierDetail!)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition"
                      title="Edit Supplier"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                          Currency
                        </p>
                        <p className="mt-1 font-medium">
                          {supplierDetail?.currency || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                          Phone
                        </p>
                        <p className="mt-1 font-medium">
                          {supplierDetail?.phoneNo || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                          Email
                        </p>
                        <p className="mt-1 font-medium">
                          {supplierDetail?.emailId || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                          TPIN
                        </p>
                        <p className="mt-1 font-medium">
                          {supplierDetail?.tpin || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                          Opening Balance
                        </p>
                        <p className="mt-1 font-medium">
                          {Number(supplierDetail?.openingBalance || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {supplierDetail?.status && (
                      <div>
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                          Status
                        </p>
                        <span
                          className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(supplierDetail?.status)}`}
                        >
                          {supplierDetail?.status.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <hr className="my-8 border-gray-200" />

                  {/* Address & Bank Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Address */}
                    <div className="bg-card border border-theme rounded-xl p-6">
                      <h4 className="font-semibold text-main mb-4 flex items-center gap-2">
                        Billing Address
                      </h4>
                      <p className="text-sm text-main leading-relaxed whitespace-pre-line">
                        {formatAddress()}
                      </p>
                    </div>

                    {/* Bank Details */}
                    {(supplierDetail?.accountNumber || supplierDetail?.accountHolder) && (
                      <div className="bg-card border border-theme rounded-xl p-6 shadow-sm">
                        <h4 className="font-semibold text-main mb-4">
                          Bank Details
                        </h4>
                        <div className="space-y-3 text-sm">
                          {supplierDetail?.accountHolder && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account Holder:</span>
                              <span className="font-medium">
                                {supplierDetail?.accountHolder}
                              </span>
                            </div>
                          )}

                          {supplierDetail?.bankAccount && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bank Account:</span>
                              <span className="font-medium">
                                {supplierDetail?.bankAccount}
                              </span>
                            </div>
                          )}

                          {supplierDetail?.accountNumber && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account No:</span>
                              <span className="font-medium font-mono">
                                {supplierDetail?.accountNumber}
                              </span>
                            </div>
                          )}

                          {supplierDetail?.swiftCode && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">SWIFT:</span>
                              <span className="font-medium uppercase">
                                {supplierDetail?.swiftCode}
                              </span>
                            </div>
                          )}

                          {supplierDetail?.sortCode && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Sort Code:</span>
                              <span className="font-medium">
                                {supplierDetail?.sortCode}
                              </span>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

       
            {activeTab === "statement" && (
  <SupplierStatement supplier={supplierDetail} />
)}

          </div>
        </div>
      </div>
      <PurchaseOrderModal
  isOpen={showPOModal}
  onClose={() => setShowPOModal(false)}
  onSubmit={(data) => {
    console.log("PO created:", data);
    setShowPOModal(false);
  }}
/>

<PurchaseInvoiceModal
  isOpen={showInvoiceModal}
  onClose={() => setShowInvoiceModal(false)}
  onSubmit={(data) => {
    console.log("Invoice created:", data);
    setShowInvoiceModal(false);
  }}
/>

    </div>
  );
};

export default SupplierDetailView;
