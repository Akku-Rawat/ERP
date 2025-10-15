import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface ItemRow {
  description: string;
  sku: string;
  quantity: number;
  uom: string;
  price: number;
  amount: number;
  gst: number;
}

const emptyItem: ItemRow = {
  description: "",
  sku: "",
  quantity: 0,
  uom: "",
  price: 0,
  amount: 0,
  gst: 0,
};

const QuotationModal: React.FC<QuotationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    number: "",
    tag: "",
    dateTime: "",
    description: "",
    opportunity: "",
    opportunityStage: "",
    forecast: "",
    followUpDate: "",
    customer: "",
    key: "",
    taxLocation: "",
    priceTier: "",
    paymentTerms: "",
    shipTo: "",
    addresses: ["", "", "", "", ""],
  });

  const [items, setItems] = useState<ItemRow[]>([{ ...emptyItem }]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    key?: string,
    idx?: number
  ) => {
    if (key === "addresses" && typeof idx === "number") {
      const addresses = [...form.addresses];
      addresses[idx] = e.target.value;
      setForm({ ...form, addresses });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    idx: number
  ) => {
    const rows = [...items];
    const name = e.target.name;
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    rows[idx] = { ...rows[idx], [name]: value };
    setItems(rows);
  };

  const addItem = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ ...form, items });
    onClose();
    setForm({
      number: "",
      tag: "",
      dateTime: "",
      description: "",
      opportunity: "",
      opportunityStage: "",
      forecast: "",
      followUpDate: "",
      customer: "",
      key: "",
      taxLocation: "",
      priceTier: "",
      paymentTerms: "",
      shipTo: "",
      addresses: ["", "", "", "", ""],
    });
    setItems([{ ...emptyItem }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 shadow-3xl">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="rounded-lg bg-white mt-10 w-[96vw] max-w-6xl shadow-lg"
        >
          <form className="pb-2 bg-[#fefefe]/10" onSubmit={handleSave}>
            <div className="flex h-12 items-center justify-between border-b px-6 py-7 rounded-t-lg bg-blue-100/30">
              <h3 className="text-2xl w-full font-semibold text-blue-600">
                Create Quotation
              </h3>
              <button type="button" className="text-gray-700 hover:bg-[#fefefe] rounded-full w-8 h-8" onClick={onClose}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="overflow-y-auto h-[82vh] border-b">
              {/* DOCUMENT HEADER */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-4">DOCUMENT HEADER</div>
                <div className="grid grid-cols-8 gap-4 mb-6">
                  <input className="col-span-1 border rounded p-2" placeholder="Number" name="number" value={form.number} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Tag" name="tag" value={form.tag} onChange={handleFormChange} />
                  <input className="col-span-2 border rounded p-2" type="datetime-local" name="dateTime" value={form.dateTime} onChange={handleFormChange} />
                  <input className="col-span-2 border rounded p-2" type="datetime-local" name="followUpDate" value={form.followUpDate} onChange={handleFormChange} />
                  <input className="col-span-2 border rounded p-2" placeholder="Description" name="description" value={form.description} onChange={handleFormChange} />
                  <input className="col-span-2 border rounded p-2" placeholder="Opportunity stage" name="opportunityStage" value={form.opportunityStage} onChange={handleFormChange} />
                  <input className="col-span-2 border rounded p-2" placeholder="Forecast" name="forecast" value={form.forecast} onChange={handleFormChange} />
                </div>
              </div>
              {/* CUSTOMER SECTION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">CUSTOMER</div>
                <div className="grid grid-cols-6 gap-4 mb-6">
                  <input className="col-span-1 border rounded p-2" placeholder="Type to search..." name="customer" value={form.customer} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Key" name="key" value={form.key} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Tax location" name="taxLocation" value={form.taxLocation} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Price tier" name="priceTier" value={form.priceTier} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Terms of payment" name="paymentTerms" value={form.paymentTerms} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Ship to" name="shipTo" value={form.shipTo} onChange={handleFormChange} />
                </div>
              </div>
              {/* BILLING ADDRESS SECTION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">BILLING ADDRESS</div>
                <div className="grid grid-cols-5 gap-4 mb-6">
                  {form.addresses.map((val, idx) => (
                    <input key={idx} className="col-span-1 border rounded p-2" placeholder={["Address", "Address", "City", "ZIP Code", "Country"][idx]} value={val} onChange={e => handleFormChange(e, "addresses", idx)} />
                  ))}
                </div>
              </div>
              {/* ITEMS SECTION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">ITEMS</div>
                <div className="overflow-x-auto rounded-md border border-gray-200 bg-white mb-2">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-800">
                        <th></th>
                        <th>DESCRIPTION</th>
                        <th>SKU</th>
                        <th>QUANTITY</th>
                        <th>UOM</th>
                        <th>PRICE</th>
                        <th>AMOUNT</th>
                        <th>GST (%)</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((itemRow, idx) => (
                        <tr key={idx}>
                          <td>
                            <button type="button" className="bg-blue-100 border border-blue-300 rounded px-2 py-1" onClick={addItem}>+</button>
                          </td>
                          <td>
                            <input className="border rounded p-1 w-full" placeholder="Type to search..." name="description" value={itemRow.description} onChange={e => handleItemChange(e, idx)} />
                          </td>
                          <td>
                            <input className="border rounded p-1 w-full" placeholder="SKU" name="sku" value={itemRow.sku} onChange={e => handleItemChange(e, idx)} />
                          </td>
                          <td>
                            <input type="number" className="border rounded p-1 w-full" name="quantity" value={itemRow.quantity} onChange={e => handleItemChange(e, idx)} />
                          </td>
                          <td>
                            <input className="border rounded p-1 w-full" placeholder="UOM" name="uom" value={itemRow.uom} onChange={e => handleItemChange(e, idx)} />
                          </td>
                          <td>
                            <input type="number" className="border rounded p-1 w-full" name="price" value={itemRow.price} onChange={e => handleItemChange(e, idx)} />
                          </td>
                          <td>
                            <input type="number" className="border rounded p-1 w-full" name="amount" value={itemRow.quantity * itemRow.price} disabled />
                          </td>
                          <td>
                            <input type="number" className="border rounded p-1 w-full" name="gst" value={itemRow.gst} onChange={e => handleItemChange(e, idx)} />
                          </td>
                          <td>
                            <button type="button" className="bg-red-100 border border-red-300 rounded px-2 py-1" onClick={() => removeItem(idx)}>-</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Controls */}
            <div className="m-3 flex items-center justify-between gap-x-7">
              <button type="button"
                className="w-24 rounded-3xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                onClick={onClose}
              >
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
                  onClick={() => {
                    setForm({
                      ...form,
                      number: "",
                      tag: "",
                      dateTime: "",
                      description: "",
                      opportunity: "",
                      opportunityStage: "",
                      forecast: "",
                      followUpDate: "",
                      customer: "",
                      key: "",
                      taxLocation: "",
                      priceTier: "",
                      paymentTerms: "",
                      shipTo: "",
                      addresses: ["", "", "", "", ""],
                    });
                    setItems([{ ...emptyItem }]);
                  }}
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

export default QuotationModal;
