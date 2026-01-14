// // src/components/Hr/Attendance/AttendanceTable.tsx
// import React, { useState, useEffect } from "react";
// import { Table } from "../../../components/ui/Table/Table";
// import { format } from "date-fns";
// import { StatusBadge } from "../../ui/StatusBadge";
// import { ActionButton } from "../../ui/FormComponents";
// import type { Column } from "../../ui/Table/type";

// interface AttendanceRecord {
//   id: string;
//   employeeId: string;
//   employeeName: string;
//   date: string; // ISO string
//   checkIn: string;
//   checkOut: string;
//   status: "Present" | "Late" | "Early Departure" | "Absent";
// }

// interface AttendanceTableProps {
//   employeeId?: string; // Optional filter by employee
// }

// const AttendanceTable: React.FC<AttendanceTableProps> = ({ employeeId }) => {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState<AttendanceRecord[]>([]);
//   const [selectedId, setSelectedId] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const url = employeeId
//           ? `/api/attendance?employeeId=${employeeId}`
//           : "/api/attendance";
//         const res = await fetch(url);
//         const json = await res.json();
//         setData(json);
//       } catch (error) {
//         console.error("Failed to load attendance records", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [employeeId]);

//   const columns: Column<AttendanceRecord>[] = [
//     {
//       key: "date",
//       header: "Date",
//       render: (row) => format(new Date(row.date), "EEE, MMM d, yyyy"),
//     },
//     { key: "employeeName", header: "Employee" },
//     { key: "checkIn", header: "Check In" },
//     { key: "checkOut", header: "Check Out" },
//     {
//       key: "status",
//       header: "Status",
//       render: (row) => <StatusBadge status={row.status} />,
//     },
//   ];

//   return (
//     <Table
//       columns={columns}
//       data={data}
//       loading={loading}
//       onRowClick={(row) => setSelectedId(row.id)}
//       selectedRowId={selectedId}
//       enableColumnSelector={true}
//       showToolbar={true}
//       searchValue="" // Optional: Add search functionality
//       onSearch={(q) => console.log("Search:", q)} // Hook up later
//       addLabel="+ Add Attendance"
//       enableAdd={false} // Disable add for now; handled via ClockInOut
//     />
//   );
// };

// export default AttendanceTable;