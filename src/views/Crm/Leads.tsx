import React, { useState } from "react";
import { Search } from "lucide-react";

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
  onAdd: () => void;
}

const Leads: React.FC<LeadsProps> = ({ leads, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");

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
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={onAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
        >
          + Add Lead
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Lead ID</th>
              <th className="px-4 py-3 text-left">Company Name</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Value</th>
              <th className="px-4 py-3 text-left">Source</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{lead.id}</td>
                <td className="px-4 py-2 font-semibold">{lead.name}</td>
                <td className="px-4 py-2">{lead.contact}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      lead.status === "Qualified"
                        ? "bg-green-100 text-green-800"
                        : lead.status === "New"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-2 font-semibold">
                  ${lead.value.toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {lead.source}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLeads.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No matches found." : "No leads yet."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
