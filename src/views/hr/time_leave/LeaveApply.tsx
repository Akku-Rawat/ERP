import React, { useState } from "react";
import { FaUsers, FaCalendarAlt, FaClock } from "react-icons/fa";
import AdvancedCalendar from "../../../components/Hr/leavemanagemnetmodal/Calendar";

type LeaveStatus = "approved" | "pending" | "rejected";

type Leave = {
  start: Date;
  end: Date;
  status: LeaveStatus;
};

type LeaveFormData = {
  type: string;
  duration: "full" | "first" | "second";
  startDate: string;
  endDate: string;
  reason: string;
};

const LeaveApply: React.FC = () => {
  const [formData, setFormData] = useState<LeaveFormData>({
    type: "",
    duration: "full",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  /* Mock UI data */
  const totalLeaves = 24;
  const usedLeaves = 10;
  const pendingLeaves = 2;
  const remainingLeaves = totalLeaves - usedLeaves;

  const calendarLeaves: Leave[] = [
    { start: new Date("2026-01-05"), end: new Date("2026-01-06"), status: "approved" },
    { start: new Date("2026-01-15"), end: new Date("2026-01-15"), status: "pending" },
  ];

  const handleRangeSelect = (range?: { from?: Date; to?: Date }) => {
    if (!range?.from || !range?.to) return;

    const normalize = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const start = normalize(range.from < range.to ? range.from : range.to);
const end = normalize(range.to > range.from ? range.to : range.from);


setFormData((prev) => ({
  ...prev,
  startDate: formatDateLocal(start),
  endDate: formatDateLocal(end),
}));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };


  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setFormData({
        type: "",
        duration: "full",
        startDate: "",
        endDate: "",
        reason: "",
      });
    }, 800);
  };

  const selectedDays =
  formData.startDate && formData.endDate
    ? Math.abs(
        (new Date(formData.endDate).getTime() -
          new Date(formData.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    : 0;


    const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


  return (
    <div className="bg-app ">
      <div className="max-w-6xl mx-auto bg-card rounded-2xl border border-theme overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT PANEL */}
          <div className="lg:w-2/5 p-3 space-y-4 border-r border-theme">
           
            <div className="grid grid-cols-2 gap-2">
              <StatCard label="Total Balance" value={totalLeaves} />
              <StatCard label="Used" value={usedLeaves} />
              <StatCard label="Pending" value={pendingLeaves} />
              <StatCard label="Remaining" value={remainingLeaves} />
            </div>

            <div className="bg-card border border-theme rounded-xl p-4 h-[385px]">
              <h3 className="font-semibold mb-2 flex items-center text-main">
                <FaCalendarAlt className="mr-2 text-primary" />
                Calendar View
              </h3>
              <AdvancedCalendar
                leaves={calendarLeaves}
                onRangeSelect={handleRangeSelect}
              />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:w-3/5 p-3 bg-app">
            <h3 className="ml-4 text-l font-bold mb-4 flex items-center text-main">
              <FaClock size={15} className="mr-1  text-primary" />
              Apply for Leave
            </h3>

            <form
  onSubmit={handleSubmit}
  className="bg-card border border-theme rounded-2xl p-6 space-y-6"
>
  {/* Leave Type + Duration */}
  <div className="grid grid-cols-2 gap-4">
    <select
      id="type"
      value={formData.type}
      onChange={handleChange}
      required
      className="w-full p-3 border border-theme rounded-xl bg-app text-main"
    >
      <option value="">Select Leave Type</option>
      <option>Casual Leave</option>
      <option>Sick Leave</option>
      <option>Emergency Leave</option>
    </select>

    <select
      id="duration"
      value={formData.duration}
      onChange={handleChange}
      className="w-full p-3 border border-theme rounded-xl bg-app text-main"
    >
      <option value="full">Full Day</option>
      <option value="first">First Half</option>
      <option value="second">Second Half</option>
    </select>
  </div>

  {/* Dates */}
  <div className="grid grid-cols-2 gap-4">
    <input
      type="date"
      id="startDate"
      value={formData.startDate}
      onChange={handleChange}
      required
      className="p-3 border border-theme rounded-xl bg-app text-main"
    />
    <input
      type="date"
      id="endDate"
      value={formData.endDate}
      onChange={handleChange}
      required
      className="p-3 border border-theme rounded-xl bg-app text-main"
    />
  </div>

  {/* Days Selected */}
  {selectedDays > 0 && (
    <div className="text-sm text-muted">
      Days Selected:{" "}
      <span className="font-semibold text-main">
        {selectedDays}
      </span>
    </div>
  )}

  {/* Reason */}
  <textarea
    id="reason"
    value={formData.reason}
    onChange={handleChange}
    rows={4}
    required
    placeholder="Reason for leave"
    className="w-full p-3 border border-theme rounded-xl bg-app text-main placeholder:text-muted"
  />

  {/* Actions */}
  <div className="flex gap-4">
    <button
      type="reset"
      onClick={() =>
        setFormData({
          type: "",
          duration: "full",
          startDate: "",
          endDate: "",
          reason: "",
        })
      }
      className="px-6 py-3 border border-theme rounded-xl text-muted"
    >
      Reset
    </button>

    <button
      type="submit"
      disabled={loading}
      className="px-6 py-3 bg-primary rounded-xl text-white font-semibold"
    >
      {loading ? "Submitting..." : "Submit"}
    </button>
  </div>
</form>

          </div>

        </div>
      </div>
    </div>
  );
};

/* ---------- Stat Card ---------- */
const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-card border border-theme rounded-xl p-4 text-center">
    <div className="text-2xl font-bold text-main">{value}</div>
    <div className="text-xs text-muted">{label}</div>
  </div>
);

export default LeaveApply;
