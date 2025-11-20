import React, { useState } from "react";
import ApprovalModal from "../../components/procurement/ApprovalModal"; // Make sure the path is correct

interface ApprovalsSectionProps {
  onAdd: () => void;
}

const ApprovalsSection: React.FC<ApprovalsSectionProps> = ({ onAdd }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddClick = () => {
    setModalOpen(true);
    onAdd();
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Pending Approvals</h3>
      <p className="text-gray-500">
        Approval workflow interface will be implemented here.
      </p>
      <button
        onClick={handleAddClick}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium shadow-sm"
      >
        + Add Approval
      </button>
      {/* Approval Modal */}
      <ApprovalModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={(data) => {
          setModalOpen(false);
          // Handle approval add logic (state/API) here
        }}
      />
    </div>
  );
};

export default ApprovalsSection;
