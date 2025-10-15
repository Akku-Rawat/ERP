import React, { useState } from "react";

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    date: "",
    description: "",
    debitAccount: "",
    creditAccount: "",
    amount: "",
    reference: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Add Journal Entry</h3>
        <input
          type="date"
          placeholder="Date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Debit Account"
          value={form.debitAccount}
          onChange={(e) => setForm({ ...form, debitAccount: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Credit Account"
          value={form.creditAccount}
          onChange={(e) => setForm({ ...form, creditAccount: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Reference / Document No."
          value={form.reference}
          onChange={(e) => setForm({ ...form, reference: e.target.value })}
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

export default JournalModal;
