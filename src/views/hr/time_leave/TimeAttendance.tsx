import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react"; // optional icons

import Attendance from "../time_leave/Attendance";
import LeaveManagement from "../time_leave/LeaveManagement";
const TimeAttendance: React.FC = () => {
  const [tab, setTab] = useState<"attendance" | "leave">("attendance");

  // debug helper (remove later)
  useEffect(() => {
    console.log("TimeAttendance active tab:", tab);
  }, [tab]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {/* top tabs */}
        <div className="flex gap-8 border-b border-gray-300 pb-4 overflow-x-auto">
          <button
            onClick={() => setTab("attendance")}
            className={`flex items-center gap-2 text-lg font-semibold transition pb-2 border-b-4 whitespace-nowrap ${
              tab === "attendance"
                ? "text-indigo-600 border-indigo-500"
                : "text-gray-500 border-transparent hover:text-indigo-600"
            }`}
          >
            <Clock /> Attendance
          </button>

          <button
            onClick={() => setTab("leave")}
            className={`flex items-center gap-2 text-lg font-semibold transition pb-2 border-b-4 whitespace-nowrap ${
              tab === "leave"
                ? "text-indigo-600 border-indigo-500"
                : "text-gray-500 border-transparent hover:text-indigo-600"
            }`}
          >
            <Calendar /> Leave Management
          </button>
        </div>

        {/* content switch (force remount with keys) */}
        <div>
          {tab === "attendance" ? (
            <Attendance key="attendance" />
          ) : (
            <LeaveManagement key="leave" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeAttendance;
