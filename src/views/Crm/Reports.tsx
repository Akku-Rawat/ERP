import React, { useState } from "react";

type Report = {
  id: number;
  name: string;
  description: string;
};

const CRMReports: React.FC = () => {
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

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  return (
    <div className="p-6 bg-app min-h-screen">
      <h2 className="text-xl font-semibold text-main mb-5">
        CRM Reports
      </h2>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((report) => (
          <li
            key={report.id}
            className="bg-card border border-theme rounded-xl p-5
                       transition-all hover:shadow-md hover:-translate-y-1 row-hover"
          >
            <h4 className="font-semibold text-sm text-main mb-1">
              {report.name}
            </h4>

            <p className="text-xs text-muted mb-4">
              {report.description}
            </p>

            <button
              onClick={() => setSelectedReport(report)}
              className="px-4 py-1.5 text-xs rounded-lg bg-primary transition"
            >
              View Report
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-theme rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-main mb-2">
              {selectedReport.name}
            </h3>

            <p className="text-sm text-muted mb-4">
              {selectedReport.description}
            </p>

            <div className="border border-theme rounded-lg p-3 bg-app text-xs text-main">
              Demo placeholder: Here you can show charts or detailed analytics
              for this report.
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              className="mt-5 w-full rounded-lg bg-primary py-2 text-sm transition"
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
