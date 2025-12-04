import React, { useEffect, useRef, useState } from "react";
import { getAllCustomers } from "../../api/customerApi";

interface CustomerSelectProps {
  value?: string;
  onChange: (cust: { name: string; id: string }) => void;
  className?: string;
  label?: string;
}

export default function CustomerSelect({
  value = "",
  onChange,
  className = "",
  label = "Customer",
}: CustomerSelectProps) {
  const [customers, setCustomers] = useState<{ name: string; id: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || "");
  const ref = useRef<HTMLDivElement>(null);

  /* ---------------- Load Customers ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getAllCustomers();
        if (res?.status_code !== 200) return;

        setCustomers(
          res.data.map((c: any) => ({
            name: c.name,
            id: c.id,
          })),
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* -------- Close dropdown when clicking outside -------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- Filter logic ---------------- */
  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="font-medium text-gray-600 text-sm">{label}</span>

      <div ref={ref} className="relative w-full">
        {/* Search Input */}
        <input
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={loading ? "Loading..." : "Search customer..."}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />

        {/* Dropdown */}
        {open && !loading && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white border shadow-lg rounded z-30">
            <ul className="max-h-56 overflow-y-auto text-sm">
              {filtered.map((cust) => (
                <li
                  key={cust.id}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setSearch(cust.name);
                    setOpen(false);
                    onChange(cust);
                  }}
                >
                  {cust.name}
                </li>
              ))}

              {filtered.length === 0 && (
                <li className="px-4 py-2 text-gray-500">No match found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
