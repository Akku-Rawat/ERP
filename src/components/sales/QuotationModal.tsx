import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  quoteOwner: string;
  subject: string;
  quoteStage: string;
  team: string;
  carrier: string;
  connectedTo: string;
  dealName: string;
  validUntil: string;
  contactName: string;
  accountName: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingCode: string;
  billingCountry: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingCode: string;
  shippingCountry: string;
  totalDiscount: number;
  totalTax: number;
  adjustment: number;
  termsAndConditions: string;
  descriptionInformation: string;
  // Computed fields (not editable directly)
  subTotal: number;
  grandTotal: number;
}

const emptyForm: FormData = {
  quoteOwner: "",
  subject: "",
  quoteStage: "",
  team: "",
  carrier: "",
  connectedTo: "",
  dealName: "",
  validUntil: "",
  contactName: "",
  accountName: "",
  billingStreet: "",
  billingCity: "",
  billingState: "",
  billingCode: "",
  billingCountry: "",
  shippingStreet: "",
  shippingCity: "",
  shippingState: "",
  shippingCode: "",
  shippingCountry: "",
  totalDiscount: 0,
  totalTax: 0,
  adjustment: 0,
  termsAndConditions: "",
  descriptionInformation: "",
  subTotal: 0,
  grandTotal: 0,
};

const QuotationModal: React.FC<QuotationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [items, setItems] = useState<ItemRow[]>([{ ...emptyItem }]);

  // Auto-calculate item amounts, subTotal, and grandTotal whenever items or totals change
  useEffect(() => {
    const newItems = items.map(item => ({
      ...item,
      // Item amount logic: (quantity * listPrice) - discount + tax
      amount: (item.quantity * item.listPrice) - item.discount + item.tax,
    }));

    const subTotal = newItems.reduce((sum, item) => sum + (item.quantity * item.listPrice - item.discount + item.tax), 0);
    const grandTotal = subTotal - form.totalDiscount + form.totalTax + form.adjustment;

    setForm(prev => ({
      ...prev,
      subTotal,
      grandTotal,
    }));
  }, [items, form.totalDiscount, form.totalTax, form.adjustment]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numValue = ['totalDiscount', 'totalTax', 'adjustment'].includes(name) ? Number(value) : value;
    setForm({ ...form, [name]: numValue });
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { name, value } = e.target;
    const numValue = ['quantity', 'listPrice', 'discount', 'tax'].includes(name) ? Number(value) : value;
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
    // Compute final subTotal and grandTotal
    const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.listPrice - item.discount + item.tax), 0);
    const grandTotal = subTotal - form.totalDiscount + form.totalTax + form.adjustment;
    const finalForm = { ...form, subTotal, grandTotal };
    if (onSubmit) onSubmit({ ...finalForm, items });
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
          className="rounded-lg bg-white w-[96vw] max-w-6xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
        >
          <form className="pb-2 bg-[#fefefe]/10 flex flex-col flex-1 overflow-hidden" onSubmit={handleSave}>
            <div className="flex h-12 items-center justify-between border-b px-6 py-3 rounded-t-lg bg-blue-100/30 shrink-0">
              <h3 className="text-2xl w-full font-semibold text-blue-600">
                Create Quotation
              </h3>
              <button type="button" className="text-gray-700 hover:bg-[#fefefe] rounded-full w-8 h-8" onClick={onClose}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto border-b">
              {/* QUOTE INFORMATION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-4">QUOTE INFORMATION</div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <input className="col-span-1 border rounded p-2" placeholder="Quote Owner" name="quoteOwner" value={form.quoteOwner} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Subject" name="subject" value={form.subject} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Quote Stage" name="quoteStage" value={form.quoteStage} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Team" name="team" value={form.team} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Carrier" name="carrier" value={form.carrier} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Connected To" name="connectedTo" value={form.connectedTo} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Deal Name" name="dealName" value={form.dealName} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" type="date" placeholder="Valid Until" name="validUntil" value={form.validUntil} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Contact Name" name="contactName" value={form.contactName} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Account Name" name="accountName" value={form.accountName} onChange={handleFormChange} />
                </div>
              </div>
              {/* ADDRESS INFORMATION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">ADDRESS INFORMATION</div>
                <div className="grid grid-cols-5 gap-4 mb-6">
                  <div className="col-span-5 font-medium text-gray-500 mb-2">Billing Address</div>
                  <input className="col-span-1 border rounded p-2" placeholder="Billing Street" name="billingStreet" value={form.billingStreet} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Billing City" name="billingCity" value={form.billingCity} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Billing State" name="billingState" value={form.billingState} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Billing Code" name="billingCode" value={form.billingCode} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Billing Country" name="billingCountry" value={form.billingCountry} onChange={handleFormChange} />
                  <div className="col-span-5 font-medium text-gray-500 mb-2 mt-4">Shipping Address</div>
                  <input className="col-span-1 border rounded p-2" placeholder="Shipping Street" name="shippingStreet" value={form.shippingStreet} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Shipping City" name="shippingCity" value={form.shippingCity} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Shipping State" name="shippingState" value={form.shippingState} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Shipping Code" name="shippingCode" value={form.shippingCode} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Shipping Country" name="shippingCountry" value={form.shippingCountry} onChange={handleFormChange} />
                </div>
              </div>
              {/* QUOTED ITEMS */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">QUOTED ITEMS</div>
                <div className="overflow-x-auto rounded-md border border-gray-200 bg-white mb-2 py-4">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-800">
                        <th>S.NO</th>
                        <th>PRODUCT NAME</th>
                        <th>DESCRIPTION</th>
                        <th>QUANTITY</th>
                        <th>LIST PRICE ($)</th>
                        <th>AMOUNT ($)</th>
                        <th>DISCOUNT ($)</th>
                        <th>TAX ($)</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((itemRow, idx) => {
                        const itemAmount = (itemRow.quantity * itemRow.listPrice) - itemRow.discount + itemRow.tax;
                        return (
                          <tr key={idx}>
                            <td className="text-center">{idx + 1}</td>
                            <td>
                              <input className="border rounded p-1 w-full" placeholder="Product Name" name="productName" value={itemRow.productName} onChange={e => handleItemChange(e, idx)} />
                            </td>
                            <td>
                              <input className="border rounded p-1 w-full" placeholder="Description" name="description" value={itemRow.description} onChange={e => handleItemChange(e, idx)} />
                            </td>
                            <td>
                              <input type="number" className="border rounded p-1 w-full" name="quantity" value={itemRow.quantity} onChange={e => handleItemChange(e, idx)} />
                            </td>
                            <td>
                              <input type="number" className="border rounded p-1 w-full" name="listPrice" value={itemRow.listPrice} onChange={e => handleItemChange(e, idx)} />
                            </td>
                            <td>
                              <input type="number" className="border rounded p-1 w-full" value={itemAmount} disabled />
                            </td>
                            <td>
                              <input type="number" className="border rounded p-1 w-full" name="discount" value={itemRow.discount} onChange={e => handleItemChange(e, idx)} />
                            </td>
                            <td>
                              <input type="number" className="border rounded p-1 w-full" name="tax" value={itemRow.tax} onChange={e => handleItemChange(e, idx)} />
                            </td>
                            <td>
                              <button type="button" className="bg-red-100 border border-red-300 rounded px-2 py-1" onClick={() => removeItem(idx)}>-</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* <button type="button" className="mt-2 bg-blue-100 border border-blue-300 rounded px-2 py-1" onClick={addItem}>+ Add Item</button> */}
                </div>
                <div>
                  <button type="button" className="mt-2 bg-blue-100 border border-blue-300 rounded px-2 py-1" onClick={addItem}>+ Add Item</button>
                </div>
              </div>
              {/* TOTALS SECTION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">TOTALS SECTION</div>
                <div className="grid grid-cols-5 gap-4 mb-6">
                  <input className="col-span-1 border rounded p-2" placeholder="Sub Total ($)" name="subTotal" value={form.subTotal} onChange={handleFormChange} disabled />
                  <input className="col-span-1 border rounded p-2" type="number" placeholder="Discount ($)" name="totalDiscount" value={form.totalDiscount} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" type="number" placeholder="Tax ($)" name="totalTax" value={form.totalTax} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" type="number" placeholder="Adjustment ($)" name="adjustment" value={form.adjustment} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Grand Total ($)" name="grandTotal" value={form.grandTotal} onChange={handleFormChange} disabled />
                </div>
              </div>
              {/* TERMS AND CONDITIONS & DESCRIPTION INFORMATION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">TERMS AND CONDITIONS</div>
                <textarea className="border rounded p-2 w-full h-24" placeholder="Enter terms and conditions..." name="termsAndConditions" value={form.termsAndConditions} onChange={handleFormChange} />
                <div className="font-semibold text-gray-600 mb-2 mt-4">DESCRIPTION INFORMATION</div>
                <textarea className="border rounded p-2 w-full h-24" placeholder="Enter description information..." name="descriptionInformation" value={form.descriptionInformation} onChange={handleFormChange} />
              </div>
            </div>
            {/* Controls */}
            <div className="m-3 flex items-center justify-between gap-x-7 shrink-0">
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

export default QuotationModal;