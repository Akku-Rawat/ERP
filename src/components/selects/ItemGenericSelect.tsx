import React, { useEffect, useRef, useState } from "react";
import type { AxiosResponse } from "axios";

interface Props {
  value?: string;
  onChange: (item: { name: string; id: string }) => void;
  fetchData: () => Promise<AxiosResponse<any>>;
  label: string;
  placeholder?: string;
  className?: string;
  displayField?: "code" | "name";  
  displayFormatter?: (option: any) => string;
}

export default function ItemGenericSelect({
  value = "",
  onChange,
  fetchData,
  label,
  placeholder = "Search...",
  className = "",
  displayField, 
  displayFormatter,
}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchData();

        let data = res?.data?.data ?? res?.data ?? res;
        if (!Array.isArray(data)) data = [];
        setItems(data);
      } catch (err) {
        console.error("Load error:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchData]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // const getId = (item: any): string => {
  //   return item.code ?? item.itemClsCd ?? String(item);
  // };

  // const getDisplayName = (item: any): string => {
  //   if (displayFormatter) {
  //     return displayFormatter(item); 
  //   }
  //   if (displayField === "code") {
  //     return getId(item); 
  //   }
    
  //   if (item.code_name) return item.code_name;
  //   if (item.name) return item.name;
  //   if (item.itemClsNm) return item.itemClsNm;
  //   return getId(item);
  // };
const getId = (item: any): string => {
  return item.code ?? item.itemClsCd ?? String(item);
};

const getCodeForDisplay = (item: any): string => {
  return item.code ?? item.itemClsCd ?? "";
};

const getNameForDisplay = (item: any): string => {
  return item.name ?? item.code_name ?? item.itemClsNm ?? "";
};

const getDisplayName = (item: any): string => {
  if (displayFormatter) {
    return displayFormatter(item);
  }

  // Default format: "CODE - NAME"
  const code = getCodeForDisplay(item);
  const name = getNameForDisplay(item);

  if (code && name) {
    return `${code} - ${name}`;
  }
  if (name) return name;
  if (code) return code;
  return String(item);
};

  const selectedItem = items.find(item => getId(item) === value);
  const displayValue = selectedItem ? getDisplayName(selectedItem) : "";

  // Filter with search
  const filtered = items.filter(item => {
    const display = getDisplayName(item).toLowerCase();
    const name = getDisplayName(item).toLowerCase();
    const code = getId(item).toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || code.includes(query);
  });

  
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="font-medium text-gray-600 text-sm">{label}</span>

      <div ref={ref} className="relative w-full">
        <input
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={loading ? "Loading..." : placeholder }
          value={open ? search : displayValue}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          disabled={loading}
        />

        {open && !loading && (
          <div className="absolute left-0 top-full mt-1 w-full bg-white border shadow-lg rounded z-30 max-h-60 overflow-y-auto">
            <ul className="text-sm">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <li
                    key={getId(item)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                      getId(item) === value ? "bg-blue-50 font-medium" : ""
                    }`}
                    onClick={() => {
                      setSearch("");
                      setOpen(false);
                      onChange({ name: getDisplayName(item), id: getId(item) });
                    }}
                  >
                    {getDisplayName(item)}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">
                  {search ? "No match found" : "No items available"}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}