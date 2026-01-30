import { useEffect, useRef, useState } from "react";
import { getAllItems } from "../../../api/itemApi";

type Item = {
  id: string;
  itemName: string;
  unitOfMeasureCd?: string;
  sellingPrice?: number;
};

interface ItemSelectProps {
  value?: string;
  selectedId?: string;
  onChange: (item: Item) => void;
  className?: string;
}

export default function POItemSelect({
  value = "",
  selectedId,
  onChange,
  className = "",
}: ItemSelectProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLInputElement>(null);


  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  // Load items
  useEffect(() => {
    const loadItems = async () => {
      const res = await getAllItems(1, 1000);
      setItems(res?.data?.data ?? res?.data ?? []);
    };
    loadItems();
  }, []);

  // Set selected name
  useEffect(() => {
    if (!selectedId || items.length === 0) return;
    const i = items.find((x) => x.id === selectedId);
    if (i) setSearch(i.itemName);
  }, [selectedId, items]);

  // Close outside click
useEffect(() => {
  const handler = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);


  // Filter items
  const filtered = items.filter((i) =>
    i.itemName.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate dropdown position
  const openDropdown = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
    setOpen(true);
  };

  return (
    <>
      {/* INPUT */}
      <div ref={containerRef}>
      <input
        ref={inputRef}
        className={`w-full border border-theme bg-card px-2 py-1 rounded text-sm ${className}`}
        placeholder="Search item..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          openDropdown();
        }}
        onFocus={openDropdown}
      />

      {/* DROPDOWN OUTSIDE TABLE */}
      {open && (
        <div
          className="fixed z-[99999] bg-card border border-theme rounded shadow"
          style={{
            top: pos.top,
            left: pos.left,
            width: pos.width,
          }}
        >
          <ul className="max-h-50  overflow-y-auto text-sm">
            {filtered.map((i) => (
              <li
                key={i.id}
                className="px-2 py-1 hover:bg-row-hover cursor-pointer"
                onClick={() => {
                  setSearch(i.itemName);
                  setOpen(false);
                  onChange(i);
                }}
              >
                {i.id} - {i.itemName}
              </li>
            ))}

            {filtered.length === 0 && (
              <li className="px-2 py-1 text-muted">No items found</li>
            )}
          </ul>
        </div>
      )}
</div>
    </>
  );
}
