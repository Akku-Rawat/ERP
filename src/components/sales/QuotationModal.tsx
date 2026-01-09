import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";
import TermsAndCondition from "../TermsAndCondition";

import {
  getAllCustomers,
  getCustomerByCustomerCode,
} from "../../api/customerApi";
import CustomerSelect from "../selects/CustomerSelect";
import ItemSelect from "../selects/ItemSelect";

import Modal from "../../components/UI/modal/modal";
import {
  Button,
} from "../../components/UI/modal/formComponent";

interface ItemRow {
  productName: string;
  description: string;
  quantity: number;
  listPrice: number;
  discount: number;
  tax: number;
  amount?: number;
}

const emptyItem: ItemRow = {
  productName: "",
  description: "",
  quantity: 0,
  listPrice: 0,
  discount: 0,
  tax: 0,
};

interface FormData {
  CutomerName: string;
  quoteID: string;
  validUntil: string;
  dateOfQuotation: string;
  totalDiscount: number;
  totalTax: number;
  adjustment: number;
  termsAndConditions: string;
  descriptionInformation: string;
  subTotal: number;
  grandTotal: number;
  currency: string;
  industry: string;
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
}

const emptyForm: FormData = {
  CutomerName: "",
  quoteID: "",
  validUntil: "",
  dateOfQuotation: "",
  totalDiscount: 0,
  totalTax: 0,
  adjustment: 0,
  termsAndConditions: "",
  descriptionInformation: "",
  subTotal: 0,
  grandTotal: 0,
  currency: "ZMW",
  industry: "",
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
};

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
  const [form, setForm] = useState<FormData>({ ...emptyForm });
  const [items, setItems] = useState<ItemRow[]>([{ ...emptyItem }]);
  const [selectedTemplate, setSelectedTemplate] = useState(
    "General Service Terms",
  );

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
  const [customers, setCustomers] = useState<{ name: string; id: string }[]>(
    [],
  );
  const [custLoading, setCustLoading] = useState(true);
  const [customerDetails, setCustomerDetails] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    const loadCustomers = async () => {
      try {
        setCustLoading(true);

        const response = await getAllCustomers();

        if (response.status_code !== 200)
          throw new Error("Failed to load customers");
        const customers =
          response.data?.map((c: any) => ({
            name: c.name,
            id: c.id,
          })) || [];

        setCustomers(customers);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error loading customers:", err);
        }
      } finally {
        setCustLoading(false);
      }
    };

    loadCustomers();

    return () => controller.abort();
  }, [isOpen]);

  const loadCustomerDetailsById = async (id: string) => {
    try {
      const response = await getCustomerByCustomerCode(id);
      if (!response || response.status_code !== 200) return;
      setCustomerDetails(response.data);
    } catch (err) {
      console.error("Error loading customer details:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setForm((prev) => ({ ...prev, dateOfQuotation: today }));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setForm((prev) => ({ ...prev, validUntil: today }));
    }
  }, [isOpen]);

  useEffect(() => {
    const subTotal = items.reduce(
      (s, i) => s + i.quantity * i.listPrice - i.discount + i.tax,
      0,
    );
    const grandTotal =
      subTotal - form.totalDiscount + form.totalTax + form.adjustment;
    setForm((p) => ({ ...p, subTotal, grandTotal }));
  }, [items, form.totalDiscount, form.totalTax, form.adjustment]);

  const handleForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const num = ["totalDiscount", "totalTax", "adjustment"].includes(name)
      ? Number(value)
      : value;
    setForm((p) => ({ ...p, [name]: num }));
  };

  const handleItem = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const { name, value } = e.target;
    const num = ["quantity", "listPrice", "discount", "tax"].includes(name)
      ? Number(value)
      : value;
    const copy = [...items];
    copy[idx] = { ...copy[idx], [name]: num };
    setItems(copy);
  };

  const addItem = () => {
    const newItem = { ...emptyItem };
    const newItems = [...items, newItem];
    setItems(newItems);

    const newItemIndex = newItems.length - 1;
    const targetPage = Math.floor(newItemIndex / itemsPerPage);
    setPage(targetPage);
  };
  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems((p) => p.filter((_, i) => i !== idx));
  };

  const reset = () => {
    setForm({ ...emptyForm });
    setItems([{ ...emptyItem }]);
    setActiveTab("details");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subTotal = items.reduce(
      (s, i) => s + i.quantity * i.listPrice - i.discount + i.tax,
      0,
    );
    const grandTotal =
      subTotal - form.totalDiscount + form.totalTax + form.adjustment;
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

  const updateItem = (index: number, updated: Partial<ItemRow>) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  return (
   <Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Create Quotation"
  subtitle="Create and manage quotation details"
  maxWidth="6xl"
  height="90vh"
  footer={
    <>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="ghost" onClick={reset}>Reset</Button>
      <Button variant="primary" type="submit">Save Quote</Button>
    </>
  }
>
  <form onSubmit={submit} className="h-full flex flex-col">
 
            
         

           {/* Tabs */}
<div className="flex gap-1 -mx-6 -mt-6 px-6 pt-4 bg-app sticky top-0 z-10 shrink-0">
  {(["details", "terms", "address"] as const).map((tab) => (
    <button
      key={tab}
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`relative px-6 py-3 font-semibold text-sm capitalize rounded-t-lg ${
        activeTab === tab
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


             
  

            <section className="flex-1 overflow-y-auto p-4 space-y-6">
              {activeTab === "details" && (
                // <div className=" grid grid-cols-3">
                <div className="grid grid-cols-3 gap-6 max-h-screen overflow-auto p-4 mt-8">
                  <div className=" col-span-2">
                    {/* Quote Information */}
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                      Quote Information
                    </h3>
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
                        <Input
                          label="Date of Quotation"
                          name="dateOfQuotation"
                          type="date"
                          value={form.dateOfQuotation}
                          onChange={handleForm}
                          className="w-full"
                        />
                        <div className="flex flex-col gap-1">
                          <Input
                            label="Valid Until"
                            name="validUntil"
                            type="date"
                            value={form.validUntil}
                            onChange={handleForm}
                            className="w-full col-span-3"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-medium text-gray-600 text-sm">
                            Currency
                          </label>
                          <select
                            name="currency"
                            value={form.currency}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="ZMW">ZMW (ZK)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-medium text-gray-600 text-sm">
                            Industry Bases
                          </label>
                          <select
                            name="industry"
                            value={form.industry}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="product">Product</option>
                            <option value="service">Service</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="my-6 h-px bg-gray-600" />

                    {/* <Card title="Quoted Items"> */}
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                      Quoted Items
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">
                        Showing {page * itemsPerPage + 1}–
                        {Math.min((page + 1) * itemsPerPage, items.length)} of{" "}
                        {items.length}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setPage(Math.max(0, page - 1))}
                          disabled={page === 0}
                          className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ← Prev
                        </button>
                        <button
                          type="button"
                          onClick={() => setPage(page + 1)}
                          disabled={(page + 1) * itemsPerPage >= items.length}
                          className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next →
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="px-2 py-2 text-left">#</th>
                            <th className="px-2 py-2 text-left">Item</th>
                            <th className="px-2 py-2 text-left">Description</th>
                            <th className="px-2 py-2 text-left">Qty</th>
                            <th className="px-2 py-2 text-left">Unit Price</th>
                            <th className="px-2 py-2 text-left">Discount</th>
                            <th className="px-2 py-2 text-left">Tax</th>
                            <th className="px-2 py-2 text-right">Amount</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {paginatedItems.map((it, idx) => {
                            const i = page * itemsPerPage + idx;
                            const amount =
                              it.quantity * it.listPrice - it.discount + it.tax;
                            return (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-center">
                                  {i + 1}
                                </td>
                                <td className="px-1 py-1">
                                  <ItemSelect
                                    value={it.productName}
                                    onChange={(item) => {
                                      updateItem(i, {
                                        productName: item.name,
                                        description:
                                          item.description ?? it.description,
                                        listPrice: item.price ?? it.listPrice,
                                      });
                                    }}
                                  />
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    className="w-full rounded border p-1 text-sm"
                                    name="description"
                                    value={it.description}
                                    onChange={(e) => handleItem(e, i)}
                                  />
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    type="number"
                                    className="w-full rounded border p-1 text-right text-sm"
                                    name="quantity"
                                    value={it.quantity}
                                    onChange={(e) => handleItem(e, i)}
                                  />
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    type="number"
                                    className="w-full rounded border p-1 text-right text-sm"
                                    name="listPrice"
                                    value={it.listPrice}
                                    onChange={(e) => handleItem(e, i)}
                                  />
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    type="number"
                                    className="w-full rounded border p-1 text-right text-sm"
                                    name="discount"
                                    value={it.discount}
                                    onChange={(e) => handleItem(e, i)}
                                  />
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    type="number"
                                    className="w-full rounded border p-1 text-right text-sm"
                                    name="tax"
                                    value={it.tax}
                                    onChange={(e) => handleItem(e, i)}
                                  />
                                </td>
                                <td className="px-1 py-1 text-right font-medium">
                                  {symbol}
                                  {amount.toFixed(2)}
                                </td>
                                <td className="px-1 py-1 text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(i)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
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

                    {/* ---------- ADD ITEM + SUBTOTAL ---------- */}
                    <div className="flex justify-between mt-3">
                      <button
                        type="button"
                        onClick={addItem}
                        className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                      >
                        <Plus className="w-4 h-4" /> Add Item
                      </button>
                      <div className="py-2 px-2"></div>
                    </div>
                  </div>

                  {/* ---------- Customer Details + Summary ---------- */}
                  {/* <div className="col-span-1 sticky top-4 flex flex-col items-center gap-6 px-4 lg:px-6 h-fit"> */}
                  <div className="col-span-1 sticky top-0 flex flex-col items-center gap-6 px-4 lg:px-6 h-fit">
                    <div className="w-full max-w-sm space-y-6">
                      {/* ---------- Customer Details ---------- */}
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
                              {" "}
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

                      {/* ---------- Summary ---------- */}
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
                              {items.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Sub Total
                            </span>
                            <span className="font-medium text-gray-800">
                              {symbol}
                              {form.subTotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Total Tax
                            </span>
                            <span className="font-medium text-gray-800">
                              {symbol}
                              {items
                                .reduce((sum, it) => sum + it.tax, 0)
                                .toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="text-base font-semibold text-gray-700">
                              Total Amount
                            </span>
                            <span className="text-base font-bold text-blue-600">
                              {symbol}
                              {(
                                form.subTotal +
                                items.reduce((sum, it) => sum + it.tax, 0) -
                                items.reduce((sum, it) => sum + it.discount, 0)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB: Terms & Conditions === */}
              {activeTab === "terms" && (
                <div className=" h-full w-full mt-8">
                  <TermsAndCondition />
                </div>
              )}

              {/* === TAB: ADDRESS & TERMS === */}
              {activeTab === "address" && (
                <div className=" grid grid-cols-2 gap-10 mt-8">
                  <div className=" col-span-1 shadow px-4 rounded-lg border border-gray-300 bg-white py-6">
                    <div className=" flex justify-between">
                      <h3 className=" mb-4 text-lg font-semibold text-gray-700 underline ">
                        Billing Address
                      </h3>
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor="address"
                          className="text-gray-600 font-medium"
                        >
                          More Address:
                        </label>
                        <select
                          name="address"
                          id="address"
                          className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="address1">Address 1</option>
                          <option value="address2">Address 2</option>
                          <option value="address3">Address 3</option>
                          <option value="address4">Address 4</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-5">
                      <Input
                        label="Line 1"
                        name="billingAddressLine1"
                        value={form.billingAddressLine1 ?? ""}
                        onChange={handleForm}
                        placeholder="Street, Apartment"
                      />
                      <Input
                        label="Line 2"
                        name="billingAddressLine2"
                        value={form.billingAddressLine2 ?? ""}
                        onChange={handleForm}
                        placeholder="Landmark, City"
                      />
                      <Input
                        label="Postal Code"
                        name="billingPostalCode"
                        value={form.billingPostalCode ?? ""}
                        onChange={handleForm}
                        placeholder="Postal Code"
                      />
                      <Input
                        label="City"
                        name="billingCity"
                        value={form.billingCity ?? ""}
                        onChange={handleForm}
                        placeholder="City"
                      />
                      <Input
                        label="State"
                        name="billingState"
                        value={form.billingState ?? ""}
                        onChange={handleForm}
                        placeholder="State"
                      />
                      <Input
                        label="Country"
                        name="billingCountry"
                        value={form.billingCountry ?? ""}
                        onChange={handleForm}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div className=" col-span-1 px-4 shadow rounded-lg border border-gray-300 bg-white py-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-5">
                      <Input
                        label="Payment Terms"
                        name="paymentTerms"
                        value={form.paymentTerms || ""}
                        onChange={handleForm}
                        placeholder="e.g., Net 30, Due on Receipt"
                      />
                      <Input
                        label="Payment Method"
                        name="paymentMethod"
                        value={form.paymentMethod || ""}
                        onChange={handleForm}
                        placeholder="e.g., Bank Transfer, Credit Card"
                      />
                      <Input
                        label="Bank Name"
                        name="bankName"
                        value={form.bankName || ""}
                        onChange={handleForm}
                      />
                      <Input
                        label="Account Number"
                        name="accountNumber"
                        value={form.accountNumber || ""}
                        onChange={handleForm}
                      />
                      <Input
                        label="Routing Number / IBAN"
                        name="routingNumber"
                        value={form.routingNumber || ""}
                        onChange={handleForm}
                      />
                      <Input
                        label="SWIFT / BIC"
                        name="swiftCode"
                        value={form.swiftCode || ""}
                        onChange={handleForm}
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

// Reusable Input Component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className = "", ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm w-full">
    <span className="font-medium text-gray-600">{label}</span>
    <input
      ref={ref}
      className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className} ${
        props.disabled ? "bg-gray-50" : ""
      }`}
      {...props}
    />
  </label>
));
Input.displayName = "Input";

export default QuotationModal;
