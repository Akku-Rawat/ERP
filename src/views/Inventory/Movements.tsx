import React, { useState } from "react";
import MovementModal from "../../components/inventory/MovementModal"; // Adjust the path as needed

interface MovementsProps {
  onAdd: () => void;
}

const Movements: React.FC<MovementsProps> = ({ onAdd }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddClick = () => {
    setModalOpen(true);
    onAdd();
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Stock Movements
      </h3>
      <p className="text-gray-500">
        Stock movement tracking and history will be displayed here.
      </p>
      <button
        onClick={handleAddClick}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition font-medium shadow-sm"
      >
        + Add Movement
      </button>
      {/* Modal for add movement */}
      <MovementModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Movements;
