export const isDemoEnabled = (): boolean => {
  try {
    const v = localStorage.getItem("useDemoData");
    if (v === null) return true; // default ON
    return v === "true";
  } catch (e) {
    return true;
  }
};

export const demoLeaveRequests = () => {
  if (!isDemoEnabled()) return [];
  return [
    {
      id: "LR001",
      employeeId: "EMP201",
      employeeName: "Sarah Johnson",
      leaveType: "Sick Leave",
      startDate: "Nov 25, 2024",
      endDate: "Nov 26, 2024",
      days: 2,
      reason: "Medical appointment",
      status: "Pending",
      appliedOn: "Nov 15, 2024",
    },
    {
      id: "LR002",
      employeeId: "EMP202",
      employeeName: "Michael Chen",
      leaveType: "Vacation",
      startDate: "Dec 20, 2024",
      endDate: "Dec 30, 2024",
      days: 10,
      reason: "Family vacation",
      status: "Pending",
      appliedOn: "Nov 14, 2024",
    },
    {
      id: "LR003",
      employeeId: "EMP203",
      employeeName: "Emily Davis",
      leaveType: "Personal Leave",
      startDate: "Nov 22, 2024",
      endDate: "Nov 22, 2024",
      days: 1,
      reason: "Personal matters",
      status: "Approved",
      appliedOn: "Nov 10, 2024",
    },
    {
      id: "LR004",
      employeeId: "EMP204",
      employeeName: "David Martinez",
      leaveType: "Sick Leave",
      startDate: "Nov 18, 2024",
      endDate: "Nov 19, 2024",
      days: 2,
      reason: "Flu symptoms",
      status: "Rejected",
      appliedOn: "Nov 17, 2024",
    },
  ];
};

export const leaveTypeDistribution = () => {
  if (!isDemoEnabled()) return [];
  return [
    { name: "Vacation", value: 35, color: "#14b8a6" },
    { name: "Sick Leave", value: 25, color: "#ef4444" },
    { name: "Personal", value: 20, color: "#f59e0b" },
    { name: "Maternity/Paternity", value: 20, color: "#3b82f6" },
  ];
};
