import React, { useEffect, useState } from "react";
import ItemsCategoryModal from "../../components/inventory/ItemsCategoryModal";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { getAllItemGroups, deleteItemGroupByName, getItemGroupByName } from "../../api/itemCategoryApi";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination";

export interface ItemGroup {
  name: string;
  item_group_name: string;
  custom_description: string | null;
  custom_unit_of_measurement: string | null;
  custom_selling_price: number | string | null;
  custom_sales_account: string | null;
}

const ItemsCategory: React.FC = () => {
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ItemGroup | null>(null);
  const [search, setSearch] = useState("");


  const loadItemGroups = async () => {
    try {
      setLoading(true);
      const response = await getAllItemGroups(page, pageSize);
      setItemGroups(response.data);
      setTotalPages(response.pagination?.total_pages || 1);
      setTotalItems(response.pagination?.total || 1);
    } catch (err) {
      console.error("Error loading item group:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteItemsGroup = async (groupName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete item group "${groupName}"?`)) return;

    try {
      setLoading(true);
      const payload = { item_group_name: groupName };
      const res = await deleteItemGroupByName(payload);

      if (res.status_code !== 200) {
        toast.error(res.message);
        return;
      }

      setItemGroups(prev => prev.filter(g => g.item_group_name !== groupName));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };


  const handleAddItemsGroup = async () => {
    setEditingGroup(null);
    setIsModalOpen(true);
    try {
      await loadItemGroups();
      toast.success(
        editingGroup
          ? "Item updated successfully!"
          : "Item created successfully!",
      );
    } catch (err) {
      toast.error("Failed to refresh item list");
    }
  };

  const handleEditItem = async (item_group_name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const item = await getItemGroupByName(item_group_name);
      setEditingGroup(item.data ?? item);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch item group:", err);
      alert("Unable to fetch full item group details.");
    }
  };

  useEffect(() => {
    loadItemGroups();
  }, [page, pageSize]);

  const filtered = itemGroups.filter(g =>
    [
      g.name,
      g.item_group_name,
      g.custom_description,
      g.custom_unit_of_measurement,
      g.custom_selling_price,
      g.custom_sales_account,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddItemsGroup}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Items Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Unit of Measurement</th>
              <th className="px-4 py-2 text-left">Selling Price</th>
              <th className="px-4 py-2 text-left">Sales Account</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((group) => (
              <tr key={group.item_group_name} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{group.name}</td>
                <td className="px-4 py-2">{group.item_group_name}</td>
                <td className="px-4 py-2">{group.custom_description}</td>
                <td className="px-4 py-2">{group.custom_unit_of_measurement}</td>
                <td className="px-4 py-2">{group.custom_selling_price}</td>
                <td className="px-4 py-2">{group.custom_sales_account}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={(e) => handleEditItem(group.item_group_name, e)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteItemsGroup(group.item_group_name, e)}
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
      <ItemsCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => console.log("New Items Category:", data)}
      />
    </div>
  );
};

export default ItemsCategory;
