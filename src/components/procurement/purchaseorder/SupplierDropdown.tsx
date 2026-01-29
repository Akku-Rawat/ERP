import React, { useState, useEffect, useRef } from "react";

interface Supplier {
  id: string;
  code: string;
  name: string;
  email?: string;
  phone?: string;
}

interface SupplierDropdownProps {
  value: string;
  onChange: (s: Supplier) => void;
  className?: string;
  suppliers: Supplier[];
  suppLoading: boolean;
}

export const SupplierDropdown: React.FC<SupplierDropdownProps> = ({
  value,
  onChange,
  className = "",
  suppliers,
  suppLoading,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = suppliers.find(s => s.id === value);


  return (
    <div ref={ref} className={`relative w-full flex flex-col gap-1 ${className}`}>
      <span className="font-medium text-gray-600 text-sm">Supplier Name</span>

      <button
        type="button"
        disabled={suppLoading}
        className="w-full rounded border px-3 py-2 text-left bg-white disabled:opacity-60"
        onClick={() => !suppLoading && setOpen((v) => !v)}
      >
        {suppLoading ? "Loading suppliers..." : selected?.name || "Select supplier..."}
      </button>

      {open && !suppLoading && (
        <div
          className="absolute left-0 w-full mt-1 bg-white border shadow-lg rounded z-10"
          style={{ top: "100%" }}
        >
          <input
            className="w-full border-b px-2 py-1"
            autoFocus
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <ul className="max-h-40 overflow-y-auto">
            {filtered.map((s) => (
              <li
                key={s.id}
                className={`px-4 py-2 cursor-pointer hover:bg-indigo-100 ${
                  s.name === value ? "bg-indigo-200 font-bold" : ""
                }`}
                onClick={() => {
                  onChange(s); 
                  setOpen(false);
                  setSearch("");
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-gray-500">{s.code}</span>
                </div>
              </li>
            ))}

            {filtered.length === 0 && (
              <li className="px-4 py-2 text-gray-500">No match</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
