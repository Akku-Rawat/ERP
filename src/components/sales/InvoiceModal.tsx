import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FileText } from "lucide-react";
import TermsAndCondition from "../TermsAndCondition";

import CustomerSelect from "../selects/CustomerSelect";
import Modal from "../../components/ui/modal/modal";
import { Input, Select, Button } from "../../components/ui/modal/formComponent";
import toast from "react-hot-toast";
import ItemSelect from "../selects/ItemSelect";
import { useInvoiceForm } from "../../hooks/useInvoiceForm";
import {
  invoiceStatusOptions,
  currencySymbols,
  paymentMethodOptions,
  currencyOptions,
} from "../../constants/invoice.constants";

// import Input from "../ui/Input";
// import Select from "../ui/Select";

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
      height="90vh"
    >
      <form onSubmit={handleFormSubmit} className="h-full flex flex-col">
        {/* Tabs */}
        <div className="flex gap-1 -mx-6 -mt-6 px-6 pt-4 bg-app sticky top-0 z-10 shrink-0">
          {(["details", "terms", "address"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => ui.setActiveTab(tab)}
              className={`relative px-6 py-3 font-semibold text-sm capitalize rounded-t-lg ${
                ui.activeTab === tab
                  ? "text-primary bg-card shadow-sm"
                  : "text-muted hover:bg-card/50"
              }`}
            >
              {tab === "details" && "Details"}
              {tab === "terms" && "Terms & Conditions"}
              {tab === "address" && "Additional Details"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <section className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* DETAILS */}
          {ui.activeTab === "details" && (
            <div className="grid grid-cols-3 gap-6 max-h-screen overflow-auto p-4 mt-8">
              <div className="col-span-2">
                <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                  Invoice Information
                </h3>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <CustomerSelect
                      value={customerNameDisplay}
                      onChange={actions.handleCustomerSelect}
                      className="w-full"
                    />

                    <Input
                      label="Date of Invoice"
                      name="dateOfInvoice"
                      type="date"
                      value={formData.dateOfInvoice}
                      onChange={actions.handleInputChange}
                      className="w-full"
                    />

                    <div className="flex flex-col gap-1">
                      <Input
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={actions.handleInputChange}
                        className="w-full col-span-3"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Select
                        label="Currency"
                        name="currencyCode"
                        value={formData.currencyCode}
                        onChange={actions.handleInputChange}
                        options={currencyOptions}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Select
                        label="Invoice Status"
                        name="invoiceStatus"
                        value={formData.invoiceStatus}
                        onChange={actions.handleInputChange}
                        options={invoiceStatusOptions}
                      />
                    </div>

                    {/* <div className="flex flex-col gap-1">
                          <Select
                            label="Invoice Type"
                            name="invoiceType"
                            value={formData.invoiceType}
                            onChange={actions.handleInputChange}
                            options={invoiceTypeOptions}
                          />
                        </div> */}

                    <div className="flex flex-col gap-1">
                      <Input
                        label="Invoice Type"
                        name="invoiceType"
                        type="text"
                        disabled
                        value={formData.invoiceType}
                        onChange={actions.handleInputChange}
                        className="w-full col-span-3"
                      />
                    </div>

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

                      <div className="flex flex-col gap-1">
                        <Input
                          label="Export To Country"
                          name="destnCountryCd"
                          type="text"
                          disabled
                          value={formData.destnCountryCd}
                          onChange={actions.handleInputChange}
                          className="w-full col-span-3"
                        />
                      </div>
                    )}

                    {ui.isLocal && (
                      <Input
                        label="LPO Number"
                        name="lpoNumber"
                        value={formData.lpoNumber}
                        onChange={actions.handleInputChange}
                        placeholder="local purchase order number"
                      />
                    )}
                  </div>
                </div>

                <div className="my-6 h-px bg-gray-600" />

                {/* ITEMS */}
                <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                  Invoiced Items
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    Showing {ui.page * 5 + 1}–
                    {Math.min((ui.page + 1) * 5, ui.itemCount)} of{" "}
                    {ui.itemCount}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => ui.setPage(Math.max(0, ui.page - 1))}
                      disabled={ui.page === 0}
                      className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => ui.setPage(ui.page + 1)}
                      disabled={(ui.page + 1) * 5 >= ui.itemCount}
                      className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wide">
                      <tr>
                        <th className="px-2 py-2 text-left">#</th>
                        <th className="px-2 py-2 text-left">Item</th>
                        <th className="px-2 py-2 text-left">Description</th>
                        <th className="px-2 py-2 text-left">Quantity</th>
                        <th className="px-2 py-2 text-left">Unit Price</th>
                        <th className="px-2 py-2 text-left">Discount</th>
                        <th className="px-2 py-2 text-left">Tax</th>
                        <th className="px-2 py-2 text-left">Tax Code</th>
                        <th className="px-2 py-2 text-right">Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedItems.map((it, idx) => {
                        const i = ui.page * 5 + idx;
                        const taxVal = parseFloat(it.vatRate || "0");
                        const amount =
                          it.quantity * it.price - it.discount + taxVal;
                        return (
                          <tr
                            key={i}
                            className="hover:bg-blue-50/40 odd:bg-white even:bg-gray-50"
                          >
                            <td className="px-3 py-2 text-center">{i + 1}</td>
                            <td className="px-2 py-2">
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

                            <td className="px-2 py-2">
                              <input
                                className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                name="description"
                                value={it.description}
                                onChange={(e) => actions.handleItemChange(i, e)}
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input
                                type="number"
                                className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                name="quantity"
                                value={it.quantity}
                                onChange={(e) => actions.handleItemChange(i, e)}
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input
                                type="number"
                                className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                name="price"
                                value={it.price}
                                onChange={(e) => actions.handleItemChange(i, e)}
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input
                                type="number"
                                className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                name="discount"
                                value={it.discount}
                                onChange={(e) => actions.handleItemChange(i, e)}
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input
                                type="number" // Assuming input is number for entry, stored as string in Type
                                className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                name="vatRate"
                                value={it.vatRate}
                                onChange={(e) => actions.handleItemChange(i, e)}
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input
                                type="string"
                                className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                name="vatCode"
                                value={it.vatCode}
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
                                className="p-1.5 rounded-full text-red-600 hover:bg-red-100 transition"
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
                    className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                  <div className="py-2 px-2" />
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="col-span-1 sticky top-0 flex flex-col items-center gap-6 px-4 lg:px-6 h-fit">
                <div className="w-full max-w-sm space-y-6">
                  <div className="w-full max-w-sm rounded-lg border border-gray-300 p-4 bg-white shadow">
                    <h3 className="mb-3 text-lg font-semibold text-gray-700 underline">
                      Customer Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Customer Name
                        </span>
                        <span className="font-medium text-gray-800">
                          {customerDetails?.name ?? "Customer Name"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Phone Number
                        </span>
                        <span className="font-medium text-gray-800">
                          {customerDetails?.mobile_no ?? "+123 4567890"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base font-semibold text-gray-700">
                          Email Address
                        </span>
                        <span className="text-base font-bold text-blue-600">
                          {customerDetails?.email ?? "customer@gmail.com"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-sm rounded-lg border border-gray-300 p-4 bg-white shadow">
                    <h3 className="mb-3 text-lg font-semibold text-gray-700 underline">
                      Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Total Items
                        </span>
                        <span className="font-medium text-gray-800">
                          {formData.items.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Sub Total
                        </span>
                        <span className="font-medium text-gray-800">
                          {symbol} {totals.subTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Total Tax
                        </span>
                        <span className="font-medium text-gray-800">
                          {symbol} {totals.totalTax.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-base font-semibold text-gray-700">
                          Total Amount
                        </span>
                        <span className="text-base font-bold text-blue-600">
                          {symbol} {totals.grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TERMS */}
          {ui.activeTab === "terms" && (
            <div className="h-full w-full mt-10">
              <TermsAndCondition
                terms={formData.terms?.selling}
                setTerms={actions.setTerms}
              />
            </div>
          )}

          {/* ADDRESS */}
          {ui.activeTab === "address" && (
            <div className="grid grid-cols-2 gap-10 mt-10">
              <div className="col-span-1 shadow px-4 rounded-lg border border-gray-300 bg-white py-6">
                <div className="flex justify-between">
                  <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                    Billing Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-5">
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

                <div className="px-4 py-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => ui.setIsShippingOpen(!ui.isShippingOpen)}
                    className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900"
                  >
                    <span className="font-bold">
                      {ui.isShippingOpen ? "−" : "+"}
                    </span>{" "}
                    Shipping Address
                  </button>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={ui.sameAsBilling}
                      onChange={(e) =>
                        actions.handleSameAsBillingChange(e.target.checked)
                      }
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">
                      Same as billing address
                    </span>
                  </label>
                </div>

                {ui.isShippingOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-5">
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

              <div className="col-span-1 px-4 shadow rounded-lg border border-gray-300 bg-white py-6 sticky h-fit">
                <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-5">
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
        </section>
      </form>
    </Modal>
  );
};

export default InvoiceModal;
 