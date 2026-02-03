import React, { useState, useMemo, useEffect } from "react";
import PurchaseOrderModal from "../../components/procurement/PurchaseOrderModal";
import toast from "react-hot-toast";
import PurchaseOrderView from "../../views/Procurement/purchaseorderview";

// Shared UI Table Components
import Table from "../../components/ui/Table/Table";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";
import type { Column } from "../../components/ui/Table/type";

import { getPurchaseOrders } from "../../api/procurement/PurchaseOrderApi";

interface PurchaseOrder {
  id: string;
  supplier: string;
  date: string;
  amount: number;
  status: string;
  deliveryDate: string;
}

interface PurchaseOrdersTableProps {
  onAdd?: () => void;
}

const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({ onAdd }) => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);




  //  FETCH ORDERS 
const fetchOrders = async () => {
  try {
    setLoading(true);

    const res = await getPurchaseOrders(page, pageSize);

    setTotalPages(res.pagination?.total_pages || 1);
    setTotalItems(res.pagination?.total || 0);

    const mappedOrders: PurchaseOrder[] = res.data.map((po: any) => ({
      id: po.poId,
      supplier: po.supplierName,
      date: po.poDate,
      deliveryDate: po.deliveryDate,
      amount: po.grandTotal,
      status: po.status,
    }));

    setOrders(mappedOrders);
  } catch (err) {
    toast.error("Failed to load Purchase Orders");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchOrders();
}, [page, pageSize]);

  const handleView = (order: PurchaseOrder) => {
  setSelectedOrder(order);
  setViewModalOpen(true);
};
  //  FILTER 
  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(term) ||
        o.supplier.toLowerCase().includes(term) ||
        o.status.toLowerCase().includes(term),
    );
  }, [orders, searchTerm]);

  //  MODAL HANDLERS 
  const handleAddClick = () => {
    setSelectedOrder(null);
    setModalOpen(true);
    onAdd?.();
  };

  const handleEdit = (order: PurchaseOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleDelete = (order: PurchaseOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete Purchase Order "${order.id}"?`)) {
      toast.success("Delete API ready — connect backend later");
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  //  TABLE COLUMNS 
  const columns: Column<PurchaseOrder>[] = [
    { key: "id", header: "PO ID", align: "left" },
    { key: "supplier", header: "Supplier", align: "left" },
    { key: "date", header: "Date", align: "left" },

    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (o) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          ${o.amount?.toLocaleString()}
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
            onEdit={(e) => handleEdit(o, e as any)}
            onDelete={(e) => handleDelete(o, e as any)}
          />
        </ActionGroup>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Table
        columns={columns}
        data={filteredOrders}
        showToolbar
        loading={loading}
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        enableAdd
        addLabel="Add Purchase Order"
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
      <PurchaseOrderModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
          poId={selectedOrder?.id}  
      />
      {/* VIEW MODAL */}
    {viewModalOpen && selectedOrder && (
      <PurchaseOrderView
        poId={selectedOrder.id}
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

export default PurchaseOrdersTable;
