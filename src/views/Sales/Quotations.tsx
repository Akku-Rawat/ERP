import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getAllQuotations, getQuotationById } from "../../api/quotationApi";
import { getCompanyById } from "../../api/companySetupApi";
import type { QuotationSummary, QuotationData } from "../../types/quotation";

import Table from "../../components/ui/Table/Table";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";
import type { Column } from "../../components/ui/Table/type";

import PdfPreviewModal from "./PdfPreviewModal";
import { generateQuotationPDF } from "../../components/template/quotation/QuotationTemplate1";

interface QuotationTableProps {
  onAddQuotation?: () => void;
  onExportQuotation?: () => void;
}

const QuotationsTable: React.FC<QuotationTableProps> = ({
  onAddQuotation,
  onExportQuotation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotations, setQuotations] = useState<QuotationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedQuotation, setSelectedQuotation] =
    useState<QuotationData | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  // Company data state
  const [company, setCompany] = useState<any>(null);

  /* ===============================
     FETCH COMPANY DATA
  ================================ */

  const fetchCompany = async (companyId: string) => {
    const res = await getCompanyById(companyId);

    if (!res || res.status_code !== 200) {
      throw new Error("Company fetch failed");
    }

    setCompany(res.data);
    return res.data;
  };

  /* ===============================
     FETCH QUOTATIONS
  ================================ */
  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await getAllQuotations(page, pageSize);

      if (!res || res.status_code !== 200) {
        console.error("Invalid response:", res);
        toast.error("Failed to load quotations");
        setQuotations([]);
        return;
      }

      const quotationsData = Array.isArray(res.data?.quotations)
        ? res.data.quotations
        : [];

      const mapped: QuotationSummary[] = quotationsData.map((q: any) => ({
        quotationNumber: q.id || "",
        customerName: q.customerName || "N/A",
        industryBases: q.industryBases || "N/A",
        transactionDate: q.transactionDate || "",
        validTill: q.validTill || "",
        grandTotal: Number(q.grandTotal ?? 0),
        currency: q.currency || "ZMW",
      }));

      setQuotations(mapped);
      setTotalPages(res.data?.pagination?.totalPages || 1);
      setTotalItems(res.data?.pagination?.total || mapped.length);
    } catch (error) {
      console.error("Error fetching quotations:", error);
      toast.error("Failed to load quotations");
      setQuotations([]);
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
  const handleView = async (quotationNumber: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    try {
      const quotationRes = await getQuotationById(quotationNumber);
      if (!quotationRes || quotationRes.status_code !== 200) {
        toast.error("Failed to load quotation");
        return;
      }

      const companyData = await fetchCompany("COMP-00003");

      const quotation = quotationRes.data as QuotationData;
      setSelectedQuotation(quotation);

      const url = await generateQuotationPDF(quotation, companyData, "bloburl");

      setPdfUrl(url as string);
      setPdfOpen(true);
    } catch (error) {
      console.error("View error:", error);
      toast.error("Failed to generate preview");
    }
  };

  const handleDownload = async (
    quotationNumber: string,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();

    if (!company) {
      toast.error("Company data not loaded");
      return;
    }

    try {
      const res = await getQuotationById(quotationNumber);
      if (!res || res.status_code !== 200) return;
      getCompanyById("COMP-00003");

      await generateQuotationPDF(res.data, company, "save");
      toast.success("Quotation downloaded");
    } catch (error) {
      console.error("Download error:", error);
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
      String(q.quotationNumber)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase())
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
        <span className="font-semibold text-main">{q.quotationNumber}</span>
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
          {q.currency === "INR" ? "₹" : q.currency === "USD" ? "$" : "ZK"}
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
            onDownload={(e) => handleDownload(q.quotationNumber, e)}
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
      {loading && quotations.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="mt-2 text-muted">Loading quotations…</p>
        </div>
      ) : (
        <Table
          loading={loading}
          serverSide
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
          pageSizeOptions={[10, 25, 50, 100]}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
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
          company &&
          generateQuotationPDF(selectedQuotation, company, "save")
        }
      />
    </div>
  );
};

export default QuotationsTable;
