import React, { useState, useEffect } from "react";

import Table from "../../components/ui/Table/Table";
import type { Column } from "../../components/ui/Table/type";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import CreateCreditNoteModal from "./CreateCreditNoteModal";
import { getAllCreditNotes } from "../../api/salesApi";

type CreditNote = {
  noteNo: string;
  invoiceNo: string;
  customer: string;
  date: string;
  amount: number;
  status: "Draft" | "Approved" | "Refunded";
};

const CreditNotesTable: React.FC = () => {
  const [data, setData] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
      render: (r) => `₹${r.amount.toLocaleString()}`,
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
        status: item.invoiceStatus ?? "",
      }));

      setData(mappedData);
      setTotalPages(resp.pagination.total_pages);
      setTotalItems(resp.pagination.total);
    } catch (error) {
      console.error("Failed to load credit notes", error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchCreditNotes();
}, [page, pageSize]);


  return (
    <>
      <Table
        columns={columns}
        data={data}
        loading={loading}
        showToolbar
        enableAdd
        addLabel="Add Credit Note"
        onAdd={() => setOpenCreateModal(true)}
        emptyMessage="No credit notes found"
        enableColumnSelector
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
    </>
  );
};

export default CreditNotesTable;
