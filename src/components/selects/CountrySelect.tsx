import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getCountryList } from "../../api/lookupApi";

interface CountrySelectProps {
  value?: string;
  onChange: (country: { code: string; name: string }) => void;
  className?: string;
  label?: string;
}

export default function CountrySelect({
  value = "",
  onChange,
  className = "",
  label = "Export To Country",
}: CountrySelectProps) {
  const [countries, setCountries] = useState<
    { sortOrder: number; code: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rect, setRect] = useState<DOMRect | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getCountryList();
      setCountries(
        (res ?? []).map((c: any) => ({
          sortOrder: c.sort_order,
          code: c.code,
          name: c.name,
        }))
      );
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!value) return;
    const match = countries.find((c) => c.code === value);
    if (match) setSearch(match.name);
  }, [value, countries]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        inputRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openDropdown = () => {
    if (!inputRef.current) return;
    setRect(inputRef.current.getBoundingClientRect());
    setOpen(true);
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <span className="font-medium text-gray-600 text-sm">{label}</span>

      <input
        ref={inputRef}
        className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={loading ? "Loading..." : "Search country..."}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          openDropdown();
        }}
        onFocus={openDropdown}
      />

      {open &&
        rect &&
        !loading &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: rect.bottom + window.scrollY,
              left: rect.left + window.scrollX,
              width: rect.width,
              zIndex: 9999,
            }}
            className="bg-white border rounded shadow-lg"
          >
            <ul className="max-h-56 overflow-y-auto text-sm">
              {filtered.map((c) => (
                <li
                  key={c.sortOrder}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setSearch(c.name);
                    setOpen(false);
                    onChange({ code: c.code, name: c.name });
                  }}
                >
                  <div className="flex justify-between">
                    <span>{c.name}</span>
                    <span className="text-xs text-gray-500">{c.code}</span>
                  </div>
                </li>
              ))}

              {filtered.length === 0 && (
                <li className="px-4 py-2 text-gray-500">No match found</li>
              )}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
