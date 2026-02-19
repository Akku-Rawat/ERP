import React, { useState, useEffect } from "react";

import Table from "../../components/ui/Table/Table";
import type { Column } from "../../components/ui/Table/type";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import CreateCreditNoteModal from "./CreateCreditNoteModal";
import { getAllCreditNotes } from "../../api/salesApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { showLoading, closeSwal , showApiError , showSuccess } from "../../utils/alert";


type CreditNote = {
  noteNo: string;
  invoiceNo: string;
  customer: string;
  date: string;
  amount: number;
  currency: string;
  status: "Draft" | "Approved" | "Refunded";
};

const CreditNotesTable: React.FC = () => {
  const [data, setData] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [initialLoad, setInitialLoad] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const columns: Column<CreditNote>[] = [
    { key: "noteNo", header: "Credit invoice No" },
    { key: "invoiceNo", header: "Reciept No" },
    { key: "customer", header: "Customer" },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (r) => (
        <code className="text-xs px-2 py-1 rounded bg-row-hover text-main font-semibold whitespace-nowrap">
          {r.amount.toLocaleString()} {r.currency}
        </code>
      ),
    },

    { key: "date", header: "Date" },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];
  const fetchCreditNotes = async () => {
    try {
      setLoading(true);

      const resp = await getAllCreditNotes(page, pageSize);

      const mappedData: CreditNote[] = resp.data.map((item: any) => ({
        noteNo: item.invoiceNumber,
        invoiceNo: item.receiptNumber,
        customer: item.customerName,
        date: item.dateOfInvoice,
        amount: Math.abs(item.totalAmount),
        currency: item.currency,
        status: item.invoiceStatus ?? "",
      }));

      setData(mappedData);
      setTotalPages(resp.pagination.total_pages);
      setTotalItems(resp.pagination.total);
    } catch (error: any) {
      console.error("Failed to load credit notes", error);
      showApiError(error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchCreditNotes();
  }, [page, pageSize]);

  const fetchAllCreditNotesForExport = async () => {
  try {
    let allData: CreditNote[] = [];
    let currentPage = 1;
    let totalPagesLocal = 1;

    do {
      const resp = await getAllCreditNotes(currentPage, 100);

      const mappedData: CreditNote[] = resp.data.map((item: any) => ({
        noteNo: item.invoiceNumber,
        invoiceNo: item.receiptNumber,
        customer: item.customerName,
        date: item.dateOfInvoice,
        amount: Math.abs(item.totalAmount),
        currency: item.currency,
        status: item.invoiceStatus ?? "",
      }));

      allData = [...allData, ...mappedData];
      totalPagesLocal = resp.pagination.total_pages;

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
    showLoading("Exporting Credit Notes...");

    const dataToExport = await fetchAllCreditNotesForExport();

    if (!dataToExport.length) {
      closeSwal();
      showApiError("No credit notes to export");
      return;
    }

    const formattedData = dataToExport.map((r) => ({
      "Credit Note No": r.noteNo,
      "Receipt No": r.invoiceNo,
      Customer: r.customer,
      Date: r.date,
      Amount: r.amount,
      Currency: r.currency,
      Status: r.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Credit Notes"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "Credit_Notes.xlsx");

    closeSwal();
    showSuccess("Credit notes exported successfully");

  } catch (error) {
    closeSwal();
    showApiError(error);
  }
};



  return (
    <div className="p-8">
      <Table
        columns={columns}
        data={data}
        loading={loading || initialLoad}
        showToolbar
        enableAdd
        addLabel="Add Credit Note"
        onAdd={() => setOpenCreateModal(true)}
        emptyMessage="No credit notes found"
        enableColumnSelector
        enableExport
        onExport={handleExportExcel}
        currentPage={page}
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


      <CreateCreditNoteModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSubmit={(payload) => {
          console.log("Credit Note Payload:", payload);
          setOpenCreateModal(false);
        }}
        invoiceId={data.length > 0 ? data[0].invoiceNo : ""}
      />
    </div>
  );
};

export default CreditNotesTable;
