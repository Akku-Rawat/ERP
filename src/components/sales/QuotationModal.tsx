import {
  Plus,
  Trash2,
  FileText,
} from "lucide-react";
import TermsAndCondition from "../TermsAndCondition";
import { useQuotationForm } from "../../hooks/useQuotationForm";
import {  Button } from "../../components/ui/modal/formComponent";
import { ModalSelect,ModalInput } from "../ui/modal/modalComponent";
import CustomerSelect from "../selects/CustomerSelect";
import ItemSelect from "../selects/ItemSelect";
import Modal from "../../components/ui/modal/modal";
import toast from "react-hot-toast";
import { User, Mail, Phone } from "lucide-react";


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
    // 1 Customer
    if (!formData.customerId) {
      toast.error("Please select a customer");
      return false;
    }
    if (!formData.dueDate) {
      toast.error("Please enter a valid until date");
      return false;
    }

    // At least 1 item
    if (!formData.items.length) {
      toast.error("Please add at least one item");
      return false;
    }

    // Validate items
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

    const footerContent = (
      <>
        <Button variant="secondary" onClick={onClose} type="button">
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={actions.handleReset} type="button">
            Reset
          </Button>
          <Button variant="primary" type="submit" onClick={handleFormSubmit}>
            Save Invoice
          </Button>
        </div>
      </>
    );
  

  return (
      <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Quotation"
      subtitle="Create and manage quotation details"
      icon={FileText}
      footer={footerContent}
      maxWidth="6xl"
      height="81vh"
    >
        
      <form onSubmit={handleFormSubmit} className="h-full flex flex-col">
        {/* Tabs */}
        <div className="bg-app border-b border-theme px-8 shrink-0">
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
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
    <div className="">
      <div className="grid grid-cols-6 gap-3 items-end">

        {/* Customer */}
       
          <CustomerSelect
            value={customerNameDisplay}
            onChange={actions.handleCustomerSelect}
            className="w-full"
          />
     

        {/* Date of Quotation */}
        <div>
          <label className="block text-[10px] font-medium text-main mb-1">
            Date of Quotation *
          </label>
          <input
            type="date"
            name="dateOfInvoice"
            value={formData.dateOfInvoice}
            onChange={actions.handleInputChange}
            className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
          />
        </div>

        {/* Valid Until */}
        <div>
          <label className="block text-[10px] font-medium text-main mb-1">
            Valid Until *
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={actions.handleInputChange}
            className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
          />
        </div>

        {/* Currency */}
        <div>
          
          <ModalSelect
            label="Currency "
            name="currencyCode"
            value={formData.currencyCode}
            onChange={actions.handleInputChange}
            options={[...currencyOptions]}
            className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
          >
           
          </ModalSelect>
        </div>

        {/* Status */}
        <div>
          
          <ModalSelect
           label="Status"
            name="invoiceStatus"
            value={formData.invoiceStatus}
            onChange={actions.handleInputChange}
            options={[...invoiceStatusOptions]}
            className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
          >
            
          </ModalSelect>
        </div>

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
              className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
            />
          </div>
        )}
      </div>
    </div>

    {/* ================= MAIN BODY (TABLE LEFT + RIGHT SIDEBAR) ================= */}
    <div className="grid grid-cols-[4fr_1fr] gap-4">
      {/* LEFT: QUOTED ITEMS TABLE  */}
        <div className="bg-card rounded-lg p-2 shadow-sm flex-1">
                  <div className="flex items-center gap-1 ">
                    <h3 className="text-sm font-semibold text-main">
                      Quoted Items
                    </h3>
                  </div>
                  <div>
                    <table className="w-full border-collapse text-[10px]">
                      <thead>
                        <tr className="border-b border-theme">
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[25px]">
                            #
                          </th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[130px]">
                            Item
                          </th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[140px]">
                            Description
                          </th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[50px]">
                            Qty
                          </th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[70px]">
                            Unit Price
                          </th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[55px]">
                            Discount
                          </th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[50px]">
                            Tax
                          </th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[55px]">
                            Tax Code
                          </th>
                          <th className="px-2 py-3 text-right text-muted font-medium text-[11px] w-[70px]">
                            Amount
                          </th>
                          <th className="px-2 py-3 text-center text-muted font-medium text-[11px] w-[35px]">
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
                              <td className="px-3 py-2 text-[10px]">
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
                                  className="w-full py-1 px-2 border border-theme rounded text-[10px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
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
                                  className="w-[50px] py-1 px-2 border border-theme rounded text-[11px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
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
                                  disabled
                                  className="w-[60px] py-1 px-2 border border-theme rounded text-[11px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
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
                                  className="w-[60px] py-1 px-2 border border-theme rounded text-[11px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
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
                                  disabled
                                  className="w-[60px] py-1 px-2 border border-theme rounded text-[11px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
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
                                  disabled
                                  className="w-[60px] py-1 px-2 border border-theme rounded text-[11px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
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
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                 
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                 
                 <div className="mt-3 flex justify-between items-center gap-3">

                    {/* Add Item Button */}
                    <button
                      type="button"
                      onClick={actions.addItem}
                      className="px-4 py-1.5 bg-primary hover:bg-[var(--primary-600)] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Plus size={14} />
                      Add Item
                    </button>

                    {/* Pagination Controls */}
                   {(ui.itemCount > 5 || ui.page > 0) && (
  <div className="flex items-center gap-3 py-1 px-2 bg-app rounded">

    <div className="text-[11px] text-muted whitespace-nowrap">
      Showing {ui.page * 5 + 1} to{" "}
      {Math.min((ui.page + 1) * 5, ui.itemCount)} of {ui.itemCount} items
    </div>

    <div className="flex gap-1.5 items-center">
      <button
        type="button"
        onClick={() => ui.setPage(Math.max(0, ui.page - 1))}
        disabled={ui.page === 0}
        className="px-2.5 py-1 bg-card text-main border border-theme rounded text-[11px]"
      >
        Previous
      </button>

      <button
        type="button"
        onClick={() => ui.setPage(ui.page + 1)}
        disabled={(ui.page + 1) * 5 >= ui.itemCount}
        className="px-2.5 py-1 bg-card text-main border border-theme rounded text-[11px]"
      >
        Next
      </button>
    </div>

  </div>
)}

                  </div>

                </div>
      

      {/* RIGHT: CUSTOMER DETAILS + SUMMARY (STACKED) */}
      <div className="flex flex-col gap-2">

        <div className="flex flex-col gap-2">
                {/* Customer Details */}
                <div className="bg-card rounded-lg p-2 w-[220px]">
                  <h3 className="text-[12px] font-semibold text-main mb-2">
                    Customer Details
                  </h3>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-main">
                      <span className="flex items-center gap-2">
                        <User size={16} className="text-muted" />
                        <span className="text-xs text-main">
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
                      <div className="bg-card rounded-lg ">
                        <h3 className="text-[11px] font-semibold text-main mb-1">
                          Invoice Information
                        </h3>

                        <div className="flex flex-col gap-1">
                          {/* Invoice Type */}
                          <div className="flex items-center gap-19 text-xs">
                            <span className="text-muted">Invoice Type</span>
                            <span className="font-medium text-main">
                              {formData.invoiceType}
                            </span>
                          </div>

                          {/* Destination Country – only for Export */}
                          {formData.invoiceType === "Export" && (
                            <div className="flex items-center gap-15 text-xs">
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
                <div className="bg-card rounded-lg p-3  w-[220px]">
                  <h3 className="text-[13px] font-semibold text-main mb-2">
                    Summary
                  </h3>

                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-19 text-xs">
                      <span className="text-muted">Total Items</span>
                      <span className="font-medium text-main">
                        {formData.items.length}
                      </span>
                    </div>

                     <div className="flex items-center gap-19 text-xs">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-medium text-main">
                        {symbol} {totals.subTotal.toFixed(2)}
                      </span>
                    </div>

                     <div className="flex items-center gap-19 text-xs">
                      <span className="text-muted">Total Tax</span>
                      <span className="font-medium text-main">
                        {symbol} {totals.totalTax.toFixed(2)}
                      </span>
                    </div>

                        <div className="mt-2 p-2 bg-primary rounded-lg w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-white">
                              Grand Total
                            </span>

                            <span className="text-sm font-bold text-white">
                              {symbol} {totals.grandTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>

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
                  <ModalInput
                    label="Line 1"
                    name="line1"
                    value={formData.billingAddress.line1}
                    onChange={(e) =>
                      actions.handleInputChange(e, "billingAddress")
                    }
                    placeholder="Street, Apartment"
                  />
                  <ModalInput
                    label="Line 2"
                    name="line2"
                    value={formData.billingAddress.line2}
                    onChange={(e) =>
                      actions.handleInputChange(e, "billingAddress")
                    }
                    placeholder="Landmark, City"
                  />
                  <ModalInput
                    label="Postal Code"
                    name="postalCode"
                    value={formData.billingAddress.postalCode}
                    onChange={(e) =>
                      actions.handleInputChange(e, "billingAddress")
                    }
                    placeholder="Postal Code"
                  />
                  <ModalInput
                    label="City"
                    name="city"
                    value={formData.billingAddress.city}
                    onChange={(e) =>
                      actions.handleInputChange(e, "billingAddress")
                    }
                    placeholder="City"
                  />
                  <ModalInput
                    label="State"
                    name="state"
                    value={formData.billingAddress.state}
                    onChange={(e) =>
                      actions.handleInputChange(e, "billingAddress")
                    }
                    placeholder="State"
                  />
                  <ModalInput
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
                    <ModalInput
                      label="Line 1"
                      name="line1"
                      value={formData.shippingAddress.line1}
                      onChange={(e) =>
                        actions.handleInputChange(e, "shippingAddress")
                      }
                      placeholder="Street, Apartment"
                      disabled={ui.sameAsBilling}
                    />
                    <ModalInput
                      label="Line 2"
                      name="line2"
                      value={formData.shippingAddress.line2}
                      onChange={(e) =>
                        actions.handleInputChange(e, "shippingAddress")
                      }
                      placeholder="Landmark, City"
                      disabled={ui.sameAsBilling}
                    />
                    <ModalInput
                      label="Postal Code"
                      name="postalCode"
                      value={formData.shippingAddress.postalCode}
                      onChange={(e) =>
                        actions.handleInputChange(e, "shippingAddress")
                      }
                      placeholder="Postal Code"
                      disabled={ui.sameAsBilling}
                    />
                    <ModalInput
                      label="City"
                      name="city"
                      value={formData.shippingAddress.city}
                      onChange={(e) =>
                        actions.handleInputChange(e, "shippingAddress")
                      }
                      placeholder="City"
                      disabled={ui.sameAsBilling}
                    />
                    <ModalInput
                      label="State"
                      name="state"
                      value={formData.shippingAddress.state}
                      onChange={(e) =>
                        actions.handleInputChange(e, "shippingAddress")
                      }
                      placeholder="State"
                      disabled={ui.sameAsBilling}
                    />
                    <ModalInput
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
                  <ModalInput
                    label="Payment Terms"
                    name="paymentTerms"
                    value={formData.paymentInformation.paymentTerms}
                    onChange={(e) =>
                      actions.handleInputChange(e, "paymentInformation")
                    }
                    placeholder="e.g., Net 30, Due on Receipt"
                  />
                  <ModalSelect
                    label="Payment Method"
                    name="paymentMethod"
                    value={formData.paymentInformation.paymentMethod}
                    onChange={(e) =>
                      actions.handleInputChange(e, "paymentInformation")
                    }
                    options={[...paymentMethodOptions]}
                  />
                  <ModalInput
                    label="Bank Name"
                    name="bankName"
                    value={formData.paymentInformation.bankName}
                    onChange={(e) =>
                      actions.handleInputChange(e, "paymentInformation")
                    }
                  />
                  <ModalInput
                    label="Account Number"
                    name="accountNumber"
                    value={formData.paymentInformation.accountNumber}
                    onChange={(e) =>
                      actions.handleInputChange(e, "paymentInformation")
                    }
                  />
                  <ModalInput
                    label="Routing Number / IBAN"
                    name="routingNumber"
                    value={formData.paymentInformation.routingNumber}
                    onChange={(e) =>
                      actions.handleInputChange(e, "paymentInformation")
                    }
                  />
                  <ModalInput
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

        
     </form>
    </Modal>
  );
};

export default QuotationModal;