import React, { useState, useEffect } from "react";
import { Calendar, Clock, ClipboardList, Settings, User } from "lucide-react";
import LeaveManagement from "./LeaveApproval";
import LeaveApply from "./LeaveApply";
import History from "./History";
import Setup from "./Setup";
import EmployeeDashboard from "./EmployeeLeaveDashboard";
import EmployeeHistory from "./EmployeeLeaveHistory";


const Leave: React.FC = () => {
  const [tab, setTab] = useState<"leave" | "employeeDashboard" | "leaveApply" | "history" | "employeeHistory" | "setup">("leave");


  const handleGoToApply = () => {
    setTab("leaveApply");
  };


  // debug helper 
  useEffect(() => {
    console.log("Leave active tab:", tab);
  }, [tab]);

  return (
    <div className=" bg-app">
      <div className="space-y-6">
        {/* top tabs */}
        <div className="flex gap-8 overflow-x-auto">
          <button
            onClick={() => setTab("leave")}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition ${tab === "leave"
                ? "text-primary border-primary"
                : "text-muted border-transparent hover:text-main"
              }`}
          >
            <Clock size={15} /> Leave Approval

          </button>

          <button
            onClick={() => setTab("employeeDashboard")}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition
    ${tab === "employeeDashboard"
                ? "text-primary border-primary"
                : "text-muted border-transparent hover:text-main"
              }`}
          >
            <User size={15} />
            Employee Dashboard
          </button>
          <button
            onClick={() => setTab("leaveApply")}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition ${tab === "leaveApply"
                ? "text-primary border-primary"
                : "text-muted border-transparent hover:text-main"
              }`}
          >
            <Calendar size={15} /> Leave Apply
          </button>

          <button
            onClick={() => setTab("employeeHistory")}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition
    ${tab === "employeeHistory"
                ? "text-primary border-primary"
                : "text-muted border-transparent hover:text-main"
              }`}
          >
            <ClipboardList size={15} />
            Employee History
          </button>

          <button
            onClick={() => setTab("history")}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition
    ${tab === "history"
                ? "text-primary border-primary"
                : "text-muted border-transparent hover:text-main"
              }`}
          >
            <ClipboardList size={15} />
            History
          </button>

          <button
            onClick={() => setTab("setup")}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition
    ${tab === "setup"
                ? "text-primary border-primary"
                : "text-muted border-transparent hover:text-main"
              }`}
          >
            <Settings size={15} />
            Setup
          </button>



        </div>

        {/* content switch (force remount with keys) */}
        <div>
          {tab === "leave" && <LeaveManagement />}

          {tab === "leaveApply" && <LeaveApply />}

          {tab === "employeeDashboard" && <EmployeeDashboard />}

          {tab === "employeeHistory" && <EmployeeHistory />}

          {tab === "history" && <History onNewRequest={handleGoToApply} />}

          {tab === "setup" && <Setup />}

        </div>


      </div>
    </div>
  );
};

export default Leave;
