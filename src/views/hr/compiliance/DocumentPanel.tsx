
import React from 'react';
import Card from './Card';
import { documentList } from './data';

const DocumentPanel: React.FC = () => {
  return (
    <Card title="Document Compliance">
      <div className="space-y-3">
        {documentList.map((d) => (
          <div key={d.id} className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-gray-900">{d.name} — {d.emp}</div>
              <div className="text-xs text-gray-500">Expiry: {d.expire}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm text-indigo-600 hover:underline">Send Reminder</button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DocumentPanel;

