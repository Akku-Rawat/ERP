import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", ...props }, ref) => (
    <label className="flex flex-col gap-1 text-sm w-full">
      <span className="font-medium text-muted">{label}</span>
      <input
        ref={ref}
        {...props}
        className={`rounded border border-theme bg-app px-3 py-2 text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
          props.disabled ? "bg-row-hover text-muted cursor-not-allowed" : ""
        } ${className}`}
      />
    </label>
  ),
);

Input.displayName = "Input";

export default Input;
