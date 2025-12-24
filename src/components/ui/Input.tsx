import React from "react";

export type InputProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", ...props }, ref) => (
    <label className="flex flex-col gap-1 text-sm w-full">
      <span className="font-medium text-gray-600">{label}</span>
      <input
        ref={ref}
        {...props}
        className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          props.disabled
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : ""
        } ${className}`}
      />
    </label>
  )
);

Input.displayName = "Input";

export default Input;
