import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface BankAccount {
  accountNumber: string;
  accountHolderName: string;
  sortCode: string;
  swiftCode: string;
  bankName: string;
  branchAddress: string;
  currency: string;
  dateOfAddition: string;
  openingBalance: string;
  isEnabled: boolean;
  financialYearBegins: string;
}

interface Props {
  onClose: () => void;
  onSubmit: (account: BankAccount) => void;
}

const AddBankAccountModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState<BankAccount>({
    accountNumber: "",
    accountHolderName: "",
    sortCode: "",
    swiftCode: "",
    bankName: "",
    branchAddress: "",
    currency: "",
    dateOfAddition: new Date().toISOString().split("T")[0],
    openingBalance: "",
    isEnabled: true,
    financialYearBegins: "April",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setForm((prev) => ({ ...prev, isEnabled: !prev.isEnabled }));
  };

  const handleReset = () => {
    setForm({
      accountNumber: "",
      accountHolderName: "",
      sortCode: "",
      swiftCode: "",
      bankName: "",
      branchAddress: "",
      currency: "",
      dateOfAddition: new Date().toISOString().split("T")[0],
      openingBalance: "",
      isEnabled: true,
      financialYearBegins: "April",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.accountNumber ||
      !form.accountHolderName ||
      !form.bankName ||
      !form.currency
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    onSubmit(form);
    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-[90vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-indigo-50/70 border-b">
              <h2 className="text-2xl font-semibold text-indigo-700">
                Add New Bank Account
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </header>

            {/* Scrollable Content */}
            <section className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Main Fields - 4 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Account Number */}
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">
                    Account No <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleChange}
                    required
                    className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="1234567890"
                  />
                </label>

                {/* Account Holder Name */}
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">
                    Account Holder Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={form.accountHolderName}
                    onChange={handleChange}
                    required
                    className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="John Doe"
                  />
                </label>

                {/* Bank Name */}
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">
                    Bank Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    name="bankName"
                    value={form.bankName}
                    onChange={handleChange}
                    required
                    className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="HDFC Bank"
                  />
                </label>

                {/* Sort Code */}
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">Sort Code</span>
                  <input
                    type="text"
                    name="sortCode"
                    value={form.sortCode}
                    onChange={handleChange}
                    className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="12-34-56"
                  />
                </label>

                {/* SWIFT Code */}
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">SWIFT Code</span>
                  <input
                    type="text"
                    name="swiftCode"
                    value={form.swiftCode}
                    onChange={handleChange}
                    className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="HDFCINBBXXX"
                  />
                </label>

                {/* Currency */}
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">
                    Currency <span className="text-red-500">*</span>
                  </span>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    required
                    className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">Select Currency</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="ZAR">ZAR - South African Rand</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </label>

                {/* Branch Address */}
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">
                    Branch Address
                  </span>
                  <input
                    type="text"
                    name="branchAddress"
                    value={form.branchAddress}
                    onChange={handleChange}
                    className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="123 MG Road, Mumbai"
                  />
                </label>

                {/* Date of Addition */}
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">
                    Date of Addition
                  </span>
                  <input
                    type="date"
                    name="dateOfAddition"
                    value={form.dateOfAddition}
                    onChange={handleChange}
                    className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </label>

                {/* Opening Balance */}
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">
                    Opening Balance
                  </span>
                  <input
                    type="number"
                    name="openingBalance"
                    value={form.openingBalance}
                    onChange={handleChange}
                    step="0.01"
                    className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="0.00"
                  />
                </label>
              </div>
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
                  onClick={handleReset}
                  className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Save Account
                </button>
              </div>
            </footer>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AddBankAccountModal;
