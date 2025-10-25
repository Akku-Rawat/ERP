import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";

const base_url = import.meta.env.VITE_BASE_URL;
console.log("base url " ,base_url);

function CustomerDropdown({
  value,
  onChange,
  className = "",
  customers,
  custLoading,
}: {
  value: string;
  onChange: (s: string) => void;
  className?: string;
  customers: { name: string }[];
  custLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

    const filtered = customers.filter((c: { name: string }) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const selected = customers.find((c) => c.name === value);

 return (
  <div ref={ref} className={`relative w-full flex flex-col gap-1 ${className}`}>
    <span className="font-medium text-gray-600 text-sm">Customer Name</span>
    <button
      type="button"
      disabled={custLoading}
      className="w-full rounded border px-3 py-2 text-left bg-white disabled:opacity-60"
      onClick={() => !custLoading && setOpen((v) => !v)}
    >
      {custLoading
        ? "Loading customers..."
        : selected?.name || "Select customer..."}
    </button>

    {open && !custLoading && (
      <div className="absolute left-0 w-full mt-1 bg-white border shadow-lg rounded z-10">
        <input
          className="w-full border-b px-2 py-1"
          autoFocus
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="max-h-40 overflow-y-auto">
          {filtered.map((c) => (
            <li
              key={c.name}  
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                c.name === value ? "bg-blue-200 font-bold" : ""
              }`}
              onClick={() => {
                onChange(c.name);
                setOpen(false);
                setSearch("");
              }}
            >
              <span>{c.name}</span>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-2 text-gray-500">No match</li>
          )}
        </ul>
      </div>
    )}
  </div>
);
}
 

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
};

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
  currency: "ZMK",
  notes:"",
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
  const [selectedTemplate, setSelectedTemplate] = useState("General Service Terms");

const itemsPerPage = 5;                          
const [page, setPage] = useState(0);             
const paginatedItems = items.slice(
  page * itemsPerPage,
  (page + 1) * itemsPerPage
);
  const [activeTab, setActiveTab] = useState<"details" | "terms" | "address">(
    "details"
  );
  const [isShippingOpen, setIsShippingOpen] = useState(false);
 const [customers, setCustomers] = useState<{ name: string }[]>([]);
const [custLoading, setCustLoading] = useState(true);

 useEffect(() => {
  if (!isOpen) return;

  const controller = new AbortController();

  // const loadCustomers = async () => {
  //   try {
  //     setCustLoading(true);
  //     const res = await fetch(`${base_url}/resource/Customer`, {
  //       signal: controller.signal,
     
  //           method: "PUT",
  //           headers: { "Content-Type": "application/json",
  //              "Authorization" : import.meta.env.VITE_AUTHORIZATION
  //            },
  //           body: JSON.stringify(payload),
      
  //     });
  //     if (!res.ok) throw new Error("Failed to load customers");
  //     const data = await res.json();
  //     setCustomers(data.map((c: any) => ({ name: c.name })));
  //     } catch (err: any) {
  //     if (err.name !== "AbortError") {
  //       console.error(err);
  //     }
  //   } finally {
  //     setCustLoading(false);
  //   }
  // };

 const loadCustomers = async () => {
  try {
    setCustLoading(true);

    const res = await fetch(`${base_url}/resource/Customer`, {
      signal: controller.signal,
      method: "GET",  
      headers: {
        "Content-Type": "application/json",
        "Authorization": import.meta.env.VITE_AUTHORIZATION,
      },
    });

    if (!res.ok) throw new Error("Failed to load customers");

    const result = await res.json();
    const customers = result.data?.map((c: any) => ({ name: c.name })) || [];

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
      0
    );
    const grandTotal =
      subTotal - form.totalDiscount + form.totalTax + form.adjustment;
    setForm((p) => ({ ...p, subTotal, grandTotal }));
  }, [items, form.totalDiscount, form.totalTax, form.adjustment]);

  const handleForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
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
      0
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-[90vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          <form onSubmit={submit} className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b">
              <h2 className="text-2xl font-semibold text-blue-700">
                Create Quotation
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200"
              >
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
                  className={`px-6 py-3 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab === "details"
                    ? "Details"
                    : tab === "terms"
                    ? "Terms & Conditions"
                    : "Additional Details"}
                </button>
              ))}
            </div>

             <section className="flex-1 overflow-y-auto p-4 space-y-6">
               {activeTab === "details" && (
                // <div className=" grid grid-cols-3">
                <div className="grid grid-cols-3 gap-6 max-h-screen overflow-auto p-4">
                  <div className=" col-span-2">
                  {/* Quote Information */}
                   <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">Quote Information</h3> 
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
<CustomerDropdown
  value={form.CutomerName}
  onChange={(name) => setForm((p) => ({ ...p, CutomerName: name }))}
  className="w-full"
  customers={customers}
  custLoading={custLoading}
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
                      </div>
                     </div>
                   

<div className="my-6 h-px bg-gray-600" />
                  
 {/* <Card title="Quoted Items"> */}
  <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">Quoted Items</h3>
   <div className="flex items-center justify-between mb-3">
    <span className="text-sm text-gray-600">
      Showing {page * itemsPerPage + 1}–{Math.min((page + 1) * itemsPerPage, items.length)} of {items.length}
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
          <th className="px-2 py-2 text-left">Product</th>
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
          const i = page * itemsPerPage + idx;   // real index in full array
          const amount = it.quantity * it.listPrice - it.discount + it.tax;
          return (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-center">{i + 1}</td>
              <td className="px-1 py-1">
                <input
                  className="w-full rounded border p-1 text-sm"
                  name="productName"
                  value={it.productName}
                  onChange={(e) => handleItem(e, i)}
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
    <div className="py-2 px-2">
      
    </div>
  </div>
  </div>
  
{/* ---------- Customer Details + Summary ---------- */}
{/* <div className="col-span-1 sticky top-4 flex flex-col items-center gap-6 px-4 lg:px-6 h-fit"> */}
<div className="col-span-1 sticky top-0 flex flex-col items-center gap-6 px-4 lg:px-6 h-fit">
  <div className="w-full max-w-sm space-y-6">  
  {/* ---------- Customer Details ---------- */}
  <div className="w-full max-w-sm rounded-lg border border-gray-300 p-4 bg-white shadow">
    <h3 className="mb-3 text-lg font-semibold text-gray-700 underline">Customer Details</h3>
    {/* <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
      <div>
        <h4 className="font-medium text-gray-600">First Name</h4>
        <p className="text-gray-800">Rishab</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-600">Phone Number</h4>
        <p className="text-gray-800">+91 9201564389</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-600">Last Name</h4>
        <p className="text-gray-800">Negi</p>
      </div>
      <div>
        <h4 className="font-medium text-gray-600">Email Address</h4>
        <p className="text-gray-800">rn@gmail.com</p>
      </div>
    </div> */}
     <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="font-medium text-gray-600">First Name</span>
        <span className="font-medium text-gray-800">Rishab</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-gray-600">Last Name</span>
        <span className="font-medium text-gray-800">
          Negi
        </span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-gray-600">Phone Number</span>
        <span className="font-medium text-gray-800"> +91 9201564389
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-base font-semibold text-gray-700">Email Address</span>
        <span className="text-base font-bold text-blue-600">
           rn@gmail.com
        </span>
      </div>
    </div>
  </div>

  {/* ---------- Summary ---------- */}
  <div className="w-full max-w-sm rounded-lg border border-gray-300 p-4 bg-white shadow">
    <h3 className="mb-3 text-lg font-semibold text-gray-700 underline">Summary</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="font-medium text-gray-600">Total Items</span>
        <span className="font-medium text-gray-800">{items.length}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-gray-600">Sub Total</span>
        <span className="font-medium text-gray-800">
          {symbol}{form.subTotal.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-gray-600">Total Tax</span>
        <span className="font-medium text-gray-800">
          {symbol}{items.reduce((sum, it) => sum + it.tax, 0).toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between border-t pt-2 mt-2">
        <span className="text-base font-semibold text-gray-700">Total Amount</span>
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
              <>
              <div className=" items-center mb-4">
  <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
    Terms and Conditions
  </h3>
 
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Select a template</label>
          <select
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <option>General Service Terms</option>
            <option>Payment Terms</option>
            <option>Service Delivery Terms</option>
            <option>Cancellation / Refund Policy</option>
            <option>Confidentiality & Data Protection</option>
            <option>Liability</option>
          </select>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex space-x-1 mb-3 p-1 bg-gray-100 rounded-md">
        <button className="p-2 hover:bg-gray-200 rounded" title="Bold">
          <strong>B</strong>
        </button>
        <button className="p-2 hover:bg-gray-200 rounded" title="Italic">
          <em>I</em>
        </button>
        <button className="p-2 hover:bg-gray-200 rounded" title="Underline">
          <u>U</u>
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button className="p-2 hover:bg-gray-200 rounded" title="Unordered List">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-200 rounded" title="Ordered List">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
<textarea
  className="w-full h-64 p-4 border border-gray-300 rounded-md text-sm text-gray-700 font-mono bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={
    selectedTemplate === "General Service Terms"
      ? `1.This Quotation is subject to the following terms and conditions. By accepting this quotation, {{CustomerName}} agrees to be bound by these terms. This quotation, identified by number {{QuotationNumber}}, was issued on {{QuotationDate}} and is valid until {{ValidUntil}}.\n\n 2.The services to be provided are: {{ServiceName}}. The total amount payable for these services is {{TotalAmount}}.\n\n 3.Payment is due upon receipt of the invoice. Any disputes must be raised within 14 days of the invoice date.`
      : selectedTemplate === "Payment Terms"
      ? `1.Payment Stages\t20% Advance, 30% after Phase 1, 50% on completion\nDue Dates\tPayment due within 30 days from invoice\nLate Payment Charges\t12% p.a. on overdue payments\nTaxes / Additional Charges\tTax applicable @ 18%\nSpecial Notes / Conditions\tAdvance payment is non-refundable`
      : selectedTemplate === "Service Delivery Terms"
      ? `1.Estimated Delivery Timelines\tPhase 1: 2 weeks; Phase 2: 3 weeks; Final Delivery: 5 weeks total\nClient Responsibilities\tClient must provide content, approvals, and access to systems on time`
      : selectedTemplate === "Cancellation / Refund Policy"
      ? `1.Cancellation Conditions\tClient may cancel anytime with written notice\nRefund Rules\tAdvance payment is non-refundable; milestone payments refundable only for uninitiated work`
      : selectedTemplate === "Confidentiality & Data Protection"
      ? `1.All client data shared for the service will remain confidential.`
      : selectedTemplate === "Liability"
      ? `1.Company not liable for delays caused by client.\n• Client responsible for providing accurate info/resources.`
      : ""
  }
/>

{/* Action Buttons */}
<div className="mt-4 flex justify-end space-x-3">
  <button
    onClick={() => {
       alert("Terms saved!");
    }}
    className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
  >
    Save
  </button>

  <button
    onClick={() => {
       alert("Preview opened!");
    }}
    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    Preview
  </button>
</div>
</>

)}

              {/* === TAB: ADDRESS & TERMS === */}
              {activeTab === "address" && (
                <div className=" grid grid-cols-2 gap-10">
                   <div className=" col-span-1 shadow px-4 rounded-lg border border-gray-300 bg-white py-6">
        <div className=" flex justify-between">
        <h3 className=" mb-4 text-lg font-semibold text-gray-700 underline ">Billing Address</h3>
 <div className="flex items-center space-x-2">
    <label htmlFor="address" className="text-gray-600 font-medium">
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
                   <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">Payment Information</h3>
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

            {/* Footer */}
            <footer className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save Quotation
                </button>
              </div>
            </footer>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
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