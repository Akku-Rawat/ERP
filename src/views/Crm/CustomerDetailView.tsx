import React, { useState } from "react";
import { X, Search, Edit, FileText, Receipt, Plus } from "lucide-react";
import CustomerModal from "../../components/crm/CustomerModal";
import QuotationModal from "../../components/sales/QuotationModal";
import InvoiceModal from "../../components/sales/InvoiceModal";
import type { CustomerDetail } from "../../types/customer";

interface Props {
  customer: CustomerDetail;
  customers: CustomerDetail[];
  onBack: () => void;
  onCustomerSelect: (customer: CustomerDetail) => void;
  onAdd: () => void;
  onEdit: (id: string, e: React.MouseEvent) => void;
}

const CustomerDetailView: React.FC<Props> = ({
  customer,
  customers,
  onBack,
  onCustomerSelect,
  onAdd,
  onEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "quotations" | "invoices"
  >("overview");
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  console.log("📌 CustomerDetailView received customer:", customer);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "prospect":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatAddress = (c: CustomerDetail, type: "billing" | "shipping") => {
    const fields =
      type === "billing"
        ? {
            line1: c.billingAddressLine1,
            line2: c.billingAddressLine2,
            city: c.billingCity,
            state: c.billingState,
            postal: c.billingPostalCode,
            country: c.billingCountry,
          }
        : {
            line1: c.shippingAddressLine1,
            line2: c.shippingAddressLine2,
            city: c.shippingCity,
            state: c.shippingState,
            postal: c.shippingPostalCode,
            country: c.shippingCountry,
          };

    const parts = [
      fields.line1,
      fields.line2,
      fields.city,
      fields.state,
      fields.postal,
      fields.country,
    ].filter(Boolean);

    return parts.length ? parts.join(", ") : "—";
  };

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
        <h1 className="text-2xl font-bold text-gray-800">Customer Details</h1>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredCustomers.map((c) => (
              <div
                key={c.id}
                onClick={() => onCustomerSelect(c)}
                className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                  c.id === customer.id
                    ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      c.id === customer.id ? "bg-indigo-600" : "bg-gray-400"
                    }`}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{c.id}</p>
                  </div>

                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      customer.status,
                    )}`}
                  >
                    {(customer.status || "UNKNOWN").toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-white border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab("quotations")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "quotations"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                Quotations
              </button>

              <button
                onClick={() => setActiveTab("invoices")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "invoices"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Receipt className="w-4 h-4" />
                Invoices
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            {activeTab === "overview" && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {customer.name}
                      </h2>
                      <p className="text-sm text-gray-500 font-mono mt-1">
                        ID: {customer.id}
                      </p>
                    </div>

                    <button
                      onClick={(e) => onEdit(customer.id, e)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Type
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            customer.type === "Company"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {customer.type}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        TPIN
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {customer.tpin || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Currency
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {customer.currency || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Onboarding Balance
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {customer.onboardingBalance ?? "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Status
                      </p>
                      <p className="mt-1">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            customer.status,
                          )}`}
                        >
                          {(customer.status || "unknown").toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <hr className="my-8 border-gray-200" />

                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Address Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Billing Address
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {formatAddress(customer, "billing")}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Shipping Address
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {formatAddress(customer, "shipping")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quotations */}
            {activeTab === "quotations" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-6" />
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    No Quotations Yet
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Create your first quotation for this customer
                  </p>
                  <button
                    onClick={() => setShowQuotationModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create Quotation
                  </button>
                </div>
              </div>
            )}

            {/* Invoices */}
            {activeTab === "invoices" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Receipt className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    No Invoices Yet
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Create your first invoice for this customer
                  </p>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuotationModal
        isOpen={showQuotationModal}
        onClose={() => setShowQuotationModal(false)}
        onSubmit={() => setShowQuotationModal(false)}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSubmit={() => setShowInvoiceModal(false)}
      />
    </div>
  );
};

export default CustomerDetailView;
