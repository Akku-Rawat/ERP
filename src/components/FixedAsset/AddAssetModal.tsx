import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

type AssetForm = {
  name: string;
  category: string;
  location: string;
  purchaseDate: string;
  value: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: AssetForm) => void;
};

const AddAssetModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<AssetForm>({
    name: "",
    category: "",
    location: "",
    purchaseDate: "",
    value: 0,
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.category) return;
    onSave(form);
    onClose();
    setForm({
      name: "",
      category: "",
      location: "",
      purchaseDate: "",
      value: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black rounded-2xl w-[90%] max-w-5xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Add New Asset</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            name="name"
            placeholder="Asset Name"
            value={form.name}
            onChange={handleChange}
            className="border border-black rounded-lg px-4 py-3"
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border border-black rounded-lg px-4 py-3"
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="border border-black rounded-lg px-4 py-3"
          />
          <input
            type="date"
            name="purchaseDate"
            value={form.purchaseDate}
            onChange={handleChange}
            className="border border-black rounded-lg px-4 py-3"
          />
          <input
            type="number"
            name="value"
            placeholder="0"
            value={form.value}
            onChange={handleChange}
            className="border border-black rounded-lg px-4 py-3"
          />
        </div>

        {/* Action */}
        <button
          onClick={handleSubmit}
          className="mt-6 bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Add Asset
        </button>
      </div>
    </div>
  );
};

export default AddAssetModal;
