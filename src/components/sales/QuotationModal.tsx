import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";


const customers = [
  { name: "Bloom Brothers Furniture", key: "0011", city: "New York" },
  { name: "Handy Dan", key: "0014", city: "Ville Marie" },
  { name: "Montreal Hotel and Spa", key: "0009", city: "Montreal" },
  { name: "Superior foods ltd", key: "0010", city: "Toronto" },
  { name: "Thompson and sons ltd", key: "0013", city: "Toronto" }
];

function CustomerDropdown({
  value,
  onChange,
  className = ""
}: {
  value: string;
  onChange: (s: string) => void;
  className?: string;
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

  const filtered = customers.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.key.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );
  const selected = customers.find(c => c.name === value);

  return (
    <div ref={ref} className={`relative w-full flex flex-col gap-1 ${className}`}>
      <span className="font-medium text-gray-600 text-sm">Customer Name</span>
      <button
        type="button"
        className="w-full rounded border px-3 py-2 text-left focus:outline-none bg-white"
        onClick={() => setOpen(v => !v)}
      >
        {selected ? selected.name : "Select customer..."}
      </button>
      {open && (
        <div className="absolute left-0 w-full mt-1 bg-white border shadow-lg rounded z-10">
          <input
            className="w-full border-b px-2 py-1"
            autoFocus
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <ul className="max-h-40 overflow-y-auto">
            {filtered.map(c => (
              <li
                key={c.key}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                  c.name === value ? "bg-blue-200 font-bold" : ""
                }`}
                onClick={() => {
                  onChange(c.name);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <div className="flex flex-col">
                  <span>{c.name}</span>
                  <span className="text-xs text-gray-400">Key: {c.key}, City: {c.city}</span>
                </div>
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

// -- QUOTATION MODAL STARTS HERE --
interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface ItemRow {
  productName: string;
  description: string;
  quantity: number;
  listPrice: number;
  discount: number;
  tax: number;
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
};

const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [items, setItems] = useState<ItemRow[]>([{ ...emptyItem }]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const addItem = () => setItems((p) => [...p, { ...emptyItem }]);
  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems((p) => p.filter((_, i) => i !== idx));
  };

  const reset = () => {
    setForm(emptyForm);
    setItems([{ ...emptyItem }]);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-[96vw] max-w-6xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          <form onSubmit={submit} className="flex flex-col h-full overflow-hidden">
            <header className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b">
              <h2 className="text-2xl font-semibold text-blue-700">
                Create Quotation
              </h2>
              <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </header>

            <section className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Quote Information */}
              <Card title="Quote Information">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <CustomerDropdown
                      value={form.CutomerName}
                      onChange={name => setForm(p => ({ ...p, CutomerName: name }))}
                      className="w-full"
                    />
                    <Input
                      label="Quote ID"
                      name="quoteID"
                      value={form.quoteID}
                      onChange={handleForm}
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
                  </div>
                  <div className="grid grid-cols-3 gap-4">
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
              </Card>

              {/* Quoted Items */}
              <Card title="Quoted Items">
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="px-2 py-2 text-left">#</th>
                        <th className="px-2 py-2 text-left">Product</th>
                        <th className="px-2 py-2 text-left">Description</th>
                        <th className="px-2 py-2 text-left">Qty</th>
                        <th className="px-2 py-2 text-left">Unit Price</th>
                        <th className="px-2 py-2 text-left">Amount </th>
                        <th className="px-2 py-2 text-left">Discount</th>
                        <th className="px-2 py-2 text-left">Tax </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((it, i) => {
                        const amount = it.quantity * it.listPrice - it.discount + it.tax;
                        return (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-center">{i + 1}</td>
                            <td className="px-1 py-1"><input className="w-full rounded border p-1 text-sm" name="productName" value={it.productName} onChange={(e) => handleItem(e, i)} /></td>
                            <td className="px-1 py-1"><input className="w-full rounded border p-1 text-sm" name="description" value={it.description} onChange={(e) => handleItem(e, i)} /></td>
                            <td className="px-1 py-1"><input type="number" className="w-full rounded border p-1 text-right text-sm" name="quantity" value={it.quantity} onChange={(e) => handleItem(e, i)} /></td>
                            <td className="px-1 py-1"><input type="number" className="w-full rounded border p-1 text-right text-sm" name="listPrice" value={it.listPrice} onChange={(e) => handleItem(e, i)} /></td>
                            <td className="px-1 py-1 text-right font-medium">{amount.toFixed(2)}</td>
                            <td className="px-1 py-1"><input type="number" className="w-full rounded border p-1 text-right text-sm" name="discount" value={it.discount} onChange={(e) => handleItem(e, i)} /></td>
                            <td className="px-1 py-1"><input type="number" className="w-full rounded border p-1 text-right text-sm" name="tax" value={it.tax} onChange={(e) => handleItem(e, i)} /></td>
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
                <button type="button" onClick={addItem} className="mt-3 flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card title="Terms & Conditions">
                  <textarea
                    className="w-full rounded border p-3 text-sm h-48 resize-none"
                    name="termsAndConditions"
                    value={form.termsAndConditions}
                    onChange={handleForm}
                    placeholder="Enter terms and conditions..."
                  />
                </Card>
                <Card title="Summary">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sub Total</span>
                      <span className="font-medium">${form.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Discount</span>
                      <span className="font-medium text-red-600">-${form.totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Tax</span>
                      <span className="font-medium text-green-600">+${form.totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adjustment</span>
                      <span className="font-medium">${form.adjustment.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-base font-bold">
                        <span>Grand Total</span>
                        <span className="text-blue-600">${form.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            <footer className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
              <button type="button" onClick={onClose} className="rounded-full bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
                Cancel
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={reset} className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400">
                  Reset
                </button>
                <button type="submit" className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600">
                  Save
                </button>
              </div>
            </footer>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};


const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-lg border bg-white p-5 shadow-sm">
    <h3 className="mb-4 text-lg font-semibold text-gray-700">{title}</h3>
    {children}
  </div>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string }>(
  ({ label, className = "", ...props }, ref) => (
    <label className="flex flex-col gap-1 text-sm w-full">
      <span className="font-medium text-gray-600">{label}</span>
      <input
        ref={ref}
        className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className} ${props.disabled ? "bg-gray-50" : ""}`}
        {...props}
      />
    </label>
  )
);
Input.displayName = "Input";

export default QuotationModal;
