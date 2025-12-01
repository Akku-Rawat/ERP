import React, { useState } from "react";
import { Search } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  customer: string;
  priority: string;
  status: string;
  created: string;
}

interface TicketsProps {
  tickets: Ticket[];
  onAdd: () => void;
}

const SupportTickets: React.FC<TicketsProps> = ({ tickets, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.created.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={onAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
        >
          + Add Ticket
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Ticket ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTickets.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{t.id}</td>
                <td className="px-4 py-2 font-semibold">{t.title}</td>
                <td className="px-4 py-2">{t.customer}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      t.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : t.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      t.status === "Open"
                        ? "bg-blue-100 text-blue-800"
                        : t.status === "In Progress"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{t.created}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No matches found." : "No tickets yet."}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
