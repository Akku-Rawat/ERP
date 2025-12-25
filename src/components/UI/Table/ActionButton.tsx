import React from "react";
import { Eye, Edit, Trash2, Download, MoreVertical } from "lucide-react";

type ActionType = "view" | "edit" | "delete" | "download" | "custom";

interface ActionButtonProps {
  type: ActionType;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string | null;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  iconOnly?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  type,
  onClick,
  label,
  icon,
  variant = "primary",
  disabled = false,
  iconOnly = false,
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
    if (label === null) return null;
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

  const variantStyles: Record<string, string> = {
    primary: "text-primary hover:bg-row-hover hover:text-primary",
    secondary: "text-muted hover:bg-row-hover hover:text-main",
    danger: "text-red-500 hover:bg-red-50 hover:text-red-600",
  };

  const base = iconOnly
    ? `inline-flex items-center justify-center w-8 h-8 rounded-md ${variantStyles[variant]}`
    : `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${variantStyles[variant]}`;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      disabled={disabled}
      aria-label={getLabel() ?? undefined}
      className={`${base} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {getIcon()}
      {getLabel() && !iconOnly ? <span>{getLabel()}</span> : null}
    </button>
  );
};

interface ActionGroupProps {
  children: React.ReactNode;
}

export const ActionGroup: React.FC<ActionGroupProps> = ({ children }) => {
  return <div className="flex items-center gap-1 justify-center">{children}</div>;
};

interface ActionMenuProps {
  onEdit?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onDownload?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  editLabel?: string;
  deleteLabel?: string;
  downloadLabel?: string;
  deleteVariant?: "danger" | "primary" | "secondary";
  showDownload?: boolean;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  onEdit,
  onDelete,
  onDownload,
  editLabel,
  deleteLabel,
  downloadLabel,
  deleteVariant = "danger",
  showDownload = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-muted hover:bg-row-hover hover:text-main"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Actions"
          className="absolute right-0 mt-2 w-40 bg-card border border-[var(--border)] rounded-md shadow-lg z-[200] py-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit?.(e);
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-row-hover flex items-center gap-2 text-main"
            role="menuitem"
          >
            <Edit className="w-4 h-4 text-muted" />
            <span>{editLabel ?? "Edit"}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete?.(e);
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-row-hover flex items-center gap-2"
            role="menuitem"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span
              className={
                deleteVariant === "danger" ? "text-red-500" : "text-main"
              }
            >
              {deleteLabel ?? "Delete"}
            </span>
          </button>

          {showDownload && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onDownload?.(e);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-row-hover flex items-center gap-2 text-main"
              role="menuitem"
            >
              <Download className="w-4 h-4 text-muted" />
              <span>{downloadLabel ?? "Download"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionButton;