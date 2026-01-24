import React, { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import RfqTabsModal from "../../components/procurement/rfq/RfqModal";

interface RFQ {
  id: string;
  supplier: string;
  date: string;
  amount: number;
  status: string;
  dueDate: string;
}

interface RFQsTableProps {
  onAdd?: () => void;
}

const initialRFQs: RFQ[] = [
  {
    id: "RFQ-001",
    supplier: "TechSupply Co",
    date: "2025-01-10",
    amount: 50000,
    status: "Awaiting Response",
    dueDate: "2025-01-25",
  },
  {
    id: "RFQ-002",
    supplier: "Office Solutions",
    date: "2025-01-12",
    amount: 25000,
    status: "Received",
    dueDate: "2025-01-27",
  },
  {
    id: "RFQ-003",
    supplier: "Equipment Plus",
    date: "2025-01-14",
    amount: 75000,
    status: "In Review",
    dueDate: "2025-01-29",
  },
];

const RFQsTable: React.FC<RFQsTableProps> = ({ onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);

  const filteredRFQs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return initialRFQs.filter(
      (rfq) =>
        rfq.id.toLowerCase().includes(term) ||
        rfq.supplier.toLowerCase().includes(term) ||
        rfq.status.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const handleAddClick = () => {
    setSelectedRFQ(null); // Clear any selected RFQ when adding
    setModalOpen(true);
    if (onAdd) onAdd();
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleEdit = (rfq: RFQ, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRFQ(rfq); // Set the RFQ being edited
    setModalOpen(true);
  };

  const handleDelete = (rfq: RFQ, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete RFQ "${rfq.id}"?`)) {
      // In a real app, remove from state or call API
      alert("Delete functionality ready — connect to API later");
    }
  };

  return (
    <div className="p-6 bg-app">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search RFQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add RFQ
          </button>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
            Export
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-6 py-4 text-left">RFQ ID</th>
              <th className="px-6 py-4 text-left">Supplier</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Due Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRFQs.map((rfq) => (
              <tr
                key={rfq.id}
                className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
              >
                <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                  {rfq.id}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {rfq.supplier}
                </td>
                <td className="px-6 py-4">{rfq.date}</td>
                <td className="px-6 py-4">${rfq.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      rfq.status === "Received"
                        ? "bg-green-100 text-green-800"
                        : rfq.status === "In Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {rfq.status}
                  </span>
                </td>
                <td className="px-6 py-4">{rfq.dueDate}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => handleEdit(rfq, e)}
                      className="text-indigo-600 hover:text-indigo-800 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(rfq, e)}
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
        {filteredRFQs.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            {searchTerm ? "No RFQs match your search." : "No RFQs added yet."}
          </div>
        )}
      </div>
      {/* Pass RFQ to modal for edit */}
      <RfqTabsModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        rfq={selectedRFQ}
      />
    </div>
  );
};

export default RFQsTable;
