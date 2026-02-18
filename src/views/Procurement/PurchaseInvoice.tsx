import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PurchaseInvoiceView from "../../views/Procurement/PurchaseInvoiceView";
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
import { updatePurchaseinvoiceStatus } from "../../api/procurement/PurchaseInvoiceApi";
import { showApiError , showSuccess } from "../../utils/alert";


interface Purchaseinvoice {
  pId: string;
  supplier: string;
  podate: string;
  amount: number;
  status: string;
  deliveryDate: string;
  registrationType: string;
}


interface PurchaseinvoicesTableProps {
  onAdd?: () => void;
}

export type PIStatus =
  |"Draft"
  | "Return"
  | "Submitted"
  | "Paid"
  | "Party Paid"
  | "Cancelled"
  | "Internal Transfer"
  | "Debit Note Issued";





const STATUS_TRANSITIONS: Record<PIStatus, PIStatus[]> = {
    Draft: [
    "Submitted",
    "Cancelled",
    "Paid",
    "Party Paid",
    "Internal Transfer",
    "Debit Note Issued",
     "Return"
  ],
  Submitted: [
    "Paid",
    "Party Paid",
    "Cancelled",
    "Return",
  ],

  Paid: [
    "Debit Note Issued",
    "Return",
  ],

  "Party Paid": [
    "Paid",
    "Debit Note Issued",
  ],

  Return: [
    "Debit Note Issued",
  ],

  "Debit Note Issued": [],

  "Internal Transfer": [],

  Cancelled: [],
};


const CRITICAL_STATUSES: PIStatus[] = [
  "Debit Note Issued",
  "Cancelled",
];




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
  const fetchInvoice = async () => {
    try {
      setLoading(true);

      const res = await getPurchaseInvoices(page, pageSize);

      setTotalPages(res.pagination?.total_pages || 1);
      setTotalItems(res.pagination?.total || 0);

      const mappedInvoice: Purchaseinvoice[] = res.data.map((pi: any) => ({
        pId: pi.pId,
        supplier: pi.supplierName,
        podate: pi.poDate,
        deliveryDate: pi.deliveryDate,
        amount: pi.grandTotal,
        status: pi.status,
        registrationType: pi.registrationType
      }));

      setOrders(mappedInvoice);
    } catch (err) {
      console.error("Failed to load Purchase Invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
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
    if (window.confirm(`Delete Purchase Invoice "${Invoice.pId}"?`)) {
      toast.success("Delete");
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  const handlePISaved = async () => {
  await fetchInvoice();
};

  const handleStatusChange = async (
    pId: string,
    newStatus: PIStatus,
  ) => {
    try {
      const res = await updatePurchaseinvoiceStatus(
        pId,
        newStatus,
      );


      if (!res || res.status_code !== 200) {
        showApiError({
  message: "Failed to update Purchase Invoice status",
});

        return;
      }

      // OPTIMISTIC UPDATE
      setOrders((prev) =>
        prev.map((o) =>
          o.pId === pId ? { ...o, status: newStatus } : o,
        ),
      );

      showSuccess(`Purchase Invoice marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update Purchase Invoice status");
    }
  };



  //  TABLE COLUMNS 
  const columns: Column<Purchaseinvoice>[] = [
    { key: "pId", header: " PI ID", align: "left" },
    { key: "supplier", header: "Supplier", align: "left" },
    { key: "podate", header: "po Date", align: "left" },
    {
      key: "registrationType"
      , header: "Registration Type"
      , align: "left"
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (o) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          ZMW {Number(o.amount || 0).toFixed(2)}
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
          <ActionButton type="view" onClick={() => handleView(o)} iconOnly />

          <ActionMenu
            // onEdit={(e) => handleEdit(o, e as any)}
            onDelete={(e) => handleDelete(o, e as any)}
            customActions={(
              STATUS_TRANSITIONS[o.status as PIStatus] ?? []
            ).map((status) => ({
              label: `Mark as ${status}`,
              danger:
                status === "Cancelled" ||
                status === "Debit Note Issued",

              onClick: () => handleStatusChange(o.pId, status)
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
        pId={selectedInvoice?.pId}
        onSubmit={handlePISaved} 
      />


      {viewModalOpen && selectedInvoice && (
        <PurchaseInvoiceView
          pId={selectedInvoice.pId}
          onClose={() => setViewModalOpen(false)}
          onEdit={() => {
            setViewModalOpen(false);
            setModalOpen(true);
          }}
        />
      )}

    </div>
  );
};

export default PurchaseinvoicesTable;
