import React, { useState, useMemo, useEffect } from "react";
import PurchaseInvoiceModal from "../../components/procurement/PurchaseInvoiceModal";
import toast from "react-hot-toast";

// Shared Table UI
import Table from "../../components/ui/Table/Table";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";
import type { Column } from "../../components/ui/Table/type";

// import { getPurchaseInvoices } from "../../api/purchaseInvoiceApi"; // later

interface PurchaseInvoice {
  id: string;
  supplier: string;
  date: string;
  amount: number;
  status: string;
  deliveryDate: string;
}

interface PurchaseInvoiceTableProps {
  onAdd?: () => void;
}

const PurchaseInvoiceTable: React.FC<PurchaseInvoiceTableProps> = ({
  onAdd,
}) => {
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<PurchaseInvoice | null>(null);

  // ================= FETCH INVOICES =================
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      // const res = await getPurchaseInvoices();
      // setInvoices(res.data);

      setInvoices([]); // temp empty
    } catch (err) {
      console.error("Failed to load invoices", err);
      toast.error("Failed to load Purchase Invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ================= FILTER =================
  const filteredInvoices = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return invoices.filter(
      (i) =>
        i.id.toLowerCase().includes(term) ||
        i.supplier.toLowerCase().includes(term) ||
        i.status.toLowerCase().includes(term),
    );
  }, [invoices, searchTerm]);

  // ================= MODAL HANDLERS =================
  const handleAddClick = () => {
    setSelectedInvoice(null);
    setModalOpen(true);
    onAdd?.();
  };

  const handleEdit = (invoice: PurchaseInvoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  const handleDelete = (invoice: PurchaseInvoice, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete Purchase Invoice "${invoice.id}"?`)) {
      toast.success("Delete API ready — connect backend later");
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  // ================= TABLE COLUMNS =================
  const columns: Column<PurchaseInvoice>[] = [
    { key: "id", header: "Invoice ID", align: "left" },
    { key: "supplier", header: "Supplier", align: "left" },
    { key: "date", header: "Date", align: "left" },

    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (i) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          ${i.amount?.toLocaleString()}
        </code>
      ),
    },

    {
      key: "status",
      header: "Status",
      align: "left",
      render: (i) => <StatusBadge status={i.status} />,
    },

    { key: "deliveryDate", header: "Delivery Date", align: "left" },

    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (i) => (
        <ActionGroup>
          <ActionButton type="view" onClick={() => setSelectedInvoice(i)} />

          <ActionMenu
            onEdit={(e) => handleEdit(i, e as any)}
            onDelete={(e) => handleDelete(i, e as any)}
          />
        </ActionGroup>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Table
        columns={columns}
        data={filteredInvoices}
        showToolbar
        loading={loading}
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        enableAdd
        addLabel="Add Invoice"
        onAdd={handleAddClick}
        enableColumnSelector
      />

      {/* MODAL */}
      <PurchaseInvoiceModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default PurchaseInvoiceTable;
