import React from "react";
import Card from "./Card";
import { demoStats, statutoryItems } from "./data";

const MonitoringPanel: React.FC = () => {
  const violations = demoStats.violations;
  return (
    <Card title="Monitoring Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500">Statutory Deadlines</div>
                <div className="text-lg font-semibold text-gray-900">
                  {demoStats.statutoryDeadlines} coming up
                </div>
              </div>
              <div className="text-sm text-gray-500">Next 30 days</div>
            </div>

            <div className="mt-4 space-y-2">
              {statutoryItems.slice(0, 3).map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">{s.title}</div>
                  <div className="text-xs text-gray-500">Due {s.due}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="text-xs text-gray-500">Violations Summary</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {violations}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Recent breaches flagged by rules
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MonitoringPanel;
