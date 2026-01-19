import React from 'react';
import { X } from 'lucide-react';
import type { PayrollRecord } from './types';

interface EditSalaryModalProps {
  show: boolean;
  record: PayrollRecord | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: string, value: number) => void;
}

export const EditSalaryModal: React.FC<EditSalaryModalProps> = ({ show, record, onClose, onSave, onChange }) => {
  if (!show || !record) return null;

  const estimatedNet = record.basicSalary + record.hra + record.allowances + record.arrears -
    Math.round((record.basicSalary + record.hra + record.allowances + record.arrears) * 0.24) - 500;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
          <h2 className="text-2xl font-bold">Edit Salary</h2>
          <p className="text-purple-100 mt-1">{record.employeeName}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Basic Salary</label>
              <input type="number" value={record.basicSalary} onChange={(e) => onChange('basicSalary', Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">HRA</label>
              <input type="number" value={record.hra} onChange={(e) => onChange('hra', Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Allowances</label>
              <input type="number" value={record.allowances} onChange={(e) => onChange('allowances', Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Arrears</label>
              <input type="number" value={record.arrears} onChange={(e) => onChange('arrears', Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-purple-800 font-semibold">Estimated Net:</span>
              <span className="text-2xl font-bold text-purple-700">₹{estimatedNet.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
          <button onClick={onClose} className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white">
            Cancel
          </button>
          <button onClick={onSave} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};