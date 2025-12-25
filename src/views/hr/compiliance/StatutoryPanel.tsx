import React from "react";
import Card from "./Card";
import { statutoryItems } from "./data";

const StatutoryPanel: React.FC = () => {
  return (
    <Card title="Statutory Compliance">
      <div className="space-y-3">
        {statutoryItems.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium text-gray-900">{s.title}</div>
              <div className="text-xs text-gray-500">Due: {s.due}</div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-xs rounded-full ${s.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
              >
                {s.status}
              </span>
              <button className="text-sm text-indigo-600 hover:underline">
                View
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg">
            Open statutory calendar
          </button>
        </div>
      </div>
    </Card>
  );
};

export default StatutoryPanel;
