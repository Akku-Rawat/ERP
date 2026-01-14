import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import WarehouseModal from "../../components/inventory/WarehouseModal"; // Adjust path as needed

interface Warehouse {
  id: string;
  name: string;
  location: string;
  manager: string;
  items: number;
  capacity: string;
}

interface WarehousesProps {
  warehouses: Warehouse[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAdd: () => void;
}

const Warehouses: React.FC<WarehousesProps> = ({
  warehouses,
  searchTerm,
  setSearchTerm,
  onAdd,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );

  const filteredWarehouses = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return warehouses.filter(
      (w) =>
        w.id.toLowerCase().includes(term) ||
        w.name.toLowerCase().includes(term) ||
        w.location.toLowerCase().includes(term) ||
        w.manager.toLowerCase().includes(term),
    );
  }, [warehouses, searchTerm]);

  const handleAddClick = () => {
    setSelectedWarehouse(null); // Add mode
    setModalOpen(true);
    onAdd();
  };

  const handleEdit = (warehouse: Warehouse, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWarehouse(warehouse);
    setModalOpen(true);
  };

  const handleDelete = (warehouse: Warehouse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete warehouse "${warehouse.name}"?`)) {
      alert("Delete functionality ready — connect to API later");
      // Connect this to deletion logic/API!
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="p-6 bg-app">
      {/* Header: Search Input + Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search warehouses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Warehouse
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-6 py-4 text-left">Warehouse ID</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Location</th>
              <th className="px-6 py-4 text-left">Manager</th>
              <th className="px-6 py-4 text-left">Items</th>
              <th className="px-6 py-4 text-left">Capacity</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredWarehouses.map((w) => (
              <tr
                key={w.id}
                className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
              >
                <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                  {w.id}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {w.name}
                </td>
                <td className="px-6 py-4">{w.location}</td>
                <td className="px-6 py-4">{w.manager}</td>
                <td className="px-6 py-4">{w.items}</td>
                <td className="px-6 py-4">{w.capacity}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => handleEdit(w, e)}
                      className="text-indigo-600 hover:text-indigo-800 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(w, e)}
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
        {filteredWarehouses.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            {searchTerm
              ? "No warehouses match your search."
              : "No warehouses added yet."}
          </div>
        )}
      </div>
      {/* Modal for add/edit */}
      <WarehouseModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        warehouse={selectedWarehouse}
        onSubmit={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Warehouses;
