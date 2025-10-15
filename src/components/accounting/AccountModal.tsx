import React, { useState } from "react";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "",
    parent: "",
    openingBalance: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Add Account</h3>
        <input
          type="text"
          placeholder="Account Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Account Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        >
          <option value="">Select Type</option>
          <option>Asset</option>
          <option>Liability</option>
          <option>Equity</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
        <input
          type="text"
          placeholder="Parent Account"
          value={form.parent}
          onChange={(e) => setForm({ ...form, parent: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="number"
          placeholder="Opening Balance"
          value={form.openingBalance}
          onChange={(e) => setForm({ ...form, openingBalance: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(form);
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
