import React, { useState } from "react";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({ name: "", contact: "", phone: "", status: "Active" });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Add Supplier</h3>
        <input
          type="text"
          placeholder="Supplier Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
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

export default SupplierModal;
