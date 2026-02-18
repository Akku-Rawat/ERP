import React, { useState, useMemo, useEffect } from "react";
import SupplierDetailView from "./SupplierDetailView";
import SupplierModal from "../../components/procurement/supply/SupplierModal";
import toast from "react-hot-toast";

import { getSupplierById , getSuppliers } from "../../api/procurement/supplierApi";
import { mapSupplierApi } from "../../types/Supply/supplierMapper";

import Table from "../../components/ui/Table/Table";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";
import type { Column } from "../../components/ui/Table/type";
import type { Supplier} from "../../types/Supply/supplier";
import { showSuccess } from "../../components/alert";

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
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);

  


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
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchSuppliers();
}, [page, pageSize]);



const fetchAllSuppliers = async () => {
  try {
    const res = await getSuppliers(1, 1000); 
    const list = res.data.suppliers.map((s: any) => ({
      ...s,
      status: normalizeStatus(s.status),
    }));
    setAllSuppliers(list);
  } catch (e) {
    console.error(e);
  }
};




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



const ensureAllSuppliers = async () => {
  if (!allSuppliers.length) {
    await fetchAllSuppliers();
  }
};

  
const handleRowClick = async (supplier: Supplier) => {
  if (!supplier.supplierId) return;

  try {
    setLoading(true);

    // Ensure sidebar suppliers loaded
    await ensureAllSuppliers();

    //  Fetch selected supplier detail
    const res = await getSupplierById(supplier.supplierId);
    const mapped = mapSupplierApi(res.data || res);

    setSelectedSupplier(mapped);
    setViewMode("detail");
  } catch (err) {
    console.error(err);
    console.error("Failed to load supplier detail");
  } finally {
    setLoading(false);
  }
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

const handleEditSupplier = async (supplier: Supplier) => {
  if (!supplier.supplierId) return;

  setLoading(true);
  const res = await getSupplierById(supplier.supplierId);
  const mapped = mapSupplierApi(res.data || res);

  setEditSupplier(mapped); 
  setShowModal(true);
  setLoading(false);
};


const handleSupplierSaved = async () => {
  await fetchSuppliers();     
  setShowModal(false);        
  setEditSupplier(null);
};


const handleEditFromDetail = (supplier: Supplier) => {
  handleEditSupplier(supplier);
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
            iconOnly
          />

          <ActionMenu
            onEdit={(e) => handleEditSupplier(s)}
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
          suppliers={allSuppliers} 
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
