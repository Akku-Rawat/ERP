import React, { useEffect, useRef, useState } from "react";
import { getCountryList } from "../../api/lookupApi";

interface Country {
  code: string;
  name: string;
}

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
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getCountryList();
        setCountries(
          (res ?? []).map((c: any) => ({
            code: c.code,
            name: c.name,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!value) return;
    const match = countries.find((c) => c.code === value);
    if (match) setSearch(match.name);
  }, [value, countries]);

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="font-medium text-gray-600 text-sm">{label}</span>

      <div ref={ref} className="relative w-full">
        <input
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={loading ? "Loading..." : "Search country..."}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />

        {open && !loading && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white border shadow-lg rounded z-30">
            <ul className="max-h-56 overflow-y-auto text-sm">
              {filtered.map((c) => (
                <li
                  key={c.code}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setSearch(c.name);
                    setOpen(false);
                    onChange(c);
                  }}
                >
                  {c.name}
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
