import React, { useEffect, useState } from "react";
import {
  getAllProformaInvoices,
  updateProformaInvoiceStatus,
  getProformaInvoiceById,

} from "../../api/proformaInvoiceApi";

import { getCompanyById } from "../../api/companySetupApi";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;
import type {
  ProformaInvoice,
  ProformaInvoiceSummary,
} from "../../types/proformaInvoice";
import { generateProformaInvoicePDF } from "../../components/template/proformatemplete/ProformaInvoiceTemplate";
import Table from "../../components/ui/Table/Table";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";

import type { Column } from "../../components/ui/Table/type";
import PdfPreviewModal from "./PdfPreviewModal";
import { showApiError, showSuccess } from "../../components/alert";

type InvoiceStatus = "Draft" | "Rejected" | "Paid" | "Cancelled" | "Approved";

const STATUS_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  Draft: ["Rejected", "Approved"],
  Rejected: ["Draft", "Approved"],
  Paid: [],
  Cancelled: ["Draft"],
  Approved: ["Paid", "Cancelled"],
};


const CRITICAL_STATUSES: InvoiceStatus[] = ["Paid"];

interface ProformaInvoiceTableProps {
  onAddProformaInvoice?: () => void;
  onExportProformaInvoice?: () => void;
  refreshKey: number;
}

const ProformaInvoicesTable: React.FC<ProformaInvoiceTableProps> = ({
  onAddProformaInvoice,
  onExportProformaInvoice,
  refreshKey,
}) => {
  const [openStatusMenuFor, setOpenStatusMenuFor] = useState<string | null>(
    null,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<ProformaInvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedInvoice, setSelectedInvoice] =
    useState<ProformaInvoice | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  // Company data state
  const [company, setCompany] = useState<any>(null);

  /*    FETCH COMPANY DATA
*/

  const fetchCompany = async () => {
    const res = await getCompanyById(COMPANY_ID);

    if (!res || res.status_code !== 200) {
      throw new Error("Company fetch failed");
    }

    setCompany(res.data);
    return res.data;
  };

  /*    FETCH INVOICES
*/
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
      setInitialLoad(false);
    }
  };
  useEffect(() => {
    fetchCompany().catch(() => console.error("Failed to load company data"));
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [page, pageSize, refreshKey]);

  /*    ACTIONS
*/
  const handleView = async (proformaId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    try {
      const res = await getProformaInvoiceById(proformaId);
      if (!res || res.status_code !== 200) {
        console.error("Failed to load invoice");
        return;
      }

      if (!company) {
        console.error("Company data not loaded");
        return;
      }

      setSelectedInvoice(res.data);

      const url = await generateProformaInvoicePDF(
        res.data,
        company,
        "bloburl",
      );

      setPdfUrl(url as string);
      setPdfOpen(true);
    } catch (err: any) {
      showApiError(err);
    }
  };

  const handleDownload = async (proformaId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    try {
      if (!company) {
        console.error("Company data not loaded");
        return;
      }

      const res = await getProformaInvoiceById(proformaId);
      if (!res || res.status_code !== 200) return;

      await generateProformaInvoicePDF(res.data, company, "save");
      showSuccess("Proforma invoice downloaded");
    } catch (err: any) {
      showApiError(err);
    }
  };

  // const handleStatusChange = async (
  //   proformaId: string,
  //   status: InvoiceStatus,
  // ) => {
  //   if (
  //     CRITICAL_STATUSES.includes(status) &&
  //     !window.confirm(`Mark proforma invoice ${proformaId} as ${status}?`)
  //   ) {
  //     return;
  //   }

  //   const res = await updateProformaInvoiceStatus(proformaId, status);
  //   if (!res || res.status_code !== 200) {
  //     toast.error("Status update failed");
  //     return;
  //   }

  //   setInvoices((prev) =>
  //     prev.map((inv) =>
  //       inv.proformaId === proformaId ? { ...inv, status } : inv,
  //     ),
  //   );

  //   toast.success(`Marked as ${status}`);
  // };

  const handleDelete = async (proformaId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm(`Delete proforma invoice ${proformaId}?`)) return;

    // TODO: Hook delete API later
    showSuccess("Proforma invoice deleted");
  };

  const handleClosePdf = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setSelectedInvoice(null);
    setPdfOpen(false);
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

    const res = await updateProformaInvoiceStatus(invoiceNumber, status);
    if (!res || res.status_code !== 200) {
      showApiError(res?.message || "Failed to update proforma invoice status");
      return;
    }

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.proformaId === invoiceNumber
          ? { ...inv, invoiceStatus: status }
          : inv,
      ),
    );

    showSuccess(`Invoice marked as ${status}`);
    setOpenStatusMenuFor(null);
  };
  /*    FILTER
*/
  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.proformaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /*    COLUMNS
*/
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
      render: (inv) => <StatusBadge status={inv.invoiceStatus} />,
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
            customActions={(STATUS_TRANSITIONS[inv.invoiceStatus] ?? []).map(
              (status) => ({
                label: `Mark as ${status}`,
                danger: status === "Paid",
                onClick: () => handleRowStatusChange(inv.proformaId, status),
              }),
            )}
          />
        </ActionGroup>
      ),
    },
  ];

  /*    RENDER
*/
  return (
    <div className="p-8">
      <Table
        loading={loading || initialLoad}
        serverSide
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
        pageSizeOptions={[10, 25, 50, 100]}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onPageChange={setPage}
      />


      <PdfPreviewModal
        open={pdfOpen}
        title="Proforma Invoice Preview"
        pdfUrl={pdfUrl}
        onClose={handleClosePdf}
        onDownload={() =>
          selectedInvoice &&
          company &&
          generateProformaInvoicePDF(selectedInvoice, company, "save")
        }
      />
    </div>
  );
};

export default ProformaInvoicesTable;
