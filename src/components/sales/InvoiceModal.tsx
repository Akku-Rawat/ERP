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

  const totalAmount = serviceItems.reduce((acc, itm) => {
    const amount =
      ((100 + Number(itm.serviceTaxRate || 0)) *
        (Number(itm.serviceRate || 0) * Number(itm.serviceQuantity || 0))) /
      100;
    return acc + (isNaN(amount) ? 0 : amount);
  }, 0);

  const handleServiceItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, idx: number) => {
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
      });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="w-full max-w-3xl mx-auto p-0 rounded-lg bg-white shadow-2xl border"
        >
          <form className="w-full" onSubmit={handleSave}>

            {/* HEADER */}
            <div className="flex h-14 items-center justify-between border-b px-6 py-2 bg-blue-50 rounded-t-lg">
              <h3 className="text-2xl font-bold text-blue-700">
                {title}{invoiceNo && ` ${invoiceNo}`}
              </h3>
              <button type="button" className="text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={onClose}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* CONTENT */}
            <div className="max-h-[80vh] overflow-y-auto px-7 py-2 bg-white">

              {/* Invoice Details */}
              <div className="border rounded p-5 mb-5 bg-gray-50">
                <div className="font-semibold text-lg mb-4 text-gray-600">Invoice Details</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-0.5">Customer</label>
                    <input
                      type="text"
                      name="customerName"
                      value={customer.customerName}
                      onChange={e => setCustomer({ ...customer, customerName: e.target.value })}
                      className="w-full rounded-md border px-3 py-2 bg-white focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-0.5">Customer Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={customer.customerEmail}
                      onChange={e => setCustomer({ ...customer, customerEmail: e.target.value })}
                      className="w-full rounded-md border px-3 py-2 bg-white focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-0.5">Billing Address</label>
                    <textarea
                      value={customer.customerBillingAddress}
                      onChange={e => setCustomer({ ...customer, customerBillingAddress: e.target.value })}
                      className="w-full rounded-md border px-3 py-2 bg-white focus:border-blue-500 min-h-[36px]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-0.5">Terms</label>
                    <select
                      name="terms"
                      value={terms}
                      onChange={e => setTerms(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 bg-white focus:border-blue-500"
                    >
                      <option value="">Select</option>
                      {termsList.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-0.5">Invoice Date</label>
                    <input
                      type="date"
                      name="invoiceDate"
                      value={invoiceDate}
                      onChange={e => setInvoiceDate(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 bg-white focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-0.5">Due Date</label>
                    <input
                      type="date"
                      name="invoiceDueDate"
                      value={invoiceDueDate}
                      onChange={e => setInvoiceDueDate(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 bg-white focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-0.5">Customer Currency</label>
                    <input
                      type="text"
                      name="customerCurrency"
                      value={customerCurrency}
                      onChange={e => setCustomerCurrency(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 bg-white focus:border-blue-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-0.5">Conversion Rate To INR</label>
                    <input
                      type="text"
                      value={conversionRate}
                      onChange={e => setConversionRate(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 bg-white focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Add Services */}
              <div className="border rounded p-5 mb-3 bg-gray-50">
                <div className="font-semibold text-lg mb-3 text-gray-600">Add Services</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full rounded-xl">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="py-2 px-2 font-normal text-left text-xs text-gray-500">#</th>
                        <th className="py-2 px-2 font-normal text-left text-xs text-gray-500">Service/Product</th>
                        <th className="py-2 px-2 font-normal text-left text-xs text-gray-500">Description</th>
                        <th className="py-2 px-2 font-normal text-left text-xs text-gray-500">Units</th>
                        <th className="py-2 px-2 font-normal text-left text-xs text-gray-500">Quantity</th>
                        <th className="py-2 px-2 font-normal text-left text-xs text-gray-500">Rate</th>
                        <th className="py-2 px-2 font-normal text-left text-xs text-gray-500">Tax Type</th>
                        <th className="py-2 px-2 font-normal text-left text-xs text-gray-500">Tax Rate (%)</th>
                        <th className="py-2 px-2 font-normal text-left text-xs text-gray-500"></th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800 font-medium">
                      {serviceItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-1 px-2">{idx + 1}</td>
                          <td className="py-1 px-2">
                            <input name="serviceName" value={item.serviceName} onChange={e => handleServiceItemChange(e, idx)}
                              className="border px-2 rounded w-full" />
                          </td>
                          <td className="py-1 px-2">
                            <input name="serviceDescription" value={item.serviceDescription} onChange={e => handleServiceItemChange(e, idx)}
                              className="border px-2 rounded w-full" />
                          </td>
                          <td className="py-1 px-2">
                            <select name="serviceUnitType" value={item.serviceUnitType} onChange={e => handleServiceItemChange(e, idx)}
                              className="border px-2 rounded w-full">
                              <option value="">Select</option>
                              {unitTypeList.map(u => <option value={u} key={u}>{u}</option>)}
                            </select>
                          </td>
                          <td className="py-1 px-2">
                            <input type="number" name="serviceQuantity" value={item.serviceQuantity} onChange={e => handleServiceItemChange(e, idx)}
                              className="border px-2 rounded w-full" />
                          </td>
                          <td className="py-1 px-2">
                            <input type="number" name="serviceRate" value={item.serviceRate} onChange={e => handleServiceItemChange(e, idx)}
                              className="border px-2 rounded w-full" />
                          </td>
                          <td className="py-1 px-2">
                            <select name="serviceTaxType" value={item.serviceTaxType} onChange={e => handleServiceItemChange(e, idx)}
                              className="border px-2 rounded w-full">
                              <option value="">Select</option>
                              {taxTypeList.map(t => <option value={t} key={t}>{t}</option>)}
                            </select>
                          </td>
                          <td className="py-1 px-2">
                            <input type="number" name="serviceTaxRate" value={item.serviceTaxRate} onChange={e => handleServiceItemChange(e, idx)}
                              className="border px-2 rounded w-full" />
                          </td>
                          <td className="py-1 px-2">
                            <button type="button"
                              className="rounded-full bg-red-100 text-red-600 px-3 py-1 hover:bg-red-200"
                              onClick={() => removeServiceItem(idx)}
                              title="Delete"
                            >
                              &times;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <button type="button" onClick={addServiceItem} className="rounded-3xl bg-blue-600 px-4 py-2 text-sm text-white font-semibold hover:bg-blue-700">
                    Add Line
                  </button>
                  <button type="button" onClick={clearAllLines} className="rounded-3xl bg-blue-100 text-blue-900 px-4 py-2 text-sm font-semibold hover:bg-blue-300">
                    Clear Lines
                  </button>
                  <div className="ml-auto font-bold text-base text-gray-700 bg-gray-100 px-4 py-2 rounded">
                    Total {totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-b-lg border-t">
              <button
                type="button"
                className="w-28 rounded-3xl bg-gray-200 px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-300"
                onClick={onClose}
              >
                Cancel
              </button>
              <div className="flex gap-x-2">
                <button
                  type="submit"
                  className="w-28 rounded-3xl bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="w-28 rounded-3xl bg-gray-300 text-gray-700 px-4 py-2 text-base font-medium hover:bg-gray-500 hover:text-white"
                  onClick={() => {
                    setCustomer({ ...emptyCustomer });
                    setTerms("");
                    setInvoiceDate("");
                    setInvoiceDueDate("");
                    setCustomerCurrency("");
                    setConversionRate("");
                    setServiceItems([{ ...emptyItem }]);
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
