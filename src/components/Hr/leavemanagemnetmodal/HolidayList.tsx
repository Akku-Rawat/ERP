import React from "react";
import { ArrowLeft, Plus, Calendar } from "lucide-react";

export interface HolidayListProps {
  onAdd: () => void;
  onClose?: () => void;
}

export const HolidayList: React.FC<HolidayListProps> = ({ onAdd, onClose }) => {
  return (
    <div className="bg-card border border-theme rounded-2xl overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-theme">
        <div className="flex items-center gap-3">
          {onClose && (
            <button onClick={onClose} className="flex items-center gap-2 text-muted hover:text-main transition">
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-xl font-bold text-main">Holiday List</h2>
        </div>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl font-semibold transition">
          <Plus size={18} />
          Add Holiday List
        </button>
      </div>
      <div className="px-6 py-3 border-b border-theme flex items-center justify-between">
        <span className="text-sm text-muted">0 Holiday Lists</span>
        <span className="text-xs text-muted">Last Updated On: Jan 15, 2026</span>
      </div>
      <div className="p-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-6 w-20 h-20 mx-auto rounded-2xl bg-card border border-theme inline-flex items-center justify-center">
            <Calendar size={40} className="text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-main mb-2">No Holiday Lists Yet</h3>
          <p className="text-muted text-sm mb-6">Create holiday lists to define public holidays for your organization</p>
          <button onClick={onAdd} className="px-6 py-3 bg-primary rounded-xl font-semibold transition flex items-center gap-2 mx-auto">
            <Plus size={18} />
            Create Holiday List
          </button>
        </div>
      </div>
    </div>
  );
};