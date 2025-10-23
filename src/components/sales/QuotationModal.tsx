import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";

const base_url = import.meta.env.BASE_URL;
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
  const itemsPerPage = 7;                          
const [page, setPage] = useState(0);             
const paginatedItems = items.slice(
  page * itemsPerPage,
  (page + 1) * itemsPerPage
);
  const [activeTab, setActiveTab] = useState<"details" | "payment" | "address">(
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
   
// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       const payload = { ...form };
//       let response;
//       if (isEditMode && initialData?.customer_name) {
//         response = await fetch(
//           `${CUSTOMER_ENDPOINT}/${initialData.customer_name}`,
//           {
//             method: "PUT",
//             headers: { "Content-Type": "application/json",
//                "Authorization" : import.meta.env.AUTHORIZATION
//              },
//             body: JSON.stringify(payload),
//           }
//         );
//       } else {
//         response = await fetch(CUSTOMER_ENDPOINT, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       }
//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.message || "Failed to save customer");
//       }
//       await response.json();
//       toast.success(isEditMode ? "Customer updated!" : "Customer created!");
//       onSubmit?.({ ...form });
//       handleClose();
//     } catch (err: any) {
//       toast.error(err.message || "Something went wrong");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

  const handleItem = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const { name, value } = e.target;
    const num = ["quantity", "listPrice", "discount", "tax"].includes(name)
      ? Number(value)
      : value;
    const copy = [...items];
    copy[idx] = { ...copy[idx], [name]: num };
    setItems(copy);
  };

  const addItem = () => setItems((p) => [...p, { ...emptyItem }]);
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
              {(["details", "payment", "address"] as const).map((tab) => (
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
                    : tab === "payment"
                    ? "Payment Info"
                    : "Address & Terms"}
                </button>
              ))}
            </div>

             <section className="flex-1 overflow-y-auto p-4 space-y-6">
               {activeTab === "details" && (
                <>
                  {/* Quote Information */}
                  <Card title="Quote Information">
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        <Input
                          label="Valid Until"
                          name="validUntil"
                          type="date"
                          value={form.validUntil}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                      </div>
                      </div>
                     </div>
                  </Card>

<div className="my-6 h-px bg-gray-300" />
                  {/* Quoted Items */}
                  {/* <Card title="Quoted Items">
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
                          {items.map((it, i) => {
                            const amount =
                              it.quantity * it.listPrice - it.discount + it.tax;
                            return (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-center">
                                  {i + 1}
                                </td>
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
                    <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={addItem}
                      className="mt-3 flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                    <div className=" py-2 px-2">
                        <span className="text-gray-600 px-2">Sub Total</span>
                        <span className=" font-medium">
                          {symbol}
                          {form.subTotal.toFixed(2)}
                        </span>
                        </div>
                      </div>
                  </Card> */}
 <Card title="Quoted Items">
  {/* ---------- PAGINATION CONTROLS ---------- */}
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
      <span className="text-gray-600 px-2">Sub Total</span>
      <span className="font-medium">
        {symbol}
        {form.subTotal.toFixed(2)}
      </span>
    </div>
  </div>
</Card>
                  
                 </>
              )}

              {/* === TAB: PAYMENT INFO === */}
              {activeTab === "payment" && (
                <Card title="Payment Information">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                </Card>
              )}

              {/* === TAB: ADDRESS & TERMS === */}
              {activeTab === "address" && (
                 <div className="flex flex-col gap-6">
    <Card title="Billing Address">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
    </Card>
   <div className=" my-2 h-px bg-gray-300" />
    {/* Shipping Address */}
<div className="border rounded-lg overflow-hidden">
  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
    <button
  type="button"
  onClick={() => setIsShippingOpen(!isShippingOpen)}
  className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900"
>
  <span className="font-bold">
    {isShippingOpen ? "−" : "+"}
  </span>
  Shipping Address
</button>

<label className="flex items-center gap-2 cursor-pointer select-none">
  <input
    type="checkbox"
    checked={form.sameAsBilling}
    onChange={(e) => {
      const checked = e.target.checked;
      setForm((prev) => ({
        ...prev,
        sameAsBilling: checked, 
        ...(checked
          ? {
              shippingAddressLine1: prev.billingAddressLine1 ?? "",
              shippingAddressLine2: prev.billingAddressLine2 ?? "",
              shippingPostalCode: prev.billingPostalCode ?? "",
              shippingCity: prev.billingCity ?? "",
              shippingState: prev.billingState ?? "",
              shippingCountry: prev.billingCountry ?? "",
            }
          : {
              shippingAddressLine1: "",
              shippingAddressLine2: "",
              shippingPostalCode: "",
              shippingCity: "",
              shippingState: "",
              shippingCountry: "",
            }),
      }));
    }}
    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
  />
  <span className="text-sm text-gray-600">Same as billing address</span>
</label>
  </div>
 
  {isShippingOpen && (
    <div className="p-4 border-t">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Input
          label="Line 1"
          name="shippingAddressLine1"
          value={form.shippingAddressLine1 ?? ""}
          onChange={handleForm}
          placeholder="Street, Apartment"
          disabled={form.sameAsBilling}
        />
        <Input
          label="Line 2"
          name="shippingAddressLine2"
          value={form.shippingAddressLine2 ?? ""}
          onChange={handleForm}
          placeholder="Landmark, City"
          disabled={form.sameAsBilling}
        />
        <Input
          label="Postal Code"
          name="shippingPostalCode"
          value={form.shippingPostalCode ?? ""}
          onChange={handleForm}
          placeholder="Postal Code"
          disabled={form.sameAsBilling}
        />
        <Input
          label="City"
          name="shippingCity"
          value={form.shippingCity ?? ""}
          onChange={handleForm}
          placeholder="City"
          disabled={form.sameAsBilling}
        />
        <Input
          label="State"
          name="shippingState"
          value={form.shippingState ?? ""}
          onChange={handleForm}
          placeholder="State"
          disabled={form.sameAsBilling}
        />
        <Input
          label="Country"
          name="shippingCountry"
          value={form.shippingCountry ?? ""}
          onChange={handleForm}
          placeholder="Country"
          disabled={form.sameAsBilling}
        />
      </div>
    </div>
  )}
</div>
<div className=" my-2 h-px bg-gray-300" />
    <Card title="Terms and Conditions">
      <textarea
        className="w-full rounded border p-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        name="notes"
        value={form.notes ?? ""}
        onChange={handleForm}
        placeholder="Any special instructions..."
      />
    </Card>
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

// Reusable Card Component
const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h3 className="mb-4 text-lg font-semibold text-gray-700">{title}</h3>
    {children}</div>
);

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