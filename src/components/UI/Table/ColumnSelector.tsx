import React from "react";
import type { Column } from "./types";

interface ColumnSelectorProps {
  columns: Column<any>[];
  visibleKeys: string[];
  toggleColumn: (key: string) => void;
  setVisibleKeys: (keys: string[]) => void;
  allKeys: string[];
  className?: string;
  buttonLabel?: string;
}

export default function ColumnSelector({
  columns,
  visibleKeys,
  toggleColumn,
  setVisibleKeys,
  allKeys,
  className,
  buttonLabel,
}: ColumnSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [menuSearch, setMenuSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
        setMenuSearch("");
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenuSearch("");
      }
    };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const filtered = columns.filter((c) =>
    c.header.toLowerCase().includes(menuSearch.trim().toLowerCase()),
  );

  return (
    <div ref={ref} className={`relative inline-block ${className ?? ""}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="px-3 py-2 rounded-md text-sm bg-primary text-white hover:bg-primary-600 flex items-center gap-2"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="whitespace-nowrap">
          {buttonLabel ?? `${visibleKeys.length} Selected`}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-72 bg-card border border-[var(--border)] rounded-lg shadow-2xl z-[300] overflow-hidden"
          role="dialog"
          aria-label="Column selector"
        >
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-white">
              Columns ({visibleKeys.length}/{columns.length})
            </div>
            <button
              onClick={() => {
                setOpen(false);
                setMenuSearch("");
              }}
              className="p-1 rounded hover:bg-card/20 text-white transition-colors"
              type="button"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="p-3 bg-app border-b border-[var(--border)]">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search columns..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none bg-card text-main placeholder:text-muted"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-[var(--border)]">
            <button
              onClick={() => setVisibleKeys(allKeys)}
              className="text-xs font-medium bg-primary text-white px-2 py-1 rounded"
              type="button"
            >
              ✓ Show all
            </button>
            <button
              onClick={() => setVisibleKeys([])}
              className="text-xs font-medium text-[var(--danger)] px-2 py-1 rounded"
              type="button"
            >
              ✕ Hide all
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto bg-card">
            {filtered.length > 0 ? (
              <div className="p-2">
                {filtered.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-row-hover cursor-pointer select-none transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={visibleKeys.includes(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 text-[var(--primary)] rounded border-[var(--border)] bg-card"
                    />
                    <div className="flex-1 text-sm text-main font-medium">
                      {col.header}
                    </div>
                    {visibleKeys.includes(col.key) && (
                      <svg
                        className="w-4 h-4 text-[var(--success)]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted">
                No columns found
              </div>
            )}
          </div>

          <div className="px-3 py-3 bg-app border-t border-[var(--border)] flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setOpen(false);
                setMenuSearch("");
              }}
              className="text-sm px-4 py-1.5 rounded-md border border-[var(--border)] bg-card text-main"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setMenuSearch("");
              }}
              className="text-sm px-4 py-1.5 rounded-md bg-primary text-white"
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}