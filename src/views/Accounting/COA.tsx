// COA.tsx
import React from "react";

export interface Account {
  code: string;
  name: string;
  type: string;
  balance: number;
  parent: string;
}

interface CoaProps {
  accounts: Account[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAdd: () => void;
}

const Coa: React.FC<CoaProps> = ({ accounts, searchTerm, setSearchTerm, onAdd }) => {
  const filteredAccounts = accounts.filter(
    (account) =>
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Account
        </button>
      </div>
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
    </div>
  );
};

export default Coa;
