import React, { useEffect, useState } from "react";
import {
  getAllProformaInvoices,
  updateProformaInvoiceStatus,
  getProformaInvoiceById,
  deleteProformaInvoiceById
} from "../../api/proformaInvoiceApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getCompanyById } from "../../api/companySetupApi";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;
import type {
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
import { showApiError, showSuccess, showLoading , closeSwal} from "../../utils/alert";
import Swal from "sweetalert2";

import InvoiceDetailsModal, { type InvoiceDetails } from "./InvoiceDetailsModal";

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
  refreshKey,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<ProformaInvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);

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

  const handleOpenReceipt = (receiptUrl: string) => {
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
  };

  const fetchAllInvoicesForExport = async () => {
  try {
    let allData: ProformaInvoiceSummary[] = [];
    let currentPage = 1;
    let totalPagesLocal = 1;

    do {
      const res = await getAllProformaInvoices(currentPage, 100);

      if (res?.status_code === 200) {
        const mapped = res.data.map((inv: any) => ({
          proformaId: inv.proformaId,
          customerName: inv.customerName,
          currency: inv.currency,
          exchangeRate: inv.exchangeRate,
          dueDate: inv.dueDate,
          totalAmount: Number(inv.totalAmount),
          status: inv.status as InvoiceStatus,
          createdAt: new Date(inv.createdAt.replace(" ", "T")),
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
    showLoading("Exporting Proforma Invoices...");

    const dataToExport = await fetchAllInvoicesForExport();

    if (!dataToExport.length) {
      closeSwal();
      showApiError("No invoices to export");
      return;
    }

    const formattedData = dataToExport.map((inv) => ({
      "Proforma No": inv.proformaId,
      Customer: inv.customerName,
      Date: inv.createdAt.toLocaleDateString(),
      "Due Date": inv.dueDate
        ? new Date(inv.dueDate).toLocaleDateString()
        : "",
      Amount: inv.totalAmount,
      Currency: inv.currency,
      Status: inv.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Proforma Invoices"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type:
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    });

    saveAs(fileData, "Proforma_Invoices.xlsx");

    closeSwal();
    showSuccess("Export completed successfully");
  } catch (error) {
    closeSwal();
    showApiError(error);
  }
};


  /*    ACTIONS
*/
 const handleView = async (
  proformaId: string,
  e?: React.MouseEvent
) => {
  e?.stopPropagation();

  setDetailsId(proformaId);
  setDetailsOpen(true);
};


  const handleDownload = async (
  proformaId: string,
  e?: React.MouseEvent
) => {
  e?.stopPropagation();

  try {
    showLoading("Preparing proforma invoice download...");

    if (!company) {
      closeSwal();
      console.error("Company data not loaded");
      return;
    }

    const res = await getProformaInvoiceById(
      proformaId
    );

    if (!res || res.status_code !== 200) {
      closeSwal();
      showApiError("Failed to load invoice");
      return;
    }

    await generateProformaInvoicePDF(
      res.data,
      company,
      "save"
    );

    closeSwal();
    showSuccess("Proforma invoice downloaded");

  } catch (err: any) {
    closeSwal();
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

  const handleDelete = async (
    proformaId: string,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `Delete proforma invoice ${proformaId}?`,
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting...",
        text: "Please wait while we delete the invoice.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await deleteProformaInvoiceById(proformaId);

      Swal.close();

      if (!res || res.status_code !== 200) {
        showApiError(res?.message || "Delete failed");
        return;
      }

      // Remove from table instantly
      setInvoices((prev) =>
        prev.filter((inv) => inv.proformaId !== proformaId)
      );

      showSuccess("Proforma invoice deleted successfully");
    } catch (err) {
      Swal.close();
      showApiError(err);
    }
  };



  const mapProformaToInvoiceDetails = (raw: any): InvoiceDetails => {
    const items = Array.isArray(raw?.items)
      ? raw.items.map((it: any) => ({
          itemCode: it?.itemCode ?? it?.productName,
          quantity: Number(it?.quantity ?? 0),
          description: it?.description,
          discount: Number(it?.discount ?? 0),
          price: Number(it?.price ?? it?.listPrice ?? 0),
          vatCode: it?.vatCode,
        }))
      : [];

    return {
      invoiceNumber: raw?.invoiceNumber ?? raw?.proformaId ?? raw?.id,
      invoiceType: raw?.invoiceType ?? "Proforma",
      originInvoice: raw?.originInvoice ?? null,
      customerName: raw?.customerName ?? raw?.customer?.name,
      customerTpin: raw?.customerTpin ?? raw?.customer?.tpin,
      currencyCode: raw?.currencyCode ?? raw?.currency,
      exchangeRt: raw?.exchangeRt ?? raw?.exchangeRate,
      dateOfInvoice: raw?.dateOfInvoice ?? raw?.dateofinvoice ?? raw?.createdAt,
      dueDate: raw?.dueDate,
      invoiceStatus: raw?.invoiceStatus ?? raw?.status,
      Receipt: raw?.Receipt ?? raw?.receipt,
      ReceiptNo: raw?.ReceiptNo ?? raw?.receiptNo,
      TotalAmount: raw?.TotalAmount ?? raw?.totalAmount,
      discountPercentage: raw?.discountPercentage,
      discountAmount: raw?.discountAmount,
      lpoNumber: raw?.lpoNumber,
      destnCountryCd: raw?.destnCountryCd,
      billingAddress: raw?.billingAddress,
      shippingAddress: raw?.shippingAddress,
      paymentInformation: raw?.paymentInformation,
      items,
      terms: raw?.terms,
    };
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
          ? { ...inv, status }
          : inv,
      ),
    );


    showSuccess(`Invoice marked as ${status}`);
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
      render: (inv) => <StatusBadge status={inv.status} />,
    }
    ,
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (inv) => (
        <ActionGroup>
          <ActionButton
            type="view"
            onClick={(e) => handleView(inv.proformaId, e)}
            iconOnly
          />
          <ActionMenu
            showDownload
            onDownload={(e) => handleDownload(inv.proformaId, e)}
            onDelete={(e) => handleDelete(inv.proformaId, e)}
            customActions={(STATUS_TRANSITIONS[inv.status] ?? []).map(
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
        onExport={handleExportExcel}
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

      <InvoiceDetailsModal
        open={detailsOpen}
        invoiceId={detailsId}
        onClose={() => {
          setDetailsOpen(false);
          setDetailsId(null);
        }}
        onOpenReceiptPdf={handleOpenReceipt}
        fetchDetails={getProformaInvoiceById}
        mapDetails={mapProformaToInvoiceDetails}
      />
    </div>
  );
};

export default ProformaInvoicesTable;
