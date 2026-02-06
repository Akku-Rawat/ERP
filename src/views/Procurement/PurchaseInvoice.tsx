import React, { useState, useMemo, useEffect } from "react";
import PurchaseinvoiceModal from "../../components/procurement/PurchaseInvoiceModal";
import toast from "react-hot-toast";
import PurchaseinvoiceView from "../../views/Procurement/purchaseorderview";
import PurchaseInvoiceModal from "../../components/procurement/PurchaseInvoiceModal";
// Shared UI Table Components
import Table from "../../components/ui/Table/Table";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";
import type { Column } from "../../components/ui/Table/type";
import { getPurchaseInvoices } from "../../api/procurement/PurchaseInvoiceApi";



interface Purchaseinvoice {
  id: string;
  supplier: string;
  date: string;
  amount: number;
  status: string;
  deliveryDate: string;
}

interface PurchaseinvoicesTableProps {
  onAdd?: () => void;
}

type POStatus =
  | "Draft"
  | "Approved"
  | "Rejected"
  | "Cancelled"
  | "Completed";


const STATUS_TRANSITIONS: Record<POStatus, POStatus[]> = {
  Draft: ["Approved", "Rejected"],
  Approved: ["Cancelled", "Completed"],
  Rejected: [],
  Cancelled: [],
  Completed: [],
};

const CRITICAL_STATUSES: POStatus[] = ["Completed"];



const PurchaseinvoicesTable: React.FC<PurchaseinvoicesTableProps> = ({ onAdd }) => {
  const [orders, setOrders] = useState<Purchaseinvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Purchaseinvoice | null>(null);




  //  FETCH ORDERS 
const fetchOrders = async () => {
  try {
    setLoading(true);

    const res = await getPurchaseInvoices(page, pageSize);

    setTotalPages(res.pagination?.total_pages || 1);
    setTotalItems(res.pagination?.total || 0);

    const mappedOrders: Purchaseinvoice[] = res.data.map((pi: any) => ({
      piId: pi.pId,
      supplier: pi.supplierName,
      podate: pi.poDate,
      deliveryDate: pi.deliveryDate,
      amount: pi.grandTotal,
      status: pi.status,
      registrationType:pi.registrationType
    }));

    setOrders(mappedOrders);
  } catch (err) {
    toast.error("Failed to load Purchase Invoices");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchOrders();
}, [page, pageSize]);

  const handleView = (Invoice: Purchaseinvoice) => {
  setSelectedInvoice(Invoice);
  setViewModalOpen(true);
};
 

  //  MODAL HANDLERS 
  const handleAddClick = () => {
    setSelectedInvoice(null);
    setModalOpen(true);
    onAdd?.();
  };

  const handleEdit = (Invoice: Purchaseinvoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInvoice(Invoice);
    setModalOpen(true);
  };

  const handleDelete = (Invoice: Purchaseinvoice, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete Purchase Invoice "${Invoice.id}"?`)) {
      toast.success("Delete API ready — connect backend later");
    }
  };

  const handleCloseModal = () => setModalOpen(false);

const handleStatusChange = async (
  poId: string,
  newStatus: POStatus,
) => {
  try {
    const res = await updatePurchaseinvoiceStatus(
      poId,
      newStatus.toLowerCase(),
    );

    if (!res || res.status_code !== 200) {
      toast.error("Failed to update Purchase Invoice status");
      return;
    }

    // OPTIMISTIC UPDATE
    setOrders((prev) =>
      prev.map((o) =>
        o.id === poId ? { ...o, status: newStatus } : o,
      ),
    );

    toast.success(`Purchase Invoice marked as ${newStatus}`);
  } catch (err) {
    toast.error("Failed to update Purchase Invoice status");
  }
};



  //  TABLE COLUMNS 
  const columns: Column<Purchaseinvoice>[] = [
    { key: "piId", header: " PI ID", align: "left" },
    { key: "supplier", header: "Supplier", align: "left" },
    { key: "podate", header: "po Date", align: "left" },
    {key:"registrationType"
    ,header:"Registration Type"
    ,align:"left"
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (o) => (
          <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
    ${Number(o.amount || 0).toFixed(2)}
  </code>
      ),
    },

    {
      key: "status",
      header: "Status",
      align: "left",
      render: (o) => <StatusBadge status={o.status} />,
    },

    { key: "deliveryDate", header: "Delivery Date", align: "left" },

    {
  key: "actions",
  header: "Actions",
  align: "center",
  render: (o) => (
    <ActionGroup>
      <ActionButton type="view" onClick={() => handleView(o)} />

<ActionMenu
  // onEdit={(e) => handleEdit(o, e as any)}
  onDelete={(e) => handleDelete(o, e as any)}
  customActions={(
    STATUS_TRANSITIONS[o.status as POStatus] ?? []
  ).map((status) => ({
    label: `Mark as ${status}`,
    danger: status === "Completed",
    onClick: () => handleStatusChange(o.id, status),
  }))}
/>

    </ActionGroup>
  ),
},

  ];

  return (
    <div className="p-6">
      <Table
        columns={columns}
        data={orders}
        showToolbar
        loading={loading}
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        enableAdd
        addLabel="Add Purchase Invoice"
        onAdd={handleAddClick}
        enableColumnSelector
        currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
              onPageSizeChange={(size) => setPageSize(size)}
              pageSizeOptions={[10, 25, 50, 100]}


      />

      {/* MODAL */}
      <PurchaseInvoiceModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
          poId={selectedInvoice?.id}  
      />
 
  </div>  
  );
};

export default PurchaseinvoicesTable;
