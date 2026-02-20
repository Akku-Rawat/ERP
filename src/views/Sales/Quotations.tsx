import React, { useEffect, useState } from "react";
import { showApiError, showSuccess, showLoading, closeSwal } from "../../utils/alert";
import { getAllQuotations, getQuotationById } from "../../api/quotationApi";
import { getCompanyById } from "../../api/companySetupApi";
import type { QuotationSummary } from "../../types/quotation";
import Table from "../../components/ui/Table/Table";
import ActionButton, {
  ActionGroup,
  ActionMenu,
} from "../../components/ui/Table/ActionButton";

import InvoiceDetailsModal, { type InvoiceDetails } from "./InvoiceDetailsModal";

import type { Column } from "../../components/ui/Table/type";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { generateQuotationPDF } from "../../components/template/quotation/QuotationTemplate1";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;

interface QuotationTableProps {
  onAddQuotation?: () => void;
  onExportQuotation?: () => void;
}

const QuotationsTable: React.FC<QuotationTableProps> = ({
  onAddQuotation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotations, setQuotations] = useState<QuotationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [status] = useState("");
  const [fromDate] = useState("");
  const [toDate] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);


  // Company data state
  const [company, setCompany] = useState<any>(null);

  const fetchAllQuotationsForExport = async () => {
    try {
      let allData: QuotationSummary[] = [];
      let currentPage = 1;
      let totalPagesLocal = 1;

      do {
        const res = await getAllQuotations(currentPage, 100, {
          status,
          fromDate,
          toDate,
        });

        if (res?.status_code === 200) {
          const quotationsData = res.data?.quotations || [];

          const mapped = quotationsData.map((q: any) => ({
            quotationNumber: q.id || "",
            customerName: q.customerName || "N/A",
            industryBases: q.industryBases || "N/A",
            transactionDate: q.transactionDate || "",
            validTill: q.validTill || "",
            grandTotal: Number(q.grandTotal ?? 0),
            currency: q.currency || "ZMW",
          }));

          allData = [...allData, ...mapped];
          totalPagesLocal = res.data?.pagination?.totalPages || 1;
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
      showLoading("Exporting Quotations...");

      const dataToExport = await fetchAllQuotationsForExport();

      if (!dataToExport.length) {
        closeSwal();
        showApiError("No quotations to export");
        return;
      }

      const formattedData = dataToExport.map((q) => ({
        "Quotation No": q.quotationNumber,
        Customer: q.customerName,
        Industry: q.industryBases,
        Date: q.transactionDate,
        "Valid Till": q.validTill,
        Amount: q.grandTotal,
        Currency: q.currency,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Quotations");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileData = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(fileData, "All_Quotations.xlsx");

      closeSwal();
      showSuccess("Export completed successfully");

    } catch (error) {
      closeSwal();
      showApiError(error);
    }
  };




  /*      FETCH COMPANY DATA
   */

  const fetchCompany = async () => {
    const res = await getCompanyById(COMPANY_ID);

    if (!res || res.status_code !== 200) {
      throw new Error("Company fetch failed");
    }

    setCompany(res.data);
    return res.data;
  };

  /*      FETCH QUOTATIONS
   */
  const fetchQuotations = async () => {
    try {
      setLoading(true);

      const res = await getAllQuotations(page, pageSize, {
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
    fetchCompany().catch(() => console.error("Failed to load company data"));
  }, []);

  useEffect(() => {
    fetchQuotations();
  }, [page, pageSize, status, fromDate, toDate]);

  /*      ACTIONS
   */
  const handleView = async (
    quotationNumber: string,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();

    setDetailsId(quotationNumber);
    setDetailsOpen(true);
  };


  const handleDownload = async (
    quotationNumber: string,
    e?: React.MouseEvent,
  ) => {
    e?.stopPropagation();

    try {
      showLoading("Preparing download...");

      if (!company) {
        closeSwal();
        console.error("Company data not loaded");
        return;
      }

      const res = await getQuotationById(quotationNumber);
      if (!res || res.status_code !== 200) {
        closeSwal();
        return;
      }

      await generateQuotationPDF(
        res.data,
        company,
        "save"
      );

      closeSwal();
      showSuccess("Quotation downloaded");

    } catch (error) {
      closeSwal();
      showApiError(error);
    }
  };


  const mapQuotationToInvoiceDetails = (raw: any): InvoiceDetails => {
    const billingAddress = raw?.billingAddress;
    const shippingAddress = raw?.shippingAddress;

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
      invoiceNumber: raw?.id ?? raw?.quotationNumber ?? raw?.quotationId,
      invoiceType: raw?.invoiceType ?? "Quotation",
      originInvoice: null,
      customerName: raw?.customerName ?? raw?.customerId,
      customerTpin: raw?.customerTpin,
      currencyCode: raw?.currencyCode ?? raw?.currency,
      exchangeRt: raw?.exchangeRt,
      dateOfInvoice: raw?.transactionDate ?? raw?.quotationDate,
      dueDate: raw?.validUntil ?? raw?.validTill,
      invoiceStatus: raw?.invoiceStatus ?? raw?.status ?? "—",
      Receipt: raw?.Receipt ?? raw?.receipt,
      ReceiptNo: raw?.ReceiptNo ?? raw?.receiptNo,
      TotalAmount: raw?.TotalAmount ?? raw?.grandTotal ?? raw?.totalAmount,
      discountPercentage: raw?.discountPercentage,
      discountAmount: raw?.discountAmount ?? raw?.totalDiscount,
      lpoNumber: raw?.lpoNumber ?? raw?.poNumber,
      destnCountryCd: raw?.destnCountryCd ?? null,
      billingAddress,
      shippingAddress,
      paymentInformation: raw?.paymentInformation ?? {
        paymentTerms: raw?.paymentTerms,
        paymentMethod: raw?.paymentMethod,
        bankName: raw?.bankName,
        accountNumber: raw?.accountNumber,
        routingNumber: raw?.routingNumber,
        swiftCode: raw?.swiftCode,
      },
      items,
      terms: raw?.terms ?? {
        selling: {
          general: raw?.termsAndConditions ?? raw?.notes,
        },
      },
    };
  };

  /*      TABLE COLUMNS
   */
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
          {q.currency} {q.grandTotal.toLocaleString()}
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
            iconOnly
          />
          <ActionMenu
            showDownload
            onDownload={(e) => handleDownload(q.quotationNumber, e)}
          />
        </ActionGroup>
      ),
    },
  ];

  const filteredQuotations = quotations.filter((q) =>
    q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  /*  RENDER */
  return (
    <div className="p-8">
      <Table
        loading={loading || initialLoad}
        serverSide={false}
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
        onExport={handleExportExcel}
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
        fetchDetails={getQuotationById}
        mapDetails={mapQuotationToInvoiceDetails}
      />
    </div>
  );
};

export default QuotationsTable;
