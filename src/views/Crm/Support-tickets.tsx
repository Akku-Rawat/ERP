import React, { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import TicketModal from "../../components/crm/TicketModal"; // Adjust path as needed

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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filteredTickets = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return tickets.filter(
      (t) =>
        t.id.toLowerCase().includes(term) ||
        t.title.toLowerCase().includes(term) ||
        t.customer.toLowerCase().includes(term) ||
        t.priority.toLowerCase().includes(term) ||
        t.status.toLowerCase().includes(term) ||
        t.created.toLowerCase().includes(term),
    );
  }, [tickets, searchTerm]);

  const handleAddClick = () => {
    setSelectedTicket(null);
    setModalOpen(true);
    onAdd();
  };

  const handleEditClick = (ticket: Ticket, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleDeleteClick = (ticket: Ticket, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete ticket "${ticket.title}"?`)) {
      alert("Delete functionality ready — connect to API later");
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Ticket
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-6 py-4 text-left">Ticket ID</th>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Priority</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Created</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTickets.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
              >
                <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                  {t.id}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {t.title}
                </td>
                <td className="px-6 py-4">{t.customer}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
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
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
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
                <td className="px-6 py-4 text-sm text-gray-600">{t.created}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => handleEditClick(t, e)}
                      className="text-indigo-600 hover:text-indigo-800 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(t, e)}
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
        {filteredTickets.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            {searchTerm ? "No matches found." : "No tickets yet."}
          </div>
        )}
      </div>
      {/* Modal for ticket add/edit */}
      <TicketModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        ticket={selectedTicket}
        onSubmit={(data) => {
          setModalOpen(false);
          // Save or update logic here
        }}
      />
    </div>
  );
};

export default SupportTickets;
