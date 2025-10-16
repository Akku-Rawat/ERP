import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface ApprovalItem {
  approver: string;
  role: string;
  status: string;
  comments: string;
  date: string;
}

const emptyApprovalItem: ApprovalItem = {
  approver: "",
  role: "",
  status: "",
  comments: "",
  date: "",
};

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    approvalNumber: "",
    tag: "",
    dateTime: "",
    description: "",
    requester: "",
    department: "",
    priority: "",
  });

  const [items, setItems] = useState<ApprovalItem[]>([{ ...emptyApprovalItem }]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    idx: number
  ) => {
    const rows = [...items];
    rows[idx] = { ...rows[idx], [e.target.name]: e.target.value };
    setItems(rows);
  };

  const addItem = () => setItems([...items, { ...emptyApprovalItem }]);

  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ ...form, items });
    onClose();
    setForm({
      approvalNumber: "",
      tag: "",
      dateTime: "",
      description: "",
      requester: "",
      department: "",
      priority: "",
    });
    setItems([{ ...emptyApprovalItem }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="rounded-lg bg-white mt-10 w-[96vw] max-w-4xl shadow-lg"
        >
          <form className="pb-2 bg-[#fefefe]/10" onSubmit={handleSave}>
            <div className="flex h-12 items-center justify-between border-b px-6 py-7 rounded-t-lg bg-blue-100/30">
              <h3 className="text-2xl w-full font-semibold text-blue-600">
                Approval Request
              </h3>
              <button
                type="button"
                className="text-gray-700 hover:bg-[#fefefe] rounded-full w-8 h-8"
                onClick={onClose}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="overflow-y-auto h-[70vh] border-b">
              {/* APPROVAL HEADER */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-4">APPROVAL DETAILS</div>
                <div className="grid grid-cols-6 gap-4 mb-6">
                  <input
                    className="col-span-1 border rounded p-2"
                    placeholder="Approval Number"
                    name="approvalNumber"
                    value={form.approvalNumber}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-1 border rounded p-2"
                    placeholder="Tag"
                    name="tag"
                    value={form.tag}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-2 border rounded p-2"
                    type="datetime-local"
                    name="dateTime"
                    value={form.dateTime}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="Description"
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="Requester"
                    name="requester"
                    value={form.requester}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="Department"
                    name="department"
                    value={form.department}
                    onChange={handleFormChange}
                  />
                  <input
                    className="col-span-2 border rounded p-2"
                    placeholder="Priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* APPROVAL ITEMS */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-2">APPROVAL STEPS</div>
                <div className="overflow-x-auto rounded-md border border-gray-200 bg-white mb-2">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-800">
                        <th></th>
                        <th>APPROVER</th>
                        <th>ROLE</th>
                        <th>STATUS</th>
                        <th>COMMENTS</th>
                        <th>DATE</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <button
                              type="button"
                              className="bg-blue-100 border border-blue-300 rounded px-2 py-1"
                              onClick={addItem}
                            >
                              +
                            </button>
                          </td>
                          <td>
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Approver"
                              name="approver"
                              value={item.approver}
                              onChange={(e) => handleItemChange(e, idx)}
                            />
                          </td>
                          <td>
                            <input
                              className="border rounded p-1 w-full"
                              placeholder="Role"
                              name="role"
                              value={item.role}
                              onChange={(e) => handleItemChange(e, idx)}
                            />
                          </td>
                          <td>
                            <select
                              name="status"
                              className="border rounded p-1 w-full"
                              value={item.status}
                              onChange={(e) => handleItemChange(e, idx)}
                            >
                              <option value="">Select</option>
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td>
                            <textarea
                              name="comments"
                              className="border rounded p-1 w-full"
                              placeholder="Comments"
                              value={item.comments}
                              onChange={(e) => handleItemChange(e, idx)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              name="date"
                              className="border rounded p-1 w-full"
                              value={item.date}
                              onChange={(e) => handleItemChange(e, idx)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="bg-red-100 border border-red-300 rounded px-2 py-1"
                              onClick={() => removeItem(idx)}
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
            <div className="m-3 flex items-center justify-between gap-x-7">
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
                      approvalNumber: "",
                      tag: "",
                      dateTime: "",
                      description: "",
                      requester: "",
                      department: "",
                      priority: "",
                    });
                    setItems([{ ...emptyApprovalItem }]);
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

export default ApprovalModal;
