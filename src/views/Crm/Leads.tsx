// Leads.tsx
import React from "react";

interface Lead {
  id: string;
  name: string;
  contact: string;
  status: string;
  value: number;
  source: string;
}

interface LeadsProps {
  leads: Lead[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAdd: () => void;
}

const Leads: React.FC<LeadsProps> = ({ leads, searchTerm, setSearchTerm, onAdd }) => {
  const filteredLeads = leads.filter(
    (lead) =>
      lead.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.value.toString().includes(searchTerm)
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Lead
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Lead ID</th>
              <th className="px-4 py-2 text-left">Company Name</th>
              <th className="px-4 py-2 text-left">Contact</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Value</th>
              <th className="px-4 py-2 text-left">Source</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{lead.id}</td>
                <td className="px-4 py-2">{lead.name}</td>
                <td className="px-4 py-2">{lead.contact}</td>
                <td className="px-4 py-2">{lead.status}</td>
                <td className="px-4 py-2">${lead.value.toLocaleString()}</td>
                <td className="px-4 py-2">{lead.source}</td>
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

export default Leads;
