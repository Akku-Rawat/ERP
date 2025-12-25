import React from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  const getVariant = (): BadgeVariant => {
    if (variant) return variant;

    const lowerStatus = status.toLowerCase();

    if (
      lowerStatus.includes("paid") ||
      lowerStatus.includes("completed") ||
      lowerStatus.includes("active")
    ) {
      return "success";
    }
    if (
      lowerStatus.includes("pending") ||
      lowerStatus.includes("processing")
    ) {
      return "warning";
    }
    if (
      lowerStatus.includes("overdue") ||
      lowerStatus.includes("cancelled") ||
      lowerStatus.includes("failed")
    ) {
      return "danger";
    }
    if (lowerStatus.includes("draft") || lowerStatus.includes("new")) {
      return "info";
    }

    return "default";
  };

  const variantStyles: Record<BadgeVariant, string> = {
    success:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700",
    warning:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700",
    danger:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700",
    info:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700",
    default:
      "bg-row-hover text-muted border-[var(--border)]",
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
      <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current opacity-60" />
      {status}
    </span>
  );
};

export default StatusBadge;