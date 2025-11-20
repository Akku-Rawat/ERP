import React, { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import LeadModal from "../../components/crm/LeadModal";  // Adjust path if needed

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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.id.toLowerCase().includes(term) ||
        lead.name.toLowerCase().includes(term) ||
        lead.contact.toLowerCase().includes(term) ||
        lead.status.toLowerCase().includes(term) ||
        lead.source.toLowerCase().includes(term) ||
        lead.value.toString().includes(term)
    );
  }, [leads, searchTerm]);

  // Add handler (opens modal in add mode)
  const handleAddClick = () => {
    setSelectedLead(null);
    setModalOpen(true);
    onAdd();
  };

  // Edit handler (opens modal in edit mode)
  const handleEditClick = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLead(lead);
    setModalOpen(true);
  };

  // Delete handler (add actual delete logic as needed)
  const handleDeleteClick = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete lead "${lead.name}"?`)) {
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
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Lead
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-6 py-4 text-left">Lead ID</th>
              <th className="px-6 py-4 text-left">Company Name</th>
              <th className="px-6 py-4 text-left">Contact</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Value</th>
              <th className="px-6 py-4 text-left">Source</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150">
                <td className="px-6 py-4 font-mono text-sm text-indigo-600">{lead.id}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{lead.name}</td>
                <td className="px-6 py-4">{lead.contact}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
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
                <td className="px-6 py-4 font-semibold">
                  ${lead.value.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {lead.source}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => handleEditClick(lead, e)}
                      className="text-indigo-600 hover:text-indigo-800 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(lead, e)}
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

        {filteredLeads.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            {searchTerm ? "No matches found." : "No leads yet."}
          </div>
        )}
      </div>
      {/* Lead modal for add/edit */}
      <LeadModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        lead={selectedLead}
        onSubmit={(data) => {
          setModalOpen(false);
          // Save or update logic here (API/local state)
        }}
      />
    </div>
  );
};

export default Leads;
