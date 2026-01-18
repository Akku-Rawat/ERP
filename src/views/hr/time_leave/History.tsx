import React, { useMemo, useState } from "react";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaCopy,
  FaPlus,
} from "react-icons/fa";

/* ---------- Mock Types ---------- */
type LeaveRequest = {
  id: string;
  type: string;
  status: "Approved" | "Pending" | "Rejected";
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  date: string;
};

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
    start_date: "2026-01-20",
    end_date: "2026-01-20",
    days: 1,
    reason: "Fever",
    date: "18-01-2026",
  },
];

interface HistoryProps {
  onNewRequest: () => void;
}


/* ---------- Component ---------- */
const History: React.FC<HistoryProps> = ({ onNewRequest }) => {

  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    let data = MOCK_LEAVES;

    if (search) {
      data = data.filter(
        (l) =>
          l.type.toLowerCase().includes(search.toLowerCase()) ||
          l.reason.toLowerCase().includes(search.toLowerCase())
      );
    }

    return showAll ? data : data.slice(0, 5);
  }, [search, showAll]);

  return (
    <div className="bg-app">
      <div className="max-w-6xl mx-auto bg-card border border-theme rounded-2xl overflow-hidden">

       {/* Header */}
<div className="p-4 border-b border-theme flex items-center justify-between gap-4">
  
  

  {/* Middle: Search */}
  <div className="max-w-xs">
    <input
      type="text"
      placeholder="Search leaves..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full px-3 py-2 border border-theme rounded-xl bg-app text-main text-sm"
    />
  </div>

  {/* Right: New Request */}
  <button
    onClick={onNewRequest}
    className="px-4 py-2 bg-primary text-white rounded-xl text-sm flex items-center gap-2 whitespace-nowrap"
  >
    <FaPlus size={12} />
    New Request
  </button>
</div>


       

        {/* List */}
        <div className="p-4 space-y-3 max-h-[500px] overflow-auto">
          {filtered.length === 0 ? (
            <div className="text-center text-muted py-10">
              No leave requests found
            </div>
          ) : (
            filtered.map((req) => (
              <div
                key={req.id}
                className="bg-card border border-theme rounded-xl p-4 row-hover transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-main">
                    {req.type}
                  </div>
                  <span className="text-xs text-muted">
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-muted mb-3">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt size={12} />
                    {req.start_date} → {req.end_date}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock size={12} />
                    {req.days} days
                  </div>
                  <div>Applied: {req.date}</div>
                </div>

                <p className="text-xs text-main italic mb-3">
                  “{req.reason}”
                </p>

                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-theme rounded-lg text-xs text-main">
                    <FaEye className="inline mr-1" />
                    Details
                  </button>
                  {req.status === "Approved" && (
                    <button className="px-3 py-1.5 border border-theme rounded-lg text-xs text-main">
                      <FaCopy className="inline mr-1" />
                      Apply Again
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {MOCK_LEAVES.length > 5 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-primary"
              >
                {showAll ? "Show Less" : "See More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
