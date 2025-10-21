import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GoodsReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface ItemRow {
  product: string;
  description: string;
  qtyOrdered: number;
  qtyReceived: number;
  uom: string;
  remarks: string;
}

const emptyItem: ItemRow = {
  product: "",
  description: "",
  qtyOrdered: 0,
  qtyReceived: 0,
  uom: "",
  remarks: "",
};

interface FormData {
  poId: string;
  supplier: string;
  receiptDate: string;
  receivedBy: string;
  documentUrl: string;
  remarks: string;
}

const emptyForm: FormData = {
  poId: "",
  supplier: "",
  receiptDate: "",
  receivedBy: "",
  documentUrl: "",
  remarks: "",
};

const GoodsReceiptModal: React.FC<GoodsReceiptModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [items, setItems] = useState<ItemRow[]>([{ ...emptyItem }]);

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
    const numValue = ["qtyOrdered", "qtyReceived"].includes(name) ? Number(value) : value;
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
    if (onSubmit) onSubmit({ ...form, items });
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setForm(emptyForm);
    setItems([{ ...emptyItem }]);
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
                New Goods Receipt
              </h3>
              <button type="button" className="text-gray-700 hover:bg-[#fefefe] rounded-full w-8 h-8" onClick={onClose}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto border-b">
              {/* RECEIPT INFO */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-4">GOODS RECEIPT INFORMATION</div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <input className="col-span-1 border rounded p-2" placeholder="PO ID" name="poId" value={form.poId} onChange={handleFormChange} required />
                  <input className="col-span-1 border rounded p-2" placeholder="Supplier" name="supplier" value={form.supplier} onChange={handleFormChange} required />
                  <input className="col-span-1 border rounded p-2" type="date" placeholder="Receipt Date" name="receiptDate" value={form.receiptDate} onChange={handleFormChange} required />
                  <input className="col-span-1 border rounded p-2" placeholder="Received By" name="receivedBy" value={form.receivedBy} onChange={handleFormChange} required />
                </div>
                <input className="border rounded p-2 mb-2" placeholder="Document Link (optional)" name="documentUrl" value={form.documentUrl} onChange={handleFormChange} />
                <textarea className="border rounded p-2 w-full" rows={2} placeholder="General Remarks" name="remarks" value={form.remarks} onChange={handleFormChange} />
              </div>
              {/* ITEMS */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">ITEMS RECEIVED</div>
                <div className="overflow-x-auto rounded-md border border-gray-200 bg-white mb-2 py-4">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-800">
                        <th>S.No</th>
                        <th>Product</th>
                        <th>Description</th>
                        <th>Qty Ordered</th>
                        <th>Qty Received</th>
                        <th>UOM</th>
                        <th>Remarks</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((itemRow, idx) => (
                        <tr key={idx}>
                          <td className="text-center">{idx + 1}</td>
                          <td>
                            <input className="border rounded p-1 w-full" placeholder="Product" name="product" value={itemRow.product} onChange={e => handleItemChange(e, idx)} />
                          </td>
                          <td>
                            <input className="border rounded p-1 w-full" placeholder="Description" name="description" value={itemRow.description} onChange={e => handleItemChange(e, idx)} />
                          </td>
                          <td>
                            <input type="number" className="border rounded p-1 w-full" name="qtyOrdered" value={itemRow.qtyOrdered} onChange={e => handleItemChange(e, idx)} />
                          </td>
                          <td>
                            <input type="number" className="border rounded p-1 w-full" name="qtyReceived" value={itemRow.qtyReceived} onChange={e => handleItemChange(e, idx)} />
                          </td>
                          <td>
                            <input className="border rounded p-1 w-full" placeholder="UOM" name="uom" value={itemRow.uom} onChange={e => handleItemChange(e, idx)} />
                          </td>
                          <td>
                            <input className="border rounded p-1 w-full" placeholder="Remarks" name="remarks" value={itemRow.remarks} onChange={e => handleItemChange(e, idx)} />
                          </td>
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

export default GoodsReceiptModal;
