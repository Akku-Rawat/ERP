import React, { useState, useEffect } from "react";
import ItemModal from "../../components/inventory/ItemModal";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getAllItems,
  getItemByItemCode,
  deleteItemByItemCode,
} from "../../api/itemApi";
import Pagination from "../../components/Pagination";
import DeleteModal from "../../components/actionModal/DeleteModal";

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = (itemCode: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const itemToDelete = item.find((i) => i.id === itemCode);
    console.log("itemToDelete" + itemToDelete);
    if (itemToDelete) {
      setItemToDelete(itemToDelete);
      setDeleteModalOpen(true);
    } else {
      toast.error("Item not found");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);

      await deleteItemByItemCode(itemToDelete.id);

      setItem((prev) => prev.filter((i) => i.id !== itemToDelete.id));

      toast.success("Item deleted successfully!", { duration: 2000 });
      setDeleteModalOpen(false);
    } catch (err: any) {
      let errorMessage = "Failed to delete item";

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
            .join(" ")
            .replace(/<[^>]*>/g, "")
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, "\\")
            .trim();
        } catch (e) {
          errorMessage = err.response.data.message || errorMessage;
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      toast.error(errorMessage, {
        duration: 10000,
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setDeleting(false);
      setItemToDelete(null);
    }
  };

  const handleAddItem = async () => {
    setEditItems(null);
    setShowItemsModal(true);
  };

  const handleItemSuccess = async () => {
    const wasEditMode = !!editItems;
    setShowItemsModal(false);
    setEditItems(null);

    try {
      await fetchItems();
      toast.success(
        wasEditMode
          ? "Item updated successfully!"
          : "Item created successfully!",
      );
    } catch (err) {
      toast.error("Item saved but failed to refresh list");
    }
  };

  const handleEditItem = async (itemCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const item = await getItemByItemCode(itemCode);
      console.log("Item Code" + item);
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
      i.id,
      i.itemName,
      i.itemGroup,
      i.minStockLevel,
      i.maxStockLevel,
      i.preferredVendor,
      i.sellingPrice,
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
              <th className="px-4 py-2 text-left">Tax Category</th>
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
                <td className="px-4 py-2">{i.id}</td>
                <td className="px-4 py-2">{i.itemName}</td>
                <td className="px-4 py-2">{i.itemGroup}</td>
                <td className="px-4 py-2">{i.taxCategory}</td>
                <td className="px-4 py-2">{i.minStockLevel}</td>
                <td className="px-4 py-2">{i.maxStockLevel}</td>
                <td className="px-4 py-2">{i.preferredVendor}</td>
                <td className="px-4 py-2">{i.sellingPrice}</td>
                {/* <td className="px-4 py-2 text-center">
                  <button className="text-blue-600 hover:underline">View</button>
                </td> */}
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={(e) => handleEditItem(i.id, e)}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(i.id, e)}
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
        onSubmit={handleItemSuccess}
        initialData={editItems}
        isEditMode={!!editItems}
      />
      {deleteModalOpen && itemToDelete && (
        <DeleteModal
          entityName="Item"
          entityId={itemToDelete.item_code}
          entityDisplayName={itemToDelete.item_name}
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

export default Items;
