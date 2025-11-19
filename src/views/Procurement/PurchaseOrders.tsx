import React, { useState } from "react";
import PurchaseOrderModal from "../../components/procurement/PurchaseOrderModal"

interface PurchaseOrdersTableProps {
  onAdd?: () => void;
}

const initialOrders = [
  { id: "PO-001", supplier: "TechSupply Co", date: "2025-01-15", amount: 48000, status: "Approved", deliveryDate: "2025-02-01" },
  { id: "PO-002", supplier: "Office Solutions", date: "2025-01-16", amount: 23000, status: "Pending", deliveryDate: "2025-02-05" },
  { id: "PO-003", supplier: "Equipment Plus", date: "2025-01-17", amount: 72000, status: "Draft", deliveryDate: "2025-02-10" },
];

const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({ onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredOrders = initialOrders.filter(
    (po) =>
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholder="Search Orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center gap-2">
          <button onClick={handleAddClick} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
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
              <th className="px-4 py-2 text-left">PO ID</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Delivery Date</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((po) => (
              <tr key={po.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{po.id}</td>
                <td className="px-4 py-2">{po.supplier}</td>
                <td className="px-4 py-2">{po.date}</td>
                <td className="px-4 py-2">${po.amount.toLocaleString()}</td>
                <td className="px-4 py-2">{po.status}</td>
                <td className="px-4 py-2">{po.deliveryDate}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render Purchase Order Modal */}
      <PurchaseOrderModal isOpen={modalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default PurchaseOrdersTable;
