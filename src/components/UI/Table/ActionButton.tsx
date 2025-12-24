import React from "react";
import { Eye, Edit, Trash2, Download, MoreVertical } from "lucide-react";

type ActionType = "view" | "edit" | "delete" | "download" | "custom";

interface ActionButtonProps {
  type: ActionType;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  type,
  onClick,
  label,
  icon,
  variant = "primary",
  disabled = false,
}) => {
  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case "view":
        return <Eye className="w-4 h-4" />;
      case "edit":
        return <Edit className="w-4 h-4" />;
      case "delete":
        return <Trash2 className="w-4 h-4" />;
      case "download":
        return <Download className="w-4 h-4" />;
      default:
        return <MoreVertical className="w-4 h-4" />;
    }
  };

  const getLabel = () => {
    if (label) return label;
    switch (type) {
      case "view":
        return "View";
      case "edit":
        return "Edit";
      case "delete":
        return "Delete";
      case "download":
        return "Download";
      default:
        return "Action";
    }
  };

  const variantStyles = {
    primary: "text-primary hover:bg-primary/10 hover:text-primary-700",
    secondary: "text-gray-600 hover:bg-gray-100 hover:text-gray-800",
    danger: "text-red-600 hover:bg-red-50 hover:text-red-700",
  };

  return (
    <button
      type="button"                       // <<-- critical: prevents accidental form submit
      onClick={(e) => {
        e.stopPropagation();              // keep original flow: stop row click
        onClick?.(e);                     // pass event to parent handler exactly as before
      }}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
        font-medium text-sm transition-all
        ${variantStyles[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </button>
  );
};


interface ActionGroupProps {
  children: React.ReactNode;
}

export const ActionGroup: React.FC<ActionGroupProps> = ({ children }) => {
  return <div className="flex items-center gap-1 justify-center">{children}</div>;
};

export default ActionButton;