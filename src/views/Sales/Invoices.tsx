import React, { useEffect, useState } from "react";
import {
  getAllSalesInvoices,
  updateInvoiceStatus,
  getSalesInvoiceById,
} from "../../api/salesApi";
import type { InvoiceSummary, Invoice } from "../../types/invoice";
import { generateInvoicePDF } from "../../components/template/invoice/InvoiceTemplate1";
import PdfPreviewModal from "./PdfPreviewModal";
import toast from "react-hot-toast";

import Table from "../../components/ui/Table/Table";

import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";

import type { Column } from "../../components/ui/Table/type";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import { Row } from "jspdf-autotable";
import { getCompanyById } from "../../api/companySetupApi";
import type { Company } from "../../types/company";

type InvoiceStatus = "Draft" | "Pending" | "Paid" | "Overdue" | "Approved";

const STATUS_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  Draft: ["Pending", "Approved"],
  Pending: ["Paid", "Overdue"],
  Paid: [],
  Overdue: ["Paid"],
  Approved: ["Pending", "Paid", "Overdue"],
};

const CRITICAL_STATUSES: InvoiceStatus[] = ["Paid"];
// const InvoicesTable: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => {

interface InvoiceTableProps {
  onAddInvoice?: () => void;
  onExportInvoice?: () => void;
}
const InvoiceTable: React.FC<InvoiceTableProps> = ({
  onAddInvoice,
  onExportInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  const [openStatusMenuFor, setOpenStatusMenuFor] = useState<string | null>(
    null
  );

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await getAllSalesInvoices(page, pageSize);
      if (!res || res.status_code !== 200) return;

      const mapped: InvoiceSummary[] = res.data.map((inv: any) => ({
        invoiceNumber: inv.invoiceNumber,
        customerName: inv.customerName,
        receiptNumber: inv.receiptNumber,
        currency: inv.currency,
        exchangeRate: inv.exchangeRate,
        dueDate: inv.dueDate,
        dateOfInvoice: new Date(inv.dateOfInvoice),
        total: Number(inv.totalAmount),
        totalTax: inv.totalTax,
        invoiceStatus: inv.invoiceStatus as InvoiceStatus,

        invoiceTypeParent: inv.invoiceTypeParent,
        invoiceType: inv.invoiceType,
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

  const handleViewClick = async (
    invoiceNumber: string,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();

    const [invoiceRes, companyRes] = await Promise.all([
      getSalesInvoiceById(invoiceNumber),
      getCompanyById("COMP-00003"),
    ]);

    const invoice = invoiceRes.data as Invoice;
    const company = companyRes.data as Company;

    setSelectedInvoice(invoice);

    const url = await generateInvoicePDF(invoice, company, "bloburl");
    setPdfUrl(url as string);
    setPdfOpen(true);
  };

  const handleDownload = async (inv: InvoiceSummary, e?: React.MouseEvent) => {
    e?.stopPropagation();

    try {
      const [invoiceRes, companyRes] = await Promise.all([
        getSalesInvoiceById(inv.invoiceNumber),
        getCompanyById("COMP-00003"),
      ]);

      const invoice = invoiceRes.data as Invoice;
      const company = companyRes.data as Company;

      await generateInvoicePDF(invoice, company, "save");

      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download invoice");
    }
  };

  const handleClosePdf = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setSelectedInvoice(null);
    setPdfOpen(false);
  };

  const handleRowStatusChange = async (
    invoiceNumber: string,
    status: InvoiceStatus
  ) => {
    if (
      CRITICAL_STATUSES.includes(status) &&
      !window.confirm(
        `Mark invoice ${invoiceNumber} as ${status}? This action cannot be undone.`
      )
    ) {
      return;
    }

    const res = await updateInvoiceStatus(invoiceNumber, status);
    if (!res || res.status_code !== 200) {
      toast.error("Failed to update invoice status");
      return;
    }

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.invoiceNumber === invoiceNumber
          ? { ...inv, invoiceStatus: status }
          : inv
      )
    );

    toast.success(`Invoice marked as ${status}`);
    setOpenStatusMenuFor(null);
  };

  const handleDelete = async (invoiceNumber: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm(`Delete invoice ${invoiceNumber}?`)) return;

    // Add your delete API call here
    toast.success("Invoice deleted successfully");
    console.log("Delete invoice:", invoiceNumber);
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table columns definition
  const columns: Column<InvoiceSummary>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice No",
      align: "left",
      render: (inv: InvoiceSummary) => (
        <span className="font-semibold text-main">{inv.invoiceNumber}</span>
      ),
    },
    {
      key: "invoiceType",
      header: "Type",
      align: "left",
      render: (inv: InvoiceSummary) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          {inv.invoiceType}
        </code>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      align: "left",
      render: (inv: InvoiceSummary) => (
        <span className="text-sm text-main">{inv.customerName}</span>
      ),
    },
    {
      key: "dateOfInvoice",
      header: "Date",
      align: "left",
      render: (inv: InvoiceSummary) => (
        <span className="text-xs text-muted">
          {new Date(inv.dateOfInvoice).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      align: "left",
      render: (inv: InvoiceSummary) => (
        <span className="text-xs text-muted">
          {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "total",
      header: "Amount",
      align: "right",
      render: (inv: InvoiceSummary) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main font-semibold whitespace-nowrap">
          {inv.total.toLocaleString()} {inv.currency}
        </code>
      ),
    },
    {
      key: "invoiceStatus",
      header: "Status",
      align: "left",
      render: (inv) => <StatusBadge status={inv.invoiceStatus} />,
    },

    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (inv: InvoiceSummary) => (
        <ActionGroup>
          <ActionButton
            type="view"
            onClick={(e) => handleViewClick(inv.invoiceNumber, e)}
            iconOnly={false}
          />
          {/* <ActionButton
            type="download"
            onClick={(e) => handleDownload(inv, e)}
            iconOnly={false}
          /> */}
          <ActionMenu
            onDelete={(e) => handleDelete(inv.invoiceNumber, e)}
            showDownload
            onDownload={(e) => handleDownload(inv, e)}
            customActions={(
              STATUS_TRANSITIONS[inv.invoiceStatus as InvoiceStatus] ?? []
            ).map((status) => ({
              label: `Mark as ${status}`,
              danger: status === "Paid",
              onClick: () => handleRowStatusChange(inv.invoiceNumber, status),
            }))}
          />
        </ActionGroup>
      ),
    },
  ];

  return (
    <div className="p-8">
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted">Loading invoices…</p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredInvoices}
          rowKey={(row) => row.invoiceNumber}
          showToolbar
          loading={loading}
          serverSide
         
          enableAdd
          addLabel="Add Invoice"
          onAdd={onAddInvoice}
          enableColumnSelector
          enableExport
          onExport={onExportInvoice}
          currentPage={page}
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          pageSizeOptions={[10, 25, 50, 100]}
  onPageSizeChange={(size) => {
    setPageSize(size);
    setPage(1); // reset page
  }}
          onPageChange={setPage}
        />
      )}

      <PdfPreviewModal
        open={pdfOpen}
        title="Invoice Preview"
        pdfUrl={pdfUrl}
        onClose={handleClosePdf}
        onDownload={() =>
          selectedInvoice && generateInvoicePDF(selectedInvoice, "save")
        }
      />
    </div>
  );
};

export default InvoiceTable;
