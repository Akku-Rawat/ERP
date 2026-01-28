import React from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

interface StatusBadgeProps {
  status?: string | null;
  variant?: BadgeVariant;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  const safeStatus = (status ?? "unknown").toLowerCase();

  const getVariant = (): BadgeVariant => {
  if (variant) return variant;

  if (safeStatus === "active" || safeStatus === "paid" || safeStatus === "completed" || safeStatus === "approved") {
    return "success";
  }

  if (safeStatus === "pending" || safeStatus === "processing") {
    return "warning";
  }

  if (
    safeStatus === "inactive" ||
    safeStatus === "unactive" ||
    safeStatus === "overdue" ||
    safeStatus === "cancelled" ||
    safeStatus === "failed" ||
    safeStatus === "rejected"
  ) {
    return "danger";
  }

  if (safeStatus === "draft" || safeStatus === "new") {
    return "info";
  }

  return "default";
};


  const variantStyles: Record<BadgeVariant, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    default: "bg-row-hover text-muted border-[var(--border)]",
  };

  const currentVariant = getVariant();

  const displayStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "Unknown";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
        variantStyles[currentVariant]
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current opacity-60" />
      {displayStatus}
    </span>
  );
};

export default StatusBadge;
