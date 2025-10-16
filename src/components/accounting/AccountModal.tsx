import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface FormData {
  accountOwner: string;
  accountName: string;
  accountSite: string;
  parentAccount: string;
  accountNumber: string;
  accountType: string;
  industry: string;
  annualRevenue: number;
  rating: string;
  phone: string;
  fax: string;
  website: string;
  tickerSymbol: string;
  ownership: string;
  employees: number;
  sicCode: string;
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
}

const emptyForm: FormData = {
  accountOwner: "",
  accountName: "",
  accountSite: "",
  parentAccount: "",
  accountNumber: "",
  accountType: "",
  industry: "",
  annualRevenue: 0,
  rating: "",
  phone: "",
  fax: "",
  website: "",
  tickerSymbol: "",
  ownership: "",
  employees: 0,
  sicCode: "",
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
};

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<FormData>(emptyForm);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numValue = ['annualRevenue', 'employees'].includes(name) ? Number(value) : value;
    setForm({ ...form, [name]: numValue });
  };

  const copyAddress = () => {
    setForm(prev => ({
      ...prev,
      shippingStreet: prev.billingStreet,
      shippingCity: prev.billingCity,
      shippingState: prev.billingState,
      shippingCode: prev.billingCode,
      shippingCountry: prev.billingCountry,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setForm(emptyForm);
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
                Create Account
              </h3>
              <button type="button" className="text-gray-700 hover:bg-[#fefefe] rounded-full w-8 h-8" onClick={onClose}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto border-b">
              {/* ACCOUNT INFORMATION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-4">ACCOUNT INFORMATION</div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <input className="col-span-1 border rounded p-2" placeholder="Account Owner" name="accountOwner" value={form.accountOwner} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Account Name" name="accountName" value={form.accountName} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Account Site" name="accountSite" value={form.accountSite} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Parent Account" name="parentAccount" value={form.parentAccount} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Account Number" name="accountNumber" value={form.accountNumber} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Account Type" name="accountType" value={form.accountType} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Industry" name="industry" value={form.industry} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" type="number" placeholder="Annual Revenue" name="annualRevenue" value={form.annualRevenue} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Rating" name="rating" value={form.rating} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Phone" name="phone" value={form.phone} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Fax" name="fax" value={form.fax} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Website" name="website" value={form.website} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Ticker Symbol" name="tickerSymbol" value={form.tickerSymbol} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="Ownership" name="ownership" value={form.ownership} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" type="number" placeholder="Employees" name="employees" value={form.employees} onChange={handleFormChange} />
                  <input className="col-span-1 border rounded p-2" placeholder="SIC Code" name="sicCode" value={form.sicCode} onChange={handleFormChange} />
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
                  <div className="col-span-5 mt-2">
                    <button type="button" className="bg-blue-100 text-blue-700 px-4 py-2 rounded" onClick={copyAddress}>Copy Address</button>
                  </div>
                </div>
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

export default AccountModal;