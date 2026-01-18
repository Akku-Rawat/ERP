import React, { useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
} from "react-icons/fa";

/* ---------- Mock Type ---------- */
type LeaveRequest = {
  leave_id: string;
  employee: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
};

/* ---------- Mock Data ---------- */
const MOCK_REQUESTS: LeaveRequest[] = [
  {
    leave_id: "1",
    employee: "Amit Sharma",
    type: "Casual Leave",
    start_date: "2026-01-14",
    end_date: "2026-01-16",
    reason: "Family function",
    status: "pending",
  },
  {
    leave_id: "2",
    employee: "Neha Verma",
    type: "Sick Leave",
    start_date: "2026-01-20",
    end_date: "2026-01-20",
    reason: "Fever",
    status: "pending",
  },
];

/* ---------- Component ---------- */
const LeaveManagment: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(MOCK_REQUESTS);

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((r) =>
        r.leave_id === id ? { ...r, status } : r
      )
    );
  };

  return (
    <div className="bg-app">
      <div className="max-w-7xl mx-auto bg-card border border-theme rounded-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT PANEL */}
          <div className="lg:w-2/5 p-6 border-r border-theme space-y-6">
            <h2 className="text-xl font-bold text-main flex items-center gap-2">
              <FaUsers />
              HR Dashboard
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Total Requests" value={requests.length} />
              <StatCard
                label="Pending"
                value={requests.filter((r) => r.status === "pending").length}
              />
              <StatCard
                label="Approved"
                value={requests.filter((r) => r.status === "approved").length}
              />
              <StatCard
                label="Rejected"
                value={requests.filter((r) => r.status === "rejected").length}
              />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:w-3/5 p-6">
            <h3 className="text-lg font-bold text-main flex items-center gap-2 mb-4">
              <FaClipboardList />
              Leave Requests
            </h3>

            <div className="space-y-4 max-h-[520px] overflow-auto">
              {requests.length === 0 ? (
                <div className="text-center text-muted py-10">
                  No leave requests
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.leave_id}
                    className="bg-card border border-theme rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-main">
                          {req.employee}
                        </div>
                        <div className="text-sm text-muted">
                          {req.type} • {req.start_date} → {req.end_date}
                        </div>
                        <p className="text-sm text-main mt-2 italic">
                          “{req.reason}”
                        </p>
                      </div>

                      <span className="text-xs text-muted capitalize">
                        {req.status}
                      </span>
                    </div>

                    {req.status === "pending" && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() =>
                            updateStatus(req.leave_id, "approved")
                          }
                          className="px-4 py-2 bg-primary text-white rounded-xl text-sm flex items-center gap-2"
                        >
                          <FaCheckCircle size={14} />
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(req.leave_id, "rejected")
                          }
                          className="px-4 py-2 border border-theme text-main rounded-xl text-sm flex items-center gap-2"
                        >
                          <FaTimesCircle size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ---------- Stat Card ---------- */
const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="bg-card border border-theme rounded-xl p-4 text-center">
    <div className="text-2xl font-bold text-main">{value}</div>
    <div className="text-xs text-muted">{label}</div>
  </div>
);

export default LeaveManagment;
