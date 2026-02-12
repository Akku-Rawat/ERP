import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FileText } from "lucide-react";
import TermsAndCondition from "../TermsAndCondition";
import { User, Mail, Phone } from "lucide-react";

import CustomerSelect from "../selects/CustomerSelect";
import Modal from "../../components/ui/modal/modal";
import {  Button } from "../../components/ui/modal/formComponent";
import { ModalInput,ModalSelect } from "../ui/modal/modalComponent";
import toast from "react-hot-toast";
import ItemSelect from "../selects/ItemSelect";
import { useInvoiceForm } from "../../hooks/useInvoiceForm";
import {
  invoiceStatusOptions,
  currencySymbols,
  paymentMethodOptions,
  currencyOptions,
} from "../../constants/invoice.constants";
import PaymentInfoBlock from "./PaymentInfoBlock";
import AddressBlock from "../ui/modal/AddressBlock";

// import ModalInput from "../ui/ModalInput";
// import ModalSelect from "../ui/ModalSelect";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
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
  } = useInvoiceForm(isOpen, onClose, onSubmit);

  const symbol = currencySymbols[formData.currencyCode] ?? "ZK";
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      actions.handleSubmit(e);
    } catch (err: any) {
      toast.error(err.message || "Invalid invoice data");
    }
  };


  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

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
      title="Create Invoice"
      subtitle="Create and manage invoice details"
      icon={FileText}
      footer={footerContent}
      maxWidth="6xl"
      height="79vh"
    >
      <form onSubmit={handleFormSubmit} className="h-full flex flex-col">
        {/* Tabs */}
           <div className="bg-app border-b border-theme px-8 shrink-0">
          <div className="flex gap-8">
            {(["details", "terms", "address"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => ui.setActiveTab(tab)}
             className={`py-2.5 bg-transparent border-none text-xs font-medium cursor-pointer transition-all 
              ${ui.activeTab === tab
                        ? "text-primary border-b-[3px] border-primary"
                    : "text-muted border-b-[3px] border-transparent hover:text-main"
                  }`}
              >
                {tab === "details" && "Details"}
                {tab === "terms" && "Terms & Conditions"}
                {tab === "address" && "Additional Details"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-8 py-4 ">
          {/* DETAILS */}
          {ui.activeTab === "details" && (
            <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
              <div className="">
                <div className="grid grid-cols-6 gap-3 items-end">
                  <CustomerSelect
                    value={customerNameDisplay}
                    onChange={actions.handleCustomerSelect}
                    className="w-full"
                  />

                  <ModalInput
                    label="Date of Invoice"
                    name="dateOfInvoice"
                    type="date"
                    value={formData.dateOfInvoice}
                    onChange={actions.handleInputChange}
                     className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
                  />

                  <div>
                    <ModalInput
                      label="Due Date"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={actions.handleInputChange}
                      className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
                    />
                  </div>

                  <div >
                    <ModalSelect
                      label="Currency"
                      name="currencyCode"
                      value={formData.currencyCode}
                      onChange={actions.handleInputChange}
                      options={[...currencyOptions]}
                       className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
                    />
                  </div>

                  <div>
                    <ModalSelect
                      label="Invoice Status"
                      name="invoiceStatus"
                      value={formData.invoiceStatus}
                      onChange={actions.handleInputChange}
                      options={[...invoiceStatusOptions]}
                      className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
                    />
                  </div>

                 

                    

                  {/* <div>
                    <ModalInput
                      label="Invoice Type"
                      name="invoiceType"
                      type="text"
                      disabled
                      value={formData.invoiceType}
                      onChange={actions.handleInputChange}
                     className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
                    />
                  </div> */}

                  {ui.isExport && (
                    // <CountrySelect
                    //   value={formData.destnCountryCd}
                    //   onChange={(c) =>
                    //     actions.handleInputChange({
                    //       target: {
                    //         name: "destnCountryCd",
                    //         value: c.code,
                    //       },
                    //     } as any)
                    //   }
                    // />

                    <div>
                      <ModalInput
                        label="Export To Country"
                        name="destnCountryCd"
                        type="text"
                        disabled
                        value={formData.destnCountryCd}
                        onChange={actions.handleInputChange}
                       className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
                      />
                    </div>
                  )}

                  {ui.isLocal && (
                    <ModalInput
                      label="LPO Number"
                      name="lpoNumber"
                      value={formData.lpoNumber}
                      onChange={actions.handleInputChange}
                      placeholder="local purchase order number"
                       className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
                    />
                  )}
                </div>
              </div>

             

              {/* ITEMS */}
              <div className="grid grid-cols-[4fr_1fr] gap-4">
                <div className="bg-card rounded-lg p-2 shadow-sm flex-1">
                  <div className="flex items-center gap-1 ">
                    <h3 className="text-sm font-semibold text-main">
                      Invoiced Items
                    </h3>
                  </div>



                  <div >
                    <table className="w-full border-collapse text-[10px]">
                      <thead >
                        <tr className="border-b border-theme">
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[25px]">#</th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[130px]">Item</th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[140px]">Description</th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[50px]">Quantity</th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[70px]">Unit Price</th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[70px]">Discount</th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[70px]">Tax</th>
                          <th className="px-2 py-3 text-left text-muted font-medium text-[11px] w-[70px]">Tax Code</th>
                          <th className="px-2 py-3 text-right text-muted font-medium text-[11px] w-[70px]">Amount</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody >
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
                              <td className="px-3 py-2 text-center">{i + 1}</td>
                              <td className="px-0.5 py-1">
                                {/* <ItemSelect
                                    taxCategory={ui.taxCategory}
                                    value={it.itemCode}
                                    onChange={(item) => {
                                      actions.updateItemDirectly(i, {
                                        itemCode: item.id,
                                        price: item.sellingPrice ?? it.price,
                                      });
                                    }}
                                  /> */}
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
                                  className="w-full py-1 px-2 border border-theme rounded text-[10px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                  name="description"
                                  value={it.description}
                                  onChange={(e) => actions.handleItemChange(i, e)}
                                />
                              </td>
                              <td className="px-0.5 py-1">
                                <input
                                  type="number"
                                  className="w-[50px] py-1 px-2 border border-theme rounded text-[11px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                  name="quantity"
                                  value={it.quantity}
                                  onChange={(e) => actions.handleItemChange(i, e)}
                                />
                              </td>
                              <td className="px-0.5 py-1">
                                <input
                                  type="number"
                                  className="w-[50px] py-1 px-2 border border-theme rounded text-[11px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                  name="price"
                                  value={it.price}
                                  disabled
                                  onChange={(e) => actions.handleItemChange(i, e)}
                                />
                              </td>
                              <td className="px-0.5 py-1">
                                <input
                                  type="number"
                                  className="w-[50px] py-1 px-2 border border-theme rounded text-[11px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                  name="discount"
                                  value={it.discount}
                                  onChange={(e) => actions.handleItemChange(i, e)}
                                />
                              </td>
                              <td className="px-0.5 py-1">
                                <input
                                  type="number" // Assuming input is number for entry, stored as string in Type
                                  className="w-[50px] py-1 px-2 border border-theme rounded text-[11px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                  name="vatRate"
                                  value={it.vatRate}
                                  disabled
                                  onChange={(e) => actions.handleItemChange(i, e)}
                                />
                              </td>
                              <td className="px-0.5 py-1">
                                <input
                                  type="string"
                                  className="w-[50px] py-1 px-2 border border-theme rounded text-[11px] bg-card text-main focus:outline-none focus:ring-1 focus:ring-primary"
                                  name="vatCode"
                                  value={it.vatCode}
                                  disabled
                                  onChange={(e) => actions.handleItemChange(i, e)}
                                />
                              </td>
                              <td className="px-2 py-2 text-right font-semibold text-gray-900 whitespace-nowrap">
                                {symbol} {amount.toFixed(2)}
                              </td>

                              <td className="px-1 py-1 text-center">
                                <button
                                  type="button"
                                  onClick={() => actions.removeItem(i)}
                               className="p-0.5 rounded bg-danger/10 text-danger hover:bg-danger/20 transition text-[10px]"
                                  title="Remove item"
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

                  <div className="flex justify-between mt-3">
                    <button
                      type="button"
                      onClick={actions.addItem}
                      className="px-4 py-1.5 bg-primary hover:bg-[var(--primary-600)] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </button>


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


                {/* RIGHT SIDE */}
                <div className="col-span-1 sticky top-0 flex flex-col items-center gap-6 px-4 lg:px-6 h-fit">
                  <div className="bg-card rounded-lg p-2 w-[220px]">
                    <h3 className="text-[12px] font-semibold text-main mb-2">
                      Customer Details
                    </h3>

                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-muted" />
                        {customerDetails?.name ?? "Customer Name"}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-muted">
                        <Mail size={12} />
                        {customerDetails?.email ?? "customer@gmail.com"}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-muted">
                        <Phone size={12} />
                        {customerDetails?.mobile_no ?? "+123 4567890"}
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

                  <div className="bg-card rounded-lg p-3 w-[220px]">
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

                      <div className="mt-2 p-2 bg-primary rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-white">Grand Total</span>
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
          )}

          {/* TERMS */}
          {ui.activeTab === "terms" && (
            <div className="h-full w-full">
              <TermsAndCondition
                terms={formData.terms?.selling}
                setTerms={actions.setTerms}
              />
            </div>
          )}

          {/* ADDRESS */}
          {ui.activeTab === "address" && (
  <div className="space-y-6 overflow-hidden">

    {/* PAYMENT INFO */}
    <PaymentInfoBlock
      data={formData.paymentInformation}
      onChange={(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) =>
        actions.handleInputChange(e, "paymentInformation")
      }
      paymentMethodOptions={paymentMethodOptions}
    />

    {/* BILLING + SHIPPING */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Billing */}
      <AddressBlock
        type="billing"
        title="Billing Address"
        subtitle="Invoice and payment details"
        data={formData.billingAddress}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement>
        ) =>
          actions.handleInputChange(e, "billingAddress")
        }
      />

      {/* Shipping */}
      <AddressBlock
        type="shipping"
        title="Shipping Address"
        subtitle="Delivery location"
        data={formData.shippingAddress}
        sameAsBilling={ui.sameAsBilling}
        onSameAsBillingChange={
          actions.handleSameAsBillingChange
        }
        onChange={(
          e: React.ChangeEvent<HTMLInputElement>
        ) =>
          actions.handleInputChange(e, "shippingAddress")
        }
      />

    </div>
  </div>
)}

        </div>
      </form>
    </Modal>
  );
};

export default InvoiceModal;
