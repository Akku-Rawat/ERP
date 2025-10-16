import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  invoiceNo?: string;
  title?: string;
}

const termsList = ["Due on receipt", "Net 15", "Net 30", "Net 60"];
const taxTypeList = ["VAT", "GST"];
const unitTypeList = ["Fixed", "Numbers", "Hours", "Days", "Weeks", "Months"];

interface CustomerData {
  customerBillingAddress: string;
  customerEmail: string;
  customerId: string;
  customerName: string;
}
interface ServiceItem {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  serviceQuantity: string;
  serviceRate: string;
  serviceUnitType: string;
  serviceTaxType: string;
  serviceTaxRate: string;
  rateINR?: string;
}
const emptyCustomer: CustomerData = {
  customerBillingAddress: "",
  customerEmail: "",
  customerId: "",
  customerName: "",
};
const emptyItem: ServiceItem = {
  serviceId: "",
  serviceName: "",
  serviceDescription: "",
  serviceQuantity: "",
  serviceRate: "",
  serviceUnitType: "",
  serviceTaxType: "",
  serviceTaxRate: "",
  rateINR: "1",
};

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  invoiceNo = "",
  title = "Invoice"
}) => {
  const [customer, setCustomer] = useState<CustomerData>({ ...emptyCustomer });
  const [terms, setTerms] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [customerCurrency, setCustomerCurrency] = useState("");
  const [conversionRate, setConversionRate] = useState("");
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([{ ...emptyItem }]);
  const [memo, setMemo] = useState("");

  // Calculation logic for amounts
  const totalAmount = serviceItems.reduce((acc, itm) => {
    const quantity = Number(itm.serviceQuantity) || 0;
    const rate = Number(itm.serviceRate) || 0;
    const taxRate = Number(itm.serviceTaxRate) || 0;
    const rateInr = Number(itm.rateINR) || 1;
    const taxableAmount = quantity * rate;
    const taxAmount = taxableAmount * (taxRate / 100);
    const netAmount = taxableAmount + taxAmount;
    return acc + (isNaN(netAmount) ? 0 : netAmount * rateInr);
  }, 0);

  // service table handlers
  const handleServiceItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    idx: number
  ) => {
    const copy = [...serviceItems];
    copy[idx] = { ...copy[idx], [e.target.name]: e.target.value };
    setServiceItems(copy);
  };

  const addServiceItem = () => setServiceItems([...serviceItems, { ...emptyItem }]);
  const clearAllLines = () => setServiceItems([{ ...emptyItem }]);
  const removeServiceItem = (idx: number) => {
    if (serviceItems.length === 1) return;
    setServiceItems(serviceItems.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave)
      onSave({
        customer,
        terms,
        invoiceDate,
        invoiceDueDate,
        customerCurrency,
        conversionRate,
        serviceItems,
        memo,
      });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="w-full max-w-6xl mx-auto my-8 rounded-lg bg-white shadow-2xl border"
        >
          <form autoComplete="off" onSubmit={handleSave}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-blue-50 rounded-t-lg border-b">
              <h3 className="text-lg font-bold text-blue-700">
                {title}{invoiceNo && ` ${invoiceNo}`}
              </h3>
              <button
                type="button"
                className="text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={onClose}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[90vh] px-8 py-6">
              {/* Section: Invoice Details */}
              <div className="mb-7 border rounded-lg bg-white">
                <div className="font-semibold text-base px-6 pt-6 pb-2 text-gray-700">
                  Invoice Details
                </div>
                <div className="grid grid-cols-3 gap-5 px-6 pb-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Customer</label>
                    <input
                      type="text"
                      name="customerName"
                      value={customer.customerName}
                      onChange={e =>
                        setCustomer({ ...customer, customerName: e.target.value })
                      }
                      className="w-full rounded border px-3 py-2 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Customer Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={customer.customerEmail}
                      onChange={e =>
                        setCustomer({ ...customer, customerEmail: e.target.value })
                      }
                      className="w-full rounded border px-3 py-2 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Billing Address</label>
                    <textarea
                      value={customer.customerBillingAddress}
                      onChange={e =>
                        setCustomer({ ...customer, customerBillingAddress: e.target.value })
                      }
                      className="w-full rounded border px-3 py-2 bg-white text-sm min-h-[36px]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Terms</label>
                    <select
                      name="terms"
                      value={terms}
                      onChange={e => setTerms(e.target.value)}
                      className="w-full rounded border px-3 py-2 bg-white text-sm"
                    >
                      <option value="">Select</option>
                      {termsList.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Invoice Date</label>
                    <input
                      type="date"
                      name="invoiceDate"
                      value={invoiceDate}
                      onChange={e => setInvoiceDate(e.target.value)}
                      className="w-full rounded border px-3 py-2 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Due Date</label>
                    <input
                      type="date"
                      name="invoiceDueDate"
                      value={invoiceDueDate}
                      onChange={e => setInvoiceDueDate(e.target.value)}
                      className="w-full rounded border px-3 py-2 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Customer Currency</label>
                    <input
                      type="text"
                      name="customerCurrency"
                      value={customerCurrency}
                      onChange={e => setCustomerCurrency(e.target.value)}
                      className="w-full rounded border px-3 py-2 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Conversion Rate To INR</label>
                    <input
                      type="number"
                      value={conversionRate}
                      onChange={e => setConversionRate(e.target.value)}
                      className="w-full rounded border px-3 py-2 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>
              {/* Section: Add Services */}
              <div className="mb-7 border rounded-lg bg-white">
                <div className="font-semibold text-base px-6 pt-6 pb-2 text-gray-700">
                  Add Services
                </div>
                <div className="overflow-x-auto px-6 pb-6">
                  <table className="min-w-full rounded-md">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">#</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Service/Product</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Description</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Units</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Quantity</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Rate</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Rate INR</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Taxable Amount</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Taxable Amount INR</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Tax Type</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Tax Rate (%)</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Tax Amount INR</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Net Amount</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium">Net Amount INR</th>
                        <th className="py-2 px-2"/>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 text-xs font-medium">
                      {serviceItems.map((item, idx) => {
                        const quantity = Number(item.serviceQuantity) || 0;
                        const rate = Number(item.serviceRate) || 0;
                        const taxRate = Number(item.serviceTaxRate) || 0;
                        const rateInr = Number(item.rateINR) || 1;
                        const taxableAmount = quantity * rate;
                        const taxableAmountInr = taxableAmount * rateInr;
                        const taxAmount = taxableAmount * (taxRate / 100);
                        const taxAmountInr = taxAmount * rateInr;
                        const netAmount = taxableAmount + taxAmount;
                        const netAmountInr = netAmount * rateInr;
                        return (
                          <tr key={idx}>
                            <td className="py-1 px-2">{idx + 1}</td>
                            <td className="py-1 px-2">
                              <input name="serviceName" value={item.serviceName}
                                onChange={e => handleServiceItemChange(e, idx)}
                                className="border px-2 rounded w-full text-xs" />
                            </td>
                            <td className="py-1 px-2">
                              <input name="serviceDescription" value={item.serviceDescription}
                                onChange={e => handleServiceItemChange(e, idx)}
                                className="border px-2 rounded w-full text-xs" />
                            </td>
                            <td className="py-1 px-2">
                              <select name="serviceUnitType" value={item.serviceUnitType}
                                onChange={e => handleServiceItemChange(e, idx)}
                                className="border px-2 rounded w-full text-xs">
                                <option value="">Unit</option>
                                {unitTypeList.map(u => <option value={u} key={u}>{u}</option>)}
                              </select>
                            </td>
                            <td className="py-1 px-2">
                              <input type="number" name="serviceQuantity" value={item.serviceQuantity}
                                onChange={e => handleServiceItemChange(e, idx)}
                                className="border px-2 rounded w-full text-xs" placeholder="qty" />
                            </td>
                            <td className="py-1 px-2">
                              <input type="number" name="serviceRate" value={item.serviceRate}
                                onChange={e => handleServiceItemChange(e, idx)}
                                className="border px-2 rounded w-full text-xs" placeholder="Rate" />
                            </td>
                            <td className="py-1 px-2">
                              <input type="number" name="rateINR" value={item.rateINR || "1"}
                                onChange={e => handleServiceItemChange(e, idx)}
                                className="border px-2 rounded w-full text-xs" />
                            </td>
                            <td className="py-1 px-2">
                              {taxableAmount.toFixed(2)}
                            </td>
                            <td className="py-1 px-2">
                              {taxableAmountInr.toFixed(2)}
                            </td>
                            <td className="py-1 px-2">
                              <select name="serviceTaxType" value={item.serviceTaxType}
                                onChange={e => handleServiceItemChange(e, idx)}
                                className="border px-2 rounded w-full text-xs">
                                <option value="">Type</option>
                                {taxTypeList.map(t => <option value={t} key={t}>{t}</option>)}
                              </select>
                            </td>
                            <td className="py-1 px-2">
                              <input type="number" name="serviceTaxRate" value={item.serviceTaxRate}
                                onChange={e => handleServiceItemChange(e, idx)}
                                className="border px-2 rounded w-full text-xs" />
                            </td>
                            <td className="py-1 px-2">
                              {taxAmountInr.toFixed(2)}
                            </td>
                            <td className="py-1 px-2">
                              {isNaN(netAmount) ? "" : netAmount.toFixed(2)}
                            </td>
                            <td className="py-1 px-2">
                              {isNaN(netAmountInr) ? "" : netAmountInr.toFixed(2)}
                            </td>
                            <td className="py-1 px-2">
                              <button type="button"
                                className="rounded-full bg-red-100 text-red-600 px-2 py-1 hover:bg-red-200"
                                onClick={() => removeServiceItem(idx)}
                                title="Delete"
                              >&times;</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center gap-2 px-6 pb-6">
                  <button
                    type="button"
                    onClick={addServiceItem}
                    className="rounded-md bg-blue-600 px-4 py-1.5 text-sm text-white font-semibold hover:bg-blue-700"
                  >
                    Add Lines
                  </button>
                  <button
                    type="button"
                    onClick={clearAllLines}
                    className="rounded-md bg-blue-100 text-blue-900 px-4 py-1.5 text-sm font-semibold hover:bg-blue-300"
                  >
                    Clear Lines
                  </button>
                  <div className="ml-auto font-bold text-base text-gray-700 bg-gray-100 px-5 py-2 rounded">
                    Total {totalAmount.toFixed(2)}<br />
                    In INR {totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
              {/* Section: Notes */}
              <div className="mb-2 border rounded-lg bg-white">
                <div className="font-semibold text-base px-6 pt-6 pb-2 text-gray-700">
                  Notes
                </div>
                <div className="px-6 pb-6">
                  <label className="block text-gray-400 text-sm mb-1">Memo</label>
                  <textarea
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                    className="w-full min-h-[48px] rounded border px-3 py-2 bg-white text-sm"
                    placeholder="Write memo here"
                  />
                </div>
              </div>
            </div>
            {/* Footer Buttons */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-100 rounded-b-lg border-t">
              <button
                type="button"
                className="rounded-md bg-gray-300 px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-400"
                onClick={onClose}
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-5 py-2 text-base font-medium text-white hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="rounded-md bg-blue-500 px-5 py-2 text-base font-medium text-white hover:bg-blue-600"
                  // add draft handler if needed
                  onClick={() => {/* draft logic */}}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="rounded-md bg-gray-300 px-5 py-2 text-base font-medium text-gray-700 hover:bg-gray-400"
                  onClick={() => {
                    setCustomer({ ...emptyCustomer });
                    setTerms("");
                    setInvoiceDate("");
                    setInvoiceDueDate("");
                    setCustomerCurrency("");
                    setConversionRate("");
                    setServiceItems([{ ...emptyItem }]);
                    setMemo("");
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

export default InvoiceModal;