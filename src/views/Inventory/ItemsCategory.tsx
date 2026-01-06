import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getAllItemGroups,
  deleteItemGroupById,
  getItemGroupById,
} from "../../api/itemCategoryApi";

import ItemsCategoryModal from "../../components/inventory/ItemsCategoryModal";
import DeleteModal from "../../components/actionModal/DeleteModal";

import Table from "../../components/ui/Table/Table";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";

import type { Column } from "../../components/ui/Table/type";
import type { ItemGroupSummary, ItemGroup } from "../../types/itemCategory";

/* ===============================
   COMPONENT
================================ */

const ItemsCategory: React.FC = () => {
  const [groups, setGroups] = useState<ItemGroupSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editGroup, setEditGroup] = useState<ItemGroup | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<ItemGroupSummary | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  /* ===============================
     FETCH
  ================================ */

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await getAllItemGroups(page, pageSize);
      setGroups(res.data);
      setTotalPages(res.pagination?.total_pages || 1);
      setTotalItems(res.pagination?.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load item categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [page, pageSize]);

  /* ===============================
     HANDLERS
  ================================ */

  const handleAdd = () => {
    setEditGroup(null);
    setShowModal(true);
  };

  const handleEdit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await getItemGroupById(id);
      setEditGroup(res.data);
      setShowModal(true);
    } catch {
      toast.error("Unable to fetch item category");
    }
  };

  const handleDeleteClick = (group: ItemGroupSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setGroupToDelete(group);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;

    try {
      setDeleting(true);
      await deleteItemGroupById(groupToDelete.id);
      setGroups((prev) => prev.filter((g) => g.id !== groupToDelete.id));
      toast.success("Item category deleted");
      setDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to delete item category",
        { duration: 8000 }
      );
    } finally {
      setDeleting(false);
      setGroupToDelete(null);
    }
  };

  const handleSaved = async () => {
    const wasEdit = !!editGroup;
    setShowModal(false);
    setEditGroup(null);
    await fetchGroups();
    toast.success(wasEdit ? "Category updated" : "Category created");
  };

  /* ===============================
     FILTER
  ================================ */

  const filteredGroups = groups.filter((g) =>
    [g.id, g.groupName, g.description, g.unitOfMeasurement, g.salesAccount]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* ===============================
     TABLE COLUMNS
  ================================ */

  const columns: Column<ItemGroupSummary>[] = [
    { key: "id", header: "ID", align: "left" },
    { key: "groupName", header: "Name", align: "left" },
    { key: "description", header: "Description", align: "left" },
    {
      key: "unitOfMeasurement",
      header: "UOM",
      align: "left",
    },
    {
      key: "sellingPrice",
      header: "Selling Price",
      align: "right",
      render: (g) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          {g.sellingPrice}
        </code>
      ),
    },
    { key: "salesAccount", header: "Sales Account", align: "left" },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (g) => (
        <ActionGroup>
          <ActionButton type="view" onClick={(e) => handleEdit(g.id, e)} />
          <ActionMenu
            onEdit={(e) => handleEdit(g.id, e as any)}
            onDelete={(e) => handleDeleteClick(g, e as any)}
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
          <p className="mt-2 text-muted">Loading categories…</p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredGroups}
          showToolbar
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          enableAdd
          addLabel="Add Category"
          onAdd={handleAdd}
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      )}

      {/* CATEGORY MODAL */}
      <ItemsCategoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditGroup(null);
        }}
        onSubmit={handleSaved}
        initialData={editGroup}
        isEditMode={!!editGroup}
      />

      {/* DELETE MODAL */}
      {deleteModalOpen && groupToDelete && (
        <DeleteModal
          entityName="Item Category"
          entityId={groupToDelete.id}
          entityDisplayName={groupToDelete.groupName}
          isLoading={deleting}
          onClose={() => {
            setDeleteModalOpen(false);
            setGroupToDelete(null);
          }}
          onDelete={confirmDelete}
        />
      )}
    </div>
  );
};

export default ItemsCategory;
