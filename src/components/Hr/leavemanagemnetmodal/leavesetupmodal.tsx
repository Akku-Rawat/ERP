// LeaveSetupModal.tsx
import React, { useState } from "react";
import {
  FaCog,
  FaArrowLeft,
  FaPlus,
  FaEllipsisH,
  FaSync,
  FaList,
} from "react-icons/fa";

import { LeaveType } from "./LeaveType";
import { LeaveTypeForm } from "./LeaveTypeForm";
import { LeavePeriod } from "./LeavePeriod";
import { LeavePeriodForm } from "./LeavePeriodForm";
import { LeavePolicy } from "./LeavePolicy";
import { LeavePolicyForm } from "./LeavePolicyForm";

export type ViewType =
  | "menu"
  | "holiday-list"
  | "holiday-form"
  | "leave-allocation"
  | "allocation-form"
  | "leave-type"
  | "leave-type-form"
  | "leave-period"
  | "leave-period-form"
  | "leave-policy"
  | "leave-policy-form";

interface LeaveSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaveSetupModal: React.FC<LeaveSetupModalProps> = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState<ViewType>("menu");

  const setupOptions = [
    {
      category: "Setup",
      items: [
        { name: "Holiday List", view: "holiday-list" as ViewType },
        { name: "Leave Type", view: "leave-type" as ViewType },
        { name: "Leave Period", view: "leave-period" as ViewType },
        { name: "Leave Policy", view: "leave-policy" as ViewType },
        { name: "Leave Block List", view: "menu" as ViewType },
      ],
    },
    {
      category: "Allocation",
      items: [
        { name: "Leave Allocation", view: "leave-allocation" as ViewType },
        { name: "Leave Policy Assignment", view: "menu" as ViewType },
        { name: "Leave Control Panel", view: "menu" as ViewType },
        { name: "Leave Encashment", view: "menu" as ViewType },
      ],
    },
    {
      category: "Application",
      items: [
        { name: "Leave Application", view: "menu" as ViewType },
        { name: "Compensatory Leave Request", view: "menu" as ViewType },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[720px] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <FaCog className="w-6 h-6 text-gray-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Leave Setup & Configuration</h2>
          </div>
          <button onClick={onClose} className="text-gray-700 p-2 rounded-lg transition hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-white">
          {currentView === "menu" && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {setupOptions.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-700 uppercase tracking-wide pb-2 border-b-2 border-slate-300">
                      {section.category}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((item, itemIdx) => (
                        <button
                          key={itemIdx}
                          onClick={() => setCurrentView(item.view)}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all group"
                        >
                          <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">{item.name}</span>
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Holiday list/form kept unchanged */}
          {currentView === "holiday-list" && (
            <div className="h-full flex flex-col bg-white">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button onClick={() => setCurrentView("menu")} className="text-gray-600 hover:text-gray-900">
                    <FaArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">Holiday List</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    <FaList className="w-4 h-4" />
                    List View
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <FaSync className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <FaEllipsisH className="w-4 h-4 text-gray-600" />
                  </button>
                  <button onClick={() => setCurrentView("holiday-form")} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm">
                    <FaPlus className="w-4 h-4" />
                    Add Holiday List
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="px-6 py-3">
                  <div className="ml-auto text-sm text-gray-600">Last Updated On</div>
                </div>

                <div className="mt-6 border border-gray-200 rounded p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">You haven't created a Holiday List yet</p>
                  <p className="text-gray-500 text-sm">Create your first Holiday List</p>
                </div>
              </div>
            </div>
          )}

          {currentView === "holiday-form" && (
            <div className="h-full flex flex-col bg-white">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button onClick={() => setCurrentView("holiday-list")} className="text-gray-600 hover:text-gray-900">
                    <FaArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">New Holiday List</h2>
                  <span className="text-sm text-orange-600 font-medium">Not Saved</span>
                </div>
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded text-sm">Save</button>
              </div>

              <div className="p-6 overflow-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Holiday List Name <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Holidays</label>
                      <input type="text" value="0" disabled className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
                    </div>
                  </div>

                  {/* rest of holiday form kept same (omitted here for brevity) */}
                </div>
              </div>
            </div>
          )}

          {/* Leave Allocation area */}
          {currentView === "leave-allocation" && (
            <div className="h-full flex flex-col bg-white">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button onClick={() => setCurrentView("menu")} className="text-gray-600 hover:text-gray-900">
                    <FaArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">Leave Allocation</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    <FaList className="w-4 h-4" />
                    List View
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <FaSync className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <FaEllipsisH className="w-4 h-4 text-gray-600" />
                  </button>
                  <button onClick={() => setCurrentView("allocation-form")} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm">
                    <FaPlus className="w-4 h-4" />
                    Add Leave Allocation
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="px-6 py-3">
                  <div className="ml-auto text-sm text-gray-600">Last Updated On</div>
                </div>

                <div className="mt-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">You haven't created a Leave Allocation yet</p>
                  <p className="text-gray-500 text-sm">Create your first Leave Allocation</p>
                </div>
              </div>
            </div>
          )}

          {currentView === "allocation-form" && (
            <div className="h-full flex flex-col bg-white">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button onClick={() => setCurrentView("leave-allocation")} className="text-gray-600 hover:text-gray-900">
                    <FaArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">New Leave Allocation</h2>
                  <span className="text-sm text-orange-600 font-medium">Not Saved</span>
                </div>
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded text-sm">Save</button>
              </div>

              <div className="p-6 overflow-auto">
                <div className="max-w-4xl mx-auto">
                  {/* allocation form fields (kept same) */}
                </div>
              </div>
            </div>
          )}

          {/* Integrated components */}
          {currentView === "leave-type" && (
            <div className="p-6">
              <LeaveType onAdd={() => setCurrentView("leave-type-form")} onClose={() => setCurrentView("menu")} />
            </div>
          )}
          {currentView === "leave-type-form" && (
            <div className="p-6">
              <LeaveTypeForm onClose={() => setCurrentView("leave-type")} />
            </div>
          )}

          {currentView === "leave-period" && (
            <div className="p-6">
              <LeavePeriod onAdd={() => setCurrentView("leave-period-form")} onClose={() => setCurrentView("menu")} />
            </div>
          )}
          {currentView === "leave-period-form" && (
            <div className="p-6">
              <LeavePeriodForm onClose={() => setCurrentView("leave-period")} />
            </div>
          )}

          {currentView === "leave-policy" && (
            <div className="p-6">
              <LeavePolicy onAdd={() => setCurrentView("leave-policy-form")} onClose={() => setCurrentView("menu")} />
            </div>
          )}
          {currentView === "leave-policy-form" && (
            <div className="p-6">
              <LeavePolicyForm onClose={() => setCurrentView("leave-policy")} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition">Close</button>
        </div>
      </div>
    </div>
  );
};

export default LeaveSetupModal;
