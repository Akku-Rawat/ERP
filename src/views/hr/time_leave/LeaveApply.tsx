import React, { useState,useEffect } from "react";
import { Calendar, Clock, FileText, CheckCircle2, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import AdvancedCalendar from "../../../components/Hr/leavemanagemnetmodal/Calendar";
import { applyLeave } from "../../../api/leaveApi";
import { getAllEmployees } from "../../../api/employeeapi";


/* ---------- Types ---------- */
type LeaveStatus = "approved" | "pending" | "rejected" | "cancelled";

type Leave = {
  start: Date;
  end: Date;
  status: LeaveStatus;
};

type LeaveFormData = {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  isHalfDay: boolean;
};

type LeaveType = {
  id: string;
  name: string;
};

const LeaveApply: React.FC = () => {
  const [formData, setFormData] = useState<LeaveFormData>({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    isHalfDay: false,
  });

  const LEAVE_TYPES: LeaveType[] = [
  { id: "PL", name: "Privilege Leave" },
  { id: "SL", name: "Sick Leave" },
  { id: "CL", name: "Casual Leave" },
  { id: "ML", name: "Maternity Leave" },
  { id: "EL", name: "Emergency Leave" },
];


  // const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(false);
const [employees, setEmployees] = useState<any[]>([]);
const [employeeId, setEmployeeId] = useState<string>("");
const [leaveApprover, setLeaveApprover] = useState<{
  id: string;
  name: string;
} | null>(null);


useEffect(() => {
  const fetchEmployees = async () => {
    const res = await getAllEmployees(1, 100);
    setEmployees(res.data.employees || []);
  };
  fetchEmployees();
}, []);




useEffect(() => {
  if (!employeeId || employees.length === 0) return;

  const currentEmployee = employees.find(e => e.id === employeeId);
  if (!currentEmployee) return;

  const managerId =
    currentEmployee.reportingManager ||
    currentEmployee.employmentInfo?.reportingManager;

  if (!managerId) {
    setLeaveApprover(null);
    return;
  }

  const manager = employees.find(e => e.id === managerId);
  if (manager) {
    setLeaveApprover({ id: manager.id, name: manager.name });
  }
}, [employeeId, employees]);


  const calendarLeaves: Leave[] = [];

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const handleRangeSelect = (range?: DateRange) => {
    if (!range?.from) return;

    setFormData((p) => ({
      ...p,
      startDate: formatDate(range.from),
      endDate: p.isHalfDay
        ? formatDate(range.from)
        : range.to
        ? formatDate(range.to)
        : "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;

    setFormData((p) => {
      const updated = { ...p, [id]: type === "checkbox" ? checked : value };

      // ✅ Half-day logic: end date = start date
      if (id === "isHalfDay" && checked && p.startDate) {
        updated.endDate = p.startDate;
      }

      if (id === "startDate" && p.isHalfDay) {
        updated.endDate = value;
      }

      return updated;
    });
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  let totalDays = 0;
  let workDays = 0;
  let leaveDays = 0;

if (formData.startDate && formData.endDate) {
  const start = new Date(formData.startDate);
  const end = new Date(formData.endDate);
  const current = new Date(start);

  while (current <= end) {
    totalDays++;

    if (!isWeekend(current)) {
      workDays++;
    }

    current.setDate(current.getDate() + 1);
  }

if (formData.isHalfDay) {
  // since half day forces single date
  workDays = isWeekend(new Date(formData.startDate)) ? 0 : 0.5;
}

leaveDays = totalDays - workDays;

}


  const showSummary =
    !!formData.startDate || !!formData.endDate || formData.isHalfDay;

const buildPayload = () => ({
  employeeId,
  leaveType: formData.type,
  leaveFromDate: formData.startDate,
  leaveToDate: formData.endDate,
  isHalfDay: formData.isHalfDay,
  leaveReason: formData.reason,
  leaveStatus: "Open",
  approverId: leaveApprover?.id,
});



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await applyLeave(buildPayload());
      handleReset();
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      type: "",
      startDate: "",
      endDate: "",
      reason: "",
      isHalfDay: false,
    });
  };

  return (
    <div className="bg-app">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-theme">
            <div className="bg-primary p-6 text-white flex gap-2 items-center">
              <Calendar size={20} />
              <h2 className="font-bold">Calendar View</h2>
            </div>
            <div className="p-8">
              <AdvancedCalendar
                leaves={calendarLeaves}
                onRangeSelect={handleRangeSelect}
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-2xl border border-theme">
            <div className="bg-primary p-6 text-white flex gap-2 items-center">
              <FileText size={20} />
              <h2 className="font-bold">Leave Request Form</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* LEAVE TYPE + APPROVER */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* DEV ONLY - REMOVE AFTER LOGIN */}
<div>
  <label className="text-sm font-semibold text-red-600">
    Select Employee (DEV)
  </label>
  <select
    value={employeeId}
    onChange={(e) => setEmployeeId(e.target.value)}
    className="w-full mt-2 px-2 py-1 rounded-xl border"
  >
    <option value="">Select employee</option>
    {employees.map(emp => (
      <option key={emp.id} value={emp.id}>
        {emp.name} ({emp.id})
      </option>
    ))}
  </select>
</div>

                <div>
                  <label className="text-sm font-semibold">LEAVE TYPE</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full mt-2 px-2 py-1 rounded-xl border bg-app"
                  >
                    <option value="">Select Leave Type</option>
                    {LEAVE_TYPES.map((lt) => (
                      <option key={lt.id} value={lt.name}>
                        {lt.name}
                      </option>
                    ))}

                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold">LEAVE APPROVER</label>
                  <input
  disabled
  value={leaveApprover?.name || "Auto assigned"}
  className="w-full mt-2 px-2 py-1 rounded-xl border bg-app opacity-80"
/>

                </div>
              </div>

              {/* HALF DAY (MOVED HERE) */}
              <label className="flex gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  id="isHalfDay"
                  checked={formData.isHalfDay}
                  onChange={handleChange}
                />
                Apply for Half Day
              </label>

              {/* START + END DATE */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold">START DATE</label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full mt-2 px-2 py-1 rounded-xl border bg-app"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">END DATE</label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={formData.isHalfDay}
                    className="w-full mt-2 px-2 py-1 rounded-xl border bg-app"
                  />

                  {showSummary && (
                    <div className="mt-2 flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span className="font-semibold">TOTAL:</span>
                        {totalDays}
                      </div>
                      <div>
                        <span className="font-semibold">WORK:</span> {workDays}
                      </div>
                      <div>
                        <span className="font-semibold">LEAVE:</span> {leaveDays}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* REASON */}
              <textarea
                id="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                placeholder="Reason for leave"
                className="w-full px-4 py-3 rounded-xl border bg-app"
              />

              {/* ACTIONS */}
            <div className="flex justify-end gap-3">
  <button
    type="button"
    onClick={handleReset}
    className="border rounded-lg px-4 py-2 flex items-center gap-2 text-sm leading-none"
  >
    <X size={14} /> Reset
  </button>

  <button
    type="submit"
    disabled={loading}
    className="bg-primary text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm leading-none"
  >
    <CheckCircle2 size={14} />
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

export default LeaveApply;
