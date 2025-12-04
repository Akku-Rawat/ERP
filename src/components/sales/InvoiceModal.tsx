import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";
import TermsAndCondition from "../TermsAndCondition";
import type { TermPhase, PaymentTerms, TermSection } from "../../types/termsAndCondition";

import { getCustomerByCustomerCode } from "../../api/customerApi";
import CustomerSelect from "../selects/CustomerSelect";
import ItemSelect from "../selects/ItemSelect";

interface ItemRow {
  item: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  taxCode: string;
}

const emptyItem: ItemRow = {
  item: "",
  description: "",
  quantity: 0,
  unitPrice: 0,
  discount: 0,
  tax: 0,
  taxCode: ""
};

interface FormData {
  CutomerName: string;
  subject: string;
  dateOfInvoice: string;
  dueDate: string;
  salesCommission: number;
  accountName: string;
  contactName: string;
  dealName: string;
  salesOrder: string;
  purchaseOrder: string;
  exciseDuty: number;
  status: string;
  type: string;
  totalDiscount: number;
  totalTax: number;
  adjustment: number;
  subTotal: number;
  grandTotal: number;
  currency: string;
  paymentTerms?: string;
  paymentMethod?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  swiftCode?: string;
  notes?: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingPostalCode?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingPostalCode?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  sameAsBilling: boolean;
  terms: TermSection;
}

const emptyForm: FormData = {
  CutomerName: "",
  subject: "",
  dateOfInvoice: "",
  dueDate: "",
  salesCommission: 0,
  accountName: "",
  contactName: "",
  dealName: "",
  salesOrder: "",
  purchaseOrder: "",
  exciseDuty: 0,
  status: "Draft",
  type: "Local",
  totalDiscount: 0,
  totalTax: 0,
  adjustment: 0,
  subTotal: 0,
  grandTotal: 0,
  currency: "",
  notes: "",
  billingAddressLine1: "",
  billingAddressLine2: "",
  billingPostalCode: "",
  billingCity: "",
  billingState: "",
  billingCountry: "",
  shippingAddressLine1: "",
  shippingAddressLine2: "",
  shippingPostalCode: "",
  shippingCity: "",
  shippingState: "",
  shippingCountry: "",
  sameAsBilling: true,
  terms: {
    general: "",
    payment: { phases: [], dueDates: "", lateCharges: "", tax: "", notes: "" },
    delivery: "",
    cancellation: "",
    warranty: "",
    liability: "",
  },
};

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
  const [form, setForm] = useState<FormData>(emptyForm);
  const [items, setItems] = useState<ItemRow[]>([{ ...emptyItem }]);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const itemsPerPage = 5;
  const [page, setPage] = useState(0);
  const paginatedItems = items.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage,
  );
  const [activeTab, setActiveTab] = useState<"details" | "terms" | "address">(
    "details",
  );
  const [isShippingOpen, setIsShippingOpen] = useState(false);

  const shippingEditedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const today = new Date().toISOString().split("T")[0];
    setForm((p) => ({
      ...p,
      dateOfInvoice: p.dateOfInvoice || today,
      dueDate: p.dueDate || today,
    }));
    setPage(0);
  }, [isOpen]);

  const loadCustomerDetailsById = async (id: string) => {
    try {
      const response = await getCustomerByCustomerCode(id);
      if (!response || response.status_code !== 200) return;
      console.log("response: ", response);
      setForm(p => ({ ...p, terms: response.data.terms.selling }))
      setCustomerDetails(response.data);
    } catch (err) {
      console.error("Error loading customer details:", err);
    }
  };

  useEffect(() => {
    if (!customerDetails) return;

    setForm((prev) => {
      const billing = {
        billingAddressLine1: customerDetails.billingAddressLine1 ?? "",
        billingAddressLine2: customerDetails.billingAddressLine2 ?? "",
        billingPostalCode: customerDetails.billingPostalCode ?? "",
        billingCity: customerDetails.billingCity ?? "",
        billingState: customerDetails.billingState ?? "",
        billingCountry: customerDetails.billingCountry ?? "",
      };


      let shipping: Partial<FormData> = {};
      if (prev.sameAsBilling) {
        shipping = {
          shippingAddressLine1: billing.billingAddressLine1,
          shippingAddressLine2: billing.billingAddressLine2,
          shippingPostalCode: billing.billingPostalCode,
          shippingCity: billing.billingCity,
          shippingState: billing.billingState,
          shippingCountry: billing.billingCountry,
        };
      } else if (shippingEditedRef.current) {
        shipping = {
          shippingAddressLine1: prev.shippingAddressLine1 ?? "",
          shippingAddressLine2: prev.shippingAddressLine2 ?? "",
          shippingPostalCode: prev.shippingPostalCode ?? "",
          shippingCity: prev.shippingCity ?? "",
          shippingState: prev.shippingState ?? "",
          shippingCountry: prev.shippingCountry ?? "",
        };
      } else {
        shipping = {
          shippingAddressLine1: customerDetails.shippingAddressLine1 ?? "",
          shippingAddressLine2: customerDetails.shippingAddressLine2 ?? "",
          shippingPostalCode: customerDetails.shippingPostalCode ?? "",
          shippingCity: customerDetails.shippingCity ?? "",
          shippingState: customerDetails.shippingState ?? "",
          shippingCountry: customerDetails.shippingCountry ?? "",
        };
      }

      return {
        ...prev,
        ...billing,
        ...shipping,
      };
    });

    shippingEditedRef.current = false;
  }, [customerDetails]);

  useEffect(() => {
    const subTotal = items.reduce((sum, item) => {
      const line = item.quantity * item.unitPrice;
      return sum + (line - item.discount + item.tax);
    }, 0);
    const grandTotal =
      subTotal - (form.totalDiscount || 0) + (form.totalTax || 0) + (form.adjustment || 0);

    setForm((p) => {
      if (p.subTotal === subTotal && p.grandTotal === grandTotal) return p;
      return { ...p, subTotal, grandTotal };
    });
  }, [items, form.totalDiscount, form.totalTax, form.adjustment]);

  const handleForm = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const isNum = [
      "salesCommission",
      "exciseDuty",
      "totalDiscount",
      "totalTax",
      "adjustment",
    ].includes(name);

    if (name.startsWith("shipping") && !form.sameAsBilling) {
      shippingEditedRef.current = true;
    }

    setForm((p) => ({ ...p, [name]: isNum ? Number(value) : value }));
  };

  const handleItem = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const { name, value } = e.target;
    const isNum = ["quantity", "unitPrice", "discount", "tax"].includes(name);
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [name]: isNum ? Number(value) : value };
      return copy;
    });
  };

  const removeItem = (idx: number) => {
    setItems((p) => {
      if (p.length === 1) return p;
      const next = p.filter((_, i) => i !== idx);
      const maxPage = Math.max(0, Math.ceil(next.length / itemsPerPage) - 1);
      if (page > maxPage) setPage(maxPage);
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => {
      const newItems = [...prev, { ...emptyItem }];
      const newIndex = newItems.length - 1;
      const targetPage = Math.floor(newIndex / itemsPerPage);
      setPage(targetPage);
      return newItems;
    });
  };

  const updateItem = (index: number, updated: Partial<ItemRow>) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const reset = () => {
    setForm({ ...emptyForm });
    setItems([{ ...emptyItem }]);
    setActiveTab("details");
    shippingEditedRef.current = false;
    setCustomerDetails(null);
    setPage(0);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subTotal = items.reduce(
      (s, i) => s + i.quantity * i.unitPrice - i.discount + i.tax,
      0,
    );
    const grandTotal =
      subTotal - (form.totalDiscount || 0) + (form.totalTax || 0) + (form.adjustment || 0);
    onSubmit?.({ ...form, subTotal, grandTotal, items });
    reset();
    onClose();
  };

  if (!isOpen) return null;

  const getCurrencySymbol = () => {
    switch (form.currency) {
      case "ZMW":
        return "ZK";
      case "INR":
        return "₹";
      case "USD":
        return "$";
      default:
        return "ZK";
    }
  };

  const symbol = getCurrencySymbol();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className=" w-[90vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          <form onSubmit={submit} className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b">
              <h2 className="text-2xl font-semibold text-blue-700">Create Invoice</h2>
              <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </header>

            {/* Tabs */}
            <div className="flex border-b bg-gray-50">
              {(["details", "terms", "address"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm capitalize transition-colors ${activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {tab === "details" ? "Details" : tab === "terms" ? "Terms & Conditions" : "Additional Details"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <section className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* DETAILS */}
              {activeTab === "details" && (
                <div className="grid grid-cols-3 gap-6 max-h-screen overflow-auto p-4">
                  <div className="col-span-2">
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">Invoice Information</h3>

                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <CustomerSelect
                          value={form.CutomerName}
                          onChange={async ({ name, id }) => {
                            setForm((p) => ({ ...p, CutomerName: name }));
                            await loadCustomerDetailsById(id);
                          }}
                          className="w-full"
                        />

                        <Input label="Date of Invoice" name="dateOfInvoice" type="date" value={form.dateOfInvoice}
                          onChange={handleForm} className="w-full" />

                        <div className="flex flex-col gap-1">
                          <Input label="Due Date" name="dueDate" type="date" value={form.dueDate} onChange={handleForm}
                            className="w-full col-span-3" />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="font-medium text-gray-600 text-sm">Currency</label>
                          <select name="currency" value={form.currency} onChange={handleForm}
                            className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                            <option value="ZMW">ZMW (ZK)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <Select label="Invoice Status" name="status" value={form.status} onChange={handleForm}
                            options={[
                              { value: "Draft", label: "Draft" },
                              { value: "Sent", label: "Sent" },
                              { value: "Paid", label: "Paid" },
                              { value: "Overdue", label: "Overdue" },
                            ]} />
                        </div>

                        <div className="flex flex-col gap-1">
                          <Select label="Invoice Type" name="type" value={form.type} onChange={handleForm}
                            options={[
                              { value: "Local", label: "Local" },
                              { value: "Export", label: "Export" },
                              { value: "Non_Export", label: "Non Export" }
                            ]} />
                        </div>
                      </div>
                    </div>

                    <div className="my-6 h-px bg-gray-600" />

                    {/* ITEMS */}
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">Invoiced Items</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">
                        Showing {page * itemsPerPage + 1}–{Math.min((page + 1) * itemsPerPage, items.length)} of {items.length}
                      </span>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                          className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">← Prev</button>
                        <button type="button" onClick={() => setPage(page + 1)} disabled={(page + 1) * itemsPerPage >= items.length}
                          className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Next →</button>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
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
                            const i = page * itemsPerPage + idx;
                            const amount = it.quantity * it.unitPrice - it.discount + it.tax;
                            return (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-center">{i + 1}</td>
                                <td className="px-1 py-1">
                                  <ItemSelect value={it.item} onChange={(item) => {
                                    updateItem(i, {
                                      item: item.name,
                                      description: item.description ?? it.description,
                                      unitPrice: item.price ?? it.unitPrice,
                                    });
                                  }} />
                                </td>
                                <td className="px-1 py-1">
                                  <input className="w-full rounded border p-1 text-sm" name="description" value={it.description}
                                    onChange={(e) => handleItem(e, i)} />
                                </td>
                                <td className="px-1 py-1">
                                  <input type="number" className="w-full rounded border p-1 text-right text-sm" name="quantity" value={it.quantity}
                                    onChange={(e) => handleItem(e, i)} />
                                </td>
                                <td className="px-1 py-1">
                                  <input type="number" className="w-full rounded border p-1 text-right text-sm" name="unitPrice" value={it.unitPrice}
                                    onChange={(e) => handleItem(e, i)} />
                                </td>
                                <td className="px-1 py-1">
                                  <input type="number" className="w-full rounded border p-1 text-right text-sm" name="discount" value={it.discount}
                                    onChange={(e) => handleItem(e, i)} />
                                </td>
                                <td className="px-1 py-1">
                                  <input type="number" className="w-full rounded border p-1 text-right text-sm" name="tax" value={it.tax}
                                    onChange={(e) => handleItem(e, i)} />
                                </td>
                                <td className="px-1 py-1">
                                  <input type="string" className="w-full rounded border p-1 text-right text-sm" name="tax" value={it.taxCode}
                                    onChange={(e) => handleItem(e, i)} />
                                </td>
                                <td className="px-1 py-1 text-right font-medium">{symbol} {amount.toFixed(2)}</td>
                                <td className="px-1 py-1 text-center">
                                  <button type="button" onClick={() => removeItem(i)} className="p-1 text-red-600 hover:bg-red-50 rounded">
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
                      <button type="button" onClick={addItem}
                        className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200">
                        <Plus className="w-4 h-4" /> Add Item
                      </button>
                      <div className="py-2 px-2" />
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="col-span-1 sticky top-0 flex flex-col items-center gap-6 px-4 lg:px-6 h-fit">
                    <div className="w-full max-w-sm space-y-6">
                      <div className="w-full max-w-sm rounded-lg border border-gray-300 p-4 bg-white shadow">
                        <h3 className="mb-3 text-lg font-semibold text-gray-700 underline">Customer Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Customer Name</span>
                            <span className="font-medium text-gray-800">{customerDetails?.name ?? "Customer Name"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Phone Number</span>
                            <span className="font-medium text-gray-800">{customerDetails?.mobile_no ?? "+123 4567890"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base font-semibold text-gray-700">Email Address</span>
                            <span className="text-base font-bold text-blue-600">{customerDetails?.email ?? "customer@gmail.com"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full max-w-sm rounded-lg border border-gray-300 p-4 bg-white shadow">
                        <h3 className="mb-3 text-lg font-semibold text-gray-700 underline">Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Total Items</span>
                            <span className="font-medium text-gray-800">{items.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Sub Total</span>
                            <span className="font-medium text-gray-800">{symbol} {form.subTotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Total Tax</span>
                            <span className="font-medium text-gray-800">{symbol} {items.reduce((sum, it) => sum + it.tax, 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="text-base font-semibold text-gray-700">Total Amount</span>
                            <span className="text-base font-bold text-blue-600">
                              {symbol} {(form.subTotal + items.reduce((sum, it) => sum + it.tax, 0) - items.reduce((sum, it) => sum + it.discount, 0)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TERMS */}
              {activeTab === "terms" && (
                <div className="h-full w-full">
                  <TermsAndCondition
                    terms={form.terms}
                    setTerms={(updated) => setForm((p) => ({ ...p, terms: updated }))}
                  />
                </div>
              )}


              {/* ADDRESS */}
              {activeTab === "address" && (
                <div className="grid grid-cols-2 gap-10">
                  <div className="col-span-1 shadow px-4 rounded-lg border border-gray-300 bg-white py-6">
                    <div className="flex justify-between">
                      <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">Billing Address</h3>
                      <div className="flex items-center space-x-2">
                        <label htmlFor="address" className="text-gray-600 font-medium">More Address:</label>
                        <select name="address" id="address" className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                          <option value="address1">Address 1</option>
                          <option value="address2">Address 2</option>
                          <option value="address3">Address 3</option>
                          <option value="address4">Address 4</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-5">
                      <Input label="Line 1" name="billingAddressLine1" value={form.billingAddressLine1 ?? ""} onChange={handleForm} placeholder="Street, Apartment" />
                      <Input label="Line 2" name="billingAddressLine2" value={form.billingAddressLine2 ?? ""} onChange={handleForm} placeholder="Landmark, City" />
                      <Input label="Postal Code" name="billingPostalCode" value={form.billingPostalCode ?? ""} onChange={handleForm} placeholder="Postal Code" />
                      <Input label="City" name="billingCity" value={form.billingCity ?? ""} onChange={handleForm} placeholder="City" />
                      <Input label="State" name="billingState" value={form.billingState ?? ""} onChange={handleForm} placeholder="State" />
                      <Input label="Country" name="billingCountry" value={form.billingCountry ?? ""} onChange={handleForm} placeholder="Country" />
                    </div>

                    <div className="px-4 py-4 flex items-center justify-between">
                      <button type="button" onClick={() => setIsShippingOpen(!isShippingOpen)} className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900">
                        <span className="font-bold">{isShippingOpen ? "−" : "+"}</span> Shipping Address
                      </button>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={form.sameAsBilling} onChange={(e) => {
                          const checked = e.target.checked;
                          setForm((prev) => {
                            if (checked) {
                              return {
                                ...prev,
                                sameAsBilling: true,
                                shippingAddressLine1: prev.billingAddressLine1 ?? "",
                                shippingAddressLine2: prev.billingAddressLine2 ?? "",
                                shippingPostalCode: prev.billingPostalCode ?? "",
                                shippingCity: prev.billingCity ?? "",
                                shippingState: prev.billingState ?? "",
                                shippingCountry: prev.billingCountry ?? "",
                              };
                            } else {
                              shippingEditedRef.current = false;
                              return { ...prev, sameAsBilling: false };
                            }
                          });
                        }} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                        <span className="text-sm text-gray-600">Same as billing address</span>
                      </label>
                    </div>

                    {isShippingOpen && (
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-5">
                        <Input label="Line 1" name="shippingAddressLine1" value={form.shippingAddressLine1 ?? ""} onChange={handleForm} placeholder="Street, Apartment" disabled={form.sameAsBilling} />
                        <Input label="Line 2" name="shippingAddressLine2" value={form.shippingAddressLine2 ?? ""} onChange={handleForm} placeholder="Landmark, City" disabled={form.sameAsBilling} />
                        <Input label="Postal Code" name="shippingPostalCode" value={form.shippingPostalCode ?? ""} onChange={handleForm} placeholder="Postal Code" disabled={form.sameAsBilling} />
                        <Input label="City" name="shippingCity" value={form.shippingCity ?? ""} onChange={handleForm} placeholder="City" disabled={form.sameAsBilling} />
                        <Input label="State" name="shippingState" value={form.shippingState ?? ""} onChange={handleForm} placeholder="State" disabled={form.sameAsBilling} />
                        <Input label="Country" name="shippingCountry" value={form.shippingCountry ?? ""} onChange={handleForm} placeholder="Country" disabled={form.sameAsBilling} />
                      </div>
                    )}
                  </div>

                  <div className="col-span-1 px-4 shadow rounded-lg border border-gray-300 bg-white py-6 sticky h-fit">
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">Payment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-5">
                      <Input label="Payment Terms" name="paymentTerms" value={form.paymentTerms || ""} onChange={handleForm} placeholder="e.g., Net 30, Due on Receipt" />
                      <Input label="Payment Method" name="paymentMethod" value={form.paymentMethod || ""} onChange={handleForm} placeholder="e.g., Bank Transfer, Credit Card" />
                      <Input label="Bank Name" name="bankName" value={form.bankName || ""} onChange={handleForm} />
                      <Input label="Account Number" name="accountNumber" value={form.accountNumber || ""} onChange={handleForm} />
                      <Input label="Routing Number / IBAN" name="routingNumber" value={form.routingNumber || ""} onChange={handleForm} />
                      <Input label="SWIFT / BIC" name="swiftCode" value={form.swiftCode || ""} onChange={handleForm} />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <footer className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
              <button type="button" onClick={onClose} className="rounded-full bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">Cancel</button>
              <div className="flex gap-2">
                <button type="button" onClick={reset} className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400">Reset</button>
                <button type="submit" className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600">Save Invoice</button>
              </div>
            </footer>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className = "", ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm w-full">
    <span className="font-medium text-gray-600">{label}</span>
    <input
      ref={ref}
      className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${props.disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""} ${className}`}
      {...props}
    />
  </label>
));
Input.displayName = "Input";

const Select: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}> = ({ label, name, value, onChange, options }) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <select name={name} value={value} onChange={onChange} className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

export default InvoiceModal;
