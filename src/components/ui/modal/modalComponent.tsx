
import React from "react";interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: React.ReactNode;
  options?: SelectOption[];
  children?: React.ReactNode;
}

export const ModalSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, icon, options = [], className = "", ...props }, ref) => (
    <label className="flex flex-col  text-sm w-full group">
      <span className="block text-[10px] font-medium text-main mb-1">
        {icon && (
          <span className="text-muted group-focus-within:text-primary transition-colors">
            {icon}
          </span>
        )}
        {label}
        {props.required && <span className="text-red-500">*</span>}
      </span>

      <select
        ref={ref}
        {...props}
        value={props.value ?? ""}
        className={[
          "w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card",
          props.disabled
            ? "bg-app cursor-not-allowed opacity-60"
            : "border-[var(--border)] hover:border-primary/40",
          className,
        ].join(" ")}
      >
        <option value="" disabled>
          Select
        </option>

        {options.map((opt, idx) => (
          <option key={`${opt.value}-${idx}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  ),
);

ModalSelect.displayName = "ModalSelect";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}


export const ModalInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, className = "", ...props }, ref) => (
    <label className="flex flex-col  text-sm w-full group">
      <span className="block text-[10px] font-medium text-main mb-1">
        {icon && (
          <span className="text-muted group-focus-within:text-primary transition-colors">
            {icon}
          </span>
        )}
        {label}
        {props.required && <span className="text-danger">*</span>}
      </span>
      <input
        ref={ref}
        {...props}
        value={props.value ?? ""}
        className={[
          "w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card",
          props.disabled
            ? "bg-app cursor-not-allowed opacity-60"
            : "border-[var(--border)] hover:border-primary/40",
          className,
        ].join(" ")}
        onFocus={(e) => {
          if (!props.disabled) {
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(37, 99, 235, 0.16)"; // primary-like glow
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "";
          props.onBlur?.(e);
        }}
      />
    </label>
  ),
);
ModalInput.displayName = "ModalInput";


/*  FILTER SELECT  */

interface FilterSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
}

export const FilterSelect = React.forwardRef<
  HTMLSelectElement,
  FilterSelectProps
>(({ options = [], className = "", ...props }, ref) => {
  return (
    <select
      ref={ref}
      {...props}
      value={props.value ?? ""}
      className={[
        "h-9 min-w-[60px]",
        "px-3 py-1",
        "bg-card border border-[var(--border)]",
        "rounded-xl",
        "text-xs font-medium text-main",
        "focus:ring-2 focus:ring-primary/10",
        "focus:border-primary outline-none transition-all",
        className,
      ].join(" ")}
    >
      <option value="">ALL</option>

      {options.map((opt, idx) => (
        <option key={`${opt.value}-${idx}`} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});


FilterSelect.displayName = "FilterSelect";

