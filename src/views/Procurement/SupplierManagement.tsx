import React, { useState, useMemo, useEffect } from "react";
import SupplierDetailView from "./SupplierDetailView";
import SupplierModal from "../../components/procurement/SupplierModal";
import toast from "react-hot-toast";

import { getSuppliers } from "../../api/supplierApi";

// 🔥 SAME UI TABLE COMPONENTS AS CUSTOMER
import Table from "../../components/ui/Table/Table";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";

import type { Column } from "../../components/ui/Table/type";

// ================= TYPES =================
export interface Supplier {
  supplierName: string;
  supplierCode?: string;
  tpin?: string;
  contactPerson?: string;
  phoneNo?: string;
  emailId?: string;
  currency?: string;
  paymentTerms?: string;
  openingBalance?: string;
  accountNumber?: string;
  accountHolder?: string;
  swiftCode?: string;
  sortCode?: string;
  billingAddressLine1?: string;
  billingCity?: string;
  billingCountry?: string;
  status?: "active" | "inactive" | "pending";
  supplierId?: string; // backend id if exists
}

interface Props {}

const SupplierManagement: React.FC<Props> = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [viewMode, setViewMode] = useState<"table" | "detail">("table");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Modal State (same pattern as Customer)
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  // ================= FETCH SUPPLIERS =================
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await getSuppliers(); // API NOT REMOVED
      setSuppliers(res);
    } catch (err) {
      console.error("Error loading suppliers:", err);
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ================= SEARCH FILTER =================
  const filteredSuppliers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.supplierName?.toLowerCase().includes(term) ||
        (s.supplierCode ?? "").toLowerCase().includes(term) ||
        (s.tpin ?? "").toLowerCase().includes(term) ||
        (s.status ?? "").toLowerCase().includes(term),
    );
  }, [suppliers, searchTerm]);

  // ================= ROW CLICK =================
  const handleRowClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("table");
    setSelectedSupplier(null);
  };

  // ================= MODAL HANDLERS =================
  const handleAddSupplier = () => {
    setEditSupplier(null);
    setShowModal(true);
  };

  const handleEditSupplier = (supplier: Supplier, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditSupplier(supplier);
    setShowModal(true);
  };

  const handleSupplierSaved = async () => {
    setShowModal(false);
    setEditSupplier(null);
    await fetchSuppliers();
    toast.success(editSupplier ? "Supplier updated!" : "Supplier created!");
  };

  // ================= DELETE (API later) =================
  const handleDelete = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete supplier "${name}"?`)) {
      toast.success("Delete API ready — connect backend later");
    }
  };

  // ================= TABLE COLUMNS (ENTERPRISE STYLE) =================
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
            onDelete={(e) => handleDelete(s.supplierName, e as any)}
          />
        </ActionGroup>
      ),
    },
  ];

  // ================= UI =================
  return (
    <div className="p-8">
      {viewMode === "table" ? (
        <Table
          columns={columns}
          data={filteredSuppliers}
          showToolbar
          loading={loading}
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          enableAdd
          addLabel="Add Supplier"
          onAdd={handleAddSupplier}
          enableColumnSelector
        />
      ) : selectedSupplier ? (
        <SupplierDetailView
          supplier={selectedSupplier}
          suppliers={suppliers}
          onBack={handleBack}
          onSupplierSelect={handleRowClick}
          onEdit={(s) => {
            setEditSupplier(s);
            setShowModal(true);
          }}
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
