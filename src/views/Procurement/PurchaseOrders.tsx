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
import { showApiError,showSuccess ,showLoading,closeSwal } from "../../components/alert";
import { getPurchaseOrders ,updatePurchaseOrderStatus } from "../../api/procurement/PurchaseOrderApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getPurchaseOrderById } from "../../api/procurement/PurchaseOrderApi";

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
const [selectedOrder, setSelectedOrder] =  useState<any | null>(null);





  //  FETCH ORDERS 
const fetchOrders = async () => {
  try {
    setLoading(true);

    const res = await getPurchaseOrders(page, pageSize);
    console.log("RAW PO:", res.data[0]);


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
    console.error("Failed to load Purchase Orders");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchOrders();
}, [page, pageSize]);


const handleView = async (order: PurchaseOrder) => {
  try {
    // SweetAlert Loader
    showLoading("Loading Purchase Order...");

    const res = await getPurchaseOrderById(order.id);

    if (res.status !== "success") {
      throw new Error(res.message || "Failed to load");
    }

    // Data set
    setSelectedOrder(res.data);

    // Close loader → open modal
    closeSwal();
    setViewModalOpen(true);

  } catch (error) {
    closeSwal();
    showApiError(error);
  }
};

  //  FILTER 
 const filteredOrders = useMemo(() => {
  const term = searchTerm.toLowerCase();

  return orders.filter((o) =>
    (o.id ?? "").toLowerCase().includes(term) ||
    (o.supplier ?? "").toLowerCase().includes(term) ||
    (o.status ?? "").toLowerCase().includes(term)
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
  const handlePOSaved = async () => {
  await fetchOrders();   //  Refresh table
};


const fetchAllPOsForExport = async () => {
  try {
    let allData: PurchaseOrder[] = [];
    let currentPage = 1;
    let totalPagesLocal = 1;

    do {
      const res = await getPurchaseOrders(currentPage, 100);

      if (res?.status_code === 200) {
        const mapped = res.data.map((po: any) => ({
          id: po.poId,
          supplier: po.supplierName,
          date: po.poDate,
          deliveryDate: po.deliveryDate,
          amount: po.grandTotal,
          status: po.status,
        }));

        allData = [...allData, ...mapped];
        totalPagesLocal = res.pagination?.total_pages || 1;
      }

      currentPage++;
    } while (currentPage <= totalPagesLocal);

    return allData;
  } catch (error) {
    showApiError(error);
    return [];
  }
};

const handleExportExcel = async () => {
  try {
    showLoading("Exporting Purchase Orders...");

    const dataToExport = await fetchAllPOsForExport();

    if (!dataToExport.length) {
      closeSwal();
      showApiError("No purchase orders to export");
      return;
    }

    const formattedData = dataToExport.map((po) => ({
      "PO ID": po.id,
      Supplier: po.supplier,
      Date: po.date,
      "Delivery Date": po.deliveryDate,
      Amount: po.amount,
      Status: po.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Purchase Orders"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "All_Purchase_Orders.xlsx");

    closeSwal();
    showSuccess("Export completed successfully");
  } catch (error) {
    closeSwal();
    showApiError(error);
  }
};



const handleStatusChange = async (
  poId: string,
  newStatus: POStatus,
) => {
  try {
    const res = await updatePurchaseOrderStatus(
      poId,
      newStatus
    );

 
    if (!res || res.status_code !== 200) {
      showApiError(res);
      return;
    }

 
    setOrders((prev) =>
      prev.map((o) =>
        o.id === poId
          ? { ...o, status: res.data?.status || newStatus }
          : o,
      ),
    );

  
    showSuccess(
      res.message ||
        `Purchase Order marked as ${newStatus}`,
    );

  } catch (error: any) {
    showApiError(error);
  }
};




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
        data={filteredOrders}
        showToolbar
        loading={loading}
        searchValue={searchTerm}
         enableExport
        onExport={handleExportExcel}
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
         poId={selectedOrder?.poId}
          onSubmit={handlePOSaved} 
      />
      {/* VIEW MODAL */}
    {viewModalOpen && selectedOrder && (
      <PurchaseOrderView
        poData={selectedOrder}
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
