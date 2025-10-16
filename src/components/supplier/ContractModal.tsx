import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface ContractParty {
  partyName: string;
  role: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

const emptyParty: ContractParty = {
  partyName: "",
  role: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
};

const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    contractNumber: "",
    title: "",
    supplier: "",
    startDate: "",
    endDate: "",
    contractValue: "",
    description: "",
    status: "",
  });

  const [parties, setParties] = useState<ContractParty[]>([{ ...emptyParty }]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePartyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const updatedParties = [...parties];
    updatedParties[idx] = { ...updatedParties[idx], [e.target.name]: e.target.value };
    setParties(updatedParties);
  };

  const addParty = () => setParties([...parties, { ...emptyParty }]);

  const removeParty = (idx: number) => {
    if (parties.length === 1) return;
    setParties(parties.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ ...form, parties });
    onClose();
    setForm({
      contractNumber: "",
      title: "",
      supplier: "",
      startDate: "",
      endDate: "",
      contractValue: "",
      description: "",
      status: "",
    });
    setParties([{ ...emptyParty }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="bg-white rounded-lg mt-10 w-[96vw] max-w-5xl shadow-lg"
        >
          <form className="pb-2 bg-[#fefefe]/10" onSubmit={handleSave}>
            <div className="flex items-center justify-between h-12 border-b px-6 py-7 rounded-t-lg bg-blue-100/30">
              <h3 className="w-full text-2xl font-semibold text-blue-600">
                Contract Details
              </h3>
              <button
                type="button"
                className="w-8 h-8 rounded-full text-gray-700 hover:bg-[#fefefe]"
                onClick={onClose}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="overflow-y-auto h-[75vh] border-b">
              {/* CONTRACT INFO */}
              <div className="flex flex-col gap-y-2 m-4 p-6 border">
                <div className="mb-4 font-semibold text-gray-600">
                  CONTRACT INFORMATION
                </div>
                <div className="grid grid-cols-8 gap-4 mb-6">
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="Contract Number"
                    name="contractNumber"
                    value={form.contractNumber}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-4 border rounded p-2"
                    placeholder="Title"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="Supplier"
                    name="supplier"
                    value={form.supplier}
                    onChange={handleFormChange}
                  />
                  <input
                    type="date"
                    className="col-span-2 border rounded p-2"
                    placeholder="Start Date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleFormChange}
                  />
                  <input
                    type="date"
                    className="col-span-2 border rounded p-2"
                    placeholder="End Date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="Contract Value"
                    name="contractValue"
                    value={form.contractValue}
                    onChange={handleFormChange}
                  />
                  <select
                    className="col-span-2 border rounded p-2"
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                  <textarea
                    className="col-span-8 border rounded p-2"
                    placeholder="Description"
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* CONTRACT PARTIES */}
              <div className="flex flex-col gap-y-2 m-4 p-6 border">
                <div className="mb-2 font-semibold text-gray-600">
                  CONTRACT PARTIES
                </div>
                <div className="overflow-x-auto rounded-md border border-gray-200 bg-white mb-2">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-800">
                        <th></th>
                        <th>PARTY NAME</th>
                        <th>ROLE</th>
                        <th>CONTACT PERSON</th>
                        <th>CONTACT EMAIL</th>
                        <th>CONTACT PHONE</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {parties.map((party, idx) => (
                        <tr key={idx}>
                          <td>
                            <button
                              type="button"
                              className="bg-blue-100 border border-blue-300 rounded px-2 py-1"
                              onClick={addParty}
                            >
                              +
                            </button>
                          </td>
                          <td>
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Party Name"
                              name="partyName"
                              value={party.partyName}
                              onChange={(e) => handlePartyChange(e, idx)}
                            />
                          </td>
                          <td>
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Role"
                              name="role"
                              value={party.role}
                              onChange={(e) => handlePartyChange(e, idx)}
                            />
                          </td>
                          <td>
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Contact Person"
                              name="contactPerson"
                              value={party.contactPerson}
                              onChange={(e) => handlePartyChange(e, idx)}
                            />
                          </td>
                          <td>
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Contact Email"
                              name="contactEmail"
                              value={party.contactEmail}
                              onChange={(e) => handlePartyChange(e, idx)}
                            />
                          </td>
                          <td>
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Contact Phone"
                              name="contactPhone"
                              value={party.contactPhone}
                              onChange={(e) => handlePartyChange(e, idx)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="bg-red-100 border border-red-300 rounded px-2 py-1"
                              onClick={() => removeParty(idx)}
                            >
                              -
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex m-3 items-center justify-between gap-x-7">
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
                  onClick={() => {
                    setForm({
                      contractNumber: "",
                      title: "",
                      supplier: "",
                      startDate: "",
                      endDate: "",
                      contractValue: "",
                      description: "",
                      status: "",
                    });
                    setParties([{ ...emptyParty }]);
                  }}
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

export default ContractModal;
