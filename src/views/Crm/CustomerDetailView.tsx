import React, { useMemo, useState } from "react";
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
      active ? "bg-primary" : "bg-slate-400"
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
  const handleCustomerCreated = (newCustomer: CustomerDetail) => {
    // select the new customer in UI
    onCustomerSelect(newCustomer);

    // notify parent to refresh list if it uses onAdd to refresh
    try { onAdd && onAdd(); } catch (err) { /* ignore */ }

    // close modal
    setCustomerModalOpen(false);
  };
  

  const [activeTab, setActiveTab] = useState<"overview" | "quotations" | "invoices">(
    "overview",
  );

  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q),
    );
  }, [customers, searchTerm]);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "inactive":
        return "bg-slate-100 text-muted border-slate-200";
      case "prospect":
        return "bg-primary-600 text-white border-primary-600";
      default:
        return "bg-slate-50 text-muted border-slate-200";
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
      <div className="bg-card shadow-sm px-6 py-3 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Back"
          >
            <X className="w-5 h-5 text-muted" />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-main">Customer Details</h1>
            <p className="text-xs text-muted">Profile & transactions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
        <button
  onClick={() => setCustomerModalOpen(true)}
  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
>
  <Plus className="w-4 h-4" />
  New
</button>


         
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-sidebar border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="search"
                placeholder="Search customers, id or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-card border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] focus:border-[var(--primary-600)] transition-all"
                aria-label="Search customers"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </label>

            <p className="mt-3 text-xs text-muted">{filteredCustomers.length} customers</p>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
            {filteredCustomers.slice(0, 8).map((c) => (
              <button
                key={c.id}
                onClick={() => onCustomerSelect(c)}
                className={`w-full text-left p-4 border-b border-slate-100 cursor-pointer transition-all flex items-center gap-3 ${
                  c.id === customer.id
                    ? "bg-[rgba(35,124,169,0.06)] border-l-4 border-l-[var(--primary)]"
                    : "hover:bg-[var(--row-hover)]"
                }`}
                aria-current={c.id === customer.id}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm ${
                    c.id === customer.id ? "bg-primary" : "bg-slate-400"
                  }`}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-main truncate">{c.name}</p>
                  <p className="text-xs text-muted font-mono truncate">{c.id}</p>
                </div>

                <span
                  className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(c.status)}`}
                >
                  {(c.status || "N/A").toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </aside>
{/* Customer create / edit modal */}
<CustomerModal
  isOpen={isCustomerModalOpen}
  onClose={() => setCustomerModalOpen(false)}
  // onSubmit is called by the modal after successful create/update
  onSubmit={(created) => handleCustomerCreated(created)}
  initialData={null}
  isEditMode={false}
/>

        {/* Main */}
        <main className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-card border-b border-slate-200 sticky top-0 z-10">
            <div className="flex px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-all ${
                  activeTab === "overview"
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-muted hover:text-main"
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab("quotations")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "quotations"
                    ? "border-[var(--primary)] text-[var(--primary)]"
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
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-muted hover:text-main"
                }`}
              >
                <Receipt className="w-4 h-4 text-muted" />
                Invoices
              </button>

              <div className="ml-auto flex items-center gap-3 px-4">
                <button className="text-sm px-3 py-2 rounded-md border border-slate-200 hover:shadow-sm text-muted">Export</button>
                <button className="text-sm px-3 py-2 rounded-md border border-slate-200 hover:shadow-sm text-muted">More</button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-app">
            {activeTab === "overview" && (
              <div className="max-w-6xl mx-auto">
                {/* SINGLE CONSOLIDATED CARD */}
                <section className="bg-card rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-6">
                    {/* Left: avatar + name */}
                    <div className="flex items-center gap-5 min-w-0">
                      <Avatar name={customer.name} active />
                      <div className="min-w-0">
                        <h2 className="text-2xl font-bold text-main truncate">{customer.name}</h2>
                        <p className="text-xs text-muted font-mono">{customer.id}</p>
                        <div className="mt-2">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              customer.status,
                            )}`}
                          >
                            {(customer.status || "unknown").toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: action buttons */}
                    <div className="ml-auto flex items-center gap-3">
                      <button onClick={(e) => onEdit(customer.id, e)} className="px-4 py-2 bg-card border border-slate-200 rounded-md hover:shadow-sm text-main">Edit Profile</button>
                    </div>
                  </div>

                  <hr className="my-6 border-t border-slate-100" />

                  {/* Consolidated info grid inside same card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-[var(--card)] border border-slate-100 h-full flex items-start gap-3">
                      <div className="p-2 rounded-md bg-[rgba(35,124,169,0.06)]">
                        <Building2 className="w-6 h-6 text-[var(--primary)]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted font-medium">Customer Type</p>
                        <p className="text-base font-semibold text-main mt-1">{customer.type || "—"}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[var(--card)] border border-slate-100 h-full flex items-start gap-3">
                      <div className="p-2 rounded-md bg-[rgba(35,124,169,0.06)]">
                        <FileText className="w-6 h-6 text-[var(--primary)]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted font-medium">Tax ID (TPIN)</p>
                        <p className="text-base font-semibold text-main mt-1">{customer.tpin || "—"}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[var(--card)] border border-slate-100 h-full flex items-start gap-3">
                      <div className="p-2 rounded-md bg-[rgba(35,124,169,0.06)]">
                        <Receipt className="w-6 h-6 text-[var(--primary)]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted font-medium">Currency</p>
                        <p className="text-base font-semibold text-main mt-1">{customer.currency || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-[var(--card)] border border-slate-100 h-full">
                      <h4 className="text-sm font-semibold text-main flex items-center gap-2 mb-3">
                        <Mail className="w-4 h-4 text-[var(--primary)]" />
                        Contact
                      </h4>

                      <div className="flex flex-col gap-4 h-full justify-start">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-card rounded-md"><Mail className="w-5 h-5 text-muted" /></div>
                          <div>
                            <p className="text-xs text-muted">Email Address</p>
                            <p className="text-sm font-medium text-main mt-1">{customer.email || "—"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-card rounded-md"><Phone className="w-5 h-5 text-muted" /></div>
                          <div>
                            <p className="text-xs text-muted">Mobile Number</p>
                            <p className="text-sm font-medium text-main mt-1">{customer.mobile || "—"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[var(--card)] border border-slate-100 h-full">
                      <h4 className="text-sm font-semibold text-main flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-[var(--primary)]" />
                        Addresses
                      </h4>

                      <div className="flex flex-col gap-4 h-full justify-start">
                        <div>
                          <p className="text-xs text-muted">Billing</p>
                          <p className="text-sm text-main mt-1">{formatAddress(customer, "billing")}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted">Shipping</p>
                          <p className="text-sm text-main mt-1">{formatAddress(customer, "shipping")}</p>
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
                  <div className="w-24 h-24 mx-auto bg-[linear-gradient(180deg,rgba(248,250,252,1),rgba(241,245,249,1))] rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-12 h-12 text-muted" />
                  </div>
                  <p className="text-xl font-semibold text-main mb-2">No Quotations Yet</p>
                  <p className="text-sm text-muted mb-6">Create your first quotation for this customer</p>
                  <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm inline-flex items-center gap-2 shadow-sm"><Plus className="w-4 h-4"/> Create Quotation</button>
                </div>
              </div>
            )}

            {activeTab === "invoices" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-[linear-gradient(180deg,rgba(248,250,252,1),rgba(241,245,249,1))] rounded-full flex items-center justify-center mb-4">
                    <Receipt className="w-12 h-12 text-muted" />
                  </div>
                  <p className="text-xl font-semibold text-main mb-2">No Invoices Yet</p>
                  <p className="text-sm text-muted mb-6">Create your first invoice for this customer</p>
                  <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm inline-flex items-center gap-2 shadow-sm"><Plus className="w-4 h-4"/> Create Invoice</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
    
  );
  
};

export default CustomerDetailView;
