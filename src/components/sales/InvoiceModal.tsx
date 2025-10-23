import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";

interface InvoiceModalProps {
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
  invoiceOwner: string;
  subject: string;
  invoiceDate: string;
  dueDate: string;
  salesCommission: number;
  accountName: string;
  contactName: string;
  dealName: string;
  salesOrder: string;
  purchaseOrder: string;
  exciseDuty: number;
  status: string;
  totalDiscount: number;
  totalTax: number;
  adjustment: number;
  termsAndConditions: string;
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
}

const emptyForm: FormData = {
  invoiceOwner: "",
  subject: "",
  invoiceDate: "", // Will be set via useEffect
  dueDate: "",
  salesCommission: 0,
  accountName: "",
  contactName: "",
  dealName: "",
  salesOrder: "",
  purchaseOrder: "",
  exciseDuty: 0,
  status: "Draft",
  totalDiscount: 0,
  totalTax: 0,
  adjustment: 0,
  termsAndConditions: "",
  subTotal: 0,
  grandTotal: 0,
  currency: "",
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

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [items, setItems] = useState<ItemRow[]>([{ ...emptyItem }]);
const [activeTab, setActiveTab] = useState<"details" | "payment" | "address">(
    "details"
  );
  // Set current date on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setForm((p) => ({ ...p, invoiceDate: today }));
  }, []);

  // --- Calculate Totals ---
  useEffect(() => {
    const subTotal = items.reduce((sum, item) => {
      const line = item.quantity * item.listPrice;
      return sum + (line - item.discount + item.tax);
    }, 0);
    const grandTotal = subTotal - form.totalDiscount + form.totalTax + form.adjustment;
    setForm((p) => ({ ...p, subTotal, grandTotal }));
  }, [items, form.totalDiscount, form.totalTax, form.adjustment]);

  // --- Form handlers ---
  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNum = ["salesCommission", "exciseDuty", "totalDiscount", "totalTax", "adjustment"].includes(name);
    setForm((p) => ({ ...p, [name]: isNum ? Number(value) : value }));
  };

  const handleItem = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const { name, value } = e.target;
    const isNum = ["quantity", "listPrice", "discount", "tax"].includes(name);
    const copy = [...items];
    copy[idx] = { ...copy[idx], [name]: isNum ? Number(value) : value };
    setItems(copy);
  };

  // --- Add/Remove/Reset ---
  const addItem = () => setItems((p) => [...p, { ...emptyItem }]);
  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems((p) => p.filter((_, i) => i !== idx));
  };

  const reset = () => {
    const today = new Date().toISOString().split("T")[0];
    setForm({ ...emptyForm, invoiceDate: today });
    setItems([{ ...emptyItem }]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ ...form, items });
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
          <form
            onSubmit={submit}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b">
              <h2 className="text-2xl font-semibold text-blue-700">
                Create Invoice
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
              {(['details', 'payment', 'address'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'details'
                    ? 'Details'
                    : tab === 'payment'
                    ? 'Payment Info'
                    : 'Address & Terms'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <section className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* ====================== DETAILS ====================== */}
              {activeTab === 'details' && (
                <>
                  {/* Invoice Information */}
                  <Card title="Invoice Information">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Input
                        label="Invoice Owner"
                        name="invoiceOwner"
                        value={form.invoiceOwner}
                        onChange={handleForm}
                      />
                      <Input
                        label="Subject *"
                        name="subject"
                        value={form.subject}
                        onChange={handleForm}
                      />
                      <Input
                        label="Invoice Date *"
                        type="date"
                        name="invoiceDate"
                        value={form.invoiceDate}
                        onChange={handleForm}
                        disabled
                      />
                      <Input
                        label="Due Date *"
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleForm}
                      />
                      <Input
                        label="Account Name *"
                        name="accountName"
                        value={form.accountName}
                        onChange={handleForm}
                      />
                      <Select
                        label="Invoice Status"
                        name="status"
                        value={form.status}
                        onChange={handleForm}
                        options={[
                          { value: 'Draft', label: 'Draft' },
                          { value: 'Sent', label: 'Sent' },
                          { value: 'Paid', label: 'Paid' },
                          { value: 'Overdue', label: 'Overdue' },
                        ]}
                      />
                    </div>
                  </Card>

                  {/* Invoiced Items */}
                  <Card title="Invoiced Items">
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="px-2 py-2 text-left">#</th>
                            <th className="px-2 py-2 text-left">Product</th>
                            <th className="px-2 py-2 text-left">Description</th>
                            <th className="px-2 py-2 text-right">Qty</th>
                            <th className="px-2 py-2 text-right">Price $</th>
                            <th className="px-2 py-2 text-right">Amount $</th>
                            <th className="px-2 py-2 text-right">Disc $</th>
                            <th className="px-2 py-2 text-right">Tax $</th>
                            <th className="px-2 py-2 text-right">Total $</th>
                            <th className="w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {items.map((it, i) => {
                            const amount = it.quantity * it.listPrice;
                            const total = amount - it.discount + it.tax;
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
                                <td className="px-1 py-1 text-right">
                                  {amount.toFixed(2)}
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
                                  {total.toFixed(2)}
                                </td>
                                <td className="px-1 py-1 text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(i)}
                                    disabled={items.length === 1}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
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

                      <div className="text-sm">
                        <span className="text-gray-600 mr-2">Sub Total</span>
                        <span className="font-medium">
                          ${form.subTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* ====================== PAYMENT ====================== */}
              {activeTab === 'payment' && (
                <Card title="Payment Information">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Payment Terms"
                      name="paymentTerms"
                      value={form.paymentTerms || ''}
                      onChange={handleForm}
                      placeholder="e.g., Net 30, Due on Receipt"
                    />
                    <Input
                      label="Payment Method"
                      name="paymentMethod"
                      value={form.paymentMethod || ''}
                      onChange={handleForm}
                      placeholder="e.g., Bank Transfer, Credit Card"
                    />
                    <Input
                      label="Bank Name"
                      name="bankName"
                      value={form.bankName || ''}
                      onChange={handleForm}
                    />
                    <Input
                      label="Account Number"
                      name="accountNumber"
                      value={form.accountNumber || ''}
                      onChange={handleForm}
                    />
                    <Input
                      label="Routing Number / IBAN"
                      name="routingNumber"
                      value={form.routingNumber || ''}
                      onChange={handleForm}
                    />
                    <Input
                      label="SWIFT / BIC"
                      name="swiftCode"
                      value={form.swiftCode || ''}
                      onChange={handleForm}
                    />
                  </div>
                </Card>
              )}

              {/* ====================== ADDRESS & TERMS ====================== */}
              {activeTab === 'address' && (
                <div className="flex flex-col gap-6">
                  {/* Billing */}
                  <Card title="Billing Address">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Line 1"
                        name="billingAddressLine1"
                        value={form.billingAddressLine1 ?? ''}
                        onChange={handleForm}
                        placeholder="Street, Apartment"
                      />
                      <Input
                        label="Line 2"
                        name="billingAddressLine2"
                        value={form.billingAddressLine2 ?? ''}
                        onChange={handleForm}
                        placeholder="Landmark, City"
                      />
                      <Input
                        label="Postal Code"
                        name="billingPostalCode"
                        value={form.billingPostalCode ?? ''}
                        onChange={handleForm}
                      />
                      <Input
                        label="City"
                        name="billingCity"
                        value={form.billingCity ?? ''}
                        onChange={handleForm}
                      />
                      <Input
                        label="State"
                        name="billingState"
                        value={form.billingState ?? ''}
                        onChange={handleForm}
                      />
                      <Input
                        label="Country"
                        name="billingCountry"
                        value={form.billingCountry ?? ''}
                        onChange={handleForm}
                      />
                    </div>
                  </Card>

                  {/* Shipping */}
                  <Card title="Shipping Address">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Line 1"
                        name="shippingAddressLine1"
                        value={form.shippingAddressLine1 ?? ''}
                        onChange={handleForm}
                        placeholder="Street, Apartment"
                        disabled={form.sameAsBilling}
                      />
                      <Input
                        label="Line 2"
                        name="shippingAddressLine2"
                        value={form.shippingAddressLine2 ?? ''}
                        onChange={handleForm}
                        placeholder="Landmark, City"
                        disabled={form.sameAsBilling}
                      />
                      <Input
                        label="Postal Code"
                        name="shippingPostalCode"
                        value={form.shippingPostalCode ?? ''}
                        onChange={handleForm}
                        disabled={form.sameAsBilling}
                      />
                      <Input
                        label="City"
                        name="shippingCity"
                        value={form.shippingCity ?? ''}
                        onChange={handleForm}
                        disabled={form.sameAsBilling}
                      />
                      <Input
                        label="State"
                        name="shippingState"
                        value={form.shippingState ?? ''}
                        onChange={handleForm}
                        disabled={form.sameAsBilling}
                      />
                      <Input
                        label="Country"
                        name="shippingCountry"
                        value={form.shippingCountry ?? ''}
                        onChange={handleForm}
                        disabled={form.sameAsBilling}
                      />
                      <div className="col-span-3 flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          name="sameAsBilling"
                          checked={form.sameAsBilling}
                          onChange={handleForm}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-gray-600">
                          Same as billing address
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Terms */}
                  <Card title="Terms and Conditions">
                    <textarea
                      className="w-full rounded border p-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      name="termsAndConditions"
                      value={form.termsAndConditions ?? ''}
                      onChange={handleForm}
                      placeholder="Payment due within 30 days..."
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
                  Save Invoice
                </button>
              </div>
            </footer>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
 
const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="rounded-lg border bg-white p-5 shadow-sm">
    <h3 className="mb-4 text-lg font-semibold text-gray-700">{title}</h3>
    {children}
  </div>
);

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className = '', ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm w-full">
    <span className="font-medium text-gray-600">{label}</span>
    <input
      ref={ref}
      className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        props.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    />
  </label>
));
Input.displayName = 'Input';

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

export default InvoiceModal;