import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";

// --- TAX ROW TYPES/STATE
type TaxRow = {
  type: string;
  accountHead: string;
  taxRate: number;
  amount: number;
};

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

type PaymentRow = {
  paymentTerm: string;
  description: string;
  dueDate: string;
  invoicePortion: number;
  paymentAmount: number;
};

function SupplierDropdown({
  value,
  onChange,
  className = "",
  suppliers,
  suppLoading,
}: {
  value: string;
  onChange: (s: string) => void;
  className?: string;
  suppliers: { name: string }[];
  suppLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = suppliers.filter((s: { name: string }) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const selected = suppliers.find((s) => s.name === value);

  return (
    <div
      ref={ref}
      className={`relative w-full flex flex-col gap-1 ${className}`}
    >
      <span className="font-medium text-gray-600 text-sm">Supplier Name</span>
      <button
        type="button"
        disabled={suppLoading}
        className="w-full rounded border px-3 py-2 text-left bg-white disabled:opacity-60"
        onClick={() => !suppLoading && setOpen((v) => !v)}
      >
        {suppLoading
          ? "Loading suppliers..."
          : selected?.name || "Select supplier..."}
      </button>

      {open && !suppLoading && (
        <div
          className="absolute left-0 w-full mt-1 bg-white border shadow-lg rounded z-10"
          style={{ top: "100%" }}
        >
          <input
            className="w-full border-b px-2 py-1"
            autoFocus
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="max-h-40 overflow-y-auto">
            {filtered.map((s) => (
              <li
                key={s.name}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                  s.name === value ? "bg-blue-200 font-bold" : ""
                }`}
                onClick={() => {
                  onChange(s.name);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <span>{s.name}</span>
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
  itemCode: string;
  requiredBy: string;
  quantity: number;
  uom: string;
  rate: number;
}

const emptyItem: ItemRow = {
  itemCode: "",
  requiredBy: "",
  quantity: 0,
  uom: "Unit",
  rate: 0,
};

interface FormData {
  poNumber: string;
  date: string;
  supplier: string;
  taxCategory: string;
  shippingRule: string;
  incoterm: string;
  taxesChargesTemplate: string;
  requiredBy: string;
  currency: string;
  status: string;
  costCenter: string;
  project: string;
  supplierAddress: string;
  supplierContact: string;
  dispatchAddress: string;
  shippingAddress: string;
  companyBillingAddress: string;
  placeOfSupply: string;
  paymentTermsTemplate: string;
  termsAndConditions: string;
  totalQuantity: number;
  grandTotal: number;
  roundingAdjustment: number;
  roundedTotal: number;
}

const emptyForm: FormData = {
  poNumber: "",
  date: "",
  supplier: "",
  requiredBy: "",
  currency: "INR",
  status: "Draft",
  taxCategory: "",
  shippingRule: "",
  incoterm: "",
  taxesChargesTemplate: "",
  costCenter: "",
  project: "",
  supplierAddress: "",
  supplierContact: "",
  dispatchAddress: "",
  shippingAddress: "",
  companyBillingAddress: "",
  placeOfSupply: "",
  paymentTermsTemplate: "",
  termsAndConditions: "",
  totalQuantity: 0,
  grandTotal: 0,
  roundingAdjustment: 0,
  roundedTotal: 0,
};

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [items, setItems] = useState<ItemRow[]>([{ ...emptyItem }]);
  const [activeTab, setActiveTab] = useState<
    "details" | "email" | "tax" | "address" | "terms"
  >("details");
  const itemsPerPage = 3;
  const [page, setPage] = useState(0);
  const paginatedItems = items.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const [suppliers, setSuppliers] = useState<{ name: string }[]>([]);
  const [suppLoading, setSuppLoading] = useState(true);

  // --- TAX ROW STATE + HANDLERS ---
  const [taxRows, setTaxRows] = useState<TaxRow[]>([
    { type: "", accountHead: "", taxRate: 0, amount: 0 },
  ]);

  const taxItemsPerPage = 4;
  const [taxPage, setTaxPage] = useState(0);
  const paginatedTaxRows = taxRows.slice(
    taxPage * taxItemsPerPage,
    (taxPage + 1) * taxItemsPerPage
  );

  const addTaxRow = () => {
    setTaxRows((prev) => {
      const newRows = [
        ...prev,
        { type: "", accountHead: "", taxRate: 0, amount: 0 },
      ];
      setTaxPage(Math.floor((newRows.length - 1) / taxItemsPerPage));
      return newRows;
    });
  };

  const removeTaxRow = (idx: number) =>
    setTaxRows((rows) => rows.filter((_, i) => i !== idx));

  const handleTaxRowChange = (idx: number, key: keyof TaxRow, value: any) => {
    setTaxRows((rows) => {
      const updated = [...rows];
      updated[idx] = { ...updated[idx], [key]: value };
      return updated;
    });
  };

  // Email template state
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [subject, setSubject] = useState("");
  const [sendAttachedFiles, setSendAttachedFiles] = useState(false);
  const [sendPrint, setSendPrint] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Payment rows
  const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([
    {
      paymentTerm: "",
      description: "",
      dueDate: "",
      invoicePortion: 0,
      paymentAmount: 0,
    },
  ]);
  const paymentItemsPerPage = 4;
  const [paymentPage, setPaymentPage] = useState(0);
  const paginatedPaymentRows = paymentRows.slice(
    paymentPage * paymentItemsPerPage,
    (paymentPage + 1) * paymentItemsPerPage
  );

  const addPaymentRow = () => {
  setPaymentRows(prev => {
    const newRows = [
      ...prev,
      {
        paymentTerm: "",
        description: "",
        dueDate: "",
        invoicePortion: 0,
        paymentAmount: 0,
      },
    ];
    setPaymentPage(Math.floor((newRows.length - 1) / paymentItemsPerPage));
    return newRows;
  });
};


  const removePaymentRow = (idx: number) =>
    setPaymentRows((rows) =>
      rows.length === 1 ? rows : rows.filter((_, i) => i !== idx)
    );

  const handlePaymentRowChange = (
    idx: number,
    key: keyof PaymentRow,
    value: any
  ) => {
    setPaymentRows((rows) => {
      const updated = [...rows];
      updated[idx] = { ...updated[idx], [key]: value };
      return updated;
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    const loadSuppliers = async () => {
      try {
        setSuppLoading(true);
        // Simulated supplier data - replace with actual API call
        const mockSuppliers = [
          { name: "Supplier A" },
          { name: "Supplier B" },
          { name: "Supplier C" },
        ];
        setSuppliers(mockSuppliers);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error loading suppliers:", err);
        }
      } finally {
        setSuppLoading(false);
      }
    };

    loadSuppliers();
    return () => controller.abort();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setForm((prev) => ({ ...prev, date: today, requiredBy: today }));
    }
  }, [isOpen]);

  useEffect(() => {
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const grandTotal = items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
    const roundedTotal = Math.round(grandTotal);
    const roundingAdjustment = roundedTotal - grandTotal;

    setForm((p) => ({
      ...p,
      totalQuantity: totalQty,
      grandTotal,
      roundingAdjustment,
      roundedTotal,
    }));
  }, [items]);

  const handleForm = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name as keyof FormData;
    const value = e.target.value;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleItem = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const { name, value } = e.target;
    const isNum = ["quantity", "rate"].includes(name);
    const copy = [...items];
    copy[idx] = { ...copy[idx], [name]: isNum ? Number(value) : value } as any;
    setItems(copy);
  };

  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems((p) => p.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    const newItem = { ...emptyItem };
    const newItems = [...items, newItem];
    setItems(newItems);

    const newItemIndex = newItems.length - 1;
    const targetPage = Math.floor(newItemIndex / itemsPerPage);
    setPage(targetPage);
  };

  const reset = () => {
    setForm({ ...emptyForm });
    setItems([{ ...emptyItem }]);
    setActiveTab("details");
    setTaxRows([{ type: "", accountHead: "", taxRate: 0, amount: 0 }]);
    setPaymentRows([
      {
        paymentTerm: "",
        description: "",
        dueDate: "",
        invoicePortion: 0,
        paymentAmount: 0,
      },
    ]);
    // reset email template fields too
    resetTemplate();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ ...form, items, taxes: taxRows, payments: paymentRows });
    reset();
    onClose();
  };

  if (!isOpen) return null;

  const getCurrencySymbol = () => {
    switch (form.currency) {
      case "INR":
        return "₹";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      default:
        return "₹";
    }
  };

  const symbol = getCurrencySymbol();

  // Editor utilities (small, cross-browser fallback)
  function exec(cmd: string) {
    document.execCommand(cmd, false, null);
    editorRef.current?.focus();
  }

  function insertToken(token: string) {
    if (!editorRef.current) return;
    document.execCommand("insertHTML", false, token);
  }

  function getEditorHtml() {
    return editorRef.current?.innerHTML || "";
  }

  function handleSaveTemplate() {
    const payload = {
      name: templateName,
      type: templateType,
      subject,
      messageHtml: getEditorHtml(),
      sendAttachedFiles,
      sendPrint,
    };
    // replace this with API save - keeping console for debug
    console.log("Saving Email Template:", payload);
    alert("Template saved (console).");
    setPreviewOpen(false);
  }

  function resetTemplate() {
    setTemplateName("");
    setTemplateType("");
    setSubject("");
    if (editorRef.current) editorRef.current.innerHTML = "";
    setSendAttachedFiles(false);
    setSendPrint(false);
    setPreviewOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-[90vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          <form
            onSubmit={submit}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b">
              <h2 className="text-2xl font-semibold text-blue-700">
                Create Purchase Order
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
              {(["details", "email", "tax", "address", "terms"] as const).map(
                (tab) => (
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
                      : tab === "email"
                      ? "Email"
                      : tab === "tax"
                      ? "Tax"
                      : tab === "address"
                      ? "Address"
                      : "Terms and Conditions"}
                  </button>
                )
              )}
            </div>

            {/* Tab Content */}
            <section className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* =========== DETAILS TAB =========== */}
              {activeTab === "details" && (
                <div className="grid grid-cols-3 gap-6 max-h-screen overflow-auto p-4">
                  <div className="col-span-2">
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="PO Number"
                          name="poNumber"
                          type="text"
                          value={form.poNumber}
                          onChange={handleForm}
                          placeholder="Enter PO Number"
                          className="w-full"
                        />
                        <SupplierDropdown
                          value={form.supplier}
                          onChange={(name) =>
                            setForm((p) => ({ ...p, supplier: name }))
                          }
                          className="w-full"
                          suppliers={suppliers}
                          suppLoading={suppLoading}
                        />
                        <Input
                          label="Date"
                          name="date"
                          type="date"
                          value={form.date}
                          onChange={handleForm}
                          className="w-full"
                        />
                        <Input
                          label="Required By"
                          name="requiredBy"
                          type="date"
                          value={form.requiredBy}
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
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        </div>
                        <div className="col-span-3 grid grid-cols-3 gap-4">
                          <Select
                            label="Status"
                            name="status"
                            value={form.status}
                            onChange={handleForm}
                            options={[
                              { value: "Draft", label: "Draft" },
                              { value: "Submitted", label: "Submitted" },
                              { value: "Approved", label: "Approved" },
                              { value: "Cancelled", label: "Cancelled" },
                            ]}
                          />
                          <Input
                            label="Cost Center"
                            name="costCenter"
                            type="text"
                            value={form.costCenter}
                            onChange={handleForm}
                            placeholder="Enter Cost Center"
                            className="w-full"
                          />
                          <Input
                            label="Project"
                            name="project"
                            type="text"
                            value={form.project}
                            onChange={handleForm}
                            placeholder="Enter Project Name"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="my-6 h-px bg-gray-600" />
                    {/* Order Items */}
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                      Order Items
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
                            <th className="px-2 py-2 text-left">Item Code</th>
                            <th className="px-2 py-2 text-left">Required By</th>
                            <th className="px-2 py-2 text-left">Qty</th>
                            <th className="px-2 py-2 text-left">UOM</th>
                            <th className="px-2 py-2 text-left">Rate</th>
                            <th className="px-2 py-2 text-right">Amount</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {paginatedItems.map((it, idx) => {
                            const i = page * itemsPerPage + idx;
                            const amount = it.quantity * it.rate;
                            return (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-center">
                                  {i + 1}
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    className="w-full rounded border p-1 text-sm"
                                    name="itemCode"
                                    value={it.itemCode}
                                    onChange={(e) => handleItem(e, i)}
                                  />
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    type="date"
                                    className="w-full rounded border p-1 text-sm"
                                    name="requiredBy"
                                    value={it.requiredBy}
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
                                    className="w-full rounded border p-1 text-sm"
                                    name="uom"
                                    value={it.uom}
                                    onChange={(e) => handleItem(e, i)}
                                  />
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    type="number"
                                    className="w-full rounded border p-1 text-right text-sm"
                                    name="rate"
                                    value={it.rate}
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
                    <div className="flex justify-between mt-3">
                      <button
                        type="button"
                        onClick={addItem}
                        className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                      >
                        <Plus className="w-4 h-4" /> Add Item
                      </button>
                    </div>
                  </div>

                  {/* Supplier Details + Summary */}
                  <div className="col-span-1 sticky top-0 flex flex-col items-center gap-6 px-4 lg:px-6 h-fit">
                    <div className="w-full max-w-sm space-y-6">
                      {/* Supplier Details */}
                      <div className="w-full max-w-sm rounded-lg border border-gray-300 p-4 bg-white shadow">
                        <h3 className="mb-3 text-lg font-semibold text-gray-700 underline">
                          Supplier Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Supplier Name
                            </span>
                            <span className="font-medium text-gray-800">
                              {form.supplier || "Not Selected"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Contact
                            </span>
                            <span className="font-medium text-gray-800">
                              +91 9876543210
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base font-semibold text-gray-700">
                              Email Address
                            </span>
                            <span className="text-base font-bold text-blue-600">
                              supplier@example.com
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="w-full max-w-sm rounded-lg border border-gray-300 p-4 bg-white shadow">
                        <h3 className="mb-3 text-lg font-semibold text-gray-700 underline">
                          Order Summary
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
                              Total Quantity
                            </span>
                            <span className="font-medium text-gray-800">
                              {form.totalQuantity}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Grand Total
                            </span>
                            <span className="font-medium text-gray-800">
                              {symbol}
                              {form.grandTotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Rounding Adj
                            </span>
                            <span className="font-medium text-gray-800">
                              {symbol}
                              {form.roundingAdjustment.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="text-base font-semibold text-gray-700">
                              Rounded Total
                            </span>
                            <span className="text-base font-bold text-blue-600">
                              {symbol}
                              {form.roundedTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EMAIL TAB (BLANK) */}
              {activeTab === "email" && (
                <div className="mx-auto bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Email Template
                    </h3>
                    <div className="text-sm text-gray-500">
                      Create professional email templates for supplier
                      communication
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">
                        Name
                      </label>
                      <input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Template name (e.g., RFQ Invitation)"
                        className="px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">
                        Type
                      </label>
                      <select
                        value={templateType}
                        onChange={(e) => setTemplateType(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option>Quote Email</option>
                        <option>Order Confirmation</option>
                        <option>Reminder</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">
                        Subject
                      </label>
                      <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Email subject line"
                        className="px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => exec("bold")}
                        title="Bold"
                        className="px-2 py-1 rounded hover:bg-gray-100 border border-transparent"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => exec("italic")}
                        title="Italic"
                        className="px-2 py-1 rounded hover:bg-gray-100 border border-transparent"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => exec("underline")}
                        title="Underline"
                        className="px-2 py-1 rounded hover:bg-gray-100 border border-transparent"
                      >
                        U
                      </button>
                    </div>

                    <div className="w-px h-6 bg-gray-200 mx-2" />

                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600">
                        Insert token
                      </label>
                      <select
                        onChange={(e) => {
                          if (!e.target.value) return;
                          insertToken(`{{${e.target.value}}}`);
                          e.target.selectedIndex = 0;
                        }}
                        defaultValue=""
                        className="px-2 py-1 border border-gray-200 rounded bg-white text-sm"
                      >
                        <option value="">-- select token --</option>
                        <option value="contact.first_name">
                          contact.first_name
                        </option>
                        <option value="supplier_name">supplier_name</option>
                        <option value="rfq_number">rfq_number</option>
                        <option value="portal_link">portal_link</option>
                      </select>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                      <select
                        onChange={(e) => {
                          if (!e.target.value) return;
                          insertToken(`<br/>${e.target.value}<br/>`);
                          e.target.selectedIndex = 0;
                        }}
                        defaultValue=""
                        className="px-2 py-1 border border-gray-200 rounded bg-white text-sm"
                      >
                        <option value="">Insert signature</option>
                        <option value="Regards,<br/>[Company Name]">
                          Standard
                        </option>
                        <option value="Best regards,<br/>[Procurement Team]">
                          Procurement
                        </option>
                        <option value="Sincerely,<br/>[Your Name]">
                          Sincerely
                        </option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setPreviewOpen(true)}
                        className="px-3 py-1 text-sm rounded border border-gray-200 hover:bg-gray-100"
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {/* Editor */}
                  <div className="border border-t-0 border-gray-200 rounded-b-md bg-white">
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      className="min-h-[240px] p-4 prose max-w-none text-sm text-gray-800 outline-none"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      <p style={{ color: "#6b7280" }}>
                        Start typing your message here. Use tokens to
                        personalize (e.g., {"{{contact.first_name}}"}).
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="mt-4 flex items-start gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={sendAttachedFiles}
                        onChange={(e) => setSendAttachedFiles(e.target.checked)}
                      />
                      <span>Attach files</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={sendPrint}
                        onChange={(e) => setSendPrint(e.target.checked)}
                      />
                      <span>Attach PDF print</span>
                    </label>

                    <div className="ml-auto flex gap-2">
                      <button
                        onClick={resetTemplate}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleSaveTemplate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Save Template
                      </button>
                    </div>
                  </div>

                  {/* Preview modal */}
                  {previewOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
                      <div className="w-full max-w-3xl bg-white rounded shadow-lg overflow-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                          <h4 className="font-semibold text-gray-800">
                            Email Preview
                          </h4>
                          <button
                            onClick={() => setPreviewOpen(false)}
                            className="px-2 py-1 rounded hover:bg-gray-100"
                          >
                            Close
                          </button>
                        </div>
                        <div className="p-6">
                          <div className="text-sm text-gray-600 mb-3">
                            {subject || (
                              <span className="text-gray-400">
                                [No subject]
                              </span>
                            )}
                          </div>
                          <div
                            className="prose max-w-none text-sm text-gray-800"
                            dangerouslySetInnerHTML={{
                              __html: getEditorHtml(),
                            }}
                          />
                          <div className="mt-6 text-xs text-gray-500">
                            Tokens shown as inserted values will be replaced
                            when sending.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAX TAB */}
              {activeTab === "tax" && (
                <div className="space-y-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                    Taxes and Charges
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Tax Category"
                      name="taxCategory"
                      type="text"
                      value={form.taxCategory}
                      onChange={handleForm}
                      placeholder="Enter Tax Category"
                      className="w-full"
                    />
                    <Input
                      label="Shipping Rule"
                      name="shippingRule"
                      type="text"
                      value={form.shippingRule}
                      onChange={handleForm}
                      placeholder="Enter Shipping Rule"
                      className="w-full"
                    />
                    <Input
                      label="Incoterm"
                      name="incoterm"
                      type="text"
                      value={form.incoterm}
                      onChange={handleForm}
                      placeholder="Enter Incoterm"
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-2">
  <Input
    label="Purchase Taxes and Charges Template"
    name="taxesChargesTemplate"
    type="text"
    value={form.taxesChargesTemplate}
    onChange={handleForm}
    placeholder="Enter Template"
    className="w-full"
  />

</div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">
                        Purchase Taxes and Charges
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="px-2 py-2 text-left">#</th>
                            <th className="px-2 py-2 text-left">Type *</th>
                            <th className="px-2 py-2 text-left">
                              Account Head *
                            </th>
                            <th className="px-2 py-2 text-left">Tax Rate</th>
                            <th className="px-2 py-2 text-left">Amount</th>
                            <th className="px-2 py-2 text-right">Total</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {paginatedTaxRows.length === 0 ? (
                            <tr>
                              <td
                                colSpan={7}
                                className="text-center p-6 text-gray-400"
                              >
                                No Data
                              </td>
                            </tr>
                          ) : (
                            paginatedTaxRows.map((row, idx) => {
                              const i = taxPage * taxItemsPerPage + idx;
                              const total = (row.taxRate * row.amount) / 100;
                              return (
                                <tr key={i} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 text-center">
                                    {i + 1}
                                  </td>
                                  <td className="px-1 py-1">
                                    <input
                                      className="w-full rounded border p-1 text-sm"
                                      name="type"
                                      value={row.type}
                                      onChange={(e) =>
                                        handleTaxRowChange(
                                          i,
                                          "type",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-1 py-1">
                                    <input
                                      className="w-full rounded border p-1 text-sm"
                                      name="accountHead"
                                      value={row.accountHead}
                                      onChange={(e) =>
                                        handleTaxRowChange(
                                          i,
                                          "accountHead",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-1 py-1">
                                    <input
                                      type="number"
                                      className="w-full rounded border p-1 text-sm"
                                      name="taxRate"
                                      value={row.taxRate}
                                      onChange={(e) =>
                                        handleTaxRowChange(
                                          i,
                                          "taxRate",
                                          Number(e.target.value)
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-1 py-1">
                                    <input
                                      type="number"
                                      className="w-full rounded border p-1 text-sm"
                                      name="amount"
                                      value={row.amount}
                                      onChange={(e) =>
                                        handleTaxRowChange(
                                          i,
                                          "amount",
                                          Number(e.target.value)
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="px-1 py-1 text-right font-medium">
                                    {total.toFixed(2)}
                                  </td>
                                  <td className="px-1 py-1 text-center">
                                    <button
                                      type="button"
                                      onClick={() => removeTaxRow(i)}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-600">
                        Showing{" "}
                        {taxRows.length === 0
                          ? 0
                          : taxPage * taxItemsPerPage + 1}
                        –
                        {Math.min(
                          (taxPage + 1) * taxItemsPerPage,
                          taxRows.length
                        )}{" "}
                        of {taxRows.length}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setTaxPage(Math.max(0, taxPage - 1))}
                          disabled={taxPage === 0}
                          className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ← Prev
                        </button>
                        <button
                          type="button"
                          onClick={() => setTaxPage(taxPage + 1)}
                          disabled={
                            (taxPage + 1) * taxItemsPerPage >= taxRows.length
                          }
                          className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next →
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addTaxRow}
                      className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200 mt-2"
                    >
                      <Plus className="w-4 h-4" /> Add Row
                    </button>
                  </div>
                </div>
              )}

              {/* ADDRESS TAB */}
              {activeTab === "address" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                      Supplier Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextArea
                        label="Supplier Address"
                        name="supplierAddress"
                        value={form.supplierAddress}
                        onChange={handleForm}
                        rows={2}
                      />
                      <TextArea
                        label="Supplier Contact"
                        name="supplierContact"
                        value={form.supplierContact}
                        onChange={handleForm}
                        rows={2}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                      Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextArea
                        label="Dispatch Address"
                        name="dispatchAddress"
                        value={form.dispatchAddress}
                        onChange={handleForm}
                        rows={2}
                      />
                      <TextArea
                        label="Shipping Address"
                        name="shippingAddress"
                        value={form.shippingAddress}
                        onChange={handleForm}
                        rows={2}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                      Company Billing Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextArea
                        label="Company Billing Address"
                        name="companyBillingAddress"
                        value={form.companyBillingAddress}
                        onChange={handleForm}
                        rows={2}
                      />
                      <TextArea
                        label="Place of Supply"
                        name="placeOfSupply"
                        value={form.placeOfSupply}
                        onChange={handleForm}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

             {/* TERMS TAB */}
              {activeTab === "terms" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                      Payment Terms
                    </h3>
                    <div className="mt-4">
                      <span className="font-medium text-gray-700">
                        Payment Schedule
                      </span>
                      <div className="overflow-x-auto rounded-lg border mt-2">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 text-gray-700">
                            <tr>
                              <th className="px-2 py-2">No.</th>
                              <th className="px-2 py-2">Payment Term</th>
                              <th className="px-2 py-2">Description</th>
                              <th className="px-2 py-2">Due Date *</th>
                              <th className="px-2 py-2">Invoice Portion</th>
                              <th className="px-2 py-2">Payment Amount *</th>
                              <th></th>
                            </tr>
                          </thead>
                         <tbody className="divide-y">
  {paginatedPaymentRows.length === 0 ? (
    <tr>
      <td colSpan={7} className="text-center p-6 text-gray-400">
        No Data
      </td>
    </tr>
  ) : (
    paginatedPaymentRows.map((row, idx) => {
      const i = paymentPage * paymentItemsPerPage + idx;
      return (
        <tr key={i} className="hover:bg-gray-50">
          <td className="px-3 py-2 text-center">{i + 1}</td>
          <td className="px-1 py-1">
            <input className="w-full rounded border p-1 text-sm"
              name="paymentTerm"
              value={row.paymentTerm}
              onChange={(e) => handlePaymentRowChange(i, "paymentTerm", e.target.value)}
            />
          </td>
          <td className="px-1 py-1">
            <input className="w-full rounded border p-1 text-sm"
              name="description"
              value={row.description}
              onChange={(e) => handlePaymentRowChange(i, "description", e.target.value)}
            />
          </td>
          <td className="px-1 py-1">
            <input type="date" className="w-full rounded border p-1 text-sm"
              name="dueDate"
              value={row.dueDate}
              onChange={(e) => handlePaymentRowChange(i, "dueDate", e.target.value)}
            />
          </td>
          <td className="px-1 py-1">
            <input type="number" className="w-full rounded border p-1 text-sm"
              name="invoicePortion"
              value={row.invoicePortion}
              onChange={(e) => handlePaymentRowChange(i, "invoicePortion", Number(e.target.value))}
            />
          </td>
          <td className="px-1 py-1">
            <input type="number" className="w-full rounded border p-1 text-sm"
              name="paymentAmount"
              value={row.paymentAmount}
              onChange={(e) => handlePaymentRowChange(i, "paymentAmount", Number(e.target.value))}
            />
          </td>
          <td className="px-1 py-1 text-center">
            <button type="button" onClick={() => removePaymentRow(i)} className="p-1 text-red-600 hover:bg-red-50 rounded" disabled={paymentRows.length === 1}>
              <Trash2 className="w-4 h-4" />
            </button>
          </td>
        </tr>
      );
    })
  )}
</tbody>

                        </table>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-gray-600">
                          Showing{" "}
                          {paymentRows.length === 0
                            ? 0
                            : paymentPage * paymentItemsPerPage + 1}
                          –
                          {Math.min(
                            (paymentPage + 1) * paymentItemsPerPage,
                            paymentRows.length
                          )}{" "}
                          of {paymentRows.length}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setPaymentPage(Math.max(0, paymentPage - 1))
                            }
                            disabled={paymentPage === 0}
                            className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ← Prev
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentPage(paymentPage + 1)}
                            disabled={
                              (paymentPage + 1) * paymentItemsPerPage >=
                              paymentRows.length
                            }
                            className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next →
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={addPaymentRow}
                        className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200 mt-2"
                      >
                        <Plus className="w-4 h-4" /> Add Row
                      </button>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Terms and Conditions</h3>
              </div>
              <div className="p-6">
                {/* Rich Text Editor Toolbar */}
                <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
                  <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                    <option>Normal</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  
                  <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                    <option>---</option>
                    <option>Arial</option>
                    <option>Times New Roman</option>
                  </select>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  
                  <button className="p-1.5 hover:bg-gray-200 rounded" title="Bold">
                    <strong className="text-sm">B</strong>
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded" title="Italic">
                    <em className="text-sm">I</em>
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded" title="Underline">
                    <u className="text-sm">U</u>
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded" title="Strikethrough">
                    <s className="text-sm">S</s>
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Subscript">
                    T<sub>x</sub>
                  </button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Font Color">
                    A
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Background Color">
                    A̲
                  </button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Quote">
                    "
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Code">
                    {'</>'}
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Bullet Point">
                    •¶
                  </button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Link">
                    🔗
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Image">
                    🖼
                  </button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Bullet List">
                    ≡
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Numbered List">
                    ☰
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Checklist">
                    ☑
                  </button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Align Left">
                    ≡
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Align Center">
                    ≡
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded text-sm" title="Align Right">
                    ≡
                  </button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  
                  <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                    <option>Table</option>
                  </select>
                </div>
                
                {/* Text Area */}
                <textarea
                  value={form.termsAndConditions}
                  onChange={e => setForm(p => ({ ...p, termsAndConditions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={12}
                  placeholder="Enter terms and conditions..."
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
                  Save Purchase Order
                </button>
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
      className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        props.disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
      } ${className}`}
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
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

const TextArea: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}> = ({ label, name, value, onChange, rows = 3 }) => (
  <label className="flex flex-col gap-1 text-sm w-full">
    <span className="font-medium text-gray-600">{label}</span>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
    />
  </label>
);

export default PurchaseOrderModal;
