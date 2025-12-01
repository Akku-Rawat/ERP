import React, { useState } from "react";
import RfqTabsModal from "../../components/procurement/RfqModal";

interface RFQsTableProps {
  onAdd?: () => void;
}

const initialRFQs = [
  { id: "RFQ-001", supplier: "TechSupply Co", date: "2025-01-10", amount: 50000, status: "Awaiting Response", dueDate: "2025-01-25" },
  { id: "RFQ-002", supplier: "Office Solutions", date: "2025-01-12", amount: 25000, status: "Received", dueDate: "2025-01-27" },
  { id: "RFQ-003", supplier: "Equipment Plus", date: "2025-01-14", amount: 75000, status: "In Review", dueDate: "2025-01-29" },
];

const RFQsTable: React.FC<RFQsTableProps> = ({ onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredRFQs = initialRFQs.filter(
    (rfq) =>
      rfq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setModalOpen(true);
    if (onAdd) onAdd();
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search RFQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Add
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">RFQ ID</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRFQs.map((rfq) => (
              <tr key={rfq.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{rfq.id}</td>
                <td className="px-4 py-2">{rfq.supplier}</td>
                <td className="px-4 py-2">{rfq.date}</td>
                <td className="px-4 py-2">${rfq.amount.toLocaleString()}</td>
                <td className="px-4 py-2">{rfq.status}</td>
                <td className="px-4 py-2">{rfq.dueDate}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render RFQ Modal */}
      <RfqTabsModal isOpen={modalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default RFQsTable;
