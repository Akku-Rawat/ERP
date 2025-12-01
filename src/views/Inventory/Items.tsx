import React, { useState, useEffect } from "react";
import ItemModal from "../../components/inventory/ItemModal";
import axios from "axios";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";

const base_url = import.meta.env.VITE_BASE_URL;
const GET_ITEMS_ENDPOINT = `${base_url}.item.item.get_all_items_api`;
// const DELETE_ITEMS_ENDPOINT = `${base_url}.item.item.delete_item_by_code_api?item_code=${item_code}`
console.log(GET_ITEMS_ENDPOINT);

interface ItemsProps {
  onAdd: () => void;
}

const Items: React.FC<ItemsProps> = ({ onAdd }) => {
  const [item, setItem] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemLoading, setItemLoading] = useState(true);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [editItems, setEditItems] = useState<any | null>(null);

  const fetchItems = async () => {
    try {
      setItemLoading(true);
      const response = await fetch(GET_ITEMS_ENDPOINT, {
        headers: { Authorization: import.meta.env.VITE_AUTHORIZATION },
      });
      if (!response.ok) throw new Error("Failed to load items");
      const result = await response.json();
      setItem(result.data || []);
    } catch (err) {
      console.error("Error loading item:", err);
    } finally {
      setItemLoading(false);
    }
  };

  const handleDelete = async (itemCode: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const itemToDelete = item.find((i) => i.item_code === itemCode);
    if (!itemToDelete) return;

    const code = itemToDelete.item_code;
    console.log("item code " + itemCode);
    if (!itemCode) {
      alert("Cannot delete — itemCode not found for this item.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete item with itemCode ${code}?`,
      )
    )
      return;

    try {
      setItemLoading(true);
      const DELETE_ITEMS_ENDPOINT = `${base_url}.item.item.delete_item_by_code_api?item_code=${code}`;

      await axios.delete(`${DELETE_ITEMS_ENDPOINT}`, {
        headers: { Authorization: import.meta.env.VITE_AUTHORIZATION },
      });

      setItem((prev) => prev.filter((c) => c.item_code !== code));
      alert("Item deleted successfully.");
    } catch (err: any) {
      console.error("Error deleting item:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete item.";
      alert(errorMsg);
    } finally {
      setItemLoading(false);
    }
  };

  const handleAddItem = () => {
    setEditItems(null);
    setShowItemsModal(true);
  };

  // const handleEditItem = (item: any, e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     setEditItems(item);
  //     setShowItemsModal(true);
  //   };
  const handleEdit = async (item_code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(
        `${base_url}.item.item.get_item_by_id_api?item_code=${item_code}`,
        {
          headers: { Authorization: import.meta.env.VITE_AUTHORIZATION },
        },
      );

      const fullItem = await res.json();

      setEditItems(fullItem.data ?? fullItem);
      setShowItemsModal(true);
    } catch (err) {
      console.error("Failed to fetch item:", err);
      alert("Unable to fetch full item details.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
                    // onClick={(e) => handleEditItem(i, e)}
                    onClick={(e) => handleEdit(i.item_code, e)}
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
