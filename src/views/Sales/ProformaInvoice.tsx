import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllProformaInvoices,
  updateProformaInvoiceStatus,
  getProformaInvoiceById,
} from "../../api/proformaInvoiceApi";

import type {
  ProformaInvoice,
  ProformaInvoiceSummary,
} from "../../types/proformaInvoice";

import Table from "../../components/ui/Table/Table";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";

import type { Column } from "../../components/ui/Table/type";
import PdfPreviewModal from "./PdfPreviewModal";
import { generateInvoicePDF } from "../../components/template/invoice/InvoiceTemplate1";

type InvoiceStatus = "Draft" | "Pending" | "Paid" | "Overdue";

const STATUS_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  Draft: ["Pending"],
  Pending: ["Paid", "Overdue"],
  Paid: [],
  Overdue: ["Paid"],
};

const CRITICAL_STATUSES: InvoiceStatus[] = ["Paid"];

interface ProformaInvoiceTableProps {
  onAddProformaInvoice?: () => void;
  onExportProformaInvoice?: () => void;
}
const ProformaInvoicesTable: React.FC<ProformaInvoiceTableProps> = ({
  onAddProformaInvoice,
  onExportProformaInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<ProformaInvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedInvoice, setSelectedInvoice] =
    useState<ProformaInvoice | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  /* ===============================
     FETCH
  ================================ */

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await getAllProformaInvoices(page, pageSize);
      if (!res || res.status_code !== 200) return;

      const mapped: ProformaInvoiceSummary[] = res.data.map((inv: any) => ({
        proformaId: inv.proformaId,
        customerName: inv.customerName,
        currency: inv.currency,
        exchangeRate: inv.exchangeRate,
        dueDate: inv.dueDate,
        totalAmount: Number(inv.totalAmount),
        status: inv.status as InvoiceStatus,
        createdAt: new Date(inv.createdAt.replace(" ", "T")),
      }));

      setInvoices(mapped);
      setTotalPages(res.pagination?.total_pages || 1);
      setTotalItems(res.pagination?.total || mapped.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, pageSize]);

  /* ===============================
     ACTIONS
  ================================ */

  const handleView = async (proformaId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    const res = await getProformaInvoiceById(proformaId);
    if (!res || res.status_code !== 200) return;

    setSelectedInvoice(res.data);

    const url = await generateInvoicePDF(res.data, "bloburl");
    setPdfUrl(url as string);
    setPdfOpen(true);
  };

  const handleDownload = async (proformaId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    try {
      const res = await getProformaInvoiceById(proformaId);
      if (!res || res.status_code !== 200) return;

      await generateInvoicePDF(res.data, "save");
      toast.success("Proforma invoice downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  const handleStatusChange = async (
    proformaId: string,
    status: InvoiceStatus,
  ) => {
    if (
      CRITICAL_STATUSES.includes(status) &&
      !window.confirm(`Mark proforma invoice ${proformaId} as ${status}?`)
    ) {
      return;
    }

    const res = await updateProformaInvoiceStatus(proformaId, status);
    if (!res || res.status_code !== 200) {
      toast.error("Status update failed");
      return;
    }

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.proformaId === proformaId ? { ...inv, status } : inv,
      ),
    );

    toast.success(`Marked as ${status}`);
  };

  const handleDelete = async (proformaId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm(`Delete proforma invoice ${proformaId}?`)) return;

    // Hook delete API later
    toast.success("Proforma invoice deleted");
  };

  const handleClosePdf = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setSelectedInvoice(null);
    setPdfOpen(false);
  };

  /* ===============================
     FILTER
  ================================ */

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.proformaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ===============================
     COLUMNS
  ================================ */

  const columns: Column<ProformaInvoiceSummary>[] = [
    {
      key: "proformaId",
      header: "Proforma No",
      align: "left",
      render: (inv) => (
        <span className="font-semibold text-main">{inv.proformaId}</span>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      align: "left",
    },
    {
      key: "createdAt",
      header: "Date",
      align: "left",
      render: (inv) => (
        <span className="text-xs text-muted">
          {inv.createdAt.toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      align: "left",
      render: (inv) => (
        <span className="text-xs text-muted">
          {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Amount",
      align: "right",
      render: (inv) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          {inv.currency} {inv.totalAmount.toLocaleString()}
        </code>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "left",
      render: (inv) => <StatusBadge status={inv.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (inv) => (
        <ActionGroup>
          <ActionButton
            type="view"
            onClick={(e) => handleView(inv.proformaId, e)}
            iconOnly={false}
          />
          <ActionMenu
            showDownload
            onDownload={(e) => handleDownload(inv.proformaId, e)}
            onDelete={(e) => handleDelete(inv.proformaId, e)}
            customActions={(STATUS_TRANSITIONS[inv.status] ?? []).map(
              (status) => ({
                label: `Mark as ${status}`,
                danger: status === "Paid",
                onClick: () => handleStatusChange(inv.proformaId, status),
              }),
            )}
          />
        </ActionGroup>
      ),
    },
  ];

  /* ===============================
     RENDER
  ================================ */

  return (
    <div className="p-8">
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="mt-2 text-muted">Loading proforma invoices…</p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredInvoices}
          rowKey={(row) => row.proformaId}
          showToolbar
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          enableAdd
          addLabel=" Add Proforma Invoice"
          onAdd={onAddProformaInvoice}
          enableExport
          onExport={onExportProformaInvoice}
          enableColumnSelector
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      )}

      <PdfPreviewModal
        open={pdfOpen}
        title="Proforma Invoice Preview"
        pdfUrl={pdfUrl}
        onClose={handleClosePdf}
        onDownload={() =>
          selectedInvoice && generateInvoicePDF(selectedInvoice, "save")
        }
      />
    </div>
  );
};

export default ProformaInvoicesTable;
