import React from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  // Auto-detect variant based on status text if not provided
  const getVariant = (): BadgeVariant => {
    if (variant) return variant;
    
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes("paid") || lowerStatus.includes("completed") || lowerStatus.includes("active")) {
      return "success";
    }
    if (lowerStatus.includes("pending") || lowerStatus.includes("processing")) {
      return "warning";
    }
    if (lowerStatus.includes("overdue") || lowerStatus.includes("cancelled") || lowerStatus.includes("failed")) {
      return "danger";
    }
    if (lowerStatus.includes("draft") || lowerStatus.includes("new")) {
      return "info";
    }
    
    return "default";
  };

  const variantStyles: Record<BadgeVariant, string> = {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const currentVariant = getVariant();

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
        border transition-all
        ${variantStyles[currentVariant]}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current opacity-60"></span>
      {status}
    </span>
  );
};

export default StatusBadge;