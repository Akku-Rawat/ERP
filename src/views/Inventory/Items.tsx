import React, { useState, useEffect } from "react";
import ItemModal from "../../components/inventory/ItemModal";
import axios from "axios";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";

import {
  getAllItems,
  getItemByItemCode,
  deleteItemByItemCode,
} from "../../api/itemApi";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination";

interface ItemsProps {
  onAdd: () => void;
}

const Items: React.FC<ItemsProps> = ({ onAdd }) => {
  const [item, setItem] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [editItems, setEditItems] = useState<any | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getAllItems(page, pageSize);
      setItem(response.data);
      setTotalPages(response.pagination?.total_pages || 1);
      setTotalItems(response.pagination?.total || 1);
    } catch (err) {
      console.error("Error loading items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemCode: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const itemToDelete = item.find((i) => i.item_code === itemCode);
    if (!itemToDelete) return;

    const code = itemToDelete.item_code;
    console.log("item code " + itemCode);

    if (
      !window.confirm(
        `Are you sure you want to delete item with itemCode ${itemCode}?`,
      )
    )
      return;

    try {
      setLoading(true);
      await deleteItemByItemCode(code);
      setItem((prev) => prev.filter((c) => c.item_code !== code));
      alert("Item deleted successfully.");
    } catch (err: any) {
      console.error("Error deleting item:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete item.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    setEditItems(null);
    setShowItemsModal(true);
    try {
      await fetchItems();
      toast.success(
        editItems ? "Item updated successfully!" : "Item created successfully!",
      );
    } catch (err) {
      toast.error("Failed to refresh item list");
    }
  };

  const handleEditItem = async (item_code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const item = await getItemByItemCode(item_code);
      setEditItems(item.data ?? item);
      setShowItemsModal(true);
    } catch (err) {
      console.error("Failed to fetch item:", err);
      alert("Unable to fetch full item details.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, pageSize]);

  const filtered = item.filter((i: any) =>
    [
      i.item_code,
      i.item_name,
      i.item_group,
      i.custom_min_stock_level,
      i.custom_max_stock_level,
      i.custom_vendor,
      i.custom_selling_price,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Items
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Item Code</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Min Stock</th>
              <th className="px-4 py-2 text-left">Max Stock</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              // <tr key={i.id} className="border-t hover:bg-gray-50">
              <tr key={i.item_code} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{i.item_code}</td>
                <td className="px-4 py-2">{i.item_name}</td>
                <td className="px-4 py-2">{i.item_group}</td>
                <td className="px-4 py-2">{i.custom_min_stock_level}</td>
                <td className="px-4 py-2">{i.custom_max_stock_level}</td>
                <td className="px-4 py-2">{i.custom_vendor}</td>
                <td className="px-4 py-2">{i.custom_selling_price}</td>
                {/* <td className="px-4 py-2 text-center">
                  <button className="text-blue-600 hover:underline">View</button>
                </td> */}
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={(e) => handleEditItem(i.item_code, e)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(i.item_code, e)}
                    className="ml-2 text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      </div>
      <ItemModal
        isOpen={showItemsModal}
        onClose={() => {
          setShowItemsModal(false);
          setEditItems(null);
        }}
        onSubmit={handleAddItem}
        initialData={editItems}
        isEditMode={!!editItems}
      />
    </div>
  );
};

export default Items;
