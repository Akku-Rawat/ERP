import React, { useState } from "react";

// TypeScript type for report
type Report = {
  id: number;
  name: string;
  description: string;
};

const CRMReports: React.FC = () => {
  // Report array with type
  const reports: Report[] = [
    {
      id: 1,
      name: "Lead Conversion Report",
      description: "Shows lead to customer conversion rates.",
    },
    {
      id: 2,
      name: "Ticket Resolution Times",
      description: "Average resolution time by priority.",
    },
    {
      id: 3,
      name: "Sales Funnel Analysis",
      description: "Visualizes sales opportunities by stage.",
    },
    {
      id: 4,
      name: "Customer Interaction Summary",
      description: "Aggregated interaction logs and activity.",
    },
  ];

  // Modal ke liye selectedReport state with type
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Modal open karne ka handler with parameter type
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  // Modal close karne ka handler
  const closeModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">CRM Reports</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((report) => (
          <li
            key={report.id}
            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-1 p-5"
          >
            <h4 className="font-semibold text-lg text-gray-800 mb-1">
              {report.name}
            </h4>
            <p className="text-sm text-gray-600 mb-3">{report.description}</p>
            <button
              onClick={() => handleViewReport(report)}
              className="px-4 py-1.5 text-sm rounded bg-teal-600 text-white hover:bg-teal-700 transition"
            >
              View Report
            </button>
          </li>
        ))}
      </ul>

      {/* Modal for showing selected report */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {selectedReport.name}
            </h3>
            <p className="text-gray-600 mb-4">{selectedReport.description}</p>
            <div className="border rounded-lg p-3 bg-gray-50 text-sm text-gray-700">
              Demo placeholder: Here you can show charts or detailed analytics
              for this report.
            </div>
            <button
              className="mt-5 w-full rounded bg-teal-600 hover:bg-teal-700 text-white py-2 transition"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMReports;
