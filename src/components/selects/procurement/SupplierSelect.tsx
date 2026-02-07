import React, { useEffect, useRef, useState } from "react";
import { getSuppliers } from "../../../api/procurement/supplierApi";


type Supplier = {
  id: string;
  name: string;
  supplierCode?: string;
  taxCategory?: string;
  billingCountry?: string;
  
};

interface SupplierSelectProps {
  value?: string;
  selectedId?: string;
  onChange: (supplier: { id: string; name: string; code?: string, taxCategory?: string , billingCountry?: string }) => void;
  className?: string;
  label?: string;
}

export default function SupplierSelect({
  value = "",
  selectedId,
  onChange,
  className = "",
  label = "Supplier",
}: SupplierSelectProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const res = await getSuppliers(1, 1000);
        const list = res?.data?.suppliers || [];

       setSuppliers(
  list.map((s: any) => ({
    id: s.supplierId,
    name: s.supplierName,
    supplierCode: s.supplierCode,
    taxCategory: s.taxCategory,

    billingCountry: s.billingCountry
  }))
);

      } finally {
        setLoading(false);
      }
    };

    loadSuppliers();
  }, []);

  useEffect(() => setSearch(value), [value]);

  useEffect(() => {
    if (!selectedId || suppliers.length === 0) return;
    const s = suppliers.find((x) => x.id === selectedId);
    if (s) setSearch(s.name);
  }, [selectedId, suppliers]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="block text-[10px] font-medium text-main">{label}</span>

      <div ref={containerRef} className="relative">
        <input
          className="w-full py-1 px-2 border border-theme rounded text-[11px] text-main bg-card"
          placeholder={loading ? "Loading..." : "Search supplier..."}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />

        {open && !loading && (
          <div className="absolute z-50 bg-card border border-theme mt-1 w-full rounded shadow">
            <ul className="max-h-60 overflow-y-auto text-sm">
              {filtered.map((s) => (
                <li
                  key={s.id}
                  className="px-3 py-2 hover:bg-row-hover cursor-pointer"
                  onClick={() => {
                    setSearch(s.name);
                    setOpen(false);
                    onChange({ id: s.id, name: s.name, code: s.supplierCode ,taxCategory: s.taxCategory,billingCountry: s.billingCountry  });
                  }}
                >
                  <div className="flex justify-between">
                    <span>{s.name}</span>
                    {s.supplierCode && <span className="text-xs text-muted">{s.supplierCode}</span>}
                  </div>
                </li>
              ))}

              {filtered.length === 0 && (
                <li className="px-3 py-2 text-muted">No supplier found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
