import React, { useMemo, useState } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { CalendarDays , XCircle } from "lucide-react";
import Table from "../../../components/ui/Table/Table";
import StatusBadge from "../../../components/ui/Table/StatusBadge";
import ActionButton, {
  ActionGroup,
} from "../../../components/ui/Table/ActionButton";
import Modal from "../../../components/ui/modal/modal";
import { Card,Select } from "../../../components/ui/modal/formComponent";
import type { Column } from "../../../components/ui/Table/type";
import { useTableLogic } from "../../../components/ui/Table/useTableLogic";

/* ---------- Types ---------- */
type LeaveRequest = {
  id: string;
  type: string;
  status: "Approved" | "Pending" | "Rejected" | "Cancelled";
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  date: string;
};

interface HistoryProps {
  onNewRequest: () => void;
}

/* ---------- Mock Data ---------- */
const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: "1",
    type: "Casual Leave",
    status: "Approved",
    start_date: "2026-01-14",
    end_date: "2026-01-16",
    days: 3,
    reason: "Family function",
    date: "12-01-2026",
  },
  {
    id: "2",
    type: "Sick Leave",
    status: "Pending",
    start_date: "2025-12-20",
    end_date: "2025-12-20",
    days: 1,
    reason: "Fever",
    date: "18-12-2025",
  },
];

const handleCancelLeave = (leave: LeaveRequest) => {
  console.log("Cancel leave request:", leave.id);

  // later API call
  // setStatus("Cancelled")
};



const History: React.FC<HistoryProps> = ({ onNewRequest }) => {
  const [selectedLeave, setSelectedLeave] =
    useState<LeaveRequest | null>(null);

    
  /* ---------- Columns (CRM Style) ---------- */
  const columns: Column<LeaveRequest>[] = [
    {
      key: "type",
      header: "Type",
      align: "left",
      render: (l) => (
        <div>
          <div className="font-semibold">{l.type}</div>
          <div className="text-xs text-muted italic">{l.reason}</div>
        </div>
      ),
    },
    {
      key: "period",
      header: "Period",
      align: "left",
      render: (l) => (
        <span className="text-xs">
          <FaCalendarAlt className="inline mr-1 text-muted" />
          {l.start_date} → {l.end_date}
        </span>
      ),
    },
    {
      key: "days",
      header: "Days",
      align: "center",
      render: (l) => (
        <span className="inline-flex items-center gap-1">
          <FaClock className="text-muted" />
          {l.days}
        </span>
      ),
    },
    {
      key: "date",
      header: "Applied",
      align: "left",
    },
    {
      key: "status",
      header: "Status",
      align: "left",
      render: (l) => <StatusBadge status={l.status} />,
    },
{
  key: "actions",
  header: "Actions",
  align: "center",
  render: (l) => (
    <div className="flex items-center justify-center gap-3 min-w-[72px]">
      {/* View */}
      <ActionButton
        type="view"
        iconOnly
        onClick={() => setSelectedLeave(l)}
      />

      {/* Cancel (only for Pending, but space stays consistent) */}
      {l.status === "Pending" ? (
        <ActionButton
          type="custom"
          variant="danger"
          iconOnly
          icon={<XCircle className="w-4 h-4" />}
          onClick={() => handleCancelLeave(l)}
        />
      ) : (
        <span className="w-8 h-8" /> // spacer to keep alignment
      )}
    </div>
  ),
}


  ];

  const {
  yearFilter,
  setYearFilter,
  leaveTypeFilter,
  setLeaveTypeFilter,
} = useTableLogic<LeaveRequest>({
  columns,
  data: MOCK_LEAVES,
});

    
const historyFilters = (
  <>
    {/* YEAR FILTER */}
    <div className="relative">
      <select
        value={yearFilter}
        onChange={(e) => setYearFilter(e.target.value)}
        className="
          appearance-none
          px-4 py-2
          pr-9
          rounded-xl
          border border-[var(--border)]
          bg-app
          text-[10px] font-black uppercase tracking-widest
          text-muted
          hover:text-primary hover:border-primary
          focus:outline-none focus:ring-2 focus:ring-primary/10
          cursor-pointer
        "
      >
        <option value="">Year: All</option>
        <option value="2026">Year: 2026</option>
        <option value="2025">Year: 2025</option>
      </select>

      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
        ▾
      </span>
    </div>

    {/* LEAVE TYPE FILTER */}
    <div className="relative">
      <select
        value={leaveTypeFilter}
        onChange={(e) => setLeaveTypeFilter(e.target.value)}
        className="
          appearance-none
          px-4 py-2
          pr-9
          rounded-xl
          border border-[var(--border)]
          bg-app
          text-[10px] font-black uppercase tracking-widest
          text-muted
          hover:text-primary hover:border-primary
          focus:outline-none focus:ring-2 focus:ring-primary/10
          cursor-pointer
        "
      >
        <option value="">Type: All</option>
        <option value="Casual Leave">Type: Casual</option>
        <option value="Sick Leave">Type: Sick</option>
      </select>

      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
        ▾
      </span>
    </div>
  </>
);

  

  return (
    <div className="p-8">
      {/* ===== CRM TABLE ===== */}
      <Table
        columns={columns}
        data={MOCK_LEAVES}
        showToolbar
        enableAdd
        extraFilters={historyFilters}  
        addLabel="New Request"
        onAdd={onNewRequest}
        toolbarPlaceholder="Search reason / type..."
        emptyMessage="No leave requests found."
      />

      {/* ===== DETAILS MODAL ===== */}
      <Modal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        title="Leave Details"
        subtitle="Applied leave information"
        icon={CalendarDays}
        maxWidth="md"
      >
        {selectedLeave && (
          <Card title="Leave Information">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted">Type</span>
                <p className="font-semibold">{selectedLeave.type}</p>
              </div>

              <div>
                <span className="text-muted">Status</span>
                <p className="font-semibold">{selectedLeave.status}</p>
              </div>

              <div>
                <span className="text-muted">Period</span>
                <p>
                  {selectedLeave.start_date} → {selectedLeave.end_date}
                </p>
              </div>

              <div>
                <span className="text-muted">Days</span>
                <p>{selectedLeave.days}</p>
              </div>

              <div className="col-span-2">
                <span className="text-muted">Reason</span>
                <p className="italic mt-1">
                  “{selectedLeave.reason}”
                </p>
              </div>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default History;
