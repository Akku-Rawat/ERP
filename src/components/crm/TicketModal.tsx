import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    title: "",
    customer: "",
    priority: "",
    status: "",
    description: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setForm({
      title: "",
      customer: "",
      priority: "",
      status: "",
      description: "",
    });
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
                Add Support Ticket
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
              {/* TICKET DETAILS */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-4">
                  TICKET DETAILS
                </div>
                <div className="grid grid-cols-6 gap-4 mb-6">
                  <input
                    type="text"
                    className="col-span-4 border rounded p-2"
                    placeholder="Ticket Title"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                  />
                  <input
                    type="text"
                    className="col-span-2 border rounded p-2"
                    placeholder="Customer"
                    name="customer"
                    value={form.customer}
                    onChange={handleFormChange}
                  />
                  <select
                    className="col-span-3 border rounded p-2"
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                  >
                    <option value="">Select Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <select
                    className="col-span-3 border rounded p-2"
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <textarea
                    className="col-span-6 border rounded p-2"
                    placeholder="Description / Issue Details"
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                  />
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

export default TicketModal;
