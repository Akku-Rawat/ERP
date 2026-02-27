import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", ...props }, ref) => (
    <label className="flex flex-col gap-0.5 text-sm w-full">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <input
        ref={ref}
        {...props}
        className={`
          h-8 rounded-md border border-theme bg-card text-main text-sm px-2.5
          placeholder:text-muted/40
          focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
          ${props.disabled ? "bg-app text-muted cursor-not-allowed opacity-60" : ""}
          ${className}
        `}
      />
    </label>
  ),
);

Input.displayName = "Input";

export default Input;