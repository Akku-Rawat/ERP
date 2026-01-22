// LeaveBlockList.tsx
import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export interface LeaveBlockListProps {
  onAdd: () => void;
  onClose?: () => void;
}

export const LeaveBlockList: React.FC<LeaveBlockListProps> = ({
  onAdd,
  onClose,
}) => {
  return (
    <div className="bg-card border border-theme rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-theme">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-muted hover:text-main transition"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-xl font-bold text-main">Leave Block List</h2>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl font-semibold transition"
        >
          <Plus size={18} />
          Add Block List
        </button>
      </div>

      {/* Meta Info */}
      <div className="px-6 py-3 border-b border-theme flex items-center justify-between">
        <span className="text-sm text-muted">0 Block Lists</span>
        <span className="text-xs text-muted">
          Last Updated On: Jan 15, 2026
        </span>
      </div>

      {/* Empty State */}
      <div className="p-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-6 w-20 h-20 mx-auto rounded-2xl bg-card border border-theme inline-flex items-center justify-center">
            <svg
              className="w-10 h-10 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-main mb-2">
            No Block Lists Created
          </h3>
          <p className="text-muted text-sm mb-6">
            Create block lists to prevent leave applications during specific
            periods or days
          </p>
        </div>
      </div>
    </div>
  );
};

// LeaveBlockListForm.tsx
export const LeaveBlockListForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [blockDates, setBlockDates] = useState([
    { id: 1, date: "", reason: "" },
  ]);
  const [allowedUsers, setAllowedUsers] = useState<any[]>([]);
  const [appliesToCompany, setAppliesToCompany] = useState(false);

  const addBlockDate = () => {
    setBlockDates([
      ...blockDates,
      { id: blockDates.length + 1, date: "", reason: "" },
    ]);
  };

  const removeBlockDate = (id: number) => {
    setBlockDates(blockDates.filter((item) => item.id !== id));
  };

  const addAllowedUser = () => {
    setAllowedUsers([
      ...allowedUsers,
      { id: allowedUsers.length + 1, user: "" },
    ]);
  };

  const removeAllowedUser = (id: number) => {
    setAllowedUsers(allowedUsers.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-card border border-theme rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-theme">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-muted hover:text-main transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-main">
              New Leave Block List
            </h2>
            <span className="text-xs font-medium text-orange-600">
              Not Saved
            </span>
          </div>
        </div>
        <button className="px-6 py-2 bg-primary rounded-xl font-semibold transition">
          Save
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Leave Block List Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter block list name"
              className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main placeholder:text-muted outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Leave Type
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main outline-none focus:border-primary transition">
              <option value="">Select Leave Type</option>
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Privilege Leave</option>
            </select>
          </div>
        </div>

        {/* Company Checkbox */}
        <div>
          <label className="block text-sm font-medium text-main mb-2">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value="Izyane"
            readOnly
            className="w-full px-4 py-3 rounded-xl border border-theme bg-card text-main outline-none mb-3"
          />
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="appliesToCompany"
              checked={appliesToCompany}
              onChange={(e) => setAppliesToCompany(e.target.checked)}
              className="w-5 h-5 rounded border-theme accent-primary cursor-pointer mt-0.5"
            />
            <div>
              <label
                htmlFor="appliesToCompany"
                className="text-sm font-medium text-main cursor-pointer block"
              >
                Applies to Company
              </label>
              <p className="text-xs text-muted mt-1">
                If not checked, the list will have to be added to each
                Department where it has to be applied
              </p>
            </div>
          </div>
        </div>

        {/* Block Days Section */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-main mb-1">Block Days</h3>
            <p className="text-sm text-muted">
              Stop users from making Leave Applications on following days
            </p>
          </div>

          <div className="border border-theme rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-16">
                    No.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Block Date <span className="text-red-500">*</span>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Reason <span className="text-red-500">*</span>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold w-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {blockDates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-12 text-center text-muted"
                    >
                      No dates added yet
                    </td>
                  </tr>
                ) : (
                  blockDates.map((block, index) => (
                    <tr
                      key={block.id}
                      className="border-t border-theme row-hover"
                    >
                      <td className="px-4 py-3 text-main font-medium">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          className="w-full px-3 py-2 rounded-lg border border-theme bg-app text-main outline-none focus:border-primary transition"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Enter reason"
                          className="w-full px-3 py-2 rounded-lg border border-theme bg-app text-main placeholder:text-muted outline-none focus:border-primary transition"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeBlockDate(block.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <button
            onClick={addBlockDate}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-card border border-theme rounded-xl text-sm font-medium text-main hover:border-primary transition"
          >
            <Plus size={16} />
            Add Row
          </button>
        </div>

        {/* Allow Users Section */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-main mb-1">Allow Users</h3>
            <p className="text-sm text-muted">
              Allow the following users to approve Leave Applications for block
              days
            </p>
          </div>

          <div className="border border-theme rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-16">
                    No.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Allow User <span className="text-red-500">*</span>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold w-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allowedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-12 text-center text-muted"
                    >
                      No users added
                    </td>
                  </tr>
                ) : (
                  allowedUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-t border-theme row-hover"
                    >
                      <td className="px-4 py-3 text-main font-medium">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <select className="w-full px-3 py-2 rounded-lg border border-theme bg-app text-main outline-none focus:border-primary transition">
                          <option value="">Select User</option>
                          <option>Admin User</option>
                          <option>HR Manager</option>
                          <option>Department Head</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeAllowedUser(user.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <button
            onClick={addAllowedUser}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-card border border-theme rounded-xl text-sm font-medium text-main hover:border-primary transition"
          >
            <Plus size={16} />
            Add Row
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-theme">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-theme rounded-xl font-medium text-muted hover:text-main transition"
          >
            Cancel
          </button>
          <button className="px-6 py-3 bg-primary rounded-xl font-semibold transition">
            Save Block List
          </button>
        </div>
      </div>
    </div>
  );
};
