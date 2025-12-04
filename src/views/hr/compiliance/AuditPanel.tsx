import React from 'react';
import Card from './Card';

const AuditPanel: React.FC = () => {
  return (
    <Card title="Audit & Reporting">
      <div className="space-y-4 text-sm text-gray-700">
        <div>Auto-generated audit trail included with every change.</div>
        <div>Compliance scorecard and risk matrix available for export.</div>
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm">Run internal audit</button>
          <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">Export report</button>
        </div>
      </div>
    </Card>
  );
};

export default AuditPanel;
