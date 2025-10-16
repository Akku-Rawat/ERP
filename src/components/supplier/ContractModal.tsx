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
    handleReset();
    onClose();
  };

  const handleReset = () => {
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
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="rounded-lg bg-white w-[96vw] max-w-6xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
        >
          <form className="pb-2 bg-[#fefefe]/10 flex flex-col flex-1 overflow-hidden" onSubmit={handleSave}>
            <div className="flex h-12 items-center justify-between border-b px-6 py-3 rounded-t-lg bg-blue-100/30 shrink-0">
              <h3 className="text-2xl w-full font-semibold text-blue-600">
                Contract Details
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
              {/* CONTRACT INFO */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-4">CONTRACT INFORMATION</div>
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
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">CONTRACT PARTIES</div>
                <div className="overflow-x-auto rounded-md border border-gray-200 bg-white mb-2 py-4 px-2">
                  <table className="min-w-full text-xs table-fixed">
                    <thead>
                      <tr className="bg-gray-50 text-gray-800">
                        <th className="w-1/6 px-2 py-1 text-left">PARTY NAME</th>
                        <th className="w-1/6 px-2 py-1 text-left">ROLE</th>
                        <th className="w-1/6 px-2 py-1 text-left">CONTACT PERSON</th>
                        <th className="w-1/6 px-2 py-1 text-left">CONTACT EMAIL</th>
                        <th className="w-1/6 px-2 py-1 text-left">CONTACT PHONE</th>
                        <th className="w-1/10 px-2 py-1 text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {parties.map((party, idx) => (
                        <tr key={idx}> 
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Party Name"
                              name="partyName"
                              value={party.partyName}
                              onChange={(e) => handlePartyChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Role"
                              name="role"
                              value={party.role}
                              onChange={(e) => handlePartyChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Contact Person"
                              name="contactPerson"
                              value={party.contactPerson}
                              onChange={(e) => handlePartyChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Contact Email"
                              name="contactEmail"
                              value={party.contactEmail}
                              onChange={(e) => handlePartyChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Contact Phone"
                              name="contactPhone"
                              value={party.contactPhone}
                              onChange={(e) => handlePartyChange(e, idx)}
                            />
                          </td>
                          <td className="px-2 py-1 text-center">
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
                <div>
                  <button type="button" className="bg-blue-100 border border-blue-300 rounded px-2 py-1" onClick={addParty} >
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

export default ContractModal;