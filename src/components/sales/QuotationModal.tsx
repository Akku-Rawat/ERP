import {
  Plus,
  Trash2,
  FileText,
  Calendar,
  MoreVertical,
  Save,
  Send,
  Printer,
  X,
} from "lucide-react";
import TermsAndCondition from "../TermsAndCondition";
import { useQuotationForm } from "../../hooks/useQuotationForm";
import { Input, Select, Button } from "../../components/ui/modal/formComponent";
import CustomerSelect from "../selects/CustomerSelect";
import ItemSelect from "../selects/ItemSelect";
import Modal from "../../components/ui/modal/modal";
import toast from "react-hot-toast";
import { User, Mail, Phone } from "lucide-react";

<User size={16} className="text-muted" />;
import {
  invoiceStatusOptions,
  currencySymbols,
  paymentMethodOptions,
  currencyOptions,
} from "../../constants/invoice.constants";

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const {
    formData,
    customerDetails,
    customerNameDisplay,
    paginatedItems,
    totals,
    ui,
    actions,
  } = useQuotationForm(isOpen, onClose, onSubmit);

  const validateForm = () => {
    // 1️⃣ Customer
    if (!formData.customerId) {
      toast.error("Please select a customer");
      return false;
    }
    if (!formData.dueDate) {
      toast.error("Please enter a valid until date");
      return false;
    }

    // 2️⃣ At least 1 item
    if (!formData.items.length) {
      toast.error("Please add at least one item");
      return false;
    }

    // 3️⃣ Validate items
    for (let i = 0; i < formData.items.length; i++) {
      const it = formData.items[i];

      if (!it.itemCode) {
        toast.error(`Item ${i + 1}: Please select an item`);
        return false;
      }

      if (!it.quantity || it.quantity <= 0) {
        toast.error(`Item ${i + 1}: Quantity must be greater than 0`);
        return false;
      }

      if (!it.price || it.price <= 0) {
        toast.error(`Item ${i + 1}: Unit price must be greater than 0`);
        return false;
      }
    }

    return true;
  };

  const symbol = currencySymbols[formData.currencyCode] ?? "ZK";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    actions.handleSubmit(e);
  };

  const handlePrint = () => {
    toast.success("Print functionality - Opens print dialog");
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-5"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="bg-app w-full flex flex-col overflow-hidden"
        style={{
          borderRadius: "12px",
          maxWidth: "1200px",
          maxHeight: "85vh",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <div className="relative bg-primary border-b border-theme px-8 py-3 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-xl font-semibold text-main mb-0.5">
              Create Quotation
            </h1>
            <p className="text-xs text-main">
              Create and manage quotation details
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleFormSubmit}
              className="bg-card hover:bg-[var(--primary-600)] text-white px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Save size={14} />
              Save
            </button>
            <button
              onClick={handleFormSubmit}
              className="bg-card hover:bg-[var(--primary-600)] text-white px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Send size={14} />
              Send
            </button>
            <button
              onClick={handlePrint}
              className="bg-card hover:bg-[var(--row-hover)] text-main border border-theme px-4 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer size={14} />
              Print
            </button>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2
             p-1.5 rounded-md
             text-main hover:bg-danger/10 hover:text-danger
             transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card border-b border-theme px-8 shrink-0">
          <div className="flex gap-8">
            {[
              { key: "details", label: "Details" },
              { key: "terms", label: "Terms & Conditions" },
              { key: "address", label: "Additional Details" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => ui.setActiveTab(tab.key as any)}
                className={`py-2.5 bg-transparent border-none text-xs font-medium cursor-pointer transition-all ${
                  ui.activeTab === tab.key
                    ? "text-primary border-b-[3px] border-primary"
                    : "text-muted border-b-[3px] border-transparent hover:text-main"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {/* DETAILS TAB */}
          {ui.activeTab === "details" && (
            <div className="grid grid-cols-[1fr_320px] gap-6 max-w-[1600px] mx-auto">
              {/* Left Section */}
              <div className="flex gap-4">
                {/* Quotation Details Sidebar */}
                <div className="bg-card rounded-lg p-3 shadow-sm w-[200px] shrink-0 h-fit">
                  <div className="flex items-center gap-1 mb-3">
                    <MoreVertical size={16} className="text-muted" />
                    <h3 className="text-[13px] font-semibold text-main">
                      Quotation Details
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Customer Select */}
                    <div>
                      <label className="block text-[10px] font-medium text-main mb-1">
                        Customer Name *
                      </label>
                      <CustomerSelect
                        value={customerNameDisplay}
                        onChange={actions.handleCustomerSelect}
                        className="w-full"
                      />
                    </div>

                    {/* Date of Quotation */}
                    <div>
                      <label className="block text-[10px] font-medium text-main mb-1">
                        Date of Quotation *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="dateOfInvoice"
                          value={formData.dateOfInvoice}
                          onChange={actions.handleInputChange}
                          className="w-full py-1 px-2 pl-7 border border-theme rounded text-[11px] text-main bg-card"
                        />
                        <Calendar
                          size={12}
                          className="absolute left-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Valid Until */}
                    <div>
                      <label className="block text-[10px] font-medium text-main mb-1">
                        Valid until *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={actions.handleInputChange}
                          className="w-full py-1 px-2 pl-7 border border-theme rounded text-[11px] text-main bg-card"
                        />
                        <Calendar
                          size={12}
                          className="absolute left-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Currency */}
                    <div>
                      <label className="block text-[10px] font-medium text-main mb-1">
                        Currency
                      </label>
                      <select
                        name="currencyCode"
                        value={formData.currencyCode}
                        onChange={actions.handleInputChange}
                        className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
                      >
                        {currencyOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-[10px] font-medium text-main mb-1">
                        Status
                      </label>
                      <select
                        name="invoiceStatus"
                        value={formData.invoiceStatus}
                        onChange={actions.handleInputChange}
                        className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
                      >
                        {invoiceStatusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Invoice Type */}
                    {/* <div>
                      <label className="block text-[10px] font-medium text-main mb-1">
                        Invoice Type
                      </label>
                      <input
                        type="text"
                        name="invoiceType"
                        disabled
                        value={formData.invoiceType}
                        onChange={actions.handleInputChange}
                        className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-app opacity-60"
                      />
                    </div> */}

                    {/* Export Country */}
                    {/* {ui.isExport && (
                      <div>
                        <label className="block text-[10px] font-medium text-main mb-1">
                          Export To Country
                        </label>
                        <input
                          type="text"
                          name="destnCountryCd"
                          disabled
                          value={formData.destnCountryCd}
                          onChange={actions.handleInputChange}
                          className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-app opacity-60"
                        />
                      </div>
                    )} */}

                    {/* LPO Number */}
                    {ui.isLocal && (
                      <div>
                        <label className="block text-[10px] font-medium text-main mb-1">
                          LPO Number
                        </label>
                        <input
                          type="text"
                          name="lpoNumber"
                          value={formData.lpoNumber}
                          onChange={actions.handleInputChange}
                          placeholder="Local purchase order number"
                          className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Quoted Items Table */}
                <div className="bg-card rounded-lg p-4 shadow-sm flex-1">
                  <div className="flex items-center gap-1.5 mb-3">
                    <MoreVertical size={16} className="text-muted" />
                    <h3 className="text-sm font-semibold text-main">
                      Quoted Items
                    </h3>
                  </div>

                  <div>
                    <table className="w-full border-collapse text-[10px]">
                      <thead>
                        <tr className="border-b border-theme">
                          <th className="px-1 py-1.5 text-left text-muted font-medium text-[9px] w-[25px]">
                            #
                          </th>
                          <th className="px-1 py-1.5 text-left text-muted font-medium text-[9px] w-[130px]">
                            Item
                          </th>
                          <th className="px-1 py-1.5 text-left text-muted font-medium text-[9px] w-[140px]">
                            Description
                          </th>
                          <th className="px-1 py-1.5 text-left text-muted font-medium text-[9px] w-[45px]">
                            Qty
                          </th>
                          <th className="px-1 py-1.5 text-left text-muted font-medium text-[9px] w-[70px]">
                            Unit Price
                          </th>
                          <th className="px-1 py-1.5 text-left text-muted font-medium text-[9px] w-[55px]">
                            Discount
                          </th>
                          <th className="px-1 py-1.5 text-left text-muted font-medium text-[9px] w-[50px]">
                            Tax
                          </th>
                          <th className="px-1 py-1.5 text-left text-muted font-medium text-[9px] w-[55px]">
                            Tax Code
                          </th>
                          <th className="px-1 py-1.5 text-right text-muted font-medium text-[9px] w-[70px]">
                            Amount
                          </th>
                          <th className="px-1 py-1.5 text-center text-muted font-medium text-[9px] w-[35px]">
                            -
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedItems.map((it, idx) => {
                          const i = ui.page * 5 + idx;
                          const taxVal = parseFloat(it.vatRate || "0");
                          const amount =
                            it.quantity * it.price - it.discount + taxVal;
                          return (
                            <tr
                              key={i}
                              className="border-b border-theme bg-card row-hover"
                            >
                              <td className="px-1 py-1.5 text-[10px]">
                                {i + 1}
                              </td>
                              <td className="px-0.5 py-1">
                                <ItemSelect
                                  taxCategory={ui.taxCategory}
                                  value={it.itemCode}
                                  onChange={(item) => {
                                    actions.handleItemSelect(i, item.id);
                                  }}
                                />
                              </td>
                              <td className="px-0.5 py-1">
                                <input
                                  type="text"
                                  name="description"
                                  value={it.description}
                                  onChange={(e) =>
                                    actions.handleItemChange(i, e)
                                  }
                                  placeholder="Description"
                                  className="w-full py-0.5 px-1 border border-theme rounded text-[10px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </td>
                              <td className="px-0.5 py-1">
                                <input
                                  type="number"
                                  name="quantity"
                                  value={it.quantity}
                                  onChange={(e) =>
                                    actions.handleItemChange(i, e)
                                  }
                                  min="1"
                                  className="w-[40px] py-0.5 px-1 border border-theme rounded text-[10px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </td>
                              <td className="px-0.5 py-1">
                                <input
                                  type="number"
                                  name="price"
                                  value={it.price}
                                  onChange={(e) =>
                                    actions.handleItemChange(i, e)
                                  }
                                  min="0"
                                  step="0.01"
                                  className="w-[65px] py-0.5 px-1 border border-theme rounded text-[10px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </td>
                              <td className="px-0.5 py-1">
                                <input
                                  type="number"
                                  name="discount"
                                  value={it.discount}
                                  onChange={(e) =>
                                    actions.handleItemChange(i, e)
                                  }
                                  min="0"
                                  placeholder="0"
                                  className="w-[50px] py-0.5 px-1 border border-theme rounded text-[10px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </td>
                              <td className="px-0.5 py-1">
                                <input
                                  type="number"
                                  name="vatRate"
                                  value={it.vatRate}
                                  onChange={(e) =>
                                    actions.handleItemChange(i, e)
                                  }
                                  min="0"
                                  placeholder="0"
                                  className="w-[45px] py-0.5 px-1 border border-theme rounded text-[10px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </td>
                              <td className="px-0.5 py-1">
                                <input
                                  type="text"
                                  name="vatCode"
                                  value={it.vatCode}
                                  onChange={(e) =>
                                    actions.handleItemChange(i, e)
                                  }
                                  className="w-[50px] py-0.5 px-1 border border-theme rounded text-[10px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </td>
                              <td className="px-1 py-1.5 text-right">
                                <span className="text-[10px] font-medium text-main">
                                  {symbol} {amount.toFixed(2)}
                                </span>
                              </td>
                              <td className="px-1 py-1.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => actions.removeItem(i)}
                                  className="p-0.5 rounded bg-danger/10 text-danger hover:bg-danger/20 transition text-[10px]"
                                >
                                  <X size={12} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={actions.addItem}
                    className="mt-3 px-4 py-1.5 bg-primary hover:bg-[var(--primary-600)] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} />
                    Add Item
                  </button>

                  {/* Pagination Controls */}
                  {ui.itemCount > 5 && (
                    <div className="mt-3 flex justify-between items-center py-2 px-3 bg-app rounded border border-theme">
                      <div className="text-[11px] text-muted">
                        Showing {ui.page * 5 + 1} to{" "}
                        {Math.min((ui.page + 1) * 5, ui.itemCount)} of{" "}
                        {ui.itemCount} items
                      </div>

                      <div className="flex gap-1.5 items-center">
                        <button
                          type="button"
                          onClick={() => ui.setPage(Math.max(0, ui.page - 1))}
                          disabled={ui.page === 0}
                          className="px-2.5 py-1 bg-card text-main border border-theme rounded text-[11px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--row-hover)] transition-colors"
                        >
                          Previous
                        </button>

                        <button
                          type="button"
                          onClick={() => ui.setPage(ui.page + 1)}
                          disabled={(ui.page + 1) * 5 >= ui.itemCount}
                          className="px-2.5 py-1 bg-card text-main border border-theme rounded text-[11px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--row-hover)] transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="flex flex-col gap-4">
                {/* Customer Details */}
                <div className="bg-card rounded-lg p-3">
                  <h3 className="text-[13px] font-semibold text-main mb-2">
                    Customer Details
                  </h3>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-main">
                      <span className="flex items-center gap-2">
                        <User size={16} className="text-muted" />
                        <span className="text-sm text-main">
                          {customerDetails?.name ?? "Customer Name"}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-muted">
                      <Mail size={14} className="text-muted" />
                      <span>
                        {customerDetails?.email ?? "customer@gmail.com"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-muted">
                      <Phone size={14} className="text-muted" />
                      <span>
                        {customerDetails?.mobile_no ?? "+123 4567890"}
                      </span>
                    </div>
                    {customerDetails && (
                      <div className="bg-card rounded-lg p-3">
                        <h3 className="text-[13px] font-semibold text-main mb-2">
                          Invoice Information
                        </h3>

                        <div className="flex flex-col gap-2">
                          {/* Invoice Type */}
                          <div className="flex justify-between text-xs">
                            <span className="text-muted">Invoice Type</span>
                            <span className="font-medium text-main">
                              {formData.invoiceType}
                            </span>
                          </div>

                          {/* Destination Country – only for Export */}
                          {formData.invoiceType === "Export" && (
                            <div className="flex justify-between text-xs">
                              <span className="text-muted">
                                Destination Country
                              </span>
                              <span className="font-medium text-main">
                                {formData.destnCountryCd || "-"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-card rounded-lg p-3">
                  <h3 className="text-[13px] font-semibold text-main mb-2">
                    Summary
                  </h3>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Total Items</span>
                      <span className="font-medium text-main">
                        {formData.items.length}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-medium text-main">
                        {symbol} {totals.subTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Total Tax</span>
                      <span className="font-medium text-main">
                        {symbol} {totals.totalTax.toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-1 p-3 bg-warning rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-white">
                          Grand Total
                        </span>
                        <span className="text-base font-bold text-white">
                          {symbol} {totals.grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TERMS TAB */}
          {ui.activeTab === "terms" && (
            <div className="w-full mt-3">
              <TermsAndCondition
                terms={formData.terms?.selling}
                setTerms={actions.setTerms}
              />
            </div>
          )}

          {/* ADDRESS TAB */}
          {ui.activeTab === "address" && (
            <div className="grid grid-cols-2 gap-6 mt-3">
              {/* Billing Address */}
              <div className="bg-card p-4 rounded-lg border border-theme shadow-sm">
                <h3 className="text-base font-semibold text-main mb-3 border-b-2 border-primary pb-1.5">
                  Billing Address
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Line 1"
                    name="line1"
                    value={formData.billingAddress.line1}
                    onChange={(e) =>
                      actions.handleInputChange(e, "billingAddress")
                    }
                    placeholder="Street, Apartment"
                  />
                  <Input
                    label="Line 2"
                    name="line2"
                    value={formData.billingAddress.line2}
                    onChange={(e) =>
                      actions.handleInputChange(e, "billingAddress")
                    }
                    placeholder="Landmark, City"
                  />
                  <Input
                    label="Postal Code"
                    name="postalCode"
                    value={formData.billingAddress.postalCode}
                    onChange={(e) =>
                      actions.handleInputChange(e, "billingAddress")
                    }
                    placeholder="Postal Code"
                  />
                  <Input
                    label="City"
                    name="city"
                    value={formData.billingAddress.city}
                    onChange={(e) =>
                      actions.handleInputChange(e, "billingAddress")
                    }
                    placeholder="City"
                  />
                  <Input
                    label="State"
                    name="state"
                    value={formData.billingAddress.state}
                    onChange={(e) =>
                      actions.handleInputChange(e, "billingAddress")
                    }
                    placeholder="State"
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={formData.billingAddress.country}
                    onChange={(e) =>
                      actions.handleInputChange(e, "billingAddress")
                    }
                    placeholder="Country"
                  />
                </div>

                {/* Shipping Address Toggle */}
                <div className="mt-4 pt-3 border-t border-theme flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => ui.setIsShippingOpen(!ui.isShippingOpen)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-main hover:text-primary bg-transparent border-none cursor-pointer"
                  >
                    <span className="font-bold">
                      {ui.isShippingOpen ? "−" : "+"}
                    </span>
                    Shipping Address
                  </button>

                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-muted">
                    <input
                      type="checkbox"
                      checked={ui.sameAsBilling}
                      onChange={(e) =>
                        actions.handleSameAsBillingChange(e.target.checked)
                      }
                      className="w-3.5 h-3.5 cursor-pointer"
                    />
                    Same as billing address
                  </label>
                </div>

                {ui.isShippingOpen && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Input
                      label="Line 1"
                      name="line1"
                      value={formData.shippingAddress.line1}
                      onChange={(e) =>
                        actions.handleInputChange(e, "shippingAddress")
                      }
                      placeholder="Street, Apartment"
                      disabled={ui.sameAsBilling}
                    />
                    <Input
                      label="Line 2"
                      name="line2"
                      value={formData.shippingAddress.line2}
                      onChange={(e) =>
                        actions.handleInputChange(e, "shippingAddress")
                      }
                      placeholder="Landmark, City"
                      disabled={ui.sameAsBilling}
                    />
                    <Input
                      label="Postal Code"
                      name="postalCode"
                      value={formData.shippingAddress.postalCode}
                      onChange={(e) =>
                        actions.handleInputChange(e, "shippingAddress")
                      }
                      placeholder="Postal Code"
                      disabled={ui.sameAsBilling}
                    />
                    <Input
                      label="City"
                      name="city"
                      value={formData.shippingAddress.city}
                      onChange={(e) =>
                        actions.handleInputChange(e, "shippingAddress")
                      }
                      placeholder="City"
                      disabled={ui.sameAsBilling}
                    />
                    <Input
                      label="State"
                      name="state"
                      value={formData.shippingAddress.state}
                      onChange={(e) =>
                        actions.handleInputChange(e, "shippingAddress")
                      }
                      placeholder="State"
                      disabled={ui.sameAsBilling}
                    />
                    <Input
                      label="Country"
                      name="country"
                      value={formData.shippingAddress.country}
                      onChange={(e) =>
                        actions.handleInputChange(e, "shippingAddress")
                      }
                      placeholder="Country"
                      disabled={ui.sameAsBilling}
                    />
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="bg-card p-4 rounded-lg border border-theme shadow-sm h-fit">
                <h3 className="text-base font-semibold text-main mb-3 border-b-2 border-primary pb-1.5">
                  Payment Information
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Payment Terms"
                    name="paymentTerms"
                    value={formData.paymentInformation.paymentTerms}
                    onChange={(e) =>
                      actions.handleInputChange(e, "paymentInformation")
                    }
                    placeholder="e.g., Net 30, Due on Receipt"
                  />
                  <Select
                    label="Payment Method"
                    name="paymentMethod"
                    value={formData.paymentInformation.paymentMethod}
                    onChange={(e) =>
                      actions.handleInputChange(e, "paymentInformation")
                    }
                    options={paymentMethodOptions}
                  />
                  <Input
                    label="Bank Name"
                    name="bankName"
                    value={formData.paymentInformation.bankName}
                    onChange={(e) =>
                      actions.handleInputChange(e, "paymentInformation")
                    }
                  />
                  <Input
                    label="Account Number"
                    name="accountNumber"
                    value={formData.paymentInformation.accountNumber}
                    onChange={(e) =>
                      actions.handleInputChange(e, "paymentInformation")
                    }
                  />
                  <Input
                    label="Routing Number / IBAN"
                    name="routingNumber"
                    value={formData.paymentInformation.routingNumber}
                    onChange={(e) =>
                      actions.handleInputChange(e, "paymentInformation")
                    }
                  />
                  <Input
                    label="SWIFT / BIC"
                    name="swiftCode"
                    value={formData.paymentInformation.swiftCode}
                    onChange={(e) =>
                      actions.handleInputChange(e, "paymentInformation")
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-primary border-t border-theme px-8 py-2.5 flex justify-between items-center shrink-0">
          <div className="text-[11px] text-main flex items-center gap-1"></div>

          <div className="flex items-center gap-2 pr-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-card hover:bg-[var(--row-hover)] text-main border border-theme rounded text-xs font-medium cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={actions.handleReset}
              className="px-4 py-1.5 bg-card hover:bg-[var(--row-hover)] text-main border border-theme rounded text-xs font-medium cursor-pointer transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              className="px-4 py-1.5 bg-card hover:bg-[var(--row-hover)] text-main border border-theme rounded text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Save size={14} />
              Save Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationModal;
