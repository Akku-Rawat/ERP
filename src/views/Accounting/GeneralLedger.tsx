import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  Settings,
  Star,
} from "lucide-react";

type Account = {
  code: string;
  name: string;
  type: string;
  balance: number;
  parent: string;
  status: string;
  category?: string;
};

type JournalEntry = {
  id: string;
  date: string;
  description: string;
  status: string;
  entries: { account: string; debit: number; credit: number }[];
};

type Props = {
  glSubTab: string;
  setGlSubTab: (tab: string) => void;
  accounts: Account[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  showFilterDropdown: boolean;
  setShowFilterDropdown: (show: boolean) => void;
  handleFilterSelect: (filter: string) => void;
  getFilterLabel: () => string;
  getFilterCount: (filter: string) => number;
  journalEntries: JournalEntry[];
};

const GeneralLedger: React.FC<Props> = ({
  glSubTab,
  setGlSubTab,
  accounts,
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  showFilterDropdown,
  setShowFilterDropdown,
  handleFilterSelect,
  getFilterLabel,
  getFilterCount,
  journalEntries,
}) => {
  const [journalFilter, setJournalFilter] = useState<string>("all");
  const [journalDropdown, setJournalDropdown] = useState<boolean>(false);

  const filteredAccounts = accounts
    .filter((acc) => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "active") return acc.status === "active";
      if (selectedFilter === "inactive") return acc.status === "inactive";
      return acc.category === selectedFilter;
    })
    .filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.code.includes(searchTerm),
    );

  const filteredJournalEntries = journalEntries.filter((entry) => {
    if (journalFilter === "all") return true;
    return entry.status.toLowerCase() === journalFilter;
  });

  const handleAccountDelete = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete account "${code}"?`)) {
      alert("Delete functionality ready — connect to API later");
    }
  };

  const handleJournalDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete journal entry "${id}"?`)) {
      alert("Delete functionality ready — connect to API later");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setGlSubTab("chart")}
          className={`pb-3 border-b-2 ${
            glSubTab === "chart"
              ? "border-indigo-500 text-indigo-600 font-medium"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          Chart of Accounts
        </button>
        <button
          onClick={() => setGlSubTab("journal")}
          className={`pb-3 border-b-2 ${
            glSubTab === "journal"
              ? "border-indigo-500 text-indigo-600 font-medium"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          Journal Entries
        </button>
      </div>

      {glSubTab === "chart" ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div
              className="relative"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-700">
                  {getFilterLabel()}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {[
                    "all",
                    "active",
                    "inactive",
                    "asset",
                    "liability",
                    "equity",
                    "income",
                    "expense",
                  ].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterSelect(filter)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between ${
                        selectedFilter === filter
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}{" "}
                        Accounts
                      </span>
                      <span className="text-xs text-gray-500">
                        {getFilterCount(filter)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm">
              <Plus className="w-5 h-5" /> Add Account
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
                <tr>
                  <th className="px-6 py-4 text-left">Account Code</th>
                  <th className="px-6 py-4 text-left">Account Name</th>
                  <th className="px-6 py-4 text-left">Account Type</th>
                  <th className="px-6 py-4 text-left">Balance</th>
                  <th className="px-6 py-4 text-left">Parent Account</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAccounts.map((account, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                      {account.code}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {account.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {account.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {account.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {account.parent}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          account.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit functionality
                          }}
                          className="text-indigo-600 hover:text-indigo-800 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleAccountDelete(account.code, e)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAccounts.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                {searchTerm
                  ? "No accounts match your search."
                  : "No accounts added yet."}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Journal Entries Header */}
          <div className="flex items-center justify-between mb-6">
            <div
              className="relative"
              onClick={() => setJournalDropdown(!journalDropdown)}
            >
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-700 capitalize">
                  {journalFilter} Entries
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {journalDropdown && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {["all", "posted", "draft"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setJournalFilter(filter);
                        setJournalDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 capitalize ${
                        journalFilter === filter
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm">
              <Plus className="w-5 h-5" /> New Entry
            </button>
          </div>

          {/* Journal Entries Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
                <tr>
                  <th className="px-6 py-4 text-left">Entry #</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredJournalEntries.map((entry, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                      {entry.id}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{entry.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {entry.description}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          entry.status.toLowerCase() === "posted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit functionality
                          }}
                          className="text-indigo-600 hover:text-indigo-800 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleJournalDelete(entry.id, e)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredJournalEntries.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                No journal entries found.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GeneralLedger;
