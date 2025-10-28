import React, { useState } from "react";
import AccountModal from '../../components/accounting/AccountModal';
import JournalModal from '../../components/accounting/JournalModal';

import { FaBriefcase, FaChartPie, FaFileAlt, FaClipboardList } from "react-icons/fa";
import Coa from './COA';
import JournalEntries from './Journal-Entries';
import FinancialReports from './Financial-Reports';

const accountingModule = {
  name: "Accounting",
  icon: <FaBriefcase />,
  defaultTab: "accounts",
  tabs: [
    { id: "accounts", name: "Chart of Accounts", icon: <FaChartPie /> },
    { id: "journals", name: "Journal Entries", icon: <FaFileAlt /> },
    { id: "reports", name: "Financial Reports", icon: <FaClipboardList /> },
  ],
  accounts: [
    { code: "1000", name: "Cash", type: "Asset", balance: 150000, parent: "Current Assets" },
    { code: "1200", name: "Accounts Receivable", type: "Asset", balance: 85000, parent: "Current Assets" },
    { code: "2000", name: "Accounts Payable", type: "Liability", balance: 45000, parent: "Current Liabilities" },
    { code: "3000", name: "Owner's Equity", type: "Equity", balance: 250000, parent: "Capital" },
  ],
};

const Accounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState(accountingModule.defaultTab);
  const [searchTerm, setSearchTerm] = useState("");

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);

  const handleAdd = () => {
    if (activeTab === "accounts") setShowAccountModal(true);
    else if (activeTab === "journals") setShowJournalModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <span>{accountingModule.icon}</span> {accountingModule.name}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {accountingModule.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm("");
            }}
            className={`px-4 py-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>{tab.icon}</span> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {(activeTab === "accounts") && (
          <Coa
            accounts={accountingModule.accounts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAdd={handleAdd}
          />
        )}

        {(activeTab === "journals") && (
          <JournalEntries
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAdd={handleAdd}
          />
        )}

        {(activeTab === "reports") && (
          <FinancialReports />
        )}
      </div>

      {/* Modals */}
      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSubmit={(data) => console.log("New Account:", data)}
      />
      <JournalModal
        isOpen={showJournalModal}
        onClose={() => setShowJournalModal(false)}
        onSubmit={(data) => console.log("New Journal Entry:", data)}
      />
    </div>
  );
};

export default Accounting;
