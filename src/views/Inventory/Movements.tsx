// Movements.tsx
import React from "react";

interface MovementsProps {
  onAdd: () => void;
}

const Movements: React.FC<MovementsProps> = ({ onAdd }) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Stock Movements
      </h3>
      <p className="text-gray-500">
        Stock movement tracking and history will be displayed here.
      </p>
      <button
        onClick={onAdd}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        + Add Movement
      </button>
    </div>
  );
};

export default Movements;
