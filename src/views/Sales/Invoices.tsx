import React, { useEffect, useState } from "react";
import {
  getAllSalesInvoices,
  updateInvoiceStatus,
  getSalesInvoiceById,
} from "../../api/salesApi";
import type { InvoiceSummary, Invoice } from "../../types/invoice";
import { generateInvoicePDF } from "../../components/template/invoice/InvoiceTemplate1";
import PdfPreviewModal from "./PdfPreviewModal";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;
import Table from "../../components/ui/Table/Table";

import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";

import type { Column } from "../../components/ui/Table/type";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import { getCompanyById } from "../../api/companySetupApi";
import type { Company } from "../../types/company";
import { showApiError, showSuccess , showLoading,closeSwal} from "../../utils/alert";
import type { InvoiceStatus } from "../../types/invoice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const STATUS_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  Draft: ["Rejected", "Approved"],
  Rejected: ["Draft", "Approved"],
  Paid: [],
  Cancelled: ["Draft"],
  Approved: ["Paid", "Cancelled"],
};

const CRITICAL_STATUSES: InvoiceStatus[] = ["Paid"];
// const InvoicesTable: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => {

interface InvoiceTableProps {
  onAddInvoice?: () => void;
  onExportInvoice?: () => void;
}
const InvoiceTable: React.FC<InvoiceTableProps> = ({
  onAddInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [initialLoad, setInitialLoad] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [invoiceDetailsOpen, setInvoiceDetailsOpen] = useState(false);
  const [invoiceDetailsId, setInvoiceDetailsId] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const fetchCompany = async () => {
    const res = await getCompanyById(COMPANY_ID); // valid ID
    if (!res || res.status_code !== 200) {
      throw new Error("Company fetch failed");
    }
    setCompany(res.data);
    return res.data;
  };
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
        invoiceStatus: inv.invoiceStatus,
        invoiceTypeParent: inv.invoiceTypeParent,
        invoiceType: inv.invoiceType,
      }));

      setInvoices(mapped);
      setTotalPages(res.pagination?.total_pages || 1);
      setTotalItems(res.pagination?.total || mapped.length);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };
  useEffect(() => {
    fetchCompany().catch(() => console.error("Failed to load company data"));
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [page, pageSize]);

  const fetchAllInvoicesForExport = async () => {
  try {
    let allData: InvoiceSummary[] = [];
    let currentPage = 1;
    let totalPagesLocal = 1;

    do {
      const res = await getAllSalesInvoices(currentPage, 100);

      if (res?.status_code === 200) {
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
          invoiceStatus: inv.invoiceStatus,
          invoiceTypeParent: inv.invoiceTypeParent,
          invoiceType: inv.invoiceType,
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
    showLoading("Exporting Sales Invoices...");

    const dataToExport = await fetchAllInvoicesForExport();

    if (!dataToExport.length) {
      closeSwal();
      showApiError("No invoices to export");
      return;
    }

    const formattedData = dataToExport.map((inv) => ({
      "Invoice No": inv.invoiceNumber,
      Type: inv.invoiceType,
      Customer: inv.customerName,
      Date: inv.dateOfInvoice.toLocaleDateString(),
      "Due Date": inv.dueDate
        ? new Date(inv.dueDate).toLocaleDateString()
        : "",
      Amount: inv.total,
      Currency: inv.currency,
      Status: inv.invoiceStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Invoices");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "Sales_Invoices.xlsx");

    closeSwal();
    showSuccess("Invoices exported successfully");
  } catch (error) {
    closeSwal();
    showApiError(error);
  }
};


  const handleViewClick = async (
  invoiceNumber: string,
  e?: React.MouseEvent,
) => {
  e?.stopPropagation();

  setInvoiceDetailsId(invoiceNumber);
  setInvoiceDetailsOpen(true);
};

  const handleOpenReceiptPdf = async (receiptUrl: string) => {
    try {
      const normalizedUrl = receiptUrl.startsWith("http://")
        ? receiptUrl.replace(/^http:\/\//i, "https://")
        : receiptUrl;

      const urlWithoutPort = (() => {
        try {
          const u = new URL(normalizedUrl);
          u.port = "";
          return u.toString();
        } catch {
          return normalizedUrl.replace(/^(https?:\/\/[^\/]+):\d+(\/.*)?$/i, "$1$2");
        }
      })();

      const a = document.createElement("a");
      a.href = urlWithoutPort;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();

      setInvoiceDetailsOpen(false);
    } catch (err: any) {
      showApiError(err);
    }
  };


  const handleDownload = async (
  inv: InvoiceSummary,
  e?: React.MouseEvent
) => {
  e?.stopPropagation();

  try {
    
    showLoading("Preparing invoice download...");

    if (!company) {
      closeSwal();
      showApiError("Company data not loaded");
      return;
    }

    const invoiceRes = await getSalesInvoiceById(
      inv.invoiceNumber
    );

    if (!invoiceRes || invoiceRes.status_code !== 200) {
      closeSwal();
      showApiError("Failed to load invoice");
      return;
    }

    const invoice = invoiceRes.data as Invoice;

    await generateInvoicePDF(
      invoice,
      company,
      "save"
    );

    closeSwal(); 
    showSuccess("Invoice downloaded successfully!");

  } catch (err: any) {
    closeSwal();
    showApiError(err);
  }
};


  const handleClosePdf = () => {
    if (pdfUrl?.startsWith("blob:")) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setSelectedInvoice(null);
    setPdfOpen(false);
  };

  const handleCloseInvoiceDetails = () => {
    setInvoiceDetailsOpen(false);
    setInvoiceDetailsId(null);
  };

  const handleRowStatusChange = async (
    invoiceNumber: string,
    status: InvoiceStatus,
  ) => {
    if (
      CRITICAL_STATUSES.includes(status) &&
      !window.confirm(
        `Mark invoice ${invoiceNumber} as ${status}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    const res = await updateInvoiceStatus(invoiceNumber, status);
    if (!res || res.status_code !== 200) {
      showApiError(res?.message || "Failed to update invoice status");
      return;
    }

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.invoiceNumber === invoiceNumber
          ? { ...inv, invoiceStatus: status }
          : inv,
      ),
    );

    showSuccess(`Invoice marked as ${status}`);
  };

  const handleDelete = async (invoiceNumber: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm(`Delete invoice ${invoiceNumber}?`)) return;

    // Add your delete API call here
    showSuccess("Invoice deleted successfully");
    console.log("Delete invoice:", invoiceNumber);
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
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
      render: (inv) => (
  <span className="text-xs text-muted">
    {inv.dateOfInvoice.toLocaleDateString()}
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
            iconOnly
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
              STATUS_TRANSITIONS[inv.invoiceStatus] ?? []
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
      <Table
        columns={columns}
        data={filteredInvoices}
        rowKey={(row) => row.invoiceNumber}
        showToolbar
        loading={loading || initialLoad}
        serverSide
        enableAdd
        addLabel="Add Invoice"
        onAdd={onAddInvoice}
        enableColumnSelector
        enableExport
        onExport={handleExportExcel}
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

      <PdfPreviewModal
        open={pdfOpen}
        title="Invoice Preview"
        pdfUrl={pdfUrl}
        onClose={handleClosePdf}
        onDownload={() =>
          selectedInvoice &&
          company &&
          generateInvoicePDF(selectedInvoice, company, "save")
        }
      />

      <InvoiceDetailsModal
        open={invoiceDetailsOpen}
        invoiceId={invoiceDetailsId}
        onClose={handleCloseInvoiceDetails}
        onOpenReceiptPdf={handleOpenReceiptPdf}
      />
    </div>
  );
};

export default InvoiceTable;
