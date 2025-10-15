import React, { useState } from "react";

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    supplier: "",
    title: "",
    startDate: "",
    endDate: "",
    value: "",
    paymentTerms: "",
    deliverySchedule: "",
    scope: "",
    qualityStandards: "",
    terminationClause: "",
    penalties: "",
    notes: "",
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-full overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add Contract</h3>
        <input
          type="text"
          placeholder="Supplier"
          value={form.supplier}
          onChange={(e) => setForm({ ...form, supplier: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Contract Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <div className="flex gap-2 mb-3">
          <input
            type="date"
            placeholder="Start Date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="border rounded-md flex-1 px-3 py-2"
          />
          <input
            type="date"
            placeholder="End Date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="border rounded-md flex-1 px-3 py-2"
          />
        </div>
        <input
          type="number"
          placeholder="Contract Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Payment Terms"
          value={form.paymentTerms}
          onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <textarea
          placeholder="Delivery Schedule / Terms"
          value={form.deliverySchedule}
          onChange={(e) => setForm({ ...form, deliverySchedule: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <textarea
          placeholder="Scope / Description"
          value={form.scope}
          onChange={(e) => setForm({ ...form, scope: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <textarea
          placeholder="Quality / Standards"
          value={form.qualityStandards}
          onChange={(e) => setForm({ ...form, qualityStandards: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <textarea
          placeholder="Termination / Renewal Clause"
          value={form.terminationClause}
          onChange={(e) => setForm({ ...form, terminationClause: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <textarea
          placeholder="Penalties / Damages"
          value={form.penalties}
          onChange={(e) => setForm({ ...form, penalties: e.target.value })}
          className="border rounded-md w-full mb-3 px-3 py-2"
        />
        <textarea
          placeholder="Notes / Remarks"
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
