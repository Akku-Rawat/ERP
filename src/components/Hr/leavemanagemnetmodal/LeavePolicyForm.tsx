// LeavePolicyForm.tsx
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export const LeavePolicyForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <FaArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Leave Policy <span className="text-xs text-orange-500">Not Saved</span></h2>
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 text-gray-700 rounded">Save</button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-700">Title *</label>
        <input className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 mb-4" />

        <h4 className="font-medium mb-2">Leave Allocations</h4>
        <div className="border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">No.</th>
                <th className="p-3">Leave Type *</th>
                <th className="p-3">Annual Allocation *</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">1</td>
                <td className="p-3"><input className="w-full px-2 py-1 border rounded bg-white" /></td>
                <td className="p-3">0.000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="mt-3 px-3 py-1 bg-gray-50 border rounded">Add Row</button>
      </div>
    </div>
  );
};
