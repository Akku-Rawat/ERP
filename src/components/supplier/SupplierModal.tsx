import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface SupplierContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

const emptyContact: SupplierContact = {
  name: "",
  role: "",
  email: "",
  phone: "",
};

const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    supplierCode: "",
    supplierName: "",
    address: "",
    city: "",
    country: "",
    taxID: "",
    paymentTerms: "",
    remarks: "",
  });

  const [contacts, setContacts] = useState<SupplierContact[]>([
    { ...emptyContact },
  ]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const tempContacts = [...contacts];
    tempContacts[idx] = {
      ...tempContacts[idx],
      [e.target.name]: e.target.value,
    };
    setContacts(tempContacts);
  };

  const addContact = () => setContacts([...contacts, { ...emptyContact }]);

  const removeContact = (idx: number) => {
    if (contacts.length === 1) return;
    setContacts(contacts.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ ...form, contacts });
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setForm({
      supplierCode: "",
      supplierName: "",
      address: "",
      city: "",
      country: "",
      taxID: "",
      paymentTerms: "",
      remarks: "",
    });
    setContacts([{ ...emptyContact }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="rounded-lg bg-white w-[96vw] max-w-6xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
        >
          <form
            className="pb-2 bg-[#fefefe]/10 flex flex-col flex-1 overflow-hidden"
            onSubmit={handleSave}
          >
            <div className="flex h-12 items-center justify-between border-b px-6 py-3 rounded-t-lg bg-blue-100/30 shrink-0">
              <h3 className="text-2xl w-full font-semibold text-blue-600">
                Supplier Details
              </h3>
              <button
                type="button"
                className="text-gray-700 hover:bg-[#fefefe] rounded-full w-8 h-8"
                onClick={onClose}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto border-b px-4">
              {/* SUPPLIER INFO */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-4">
                  SUPPLIER INFO
                </div>
                <div className="grid grid-cols-8 gap-4 mb-6">
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="Supplier Code"
                    name="supplierCode"
                    value={form.supplierCode}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-4 border rounded p-2"
                    placeholder="Supplier Name"
                    name="supplierName"
                    value={form.supplierName}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-8 border rounded p-2"
                    placeholder="Address"
                    name="address"
                    value={form.address}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="City"
                    name="city"
                    value={form.city}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="Country"
                    name="country"
                    value={form.country}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="Tax ID"
                    name="taxID"
                    value={form.taxID}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="Payment Terms"
                    name="paymentTerms"
                    value={form.paymentTerms}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-8 border rounded p-2"
                    placeholder="Remarks"
                    name="remarks"
                    value={form.remarks}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* CONTACT PERSONS */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">
                  CONTACT PERSONS
                </div>
                <div className="overflow-x-auto rounded-md border border-gray-200 bg-white mb-2 py-4 px-2">
                  <table className="min-w-full text-xs table-fixed">
                    <thead>
                      <tr className="bg-gray-50 text-gray-800">
                        <th className="w-1/5 px-2 py-1 text-left">NAME</th>
                        <th className="w-1/5 px-2 py-1 text-left">ROLE</th>
                        <th className="w-1/5 px-2 py-1 text-left">EMAIL</th>
                        <th className="w-1/5 px-2 py-1 text-left">PHONE</th>
                        <th className="w-1/10 px-2 py-1 text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact, idx) => (
                        <tr key={idx}>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Name"
                              name="name"
                              value={contact.name}
                              onChange={(e) => handleContactChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Role"
                              name="role"
                              value={contact.role}
                              onChange={(e) => handleContactChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Email"
                              name="email"
                              value={contact.email}
                              onChange={(e) => handleContactChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Phone"
                              name="phone"
                              value={contact.phone}
                              onChange={(e) => handleContactChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1 text-center">
                            <button
                              type="button"
                              className="bg-red-100 border border-red-300 rounded px-2 py-1"
                              onClick={() => removeContact(idx)}
                            >
                              -
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <button
                    type="button"
                    className="bg-blue-100 border border-blue-300 rounded px-2 py-1"
                    onClick={addContact}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="m-3 flex items-center justify-between gap-x-7 shrink-0">
              <button
                type="button"
                className="w-24 rounded-3xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                onClick={onClose}
              >
                Cancel
              </button>
              <div className="flex gap-x-2">
                <button
                  type="submit"
                  className="w-24 rounded-3xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="w-24 rounded-3xl bg-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-500 hover:text-white"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SupplierModal;
