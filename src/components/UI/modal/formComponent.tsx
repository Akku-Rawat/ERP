// src/components/ui/FormComponents.tsx
import React from "react";

// ============================================================
// Input Component
// ============================================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, className = "", ...props }, ref) => (
    <label className="flex flex-col gap-2 text-sm w-full group">
      <span className="font-semibold text-muted flex items-center gap-2 group-focus-within:text-primary transition-colors">
        {icon && (
          <span className="text-muted group-focus-within:text-primary transition-colors">
            {icon}
          </span>
        )}
        {label}
        {props.required && <span className="text-red-500">*</span>}
      </span>
      <input
        ref={ref}
        {...props}
        value={props.value ?? ""}
        className={`w-full rounded-lg border-2 border-[#e5e7eb] dark:border-[#1e293b] px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all bg-card text-main placeholder:text-muted ${
          props.disabled
            ? "bg-[#f3f4f6] dark:bg-[#1e293b] cursor-not-allowed opacity-60"
            : "hover:border-[#d1d5db] dark:hover:border-[#334155]"
        } ${className}`}
        onFocus={(e) => {
          if (!props.disabled) {
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(35, 124, 169, 0.12)";
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "";
          props.onBlur?.(e);
        }}
      />
    </label>
  )
);
Input.displayName = "Input";

// ============================================================
// Select Component
// ============================================================
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, icon, children, className = "", ...props }, ref) => (
    <label className="flex flex-col gap-2 text-sm w-full group">
      <span className="font-semibold text-muted flex items-center gap-2 group-focus-within:text-primary transition-colors">
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
        className={`w-full rounded-lg border-2 border-[#e5e7eb] dark:border-[#1e293b] px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all bg-card text-main hover:border-[#d1d5db] dark:hover:border-[#334155] ${className}`}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(35, 124, 169, 0.12)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "";
          props.onBlur?.(e);
        }}
      >
        {children}
      </select>
    </label>
  )
);
Select.displayName = "Select";

// ============================================================
// Textarea Component
// ============================================================
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: React.ReactNode;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, icon, className = "", ...props }, ref) => (
    <label className="flex flex-col gap-2 text-sm w-full group">
      <span className="font-semibold text-muted flex items-center gap-2 group-focus-within:text-primary transition-colors">
        {icon && (
          <span className="text-muted group-focus-within:text-primary transition-colors">
            {icon}
          </span>
        )}
        {label}
        {props.required && <span className="text-red-500">*</span>}
      </span>
      <textarea
        ref={ref}
        {...props}
        className={`w-full rounded-lg border-2 border-[#e5e7eb] dark:border-[#1e293b] p-4 text-sm resize-none focus:outline-none focus:border-primary transition-all bg-card text-main placeholder:text-muted hover:border-[#d1d5db] dark:hover:border-[#334155] ${className}`}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(35, 124, 169, 0.12)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "";
          props.onBlur?.(e);
        }}
      />
    </label>
  )
);
Textarea.displayName = "Textarea";

// ============================================================
// Checkbox Component
// ============================================================
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", ...props }, ref) => (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          {...props}
          className="peer sr-only"
        />
        <div className="w-5 h-5 border-2 border-[#d1d5db] dark:border-[#475569] rounded peer-checked:border-primary peer-checked:bg-primary transition-all" />
        <svg
          className="w-3 h-3 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <span className={`text-sm font-semibold text-main group-hover:text-primary transition-colors ${className}`}>
        {label}
      </span>
    </label>
  )
);
Checkbox.displayName = "Checkbox";

// ============================================================
// Card Component (for sections inside modals)
// ============================================================
interface CardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  children,
  className = "",
}) => (
  <div
    className={`bg-card/80 backdrop-blur-sm border border-[#e5e7eb] dark:border-[#1e293b] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
  >
    <div className="flex items-center gap-3 mb-5">
      {icon && (
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "rgba(35, 124, 169, 0.1)" }}
        >
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-base font-bold text-main">{title}</h3>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

// ============================================================
// Button Component
// ============================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", icon, loading, children, className = "", ...props }, ref) => {
    const baseClasses = "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
      primary: "bg-primary text-white hover:opacity-90 hover:shadow-lg",
      secondary: "border-2 border-[#e5e7eb] dark:border-[#1e293b] text-main hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b]",
      danger: "bg-danger text-white hover:opacity-90 hover:shadow-lg",
      ghost: "text-main hover:bg-[#f3f4f6] dark:hover:bg-[#1e293b]",
    };

    return (
      <button
        ref={ref}
        {...props}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        disabled={loading || props.disabled}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";