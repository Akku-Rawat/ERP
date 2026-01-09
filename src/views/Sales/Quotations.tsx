import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getAllQuotations, getQuotationById } from "../../api/quotationApi";
import type { QuotationSummary, QuotationData } from "../../types/quotation";

import Table from "../../components/ui/Table/Table";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";
import type { Column } from "../../components/ui/Table/type";

import PdfPreviewModal from "./PdfPreviewModal";
import { generateInvoicePDF } from "../../components/template/invoice/InvoiceTemplate1";


/* ===============================
   COMPONENT
================================ */

interface QuotationTableProps {
  onAddQuotation?: () => void;
   onExportQuotation?: () => void;  
}
const QuotationsTable: React.FC<QuotationTableProps> = ({ onAddQuotation,onExportQuotation, }) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [quotations, setQuotations] = useState<QuotationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedQuotation, setSelectedQuotation] =
    useState<QuotationData | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  /* ===============================
     FETCH
  ================================ */

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await getAllQuotations(page, pageSize);
      if (!res || res.status_code !== 200) return;

      const mapped: QuotationSummary[] = res.data.map((q: any) => ({
        quotationNumber: q.name,
        customerName: q.customer_name,
        industryBases: q.custom_industry_bases,
        transactionDate: q.transaction_date,
        validTill: q.valid_till,
        grandTotal: Number(q.grand_total ?? 0),
        currency: q.currency,
      }));

      setQuotations(mapped);
      setTotalPages(res.pagination?.total_pages || 1);
      setTotalItems(res.pagination?.total || mapped.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [page, pageSize]);

  /* ===============================
     ACTIONS
  ================================ */

  const handleView = async (
    quotationNumber: string,
    e?: React.MouseEvent,
  ) => {
    e?.stopPropagation();

    try {
      const res = await getQuotationById(quotationNumber);
      if (!res || res.status_code !== 200) return;

      const quotation = res.data as QuotationData;
      setSelectedQuotation(quotation);

      const url = await generateInvoicePDF(quotation, "bloburl");
      setPdfUrl(url as string);
      setPdfOpen(true);
    } catch {
      toast.error("Failed to load quotation preview");
    }
  };

  const handleDownload = async (
    quotationNumber: string,
    e?: React.MouseEvent,
  ) => {
    e?.stopPropagation();

    try {
      const res = await getQuotationById(quotationNumber);
      if (!res || res.status_code !== 200) return;

      await generateInvoicePDF(res.data, "save");
      toast.success("Quotation downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  const handleClosePdf = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setSelectedQuotation(null);
    setPdfOpen(false);
  };

  /* ===============================
     FILTER
  ================================ */

  const filteredQuotations = quotations.filter(
    (q) =>
      q.quotationNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      q.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  /* ===============================
     TABLE COLUMNS
  ================================ */

  const columns: Column<QuotationSummary>[] = [
    {
      key: "quotationNumber",
      header: "Quotation No",
      align: "left",
      render: (q) => (
        <span className="font-semibold text-main">
          {q.quotationNumber}
        </span>
      ),
    },
    { key: "customerName", header: "Customer", align: "left" },
    { key: "industryBases", header: "Industry", align: "left" },
    { key: "transactionDate", header: "Date", align: "left" },
    { key: "validTill", header: "Valid Till", align: "left" },
    {
      key: "grandTotal",
      header: "Amount",
      align: "right",
      render: (q) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main">
          {q.currency === "INR" ? "₹" : "$"}
          {q.grandTotal.toLocaleString()}
        </code>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (q) => (
        <ActionGroup>
          <ActionButton
            type="view"
            onClick={(e) => handleView(q.quotationNumber, e)}
            iconOnly={false}
          />
          <ActionMenu
            showDownload
            onDownload={(e) =>
              handleDownload(q.quotationNumber, e)
            }
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
          <p className="mt-2 text-muted">Loading quotations…</p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredQuotations}
          rowKey={(row) => row.quotationNumber}
          showToolbar
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          enableColumnSelector
            enableAdd
  addLabel="Add Quotation"
  onAdd={onAddQuotation}   
    enableExport              
  onExport={onExportQuotation}
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          
        />
      )}

      <PdfPreviewModal
        open={pdfOpen}
        title="Quotation Preview"
        pdfUrl={pdfUrl}
        onClose={handleClosePdf}
        onDownload={() =>
          selectedQuotation &&
          generateInvoicePDF(selectedQuotation, "save")
        }
      />
    </div>
  );
};

export default QuotationsTable;
