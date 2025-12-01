// Warehouses.tsx
import React from "react";

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

const Warehouses: React.FC<WarehousesProps> = ({ warehouses, searchTerm, setSearchTerm, onAdd }) => {
  const filteredWarehouses = warehouses.filter(
    (w) =>
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search warehouses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Warehouse
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Warehouse ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Manager</th>
              <th className="px-4 py-2 text-left">Items</th>
              <th className="px-4 py-2 text-left">Capacity</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWarehouses.map((w) => (
              <tr key={w.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{w.id}</td>
                <td className="px-4 py-2">{w.name}</td>
                <td className="px-4 py-2">{w.location}</td>
                <td className="px-4 py-2">{w.manager}</td>
                <td className="px-4 py-2">{w.items}</td>
                <td className="px-4 py-2">{w.capacity}</td>
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

export default Warehouses;
