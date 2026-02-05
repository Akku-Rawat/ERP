import React, { useState, useEffect } from "react";

import Table from "../../components/ui/Table/Table";
import type { Column } from "../../components/ui/Table/type";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import CreateDebitNoteModal from "./createDebitNoteModal";
import { getAllDebitNotes } from "../../api/salesApi";

type DebitNote = {
  noteNo: string;
  invoiceNo: string;
  customer: string;
  date: string;
  amount: number;
  status: "Draft" | "Approved" | "Rejected";
};

const DebitNotesTable: React.FC = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [data, setData] = useState<DebitNote[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [initialLoad, setInitialLoad] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const columns: Column<DebitNote>[] = [
    { key: "noteNo", header: "Debit invoice No" },
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

  const fetchDebitNotes = async () => {
    try {
      setLoading(true);

      const resp = await getAllDebitNotes(page, pageSize);

      const mappedData: DebitNote[] = resp.data.map((item: any) => ({
        noteNo: item.invoiceNumber,
        invoiceNo: item.receiptNumber,
        customer: item.customerName,
        date: item.dateOfInvoice,
        amount: item.totalAmount,
        status: item.invoiceStatus ?? "Draft",
      }));

      setData(mappedData);
      setTotalPages(resp.pagination.total_pages);
      setTotalItems(resp.pagination.total);
    } catch (error) {
      console.error("Failed to load debit notes", error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchDebitNotes();
  }, [page, pageSize]);

  return (
    <div className="p-8">
        <Table
          columns={columns}
          data={data}
          showToolbar
          enableAdd
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          loading={loading || initialLoad}
          addLabel="Add Debit Note"
          onAdd={() => setOpenCreateModal(true)}
          emptyMessage="No debit notes found"
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
      

      <CreateDebitNoteModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSubmit={(payload) => {
          console.log("debit Note Payload:", payload);
          setOpenCreateModal(false);
          fetchDebitNotes();
        }}
        invoiceId={data.length > 0 ? data[0].invoiceNo : ""}
      />
    </div>
  );
};

export default DebitNotesTable;
