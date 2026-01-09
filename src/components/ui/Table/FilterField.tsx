// FilterField.tsx
interface FilterFieldProps {
  label: string;
  children: React.ReactNode;
}

const FilterField: React.FC<FilterFieldProps> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <div className="relative">{children}</div>
  </div>
);

export default FilterField;
