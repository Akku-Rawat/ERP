import React from "react";
import Card from "./Card";
import { trainingList } from "./data";

const TrainingPanel: React.FC = () => {
  return (
    <Card title="Training & Safety Compliance">
      <div className="space-y-3">
        {trainingList.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-gray-900">{t.title}</div>
              <div className="text-xs text-gray-500">
                Dept: {t.dept} • Due: {t.due}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-xs rounded-full ${t.status === "Ongoing" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"}`}
              >
                {t.status}
              </span>
              <button className="text-sm text-indigo-600 hover:underline">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TrainingPanel;
