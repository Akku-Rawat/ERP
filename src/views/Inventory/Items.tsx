import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getAllItems,
  getItemByItemCode,
  deleteItemByItemCode,
} from "../../api/itemApi";

import ItemModal from "../../components/inventory/ItemModal";
import DeleteModal from "../../components/actionModal/DeleteModal";

import Table from "../../components/ui/Table/Table";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";

import type { Column } from "../../components/ui/Table/type";

import type { ItemSummary, Item } from "../../types/item";


const Items: React.FC = () => {
  const [items, setItems] = useState<ItemSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemSummary | null>(null);
  const [deleting, setDeleting] = useState(false);


  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getAllItems(page, pageSize);
      setItems(res.data);
      setTotalPages(res.pagination?.total_pages || 1);
      setTotalItems(res.pagination?.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, pageSize]);

  /* ===============================
     HANDLERS
  ================================ */

  const handleAdd = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const handleEdit = async (itemCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await getItemByItemCode(itemCode);
      setEditItem(res.data);
      setShowModal(true);
    } catch {
      toast.error("Unable to fetch item details");
    }
  };

  const handleDeleteClick = (item: ItemSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await deleteItemByItemCode(itemToDelete.id);
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      toast.success("Item deleted successfully");
      setDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to delete item",
        { duration: 6000 },
      );
    } finally {
      setDeleting(false);
      setItemToDelete(null);
    }
  };

  const handleSaved = async () => {
    const wasEdit = !!editItem;
    setShowModal(false);
    setEditItem(null);
    await fetchItems();
    toast.success(wasEdit ? "Item updated" : "Item created");
  };

  /* ===============================
     FILTER
  ================================ */

  const filteredItems = items.filter((i) =>
    [
      i.id,
      i.itemName,
      i.itemGroup,
      i.taxCategory,
      i.preferredVendor,
      i.sellingPrice,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  /* ===============================
     COLUMNS
  ================================ */

  const columns: Column<ItemSummary>[] = [
    { key: "id", header: "Item Code", align: "left" },
    { key: "itemName", header: "Name", align: "left" },
    { key: "itemGroup", header: "Category", align: "left" },
    { key: "taxCategory", header: "Tax Category", align: "left" },
    {
      key: "minStockLevel",
      header: "Min Stock",
      align: "right",
    },
    {
      key: "maxStockLevel",
      header: "Max Stock",
      align: "right",
    },
    { key: "preferredVendor", header: "Supplier", align: "left" },
    {
      key: "sellingPrice",
      header: "Price",
      align: "right",
      render: (i) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          {i.sellingPrice}
        </code>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (i) => (
        <ActionGroup>
          <ActionButton
            type="view"
            onClick={(e) => handleEdit(i.id, e)}
          />
          <ActionMenu
            onEdit={(e) => handleEdit(i.id, e as any)}
            onDelete={(e) => handleDeleteClick(i, e as any)}
          />
        </ActionGroup>
      ),
    },
  ];

  /* ===============================
     RENDER
  ================================ */

  return (
    <div className="p-8">
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="mt-2 text-muted">Loading items…</p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredItems}
          showToolbar
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          enableAdd
          addLabel="Add Item"
          onAdd={handleAdd}
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      )}

      {/* ITEM MODAL */}
      <ItemModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditItem(null);
        }}
        onSubmit={handleSaved}
        initialData={editItem}
        isEditMode={!!editItem}
      />

      {/* DELETE MODAL */}
      {deleteModalOpen && itemToDelete && (
        <DeleteModal
          entityName="Item"
          entityId={itemToDelete.id}
          entityDisplayName={itemToDelete.itemName}
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
