import React, { useState } from "react";
import AccountModal from '../../components/accounting/AccountModal';
import JournalModal from '../../components/accounting/JournalModal';

import { 
  FaBriefcase,
   FaChartPie, 
   FaFileAlt, 
   FaClipboardList
   } from "react-icons/fa";

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

  const filteredAccounts = accountingModule.accounts.filter(
    (account) =>
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Search, Add, Export Actions */}
        {activeTab !== "reports" && (
          <div className="flex items-center justify-between mb-4">
            <input
              type="search"
              placeholder={`Search ${
                activeTab === "accounts" ? "accounts" : "journal entries"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                Export
              </button>
            </div>
          </div>
        )}

        {/* Chart of Accounts Table */}
        {activeTab === "accounts" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Account Code</th>
                  <th className="px-4 py-2 text-left">Account Name</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Balance</th>
                  <th className="px-4 py-2 text-left">Parent</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc) => (
                  <tr key={acc.code} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{acc.code}</td>
                    <td className="px-4 py-2">{acc.name}</td>
                    <td className="px-4 py-2">{acc.type}</td>
                    <td className="px-4 py-2">${acc.balance.toLocaleString()}</td>
                    <td className="px-4 py-2">{acc.parent}</td>
                    <td className="px-4 py-2 text-center">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Journals Tab */}
        {activeTab === "journals" && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Journal Entries</h3>
            <p className="text-gray-500">Journal entry management will be implemented here.</p>
            <button
              onClick={handleAdd}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + Add Journal Entry
            </button>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Financial Reports
            </h3>
            <p className="text-gray-500">
              Financial reporting and analytics will be displayed here.
            </p>
          </div>
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
