import React, { useEffect, useRef, useState } from "react";
import { getAllItems } from "../../api/itemApi";

interface ItemSelectProps {
  value?: string; 
  onChange: (item: {
    name: string;
    code: string;
    description?: string;
    price?: number;
  }) => void;
  className?: string;
  label?: string;
}

export default function ItemSelect({
  value = "",
  onChange,
  className = "",
}: ItemSelectProps) {
  const [items, setItems] = useState<
    { name: string; code: string; description?: string; price?: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || "");
  const ref = useRef<HTMLDivElement>(null);

  /* ---------------- Fetch Items ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getAllItems();
        if (res?.status_code !== 200) return;

        setItems(
          res.data.map((it: any) => ({
            name: it.item_name,
            code: it.item_code,
            description: it.description ?? "",
            price: it.standard_rate ?? 0,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ------------ Close dropdown on outside click ------------ */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- Filtering ---------------- */
  const filtered = items.filter((it) =>
    it.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Wrapper to control dropdown width */}
      <div ref={ref} className="relative w-full">

        {/* Search Input */}
        <input
          className="w-full rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={loading ? "Loading items..." : "Search item..."}
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
              {filtered.map((it) => (
                <li
                  key={it.code}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setSearch(it.name);
                    setOpen(false);
                    onChange(it);
                  }}
                >
                  <div className="flex flex-col">
                    <span>{it.name}</span>
                    {it.description && (
                      <span className="text-xs text-gray-500 truncate">
                        {it.description}
                      </span>
                    )}
                  </div>
                </li>
              ))}

              {filtered.length === 0 && (
                <li className="px-4 py-2 text-gray-500">No items found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
