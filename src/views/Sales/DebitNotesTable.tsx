import React, { useState } from "react";
import Table from "../../components/ui/Table/Table";
import type { Column } from "../../components/ui/Table/type";
import StatusBadge from "../../components/ui/Table/StatusBadge";

type DebitNote = {
  noteNo: string;
  invoiceNo: string;
  customer: string;
  date: string;
  amount: number;
  status: "Draft" | "Approved" | "Rejected";
};

const DebitNotesTable: React.FC = () => {
  const [data] = useState<DebitNote[]>([
    {
      noteNo: "DN-001",
      invoiceNo: "INV-0038",
      customer: "LMN Corp",
      date: "2026-01-13",
      amount: 3500,
      status: "Approved",
    },
    {
      noteNo: "DN-002",
      invoiceNo: "INV-0021",
      customer: "OPQ Ltd",
      date: "2026-01-11",
      amount: 2100,
      status: "Rejected",
    },
  ]);

  const columns: Column<DebitNote>[] = [
    { key: "noteNo", header: "Debit Note No" },
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
    <Table
      columns={columns}
      data={data}
      showToolbar
      enableAdd
      addLabel="Add Debit Note"
      emptyMessage="No debit notes found"
    />
    
    

   
  );
};

export default DebitNotesTable;
