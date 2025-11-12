import React, { useState } from "react";
import SupplierModal from "../../components/supplier/SupplierModal";

const suppliersData = [
  {
    id: "SUP-001",
    name: "TechSupply Co",
    contact: "David Wilson",
    phone: "+260-97-123-4567",
    status: "Active",
    rating: 4.5,
    orders: 15,
  },
  {
    id: "SUP-002",
    name: "Office Solutions",
    contact: "Emma Brown",
    phone: "+260-97-234-5678",
    status: "Active",
    rating: 4.2,
    orders: 8,
  },
  {
    id: "SUP-003",
    name: "Equipment Plus",
    contact: "John Smith",
    phone: "+260-97-345-6789",
    status: "Active",
    rating: 4.7,
    orders: 12,
  },
];

const Performance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const filteredSuppliers = suppliersData.filter(
    (supplier) =>
      supplier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
     

      {/* Search + Actions */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="search"
          placeholder="Search suppliers by ID, name, or contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />
        <div className="flex gap-3">
          <button
            onClick={() => setShowSupplierModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Add Supplier
          </button>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
            Export
          </button>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Supplier ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-teal-700">
                    {supplier.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{supplier.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{supplier.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{supplier.phone}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {supplier.rating} stars
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{supplier.orders}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <SupplierModal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        onSubmit={(data) => {
          console.log("New Supplier:", data);
          setShowSupplierModal(false);
        }}
      />
    </div>
  );
};

export default Performance;