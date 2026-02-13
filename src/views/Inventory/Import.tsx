import React, { useEffect, useState } from "react";
import { toast } from "sonner";



import { getAllItemsApi } from "../../api/importApi";
import { getItemByItemCode, deleteItemByItemCode } from "../../api/itemApi";

import DeleteModal from "../../components/actionModal/DeleteModal";

import Table from "../../components/ui/Table/Table";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";

import type { Column } from "../../components/ui/Table/type";

import type { Item, ItemSummary } from "../../types/item";

const Items: React.FC = () => {
  const [items, setItems] = useState<ItemSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  // const [showModal, setShowModal] = useState(false); // Unused
  // const [editItem, setEditItem] = useState<Item | null>(null); // Unused
  const [initialLoad, setInitialLoad] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemSummary | null>(null);
  const [deleting, setDeleting] = useState(false);


  const fetchItems = async () => {
    try {
      setLoading(true);
      const apiData = await getAllItemsApi({ page, page_size: pageSize });
      // Map API data to ImportSummary[]
      const mapped = Array.isArray(apiData?.items || apiData)
        ? (apiData.items || apiData).map((entry: any) => ({
            id: entry.id || entry.name || "",
            itemName: entry.item_name || entry.itemName || "",
            itemGroup: entry.item_group || entry.itemGroup || "",
            itemClassCode: entry.item_class_code || entry.itemClassCode || "",
            unitOfMeasureCd: entry.unit_of_measure_cd || entry.unitOfMeasureCd || "",
            sellingPrice: entry.selling_price || entry.sellingPrice || 0,
            preferredVendor: entry.preferred_vendor || entry.preferredVendor || "",
            minStockLevel: entry.min_stock_level || entry.minStockLevel || "",
            maxStockLevel: entry.max_stock_level || entry.maxStockLevel || "",
            taxCategory: entry.tax_category || entry.taxCategory || "",
            date: entry.date || entry.posting_date || entry.postingDate || "",
            orgSarNo: entry.orgSarNo || entry.org_sar_no || entry.org_sarNo || entry.orgsarno || "",
            registrationType: entry.registrationType || entry.registration_type || entry.registrationtype || "",
            stockEntryType: entry.stockEntryType || entry.stock_entry_type || entry.stockentrytype || "",
            totalTaxableAmount: entry.totalTaxableAmount || entry.total_taxable_amount || entry.totaltaxableamount || 0,
            warehouse: entry.warehouse || "",
          }))
        : [];
      setItems(mapped);
      // If API returns total count and pages, use them:
      setTotalPages(apiData?.total_pages || 1);
      setTotalItems(apiData?.total_count || mapped.length);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, pageSize]);

  /*      HANDLERS
   */

  const handleAdd = () => {
    // Add item logic (modal removed)
  };

  const handleEdit = async (itemCode: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Edit item logic (modal removed)
    try {
      await getItemByItemCode(itemCode);
      // setEditItem(res);
      // setShowModal(true);
    } catch {
      toast.error("Unable to fetch item details");
    }
  } 

  const handleDeleteClick = (item: ItemSummary, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setItemToDelete(item);
    setDeleteModalOpen(true);
  } 

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await deleteItemByItemCode(itemToDelete.id);
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      toast.success("Item deleted successfully");
      setDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete item", {
        duration: 6000,
      });
    } finally {
      setDeleting(false);
      setItemToDelete(null);
    }
  };

  // const handleSaved = async () => {
  //   const wasEdit = !!editItem;
  //   setShowModal(false);
  //   setEditItem(null);
  //   await fetchItems();
  //   toast.success(wasEdit ? "Item updated" : "Item created");
  // };

  /*      FILTER
   */

  const filteredItems = items.filter((i) =>
    [
      i.id,
      i.itemName,
      i.itemGroup,
      i.itemClassCode,
      i.sellingPrice,
      i.preferredVendor,
      i.taxCategory,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  /*      COLUMNS
   */

  const columns: Column<ItemSummary>[] = [
    { key: "id", header: "ID", align: "left" },
    { key: "itemName", header: "Item Name", align: "left" },
    { key: "itemGroup", header: "Item Group", align: "left" },
    { key: "itemClassCode", header: "Class Code", align: "left" },
    { key: "sellingPrice", header: "Selling Price", align: "left"},
    { key: "preferredVendor", header: "Preferred Vendor", align: "left" },
    { key: "taxCategory", header: "Tax Category", align: "left" },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (i) => (
        <ActionGroup>
          <ActionButton type="view" onClick={(e?: React.MouseEvent) => handleEdit(i.id, e)} />
          <ActionMenu
            onEdit={(e?: React.MouseEvent) => handleEdit(i.id, e)}
            onDelete={(e?: React.MouseEvent) => handleDeleteClick(i, e)}
          />
        </ActionGroup>
      ),
    },
  ];

  /*      RENDER
   */

  return (
    <div className="p-8">
      <Table
        loading={loading || initialLoad}
        serverSide
        columns={columns}
        data={filteredItems}
        showToolbar
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        onAdd={handleAdd}
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        pageSizeOptions={[10, 25, 50, 100]}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1); // reset page
        }}
        onPageChange={setPage}
      />

      {/* DELETE MODAL */}
      {deleteModalOpen && itemToDelete && (
        <DeleteModal
          entityName="Import Item"
          entityId={itemToDelete.id}
          entityDisplayName={itemToDelete.id}
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
