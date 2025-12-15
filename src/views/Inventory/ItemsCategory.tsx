import React, { useEffect, useState } from "react";
import ItemsCategoryModal from "../../components/inventory/ItemsCategoryModal";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getAllItemGroups,
  deleteItemGroupById,
  getItemGroupById,
} from "../../api/itemCategoryApi";
import Pagination from "../../components/Pagination";
import DeleteModal from "../../components/actionModal/DeleteModal";

const ItemsCategory: React.FC = () => {
  const [itemGroups, setItemGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState<{ id: string; name?: string } | null>(null);
const [deleting, setDeleting] = useState(false);

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
// const handleDeleteItemsGroup = async (id: string, e: React.MouseEvent) => {
//   e.stopPropagation();

//   const group = itemGroups.find(g => g.id === id);
//   if (!confirm(`Delete item group "${group?.name || id}"?`)) return;

//   try {
//     setLoading(true);
//     await deleteItemGroupById(id);   

//     setItemGroups(prev => prev.filter(g => g.id !== id));
//     toast.success("Deleted successfully");
//   } catch {
//     toast.error("Delete failed");
//   } finally {
//     setLoading(false);
//   }
// };
const confirmDelete = async () => {
  if (!itemToDelete) return;

  try {
    setDeleting(true);

    await deleteItemGroupById(itemToDelete.id);

    setItemGroups((prev) => prev.filter((g) => g.id !== itemToDelete.id));

    toast.success("Item group deleted successfully!", { duration: 2000 });
    setDeleteModalOpen(false);
  } catch (err: any) {
    let errorMessage = "Failed to delete item group";

    if (err.response?.data?._server_messages) {
      try {
        const serverMsgs = JSON.parse(err.response.data._server_messages);
        errorMessage = serverMsgs
          .map((msg: string) => {
            try {
              const parsed = JSON.parse(msg);
              return parsed.message || "";
            } catch {
              return msg;
            }
          })
          .filter(Boolean)
          .join("\n")
          .replace(/<[^>]*>/g, "")      // strip HTML
          .replace(/\\"/g, '"')         // fix escaped quotes
          .replace(/\\\\/g, "\\")       // fix double escapes
          .trim();
      } catch {
        errorMessage = err.response?.data?.message || errorMessage;
      }
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    toast.error(errorMessage, {
      duration: 10000,
      style: { whiteSpace: "pre-line" }, // preserves line breaks for better readability
    });
  } finally {
    setDeleting(false);
    setItemToDelete(null);
  }
};
const handleDelete = (id: string) => {
  const group = itemGroups.find(g => g.id === id);
  if (!group) return toast.error("Item group not found");

  setItemToDelete({ id: group.id, name: group.name });
  setDeleteModalOpen(true);
};

  const handleAddItemsGroup = async () => {
    setEditingGroup(null);
    setIsModalOpen(true);
    // try {
    //   await loadItemGroups();
    //   toast.success(
    //     editingGroup
    //       ? "Item updated successfully!"
    //       : "Item created successfully!",
    //   );
    // } catch (err) {
    //   toast.error("Failed to refresh item list");
    // }
  };

  const handleCategorySuccess = async () => {
  const wasEditMode = !!editingGroup;  
  setIsModalOpen(false);
  setEditingGroup(null);

  try {
    await loadItemGroups();   
    toast.success(
      wasEditMode
        ? "Category updated successfully!"
        : "Category created successfully!"
    );
  } catch (err) {
    toast.error("Category saved but failed to refresh list");
  }
};

  const handleEditItem = async (
    id: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    try {
      const item = await getItemGroupById(id);
      console.log("id" + item);
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

  const filtered = itemGroups.filter((g: any) =>
    [
      g.id,
      g.groupName,
      g.description,
      g.unitOfMeasurement,
      g.sellingPrice,
      g.salesAccount,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
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
              <th className="px-4 py-2 text-left">Id</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Unit of Measurement</th>
              <th className="px-4 py-2 text-left">Selling Price</th>
              <th className="px-4 py-2 text-left">Sales Account</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr
                key={g.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-2">{g.id}</td>
                <td className="px-4 py-2">{g.groupName}</td>
                <td className="px-4 py-2">{g.description}</td>
                <td className="px-4 py-2">
                  {g.unitOfMeasurement}
                </td>
                <td className="px-4 py-2">{g.sellingPrice}</td>
                <td className="px-4 py-2">{g.salesAccount}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={(e) => handleEditItem(g.id, e)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) =>
                      handleDelete(g.id)
                    }
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
        onSubmit={handleCategorySuccess}
        initialData={editingGroup}
        isEditMode={!!editingGroup}
      />
      {deleteModalOpen && itemToDelete && (
  <DeleteModal
    entityName="Item Group"                     
    entityId={itemToDelete.id}                   
    entityDisplayName={itemToDelete.name}     
    isLoading={deleting}
    onClose={() => {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }}
    onDelete={confirmDelete}
  />
)}
    </div>
  );
};

export default ItemsCategory;
