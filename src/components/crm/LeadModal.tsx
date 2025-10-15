import React, { useState } from "react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    company: "",
    contact: "",
    status: "",
    value: "",
    source: "",
    notes: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-full overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add New Lead</h3>

        <input
          type="text"
          placeholder="Company Name"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />

        <input
          type="text"
          placeholder="Contact Person"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />

        <input
          type="text"
          placeholder="Status (e.g., New, Qualified)"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />

        <input
          type="number"
          placeholder="Lead Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />

        <input
          type="text"
          placeholder="Source (Website, Referral, etc.)"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />

        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
            Save Lead
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadModal;
