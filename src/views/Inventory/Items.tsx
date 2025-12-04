import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import ItemModal from "../../components/inventory/ItemModal";

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  supplier: string;
}

interface ProductsProps {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAdd: () => void;
}

const Items: React.FC<ProductsProps> = ({
  products,
  searchTerm,
  setSearchTerm,
  onAdd,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.id.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        p.supplier.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    );
  }, [products, searchTerm]);

  const handleAddClick = () => {
    setSelectedProduct(null); // Add mode
    setModalOpen(true);
    onAdd();
  };

  const handleEdit = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete item "${product.name}"?`)) {
      // Connect this to deletion logic/API!
      alert("Delete functionality ready — connect to API later");
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header: Search Input + Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Item
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-6 py-4 text-left">Product ID</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Stock</th>
              <th className="px-6 py-4 text-left">Min Stock</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Supplier</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
              >
                <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                  {p.id}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {p.name}
                </td>
                <td className="px-6 py-4">{p.category}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4">{p.minStock}</td>
                <td className="px-6 py-4">${p.price.toLocaleString()}</td>
                <td className="px-6 py-4">{p.supplier}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => handleEdit(p, e)}
                      className="text-indigo-600 hover:text-indigo-800 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(p, e)}
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
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            {searchTerm
              ? "No products match your search."
              : "No products added yet."}
          </div>
        )}
      </div>
      {/* Modal for add/edit */}
      <ItemModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        item={selectedProduct}
        onSubmit={(data) => {
          setModalOpen(false);
          // Do save logic here (local state/API)
        }}
      />
    </div>
  );
};

export default Items;
