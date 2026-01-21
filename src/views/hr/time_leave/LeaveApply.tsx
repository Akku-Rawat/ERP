import React, { useState, useEffect } from "react";
import { Calendar, Clock, FileText, CheckCircle2, X  } from "lucide-react";
import type { DateRange } from "react-day-picker";
import AdvancedCalendar from "../../../components/Hr/leave/Calendar";
import { applyLeave } from "../../../api/leaveApi";
import { getAllEmployees } from "../../../api/employeeapi";
import { getEmployeeById } from "../../../api/employeeapi";
import toast from "react-hot-toast";
import { getLeaveById, updateLeaveApplication } from "../../../api/leaveApi";
import { getLeaveAllocationsByEmployee } from "../../../api/leaveApi";
import { mapAllocationFromApi } from "../../../types/leave/leaveMapper";
import type { LeaveAllocationUI } from "../../../types/leave/uiLeave";





type LeaveFormData = {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  isHalfDay: boolean;
};


interface LeaveApplyProps {
  editLeaveId?: string | null;
}



const LeaveApply: React.FC<LeaveApplyProps> = ({ editLeaveId }) => {
 
  const [formData, setFormData] = useState<LeaveFormData>({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    isHalfDay: false,
  });

const LEAVE_TYPES = [
  { id: "Privilege Leave", name: "Privilege Leave" },
  { id: "Sick Leave", name: "Sick Leave" },
  { id: "Casual Leave", name: "Casual Leave" },
  { id: "Leave Without Pay", name: "Leave Without Pay" },
  { id: "Compensatory Off", name: "Compensatory Off" },
];


  // const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [leaveApprover, setLeaveApprover] = useState<{
    id: string;
    name: string;
  } | null>(null);
 const isEditMode = Boolean(editLeaveId);
const [allocations, setAllocations] = useState<LeaveAllocationUI[]>([]);
const [allocLoading, setAllocLoading] = useState(false);



useEffect(() => {
  if (!employeeId) {
    setAllocations([]);
    return;
  }

  const fetchAllocations = async () => {
    try {
      setAllocLoading(true);
      const res = await getLeaveAllocationsByEmployee(employeeId, 1, 50);
      const list = res.data.allocations || [];
      setAllocations(list.map(mapAllocationFromApi));
    } catch {
      setAllocations([]);
    } finally {
      setAllocLoading(false);
    }
  };

  fetchAllocations();
}, [employeeId]);



  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await getAllEmployees(1, 100);
      setEmployees(res.data.employees || []);
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
  if (!editLeaveId) return;

  const fetchLeaveDetail = async () => {
    try {
      const res = await getLeaveById(editLeaveId);
      const l = res.data;

      setEmployeeId(l.employee.employeeId);

      setFormData({
        type: l.leaveType,
        startDate: l.fromDate,
        endDate: l.toDate,
        isHalfDay: l.isHalfDay,
        reason: l.leaveReason,
      });
    } catch (err) {
      console.error("Failed to fetch leave", err);
    }
  };

  fetchLeaveDetail();
}, [editLeaveId]);



  useEffect(() => {
    if (!formData.startDate) {
      setSelectedRange(undefined);
      return;
    }

    const from = new Date(formData.startDate);
    const to = formData.endDate
      ? new Date(formData.endDate)
      : undefined;

    setSelectedRange({ from, to });
  }, [formData.startDate, formData.endDate]);


 useEffect(() => {
  if (!employeeId) {
    setLeaveApprover(null);
    return;
  }

  const fetchReportingManager = async () => {
    try {
      const empRes = await getEmployeeById(employeeId);
      const emp = empRes?.data || empRes;

      const managerEmployeeCode =
        emp?.employmentInfo?.reportingManager;

      if (!managerEmployeeCode) {
        setLeaveApprover(null);
        return;
      }

      const manager = employees.find(
        (e) => e.employeeId === managerEmployeeCode
      );

      if (manager) {
        setLeaveApprover({
          id: manager.id,
          name: manager.name,
        });
      } else {
        setLeaveApprover(null);
      }
    } catch (err) {
      console.error("Failed to fetch reporting manager", err);
      setLeaveApprover(null);
    }
  };

  fetchReportingManager();
}, [employeeId, employees]);

  const formatLocalDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  

  const calendarLeaves: Leave[] = [];
  const handleRangeSelect = (range?: DateRange) => {
    if (!range?.from) return;

    setSelectedRange(range);

    const from = formatLocalDate(range.from);
    const to = range.to ? formatLocalDate(range.to) : "";

    setFormData((p) => ({
      ...p,
      startDate: from,
      endDate: p.isHalfDay ? from : to,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;

    setFormData((p) => {
      const updated = {
        ...p,
        [id]: type === "checkbox" ? checked : value,
      };

      // half day lock
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
   let dayOffDays = 0;
 
  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate + "T00:00:00");
    const end = new Date(formData.endDate + "T00:00:00");
    const current = new Date(start);

    while (current <= end) {
      totalDays++;

      if (isWeekend(current)) {
        dayOffDays++;
      } else {
        workDays++;
      }

      current.setDate(current.getDate() + 1);
    }
  }

  const showSummary =
    !!formData.startDate || !!formData.endDate || formData.isHalfDay;

  const buildPayload = () => {
    const fromDate = formData.startDate;
    const toDate =
      formData.isHalfDay
        ? fromDate
        : formData.endDate || fromDate;
    return {
      employeeId,
      leaveType: formData.type,
      leaveFromDate: fromDate,
      leaveToDate: toDate,
      isHalfDay: formData.isHalfDay,
      leaveReason: formData.reason,
     leaveStatus: "Open",
       ...(leaveApprover?.id && { approverId: leaveApprover.id }), //  only include if exists
    };
  };



  const hasValidAllocation = () => {
  if (!formData.type || !formData.startDate) return true;

  const allocation = allocations.find(
    (a) => a.leaveType === formData.type
  );

  if (!allocation) {
    toast.error(
      "No leave allocation found for this leave type. Please contact HR."
    );
    return false;
  }

  if (allocation.remaining <= 0) {
    toast.error("No remaining leaves available for this leave type.");
    return false;
  }

  if (totalDays > allocation.remaining) {
    toast.error(
      `Only ${allocation.remaining} leave(s) remaining for ${formData.type}.`
    );
    return false;
  }

  return true;
};

  


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

 if (!employeeId) {
  toast.error("Please select employee");
  return;
}


 if (!formData.startDate) {
  toast.error("Start date is required");
  return;
}


  if (!formData.isHalfDay && !formData.endDate) {
      toast.error("End date is required");
    return;
  }

  if (!hasValidAllocation()) {
  return;
}

  setLoading(true);

  try {
    if (isEditMode && editLeaveId) {
  await updateLeaveApplication({
    leaveId: editLeaveId,
    leaveFromDate: formData.startDate,
    leaveToDate: formData.endDate,
    isHalfDay: formData.isHalfDay,
    leaveReason: formData.reason,
  });

  toast.success("Leave updated successfully");
} else {
  await applyLeave(buildPayload());
  toast.success("Leave applied successfully");
}


  if (!isEditMode) {
  handleReset();
}

  } catch (err: any) {
    toast.error("Failed to submit leave request");
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
  setSelectedRange(undefined);
  setEmployeeId("");
  setLeaveApprover(null);
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
                selectedRange={selectedRange}
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
                <div>
                  <label className="text-sm font-semibold text-red-600">
                    Select Employee
                  </label>
                  <select
                    value={employeeId}
  disabled={isEditMode}
  onChange={(e) => setEmployeeId(e.target.value)}
                  >
                    <option value="">Select employee</option>
                    {employees.map(emp => (
                      <option key={emp.employeeId} value={emp.employeeId}>
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
  disabled={isEditMode}
  onChange={handleChange}
                    className="w-full mt-2 px-2 py-1 rounded-xl border bg-app"
                  >
                    <option value="">Select Leave Type</option>
                    {LEAVE_TYPES.map((lt) => (
                      <option key={lt.id} value={lt.id}>
                        {lt.name}
                      </option>
                    ))}

                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold">LEAVE APPROVER</label>
                  <input
                    disabled
                    value={leaveApprover?.name || "No reporting manager assigned"}
                    className="w-full mt-2 px-2 py-1 rounded-xl border bg-app opacity-80"
                  />

                </div>
              </div>

              {/* HALF DAY  */}
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
                        <span className="font-semibold">TOTAL:</span> {totalDays}
                      </div>
                      <div>
                        <span className="font-semibold">WORK:</span> {workDays}
                      </div>
                      <div>
                           <span className="font-semibold">DAY OFF:</span> {dayOffDays}
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
                  disabled={loading || allocLoading}
                  className="bg-primary text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm leading-none"
                >
                  <CheckCircle2 size={14} />
                  {loading
  ? isEditMode ? "Updating..." : "Submitting..."
  : isEditMode ? "Update" : "Submit"}

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
