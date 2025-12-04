// LeavePolicy.tsx
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

export const LeavePolicy: React.FC<{ onAdd: () => void; onClose?: () => void }> = ({ onAdd, onClose }) => {
  return (
    <div className="flex">
      <aside className="w-56 pr-6">
        <div className="space-y-6 sticky top-6">
          <h4 className="text-sm font-medium text-slate-700">Filter By</h4>
          <div>
            <select className="w-full py-2 px-3 rounded bg-white border border-gray-200 text-sm">
              <option>Assigned To</option>
            </select>
          </div>
        </div>
      </aside>

      <div className="flex-1 bg-white rounded-xl border border-slate-200">
        <div className="p-6 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            {onClose && (
              <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <FaArrowLeft className="w-5 h-5" /> Back
              </button>
            )}
            <h2 className="text-lg font-semibold">Leave Policy</h2>
          </div>

          <div>
            <button onClick={onAdd} className="px-4 py-2 bg-gray-200 text-gray-700 rounded">+ Add Leave Policy</button>
          </div>
        </div>

        <div className="p-6 min-h-[280px] flex items-center justify-center text-slate-500">
          <div className="text-center">
            <div className="mb-4 w-16 h-16 rounded bg-gray-100 inline-flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div>You haven't created a Leave Policy yet</div>
            <button onClick={onAdd} className="mt-3 px-3 py-1 bg-gray-50 border rounded">Create your first Leave Policy</button>
          </div>
        </div>
      </div>
    </div>
  );
};
