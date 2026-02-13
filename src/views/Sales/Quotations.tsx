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
import SalesFilter from "../../components/filters/SalesFilters";

import PdfPreviewModal from "./PdfPreviewModal";
import { generateQuotationPDF } from "../../components/template/quotation/QuotationTemplate1";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;

interface QuotationTableProps {
  onAddQuotation?: () => void;
  onExportQuotation?: () => void;
}
type QuotationStatus = "Draft" | "Sent" | "Pending" | "Accepted" | "Rejected";


const QuotationsTable: React.FC<QuotationTableProps> = ({
  onAddQuotation,
  onExportQuotation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotations, setQuotations] = useState<QuotationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const [selectedQuotation, setSelectedQuotation] =
    useState<QuotationData | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  // Company data state
  const [company, setCompany] = useState<any>(null);

  const QUOTATION_STATUS_TRANSITIONS: Record<QuotationStatus, QuotationStatus[]> = {
    Draft: ["Sent", "Pending"],
    Sent: ["Pending", "Accepted", "Rejected"],
    Pending: ["Accepted", "Rejected"],
    Accepted: [],
    Rejected: [],
  };
  const CRITICAL_QUOTATION_STATUSES: QuotationStatus[] = ["Accepted"];




  /* ===============================
     FETCH COMPANY DATA
  ================================ */

  const fetchCompany = async (companyId: string) => {
    const res = await getCompanyById(COMPANY_ID);

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

      const res = await getAllQuotations(page, pageSize, {
        search: searchTerm,
        status,
        fromDate,
        toDate,
      });

      if (!res || res.status_code !== 200) {
        console.error("Invalid response:", res);
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
      setQuotations([]);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };
  useEffect(() => {
    fetchCompany("1").catch(() => console.error("Failed to load company data"));
  }, []);

  useEffect(() => {
    fetchQuotations();
  }, [page, pageSize, searchTerm, status, fromDate, toDate]);

  /* ===============================
     ACTIONS
  ================================ */
  const handleView = async (quotationNumber: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    try {
      const quotationRes = await getQuotationById(quotationNumber);
      if (!quotationRes || quotationRes.status_code !== 200) {
        console.error("Failed to load quotation");
        return;
      }

      if (!company) {
        console.error("Company data not loaded");
        return;
      }

      const quotation = quotationRes.data as QuotationData;
      setSelectedQuotation(quotation);

      const url = await generateQuotationPDF(quotation, company, "bloburl");
      setPdfUrl(url as string);
      setPdfOpen(true);
    } catch (error) {
      toast.error("Failed to generate preview");
    }
  };

  const handleDownload = async (
    quotationNumber: string,
    e?: React.MouseEvent,
  ) => {
    e?.stopPropagation();

    if (!company) {
      console.error("Company data not loaded");
      return;
    }

    try {
      const res = await getQuotationById(quotationNumber);
      if (!res || res.status_code !== 200) return;
      getCompanyById(COMPANY_ID);

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
      <Table
        loading={loading || initialLoad}
        serverSide={true}
        columns={columns}
        data={quotations}
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
