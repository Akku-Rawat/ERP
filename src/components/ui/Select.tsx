import React from "react";

export type SelectOption = {
  readonly value: string | number;
  readonly label: string;
};

type SelectProps = {
  label: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly SelectOption[];
  required?: boolean;
  disabled?: boolean;
};

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  disabled,
}) => (
  <label className="flex flex-col gap-0.5 text-sm w-full">
    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        h-8 rounded-md border border-theme bg-card text-main text-sm px-2.5 pr-7
        focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
        appearance-none
        ${disabled ? "opacity-60 cursor-not-allowed bg-app" : ""}
      `}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

export default Select;