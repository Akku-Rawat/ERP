import React, { useState } from "react";
import {
  X,
  Search,
  Edit,
  FileText,
  Receipt,
  Plus,
  MapPin,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import type { CustomerDetail } from "../../types/customer";
import CustomerModal from "../../components/crm/CustomerModal";
import QuotationModal from "../../components/sales/QuotationModal";
import InvoiceModal from "../../components/sales/InvoiceModal";

interface Props {
  customer: CustomerDetail;
  customers: CustomerDetail[];
  onBack: () => void;
  onCustomerSelect: (customer: CustomerDetail) => void;
  onAdd: () => void;
  onEdit: (id: string, e: React.MouseEvent) => void;
}

const Avatar: React.FC<{ name: string; active?: boolean }> = ({ name, active }) => (
  <div
    className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-sm select-none ${
      active ? "bg-primary" : "bg-muted"
    }`}
    aria-hidden
  >
    {name.charAt(0).toUpperCase()}
  </div>
);

const CustomerDetailView: React.FC<Props> = ({
  customer,
  customers,
  onBack,
  onCustomerSelect,
  onAdd,
  onEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleCustomerCreated = (newCustomer: CustomerDetail) => {
    onCustomerSelect(newCustomer);
    try {
      onAdd && onAdd();
    } catch {
      /* ignore */
    }
    setCustomerModalOpen(false);
  };

  const [activeTab, setActiveTab] = useState<"overview" | "quotations" | "invoices">(
    "overview",
  );

  const q = searchTerm.trim().toLowerCase();
  const filteredCustomers = (customers || []).filter((c) => {
    const name = (c.name || "").toLowerCase();
    const id = (c.id || "").toLowerCase();
    return name.includes(q) || id.includes(q);
  });

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "inactive":
        return "bg-card text-muted border-[var(--border)]";
      case "prospect":
        return "bg-primary text-white border-primary";
      default:
        return "bg-row-hover text-main border-[var(--border)]";
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
    <div className="flex flex-col h-screen bg-app text-main">
      {/* Header */}
      <div className="bg-card shadow-sm px-6 py-3 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-row-hover rounded-lg transition-colors"
            aria-label="Back"
          >
            <X className="w-5 h-5 text-muted" />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-main">Customer Details</h1>
            <p className="text-xs text-muted">Profile &amp; transactions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCustomerModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Customer
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-sidebar border-r border-[var(--border)] flex flex-col">
          <div className="p-4 border-b border-[var(--border)]">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="search"
                placeholder="Search customers, id or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-card border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-main placeholder:text-muted"
                aria-label="Search customers"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-row-hover"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </label>

            <p className="mt-3 text-xs text-muted">
              {filteredCustomers.length} customers
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredCustomers.map((c) => {
              const name = c?.name || "";
              const id = c?.id || "";
              const status = c?.status || "N/A";
              const isActive = id === customer?.id;

              return (
                <button
                  key={id || Math.random().toString(36).slice(2)}
                  onClick={() => onCustomerSelect(c)}
                  className={`w-full text-left p-4 border-b border-[var(--border)] cursor-pointer transition-all flex items-center gap-3 ${
                    isActive
                      ? "bg-row-hover border-l-4 border-l-primary"
                      : "hover:bg-row-hover"
                  }`}
                  aria-current={isActive}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm ${
                      isActive ? "bg-primary" : "bg-muted"
                    }`}
                    aria-hidden
                  >
                    {(name.charAt(0) || "").toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-main truncate">
                      {name || "—"}
                    </p>
                    <p className="text-xs text-muted font-mono truncate">
                      {id || "—"}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                      status,
                    )}`}
                  >
                    {status.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-card border-b border-[var(--border)] sticky top-0 z-10">
            <div className="flex px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-all ${
                  activeTab === "overview"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-main"
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab("quotations")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "quotations"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-main"
                }`}
              >
                <FileText className="w-4 h-4 text-muted" />
                Quotations
              </button>

              <button
                onClick={() => setActiveTab("invoices")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "invoices"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-main"
                }`}
              >
                <Receipt className="w-4 h-4 text-muted" />
                Invoices
              </button>

              <div className="ml-auto flex items-center gap-3 px-4">
                <button className="text-sm px-3 py-2 rounded-md border border-[var(--border)] hover:shadow-sm text-muted bg-card transition-shadow">
                  Export
                </button>
                <button className="text-sm px-3 py-2 rounded-md border border-[var(--border)] hover:shadow-sm text-muted bg-card transition-shadow">
                  More
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-app">
            {activeTab === "overview" && (
              <div className="max-w-6xl mx-auto">
                {/* Consolidated Card */}
                <section className="bg-card rounded-xl shadow-sm border border-[var(--border)] p-8">
                  {/* Header Section */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                      <Avatar name={customer.name} active />
                      <div>
                        <h2 className="text-3xl font-bold text-main mb-1">
                          {customer.name}
                        </h2>
                        <p className="text-sm text-muted font-mono mb-3">
                          {customer.id}
                        </p>
                        <span
                          className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(
                            customer.status,
                          )}`}
                        >
                          {(customer.status || "unknown").toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => onEdit(customer.id, e)}
                      className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-all font-medium text-sm shadow-sm hover:shadow flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>

                  <hr className="border-[var(--border)] mb-8" />

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center gap-4 p-5 rounded-lg bg-row-hover border border-[var(--border)]">
                      <div className="p-3 rounded-lg bg-card shadow-sm">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
                          Customer Type
                        </p>
                        <p className="text-lg font-bold text-main">
                          {customer.type || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-lg bg-row-hover border border-[var(--border)]">
                      <div className="p-3 rounded-lg bg-card shadow-sm">
                        <FileText className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
                          Tax ID (TPIN)
                        </p>
                        <p className="text-lg font-bold text-main">
                          {customer.tpin || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-lg bg-row-hover border border-[var(--border)]">
                      <div className="p-3 rounded-lg bg-card shadow-sm">
                        <Receipt className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
                          Currency
                        </p>
                        <p className="text-lg font-bold text-main">
                          {customer.currency || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[var(--border)] mb-8" />

                  {/* Contact & Address Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div>
                      <div className="flex items-center gap-2 mb-5">
                        <div className="p-2 rounded-lg bg-row-hover">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-main">
                          Contact Information
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-row-hover border border-[var(--border)]">
                          <div className="p-2 rounded-lg bg-card shadow-sm">
                            <Mail className="w-5 h-5 text-muted" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                              Email Address
                            </p>
                            <p className="text-sm font-medium text-main truncate">
                              {customer.email || "—"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-lg bg-row-hover border border-[var(--border)]">
                          <div className="p-2 rounded-lg bg-card shadow-sm">
                            <Phone className="w-5 h-5 text-muted" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                              Mobile Number
                            </p>
                            <p className="text-sm font-medium text-main">
                              {customer.mobile || "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Addresses */}
                    <div>
                      <div className="flex items-center gap-2 mb-5">
                        <div className="p-2 rounded-lg bg-row-hover">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-main">Addresses</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-row-hover border border-[var(--border)]">
                          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                            Billing Address
                          </p>
                          <p className="text-sm text-main leading-relaxed">
                            {formatAddress(customer, "billing")}
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-row-hover border border-[var(--border)]">
                          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                            Shipping Address
                          </p>
                          <p className="text-sm text-main leading-relaxed">
                            {formatAddress(customer, "shipping")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "quotations" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 bg-row-hover">
                    <FileText className="w-12 h-12 text-muted" />
                  </div>
                  <p className="text-xl font-semibold text-main mb-2">
                    No Quotations Yet
                  </p>
                  <p className="text-sm text-muted mb-6">
                    Create your first quotation for this customer
                  </p>
                  <button
                    onClick={() => setShowQuotationModal(true)}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm inline-flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Create Quotation
                  </button>
                </div>
              </div>
            )}

            {activeTab === "invoices" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 bg-row-hover">
                    <Receipt className="w-12 h-12 text-muted" />
                  </div>
                  <p className="text-xl font-semibold text-main mb-2">
                    No Invoices Yet
                  </p>
                  <p className="text-sm text-muted mb-6">
                    Create your first invoice for this customer
                  </p>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm inline-flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Create Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
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

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        onSubmit={(created) => handleCustomerCreated(created)}
        initialData={null}
        isEditMode={false}
      />
    </div>
  );
};

export default CustomerDetailView;                                                                                                                                