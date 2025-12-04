import React from "react";
import Card from "./Card";
import { policyList } from "./data";

const PolicyPanel: React.FC = () => {
  return (
    <Card title="Policy Compliance">
      <div className="space-y-3">
        {policyList.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-gray-900">{p.title}</div>
              <div className="text-xs text-gray-500">
                Acknowledged: {p.acknowledged}/{p.total}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm text-indigo-600 hover:underline">
                Ack Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PolicyPanel;
