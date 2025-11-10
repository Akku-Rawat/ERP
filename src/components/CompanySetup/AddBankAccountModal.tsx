import React, { useState } from "react";

interface BankAccount {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  currency: string;
  swiftCode: string;
}

interface Props {
  onClose: () => void;
  onSubmit: (account: BankAccount) => void;
}

const AddBankAccountModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState<BankAccount>({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    currency: "",
    swiftCode: "",
  });

  const handleChange = (field: keyof BankAccount, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setForm({
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      ifscCode: "",
      currency: "",
      swiftCode: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      form.bankName &&
      form.accountHolder &&
      form.accountNumber &&
      form.ifscCode &&
      form.currency &&
      form.swiftCode
    ) {
      onSubmit(form);
      handleReset();
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[1050px] max-w-full pb-2 overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-blue-600 border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Add Bank Account
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-blue-700 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-7 h-7 text-white"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l8 8M6 14L14 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-8 py-5 space-y-5">
          {/* Row 1 */}
          <div className="flex gap-5">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Bank Name</label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => handleChange("bankName", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter bank name"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Account Holder Name</label>
              <input
                type="text"
                value={form.accountHolder}
                onChange={(e) => handleChange("accountHolder", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter account holder name"
                required
              />
            </div>
          </div>
          {/* Row 2 */}
          <div className="flex gap-5">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Account Number</label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter account number"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">IFSC Code</label>
              <input
                type="text"
                value={form.ifscCode}
                onChange={(e) => handleChange("ifscCode", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter IFSC code"
                required
              />
            </div>
          </div>
          {/* Row 3 */}
          <div className="flex gap-5">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Select currency</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="CNY">CNY - Chinese Yuan</option>
                <option value="ZAR">ZAR - South African Rand</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">SWIFT Code</label>
              <input
                type="text"
                value={form.swiftCode}
                onChange={(e) => handleChange("swiftCode", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter SWIFT code"
                required
              />
            </div>
          </div>
          {/* Footer */}
          <div className="mt-8 border-t pt-5 flex items-center justify-between bg-gray-50 -mx-8 px-8 pb-3 rounded-b-xl">
            <button
              type="button"
              className="w-28 rounded-full bg-gray-200 px-5 py-2 text-base font-medium text-gray-700 hover:bg-gray-300 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <div className="flex gap-x-3 items-center">
              <button
                type="button"
                className="w-28 rounded-full bg-gray-200 px-5 py-2 text-base font-medium text-gray-700 hover:bg-gray-300 transition-colors"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-36 rounded-full bg-blue-600 px-5 py-2 text-base font-semibold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Save Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBankAccountModal;