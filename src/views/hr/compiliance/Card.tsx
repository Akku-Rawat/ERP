import React from 'react';

/**
 * Slightly slimmer Card to match app rhythm:
 * - smaller padding on desktop
 * - consistent rounded corners and border
 */

const Card: React.FC<{ title?: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
    {title && <div className="text-sm text-gray-500 mb-2 font-medium">{title}</div>}
    <div className="text-sm text-gray-700">{children}</div>
  </div>
);

export default Card;
