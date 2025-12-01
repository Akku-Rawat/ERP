import React, { useState } from "react";
import { FaSearch, FaChevronDown, FaPlus, FaCog, FaStar } from "react-icons/fa";

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

  return (
    <div className="space-y-6">
      <div className="flex gap-6 border-b border-gray-200">
        <button
          onClick={() => setGlSubTab("chart")}
          className={`pb-3 border-b-2 ${
            glSubTab === "chart"
              ? "border-teal-500 text-teal-600 font-medium"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          Chart of Accounts
        </button>
        <button
          onClick={() => setGlSubTab("journal")}
          className={`pb-3 border-b-2 ${
            glSubTab === "journal"
              ? "border-teal-500 text-teal-600 font-medium"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          Journal Entries
        </button>
      </div>

      {glSubTab === "chart" ? (
        <>
          {/* Chart of Accounts UI as before ... */}
          <div className="flex justify-between items-center my-4">
            <div
              className="relative"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-700">
                  {getFilterLabel()}
                </span>
                <FaChevronDown className="w-4 h-4 text-gray-500" />
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
                          ? "bg-teal-50 text-teal-700"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <FaStar className="w-4 h-4" />
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
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 w-80"
              />
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <FaPlus className="w-5 h-5" />
              New
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Account Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Account Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Account Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Parent Account
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No accounts found
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 border-b border-gray-100"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {account.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600 hover:underline cursor-pointer font-medium">
                      {account.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {account.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {account.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {account.parent}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaCog className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      ) : (
        <div className="space-y-6">
          {/* Journal Entries filter dropdown */}
          <div className="relative inline-block w-52">
            <button
              onClick={() => setJournalDropdown(!journalDropdown)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left flex justify-between items-center"
            >
              <span className="capitalize">{journalFilter}</span>
              <FaChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            {journalDropdown && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
                {["all", "posted", "draft"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setJournalFilter(filter);
                      setJournalDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-teal-500 hover:text-white capitalize ${
                      journalFilter === filter
                        ? "bg-teal-500 text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Journal Entries table */}
          <table className="w-full mt-4 bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Entry #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJournalEntries.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No journal entries found
                  </td>
                </tr>
              ) : (
                filteredJournalEntries.map((entry, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 border-b border-gray-100"
                  >
                    <td className="px-6 py-4 text-sm">{entry.id}</td>
                    <td className="px-6 py-4 text-sm">{entry.date}</td>
                    <td className="px-6 py-4 text-sm">{entry.description}</td>
                    <td className="px-6 py-4 text-sm capitalize">
                      {entry.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      {entry.status.toLowerCase() === "draft" && (
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GeneralLedger;
