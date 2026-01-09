import { useMemo } from "react";
import {
  Calendar,
  Search,
  Download,
  Printer,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  FileText,
} from "lucide-react";
import Table from "../../components/ui/Table/Table";

const CustomerStatement = () => {
  const statementData = useMemo(
    () => [
      {
        date: "01 Oct 2023",
        type: "Opening Balance",
        ref: "BAL-FWD",
        debit: 0,
        credit: 0,
        balance: 5000,
      },
      {
        date: "05 Oct 2023",
        type: "Sales Invoice",
        ref: "INV-001",
        debit: 1500,
        credit: 0,
        balance: 6500,
      },
      {
        date: "12 Oct 2023",
        type: "Bank Payment",
        ref: "REC-882",
        debit: 0,
        credit: 2000,
        balance: 4500,
      },
      {
        date: "15 Oct 2023",
        type: "Credit Note",
        ref: "CN-002",
        debit: 0,
        credit: 500,
        balance: 4000,
      },
      {
        date: "20 Oct 2023",
        type: "Sales Invoice",
        ref: "INV-004",
        debit: 3500,
        credit: 0,
        balance: 7500,
      },
    ],
    [],
  );

  const statementColumns = [
    {
      key: "date",
      header: "Date",
      render: (row: any) => (
        <span className="text-[11px] font-bold text-muted uppercase tracking-tighter">
          {row.date}
        </span>
      ),
    },
    {
      key: "type",
      header: "Transaction Details",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div
            className={`p-1.5 rounded-lg ${row.debit > 0 ? "bg-amber-500/10 text-amber-600" : row.credit > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-row-hover text-muted"}`}
          >
            {row.debit > 0 ? (
              <ArrowUpRight size={12} />
            ) : row.credit > 0 ? (
              <ArrowDownLeft size={12} />
            ) : (
              <FileText size={12} />
            )}
          </div>
          <div>
            <p className="font-bold text-xs text-main leading-none">
              {row.type}
            </p>
            <p className="text-[9px] font-mono text-muted mt-1 uppercase tracking-widest">
              {row.ref}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "debit",
      header: "Debit (+)",
      align: "right" as const,
      render: (row: any) =>
        row.debit > 0 ? (
          <span className="text-xs font-bold text-main">
            ₹{row.debit.toLocaleString()}
          </span>
        ) : (
          <span className="opacity-20 text-[10px]">-</span>
        ),
    },
    {
      key: "credit",
      header: "Credit (-)",
      align: "right" as const,
      render: (row: any) =>
        row.credit > 0 ? (
          <span className="text-xs font-bold text-emerald-600">
            ₹{row.credit.toLocaleString()}
          </span>
        ) : (
          <span className="opacity-20 text-[10px]">-</span>
        ),
    },
    {
      key: "balance",
      header: "Balance",
      align: "right" as const,
      render: (row: any) => (
        <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">
          ₹{row.balance.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      {/* 1. UNIFIED TOOLBAR */}
      <div className="flex items-center justify-between bg-card p-2 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-2">
          {/* Range Picker */}
          <div className="flex items-center bg-app/50 border border-[var(--border)] rounded-xl px-3 py-1.5 gap-3 group focus-within:border-primary transition-all">
            <Calendar className="w-3.5 h-3.5 text-muted" />
            <input
              type="date"
              className="bg-transparent text-[10px] font-black text-main outline-none uppercase tracking-tighter"
            />
            <span className="text-muted text-[10px] opacity-30 font-black">
              TO
            </span>
            <input
              type="date"
              className="bg-transparent text-[10px] font-black text-main outline-none uppercase tracking-tighter"
            />
          </div>
          <button className="p-2 bg-row-hover text-muted hover:text-primary rounded-xl transition-all border border-[var(--border)]">
            <Search size={14} />
          </button>
        </div>

        {/* Minimal Actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-app border border-[var(--border)] text-muted hover:text-main rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            <Printer size={14} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 text-[10px] font-black uppercase tracking-widest transition-all shadow-md">
            <Download size={14} /> Export Statement
          </button>
        </div>
      </div>

      {/* 2. AGING & KPI STRIP */}
      <div className="grid grid-cols-12 gap-3">
        {/* Aging Summary (Takes 8 cols) */}
        <div className="col-span-8 bg-card border border-[var(--border)] rounded-2xl flex divide-x divide-[var(--border)] overflow-hidden shadow-sm">
          <AgingCell label="Current" value="4,500" active />
          <AgingCell label="1-30 Days" value="2,000" />
          <AgingCell label="31-60" value="1,000" />
          <AgingCell label="61-90" value="0" />
          <AgingCell label="90+" value="0" />
        </div>
        {/* Total Owed KPI (Takes 4 cols) */}
        <div className="col-span-4 bg-primary rounded-2xl p-3 flex items-center justify-between px-6 shadow-lg shadow-primary/20">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em]">
              Net Outstanding
            </span>
            <span className="text-xl font-black text-white tracking-tighter">
              ₹7,500.00
            </span>
          </div>
          <Wallet className="text-white/30" size={24} />
        </div>
      </div>

      {/* 3. TABLE SECTION */}
      <div className="bg-card rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] flex justify-between items-center bg-row-hover/5">
          <h3 className="text-[10px] font-black text-main uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-3 bg-primary rounded-full" /> Account Ledger
          </h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-main/20" /> Total
              Invoiced: <span className="text-main">₹34,500</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />{" "}
              Total Collected: <span className="text-emerald-600">₹27,000</span>
            </div>
          </div>
        </div>

        <div className="custom-table-tight">
          <Table
            columns={statementColumns}
            data={statementData}
            showToolbar={false}
          />
        </div>
      </div>
    </div>
  );
};

// --- Compact Sub-components ---

const AgingCell = ({ label, value, active = false }: any) => (
  <div
    className={`flex-1 px-4 py-2.5 flex flex-col transition-all ${active ? "bg-row-hover" : ""}`}
  >
    <span
      className={`text-[8px] font-black uppercase tracking-widest mb-0.5 ${active ? "text-primary" : "text-muted"}`}
    >
      {label}
    </span>
    <span
      className={`text-xs font-black ${active ? "text-primary" : "text-main"}`}
    >
      ₹{value}
    </span>
  </div>
);

export default CustomerStatement;
