import React, { useState, useMemo, useEffect } from "react";
import SupplierDetailView from "./SupplierDetailView";
import SupplierModal from "../../components/procurement/supply/SupplierModal";
import toast from "react-hot-toast";

import { getSuppliers } from "../../api/supplierApi";
import { getSupplierById } from "../../api/supplierApi";
import { mapSupplierApi } from "../../types/Supply/supplierMapper";

import Table from "../../components/ui/Table/Table";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";
import type { Column } from "../../components/ui/Table/type";
import type { Supplier} from "../../types/Supply/supplier";


interface Props {}

const SupplierManagement: React.FC<Props> = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [viewMode, setViewMode] = useState<"table" | "detail">("table");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);


  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  


const normalizeStatus = (status?: string) => {
  if (!status) return "active";

  const s = status.toLowerCase();

  if (s === "unactive" || s === "inactive") return "inactive";
  if (s === "active") return "active";

  return "active";
};


// FETCH SUPPLIERS
const fetchSuppliers = async () => {
  try {
    setLoading(true);

    const res = await getSuppliers(page, pageSize);

    const list = res.data.suppliers.map((s: any) => ({
      ...s,
      status: normalizeStatus(s.status),
    }));

    setSuppliers(list);
    setTotalPages(res.data.pagination?.total_pages || 1);
    setTotalItems(res.data.pagination?.total || 0);


  } catch (err) {
    console.error("Error loading suppliers:", err);
    toast.error("Failed to load suppliers");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchSuppliers();
}, [page, pageSize]);


  //  SEARCH FILTER 
const filteredSuppliers = useMemo(() => {
  const term = searchTerm.toLowerCase();
  return suppliers.filter(
    (s) =>
      (s.supplierName || "").toLowerCase().includes(term) ||
      (s.supplierCode || "").toLowerCase().includes(term) ||
      (s.tpin || "").toLowerCase().includes(term) ||
      (s.status || "").toLowerCase().includes(term)
  );
}, [suppliers, searchTerm]);


  
const handleRowClick = (supplier: Supplier) => {
  if (!supplier.supplierId) {
    toast.error("Invalid supplier record");
    return;
  }

  setSelectedSupplier(supplier);
  setViewMode("detail");
};


  const handleBack = () => {
    setViewMode("table");
    setSelectedSupplier(null);
  };

  //  MODAL HANDLERS 
  const handleAddSupplier = () => {
    setEditSupplier(null);
    setShowModal(true);
  };

const handleEditSupplier = async (supplier: Supplier, e: React.MouseEvent) => {
  e.stopPropagation();

  if (!supplier.supplierId) {
    toast.error("Supplier ID missing");
    return;
  }

  try {
    setLoading(true);
    const res = await getSupplierById(supplier.supplierId);
    const mapped = mapSupplierApi(res.data || res);

    setEditSupplier(mapped);
    setShowModal(true);
    toast.success("Supplier loaded");

  } catch (err) {
    console.error("Failed to load supplier for edit", err);
    toast.error("Failed to load supplier details");
  } finally {
    setLoading(false);
  }
};


const handleSupplierSaved = async () => {
  setShowModal(false);
  setEditSupplier(null);
  await fetchSuppliers();

  toast.success(editSupplier ? "Supplier updated successfully" : "Supplier created successfully");
};

  const handleEditFromDetail = async (supplier: Supplier) => {
  await handleEditSupplier(supplier, {} as any);
};


  //  TABLE COLUMNS (ENTERPRISE STYLE) 
  const columns: Column<Supplier>[] = [
    { key: "supplierCode", header: "Code", align: "left" },

    { key: "supplierName", header: "Supplier Name", align: "left" },

    {
      key: "tpin",
      header: "TPIN",
      align: "left",
      render: (s) =>
        s.tpin ? (
          <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
            {s.tpin}
          </code>
        ) : (
          <span className="text-muted">—</span>
        ),
    },

    {
      key: "currency",
      header: "Currency",
      align: "left",
      render: (s) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          {s.currency || "ZMW"}
        </code>
      ),
    },

    {
      key: "status",
      header: "Status",
      align: "left",
      render: (s) => <StatusBadge status={s.status || "active"} />,
    },

    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (s) => (
        <ActionGroup>
          <ActionButton
            type="view"
            onClick={() => handleRowClick(s)}
            iconOnly={false}
          />

          <ActionMenu
            onEdit={(e) => handleEditSupplier(s, e as any)}
          />
        </ActionGroup>
      ),
    },
  ];

  //  UI 
  return (
    <div className="p-8">
      {viewMode === "table" ? (
        <Table
          columns={columns}
          data={filteredSuppliers}
          showToolbar
          loading={loading}
          onPageSizeChange={(size) => setPageSize(size)}
          pageSizeOptions={[10, 25, 50, 100]}
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          enableAdd
          addLabel="Add Supplier"
          onAdd={handleAddSupplier}
          enableColumnSelector
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      ) : selectedSupplier ? (
        <SupplierDetailView
          supplier={selectedSupplier}
          suppliers={suppliers}
          onBack={handleBack}
          onSupplierSelect={handleRowClick}
          onEdit={handleEditFromDetail}
        />
      ) : null}


      {/* SUPPLIER MODAL */}
      <SupplierModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditSupplier(null);
        }}
        onSubmit={handleSupplierSaved}
        initialData={editSupplier}
        isEditMode={!!editSupplier}
      />
    </div>
  );
};

export default SupplierManagement;
