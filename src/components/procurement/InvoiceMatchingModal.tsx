import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InvoiceMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface ItemRow {
  product: string;
  poQty: number;
  receivedQty: number;
  invoiceQty: number;
  price: number;
  uom: string;
}

const emptyItem: ItemRow = {
  product: "",
  poQty: 0,
  receivedQty: 0,
  invoiceQty: 0,
  price: 0,
  uom: "",
};

interface FormData {
  invoiceId: string;
  supplier: string;
  invoiceDate: string;
  poId: string;
  grId: string;
  remarks: string;
}

const emptyForm: FormData = {
  invoiceId: "",
  supplier: "",
  invoiceDate: "",
  poId: "",
  grId: "",
  remarks: "",
};

const InvoiceMatchingModal: React.FC<InvoiceMatchingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [items, setItems] = useState<ItemRow[]>([{ ...emptyItem }]);
  const [status, setStatus] = useState<"Matched" | "Mismatch" | "Pending">("Pending");

  // Amounts for display
  const invoiceTotal = items.reduce((sum, row) => sum + row.invoiceQty * row.price, 0);
  const receivedTotal = items.reduce((sum, row) => sum + row.receivedQty * row.price, 0);
  const poTotal = items.reduce((sum, row) => sum + row.poQty * row.price, 0);

  // Update status live
  React.useEffect(() => {
    if (items.some(row => row.invoiceQty !== row.receivedQty || row.receivedQty !== row.poQty)) {
      setStatus("Mismatch");
    } else if (items.every(row => row.invoiceQty === row.receivedQty && row.poQty === row.receivedQty && row.receivedQty > 0)) {
      setStatus("Matched");
    } else {
      setStatus("Pending");
    }
  }, [items]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { name, value } = e.target;
    const numValue = ["poQty", "receivedQty", "invoiceQty", "price"].includes(name) ? Number(value) : value;
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [name]: numValue };
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ ...form, status, items, invoiceTotal, poTotal, receivedTotal });
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setForm(emptyForm);
    setItems([{ ...emptyItem }]);
    setStatus("Pending");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="rounded-lg bg-white w-[96vw] max-w-4xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
        >
          <form className="pb-2 bg-[#fefefe]/10 flex flex-col flex-1 overflow-hidden" onSubmit={handleSave}>
            {/* Modal Bar */}
            <div className="flex h-12 items-center justify-between border-b px-6 py-3 rounded-t-lg bg-blue-100/30 shrink-0">
              <h3 className="text-2xl w-full font-semibold text-blue-600">
                New Invoice Matching
              </h3>
              <button type="button" className="text-gray-700 hover:bg-[#fefefe] rounded-full w-8 h-8" onClick={onClose}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto border-b">
              {/* INVOICE MATCH INFO */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-4">BASIC INFORMATION</div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <input className="col-span-1 border rounded p-2" placeholder="Invoice ID" name="invoiceId" value={form.invoiceId} onChange={handleFormChange} required />
                  <input className="col-span-1 border rounded p-2" placeholder="Supplier" name="supplier" value={form.supplier} onChange={handleFormChange} required />
                  <input className="col-span-1 border rounded p-2" type="date" placeholder="Invoice Date" name="invoiceDate" value={form.invoiceDate} onChange={handleFormChange} required />
                  <input className="col-span-1 border rounded p-2" placeholder="PO ID" name="poId" value={form.poId} onChange={handleFormChange} required />
                  <input className="col-span-1 border rounded p-2" placeholder="Goods Receipt ID" name="grId" value={form.grId} onChange={handleFormChange} required />
                </div>
                <textarea className="border rounded p-2 w-full" rows={2} placeholder="Remarks" name="remarks" value={form.remarks} onChange={handleFormChange} />
              </div>

              {/* ITEMS MATCHING */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">ITEM MATCHING</div>
                <div className="overflow-x-auto rounded-md border border-gray-200 bg-white mb-2 py-4">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-800">
                        <th>S.No</th>
                        <th>Product</th>
                        <th>UOM</th>
                        <th>PO Qty</th>
                        <th>Received Qty</th>
                        <th>Invoiced Qty</th>
                        <th>Unit Price</th>
                        <th>PO Value</th>
                        <th>Received Value</th>
                        <th>Invoice Value</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="text-center">{idx + 1}</td>
                          <td><input className="border rounded p-1 w-full" placeholder="Product" name="product" value={item.product} onChange={e => handleItemChange(e, idx)} /></td>
                          <td><input className="border rounded p-1 w-full" placeholder="UOM" name="uom" value={item.uom} onChange={e => handleItemChange(e, idx)} /></td>
                          <td><input type="number" className="border rounded p-1 w-full" name="poQty" value={item.poQty} onChange={e => handleItemChange(e, idx)} /></td>
                          <td><input type="number" className="border rounded p-1 w-full" name="receivedQty" value={item.receivedQty} onChange={e => handleItemChange(e, idx)} /></td>
                          <td><input type="number" className="border rounded p-1 w-full" name="invoiceQty" value={item.invoiceQty} onChange={e => handleItemChange(e, idx)} /></td>
                          <td><input type="number" className="border rounded p-1 w-full" name="price" value={item.price} onChange={e => handleItemChange(e, idx)} /></td>
                          <td className="text-right">{(item.poQty * item.price).toLocaleString()}</td>
                          <td className="text-right">{(item.receivedQty * item.price).toLocaleString()}</td>
                          <td className="text-right">{(item.invoiceQty * item.price).toLocaleString()}</td>
                          <td>
                            <button type="button" className="bg-red-100 border border-red-300 rounded px-2 py-1" onClick={() => removeItem(idx)}>-</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <button type="button" className="mt-2 bg-blue-100 border border-blue-300 rounded px-2 py-1" onClick={addItem}>
                    + Add Item
                  </button>
                </div>
              </div>

              {/* MATCH SUMMARY */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">MATCH SUMMARY</div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded p-3 flex flex-col">
                    <span className="text-xs text-gray-600">PO Total</span>
                    <span className="text-lg font-bold">&#8377; {poTotal.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 rounded p-3 flex flex-col">
                    <span className="text-xs text-gray-600">Received Total</span>
                    <span className="text-lg font-bold">&#8377; {receivedTotal.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 rounded p-3 flex flex-col">
                    <span className="text-xs text-gray-600">Invoiced Total</span>
                    <span className="text-lg font-bold">&#8377; {invoiceTotal.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 rounded p-3 flex flex-col">
                    <span className="text-xs text-gray-600">Match Status</span>
                    <span className={`text-lg font-bold ${
                      status === "Matched" ? "text-green-600" : status === "Mismatch" ? "text-red-500" : "text-yellow-500"
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Controls */}
            <div className="m-3 flex items-center justify-between gap-x-7 shrink-0">
              <button type="button"
                className="w-24 rounded-3xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                onClick={onClose}>
                Cancel
              </button>
              <div className="flex gap-x-2">
                <button
                  type="submit"
                  className="w-24 rounded-3xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="w-24 rounded-3xl bg-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-500 hover:text-white"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InvoiceMatchingModal;
