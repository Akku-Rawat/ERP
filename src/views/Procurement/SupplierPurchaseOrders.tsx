import { useMemo, useState } from "react";
import {
  FileText,
  ClipboardList,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Table from "../../components/ui/Table/Table";

/* ================= TYPES ================= */

export interface PurchaseOrder {
  poId: string;
  supplierName: string;
  poDate: string;
  deliveryDate?: string;
  status: string;
  grandTotal: number;
}

interface Props {
  purchaseOrders: PurchaseOrder[];
  loading: boolean;
}

/* ================= COMPONENT ================= */

const SupplierPurchaseOrders = ({ purchaseOrders, loading }: Props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  /* ================= SUMMARY ================= */

  const summary = useMemo(() => {
    const total = purchaseOrders.length;
    const draft = purchaseOrders.filter(p => p.status === "Draft").length;
    const submitted = purchaseOrders.filter(p => p.status === "Submitted").length;
    const totalValue = purchaseOrders.reduce((s, p) => s + p.grandTotal, 0);

    return { total, draft, submitted, totalValue };
  }, [purchaseOrders]);

  /* ================= TABLE COLUMNS ================= */

  const columns = [
    {
      key: "poId",
      header: "PO No",
      render: (row: PurchaseOrder) => (
        <span className="text-xs font-black text-primary">{row.poId}</span>
      ),
    },
    {
      key: "poDate",
      header: "PO Date",
      render: (row: PurchaseOrder) => (
        <span className="text-[10px] font-black text-muted uppercase">
          {new Date(row.poDate).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      key: "deliveryDate",
      header: "Delivery",
      render: (row: PurchaseOrder) =>
        row.deliveryDate ? (
          <span className="text-xs text-main">
            {new Date(row.deliveryDate).toLocaleDateString("en-GB")}
          </span>
        ) : (
          <span className="text-xs text-muted">—</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: PurchaseOrder) => (
        <span
          className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
            row.status === "Submitted"
              ? "bg-success/10 text-success"
              : row.status === "Draft"
              ? "bg-warning/10 text-warning"
              : "bg-muted/10 text-muted"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "grandTotal",
      header: "Amount",
      align: "right" as const,
      render: (row: PurchaseOrder) => (
        <span className="text-sm font-black text-primary">
          ₹{row.grandTotal.toLocaleString()}
        </span>
      ),
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 p-6">

      {/* SUMMARY */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard
          icon={<ClipboardList size={14} />}
          label="Total POs"
          value={summary.total}
        />
        <SummaryCard
          icon={<Clock size={14} />}
          label="Draft"
          value={summary.draft}
        />
        <SummaryCard
          icon={<CheckCircle2 size={14} />}
          label="Submitted"
          value={summary.submitted}
        />
        <SummaryCard
          icon={<FileText size={14} />}
          label="Total Value"
          value={`₹${summary.totalValue.toLocaleString()}`}
        />
      </div>

      {/* TABLE */}
      <div className="bg-card border border-theme rounded-2xl overflow-hidden">
        
        <Table
          columns={columns}
          data={purchaseOrders}
          loading={loading}
          showToolbar={false}
          currentPage={page}
          totalPages={1}
          totalItems={purchaseOrders.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          pageSizeOptions={[5, 10, 25]}
          emptyMessage="No purchase orders found"
        />
      </div>

    </div>
  );
};

/* ================= SUB COMPONENT ================= */

const SummaryCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="bg-card border border-theme rounded-xl p-4 flex items-center gap-3">
    <div className="p-2 rounded-lg bg-row-hover text-primary">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-muted">
        {label}
      </p>
      <p className="text-lg font-black text-primary">
        {value}
      </p>
    </div>
  </div>
);

export default SupplierPurchaseOrders;
