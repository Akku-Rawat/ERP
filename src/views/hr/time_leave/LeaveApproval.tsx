import React, { useState, useMemo } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
} from "react-icons/fa";
import Toast from "../../../components/Toast";
import { demoLeaveRequests } from "../../../components/Hr/leavemanagemnetmodal/demodata";

/* ---------- Types ---------- */
type LeaveRequest = {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedOn: string;
};

/* ---------- Component ---------- */
const LeaveManagment: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(
    demoLeaveRequests()
  );

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    icon?: React.ReactNode;
    className?: string;
  }>({
    show: false,
    message: "",
  });

  /* ---------- Helpers ---------- */

  const closeToast = () =>
    setToast({ show: false, message: "" });

  const approveLeave = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Approved" } : r
      )
    );

    setToast({
      show: true,
      message: "Leave approved successfully",
      icon: <FaCheckCircle />,
      className: "bg-primary",
    });
  };

  const rejectLeave = (id: string) => {
    if (!rejectReason) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Rejected" } : r
      )
    );

    setToast({
      show: true,
      message: "Leave rejected",
      icon: <FaTimesCircle />,
      className: "bg-primary",
    });

    setRejectingId(null);
    setRejectReason("");
  };

  /* ---------- Pending Since ---------- */
  const pendingRequests = useMemo(
    () => requests.filter(r => r.status === "Pending"),
    [requests]
  );

  const oldestPending = useMemo(() => {
    if (pendingRequests.length === 0) return null;

    return pendingRequests.reduce((oldest, curr) => {
      return new Date(curr.appliedOn) < new Date(oldest.appliedOn)
        ? curr
        : oldest;
    });
  }, [pendingRequests]);

  const getDaysSince = (date: string) =>
    Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 86400000
    );

  /* ---------- Team Leave Load ---------- */
  const today = new Date();

  const teamOnLeaveToday = requests.filter(r => {
    if (r.status !== "Approved") return false;
    return (
      new Date(r.startDate) <= today &&
      new Date(r.endDate) >= today
    );
  }).length;

  const teamOnLeaveThisWeek = requests.filter(r => {
    if (r.status !== "Approved") return false;
    const diff =
      (new Date(r.startDate).getTime() - today.getTime()) /
      86400000;
    return diff >= 0 && diff <= 7;
  }).length;

  return (
    <div className="bg-app p-6">
      <Toast
        show={toast.show}
        message={toast.message}
        icon={toast.icon}
        className={toast.className}
        onClose={closeToast}
      />

      <div className="max-w-7xl mx-auto bg-card border border-theme rounded-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT PANEL */}
          <div className="lg:w-2/5 p-6 border-r border-theme space-y-6">

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Total" value={requests.length} />
              <StatCard label="Pending" value={pendingRequests.length} />
              <StatCard
                label="Approved"
                value={requests.filter(r => r.status === "Approved").length}
              />
              <StatCard
                label="Rejected"
                value={requests.filter(r => r.status === "Rejected").length}
              />
            </div>

            {/* PENDING SINCE */}
            <div className="bg-card border border-theme rounded-xl p-4">
              <div className="text-sm font-semibold text-main mb-1">
                ⏳ Pending Since
              </div>

              {!oldestPending ? (
                <div className="text-xs text-muted">
                  No pending requests
                </div>
              ) : (
                <div className="text-xs text-muted">
                  Oldest:{" "}
                  <span className="font-semibold text-main">
                    {oldestPending.employeeName}
                  </span>{" "}
                  •{" "}
                  <span className="font-semibold text-main">
                    {getDaysSince(oldestPending.appliedOn)} days
                  </span>
                </div>
              )}
            </div>

            {/* TEAM LEAVE LOAD */}
            <div className="bg-card border border-theme rounded-xl p-4">
              <div className="text-sm font-semibold text-main mb-2">
                👥 Team Leave Load
              </div>

              <div className="flex justify-between text-xs text-muted">
                <span>
                  Today:{" "}
                  <span className="font-semibold text-main">
                    {teamOnLeaveToday}
                  </span>
                </span>

                <span>
                  This Week:{" "}
                  <span className="font-semibold text-main">
                    {teamOnLeaveThisWeek}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:w-3/5 p-6">
            <h3 className="text-lg font-bold text-main flex items-center gap-2 mb-4">
              <FaClipboardList />
              Leave Requests
            </h3>

            <div className="space-y-4 max-h-[520px] overflow-auto">
              {requests.map(req => (
                <div
                  key={req.id}
                  className="bg-card border border-theme rounded-xl p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-main">
                        {req.employeeName}
                      </div>

                      <div className="text-sm text-muted">
                        {req.leaveType} • {req.startDate} → {req.endDate} ({req.days} days)
                      </div>
                    </div>

                    <span className="text-xs px-2 py-1 rounded-lg capitalize bg-app border border-theme">
                      {req.status}
                    </span>
                  </div>

                  <p className="italic text-sm mt-2">
                    “{req.reason}”
                  </p>

                  {req.status === "Pending" && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => approveLeave(req.id)}
                        className="px-4 py-2 bg-primary rounded-xl text-sm flex items-center gap-2"
                      >
                        <FaCheckCircle />
                        Approve
                      </button>

                      <button
                        onClick={() => setRejectingId(req.id)}
                        className="px-4 py-2 border border-theme rounded-xl text-sm flex items-center gap-2"
                      >
                        <FaTimesCircle />
                        Reject
                      </button>
                    </div>
                  )}

                  {rejectingId === req.id && (
                    <div className="mt-3">
                      <textarea
                        className="filter-input-refined"
                        placeholder="Reason for rejection (required)"
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                      />
                      <button
                        disabled={!rejectReason}
                        onClick={() => rejectLeave(req.id)}
                        className="mt-2 px-4 py-2 bg-primary rounded-xl text-sm disabled:opacity-50"
                      >
                        Confirm Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ---------- Small Component ---------- */
const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-card border border-theme rounded-xl p-4 text-center">
    <div className="text-2xl font-bold text-main">{value}</div>
    <div className="text-xs text-muted">{label}</div>
  </div>
);

export default LeaveManagment;
