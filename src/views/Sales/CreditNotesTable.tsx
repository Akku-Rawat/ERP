import React, { useState } from "react";
import Table from "../../components/ui/Table/Table";
import type { Column } from "../../components/ui/Table/type";
import StatusBadge from "../../components/ui/Table/StatusBadge";
import CreateCreditNoteModal from "./CreateCreditNoteModal";

type CreditNote = {
  noteNo: string;
  invoiceNo: string;
  customer: string;
  date: string;
  amount: number;
  status: "Draft" | "Approved" | "Refunded";
};

const CreditNotesTable: React.FC = () => {
  const [data] = useState<CreditNote[]>([
    {
      noteNo: "CN-001",
      invoiceNo: "INV-0057",
      customer: "ABC Traders",
      date: "2026-01-15",
      amount: 1200,
      status: "Approved",
    },
  ]);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const columns: Column<CreditNote>[] = [
    { key: "noteNo", header: "Credit Note No" },
    { key: "invoiceNo", header: "Invoice No" },
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

  return (
    <>
      <Table
        columns={columns}
        data={data}
        showToolbar
        enableAdd
        addLabel="Add Credit Note"
        onAdd={() => setOpenCreateModal(true)}  
        emptyMessage="No credit notes found"
      />

      <CreateCreditNoteModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSubmit={(payload) => {
          console.log("Credit Note Payload:", payload);
          setOpenCreateModal(false);
        }}
      />
    </>
  );
};

export default CreditNotesTable;
