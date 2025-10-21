// Journal-Entries.tsx
import React from "react";

interface JournalEntriesProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAdd: () => void;
}

const JournalEntries: React.FC<JournalEntriesProps> = ({ searchTerm, setSearchTerm, onAdd }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search journal entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Journal Entry
        </button>
      </div>
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Journal Entries</h3>
        <p className="text-gray-500">Journal entry management will be implemented here.</p>
      </div>
    </div>
  );
};

export default JournalEntries;
