
import React from 'react';
import Card from './Card';
import { vendorList } from './data';

const VendorPanel: React.FC = () => {
  return (
    <Card title="Vendor / Contract Compliance">
      <div className="space-y-3">
        {vendorList.map((v) => (
          <div key={v.id} className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-gray-900">{v.name}</div>
              <div className="text-xs text-gray-500">Expires: {v.expiry}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-xs rounded-full ${v.risk === 'High' ? 'bg-red-100 text-red-700' : v.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'}`}>{v.risk}</span>
              <button className="text-sm text-indigo-600 hover:underline">View</button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default VendorPanel;

