import React, { useState } from 'react';
import { FaBuilding,FaIdCard,FaMoneyCheckAlt ,FaExchangeAlt } from 'react-icons/fa';
import BasicDetails from './BasicDetails';
import AccountingDetails from './AccountingDetails';
import BuyingSelling from './BuyingSelling';

const navTabs = [
  { key: 'basic', label: 'Basic Details', icon: <FaIdCard/> },
  { key: 'accounting', label: 'Accounting Details', icon: <FaMoneyCheckAlt /> },
  { key: 'buyingSelling', label: 'Buying & Selling', icon: <FaExchangeAlt /> },
];

const CompanySetup: React.FC = () => {
  const [tab, setTab] = useState(navTabs[0].key);

  return (
    <div className="bg-gray-50 min-h-screen p-8 pb-20">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaBuilding /> Company Setup
      </h1>
      {/* Navbar */}
      <div className="flex gap-8 mb-8 border-b border-gray-300">
        {navTabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 pb-3 text-base font-medium transition border-b-4
              ${tab === t.key
                ? 'text-teal-600 border-teal-500'
                : 'text-gray-500 border-transparent hover:text-teal-600'
              }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div>
        {tab === 'basic' && <BasicDetails />}
        {tab === 'accounting' && <AccountingDetails />}
        {tab === 'buyingSelling' && <BuyingSelling />}
      </div>
    </div>
  );
};

export default CompanySetup;
