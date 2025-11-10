import React, { useState } from "react";
import { X, Search, Edit, FileText, Receipt, Plus } from "lucide-react";
import CustomerModal from "../../components/crm/CustomerModal";
import QuotationModal from "../../components/sales/QuotationModal";
import InvoiceModal from "../../components/sales/InvoiceModal";

interface Customer {
  custom_id: string;
  customer_name: string;
  customer_type: "Individual" | "Company";
  customer_currency?: string;
  customer_onboarding_balance?: string;
  custom_customer_tpin?: string;
  custom_billing_adress_line_1?: string;
  custom_billing_adress_line_2?: string;
  custom_billing_city?: string;
  custom_billing_state?: string;
  custom_billing_country?: string;
  custom_billing_zip_code?: string;
  custom_shipping_address_line_1?: string;
  custom_shipping_address_line_2?: string;
  custom_shipping_city?: string;
  custom_shipping_state?: string;
  custom_shipping_country?: string;
  custom_shipping_zip_code?: string;
  custom_status?: "active" | "inactive" | "prospect";
  // Add more fields as needed
}

interface Props {
  customer: Customer;
  customers: Customer[];
  onBack: () => void;
  onCustomerSelect: (customer: Customer) => void;
  onAdd: () => void;
onEdit: (customer: Customer, e: React.MouseEvent) => void;}

const CustomerDetailView: React.FC<Props> = ({
  customer,
  customers,
  onBack,
  onCustomerSelect,
  onAdd,
  onEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "quotations" | "invoices">("overview");
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const filteredCustomers = customers.filter((c) =>
    c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.custom_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
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

  const formatAddress = (c: Customer, type: "billing" | "shipping") => {
    const prefix = type === "billing" ? "custom_billing" : "custom_shipping";
    const line1 = c[`${prefix}_address_line_1` as keyof Customer] || "";
    const line2 = c[`${prefix}_address_line_2` as keyof Customer] || "";
    const city = c[`${prefix}_city` as keyof Customer] || "";
    const state = c[`${prefix}_state` as keyof Customer] || "";
    const country = c[`${prefix}_country` as keyof Customer] || "";
    const zip = c[`${prefix}_zip_code` as keyof Customer] || "";

    const parts = [line1, line2, city, state, zip, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
        <h1 className="text-2xl font-bold text-gray-800">Customer Details</h1>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          title="Back to list"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Customer List */}
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
                key={c.custom_id}
                onClick={() => onCustomerSelect(c)}
                className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                  c.custom_id === customer.custom_id
                    ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      c.custom_id === customer.custom_id ? "bg-indigo-600" : "bg-gray-400"
                    }`}
                  >
                    {c.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {c.customer_name}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{c.custom_id}</p>
                  </div>
                  {c.custom_status && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        c.custom_status
                      )}`}
                    >
                      {c.custom_status.toUpperCase()}
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
                        {customer.customer_name}
                      </h2>
                      <p className="text-sm text-gray-500 font-mono mt-1">
                        ID: {customer.custom_id}
                      </p>
                    </div>
                    <button
                      onClick={() => onEdit(customer)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition"
                      title="Edit Customer"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Type
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            customer.customer_type === "Company"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {customer.customer_type}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        TPIN
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {customer.custom_customer_tpin || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Currency
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {customer.customer_currency || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Onboarding Balance
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {customer.customer_onboarding_balance || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </p>
                      <p className="mt-1">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            customer.custom_status
                          )}`}
                        >
                          {(customer.custom_status || "unknown").toUpperCase()}
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
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                        Billing Address
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {formatAddress(customer, "billing")}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
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
        onSubmit={() => {
          setShowQuotationModal(false);
          // Optionally refresh quotations
        }}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSubmit={() => {
          setShowInvoiceModal(false);
          // Optionally refresh invoices
        }}
      />
    </div>
  );
};

export default CustomerDetailView;