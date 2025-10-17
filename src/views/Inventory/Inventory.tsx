import React, { useState } from "react";
import ProductModal from '../../components/inventory/ProductModal';
import WarehouseModal from '../../components/inventory/WarehouseModal';
import MovementModal from '../../components/inventory/MovementModal';


import{
  FaBoxOpen,
   FaWarehouse,
    FaTruckMoving, 
    FaBoxes

} from "react-icons/fa";

const inventory = {
  name: "Inventory",
  icon: <FaBoxes />,
  defaultTab: "products",
  tabs: [
    { id: "products", name: "Products", icon: <FaBoxOpen /> },
    { id: "warehouses", name: "Warehouses", icon: <FaWarehouse /> },
    { id: "movements", name: "Movements", icon: <FaTruckMoving /> },
  ],
  products: [
    { id: "PR-001", name: "Laptop Pro 14", category: "Electronics", stock: 120, minStock: 50, price: 1500, supplier: "TechSupply Co" },
    { id: "PR-002", name: "Office Chair", category: "Furniture", stock: 85, minStock: 30, price: 250, supplier: "Office Solutions" },
    { id: "PR-003", name: "Printer Ink", category: "Supplies", stock: 200, minStock: 100, price: 45, supplier: "Equipment Plus" },
  ],
  warehouses: [
    { id: "WH-001", name: "Main Warehouse", location: "Lusaka", manager: "John Doe", items: 450, capacity: "90%" },
    { id: "WH-002", name: "Regional Storage", location: "Ndola", manager: "Sarah Lee", items: 310, capacity: "75%" },
    { id: "WH-003", name: "Distribution Center", location: "Kitwe", manager: "Anna Wilson", items: 120, capacity: "80%" },
  ],
};

const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState(inventory.defaultTab);
  const [searchTerm, setSearchTerm] = useState("");

  const [showProductModal, setShowProductModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);

  const filteredProducts = inventory.products.filter(
    (p) =>
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWarehouses = inventory.warehouses.filter(
    (w) =>
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (activeTab === "products") setShowProductModal(true);
    else if (activeTab === "warehouses") setShowWarehouseModal(true);
    else if (activeTab === "movements") setShowMovementModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <span>{inventory.icon}</span> {inventory.name}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {inventory.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm("");
            }}
            className={`px-4 py-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>{tab.icon}</span> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Search + Add + Export */}
        {activeTab !== "movements" && (
          <div className="flex items-center justify-between mb-4">
            <input
              type="search"
              placeholder={`Search ${activeTab === "products" ? "products" : "warehouses"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                + Add
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                Export
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        {activeTab === "products" && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Product ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Stock</th>
                  <th className="px-4 py-2 text-left">Min Stock</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Supplier</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.category}</td>
                    <td className="px-4 py-2">{p.stock}</td>
                    <td className="px-4 py-2">{p.minStock}</td>
                    <td className="px-4 py-2">${p.price.toLocaleString()}</td>
                    <td className="px-4 py-2">{p.supplier}</td>
                    <td className="px-4 py-2 text-center">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Warehouses Table */}
        {activeTab === "warehouses" && (
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
        )}

        {/* Movements Section */}
        {activeTab === "movements" && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Stock Movements</h3>
            <p className="text-gray-500">
              Stock movement tracking and history will be displayed here.
            </p>
            <button
              onClick={handleAdd}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + Add Movement
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductModal isOpen={showProductModal} onClose={() => setShowProductModal(false)} onSubmit={(data) => console.log("New Product:", data)} />
      <WarehouseModal isOpen={showWarehouseModal} onClose={() => setShowWarehouseModal(false)} onSubmit={(data) => console.log("New Warehouse:", data)} />
      <MovementModal isOpen={showMovementModal} onClose={() => setShowMovementModal(false)} onSubmit={(data) => console.log("New Movement:", data)} />
    </div>
  );
};

export default Inventory;
