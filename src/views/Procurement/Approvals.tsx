import React from "react";

interface ApprovalsSectionProps {
  onAdd: () => void;
}

const ApprovalsSection: React.FC<ApprovalsSectionProps> = ({ onAdd }) => (
  <div className="text-center py-12">
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      Pending Approvals
    </h3>
    <p className="text-gray-500">
      Approval workflow interface will be implemented here.
    </p>
    <button
      onClick={onAdd}
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
    >
      + Add Approval
    </button>
  </div>
);

export default ApprovalsSection;
