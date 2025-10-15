import React, { useState } from "react";

interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const OpportunityModal: React.FC<OpportunityModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    customer: "",
    value: "",
    stage: "",
    probability: "",
    expectedClose: "",
    notes: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-full overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add Opportunity</h3>

        <input
          type="text"
          placeholder="Opportunity Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />

        <input
          type="text"
          placeholder="Customer"
          value={form.customer}
          onChange={(e) => setForm({ ...form, customer: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />

        <input
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />

        <input
          type="text"
          placeholder="Stage (e.g., Proposal, Negotiation)"
          value={form.stage}
          onChange={(e) => setForm({ ...form, stage: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />

        <input
          type="number"
          placeholder="Probability (%)"
          value={form.probability}
          onChange={(e) => setForm({ ...form, probability: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />

        <input
          type="date"
          placeholder="Expected Close Date"
          value={form.expectedClose}
          onChange={(e) => setForm({ ...form, expectedClose: e.target.value })}
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
            Save Opportunity
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityModal;
