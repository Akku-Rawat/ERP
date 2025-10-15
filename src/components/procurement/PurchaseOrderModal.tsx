import React, { useState } from "react";

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: "",
    supplier: "",
    date: "",
    amount: "",
    status: "",
    deliveryDate: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({ id: "", supplier: "", date: "", amount: "", status: "", deliveryDate: "" });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Purchase Order</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="id"
            placeholder="PO ID"
            value={formData.id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            type="text"
            name="supplier"
            placeholder="Supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          >
            <option value="">Select Status</option>
            <option>Draft</option>
            <option>Pending</option>
            <option>Approved</option>
          </select>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add PO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseOrderModal;
