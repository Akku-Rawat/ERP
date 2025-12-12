import React from "react";
import { useTableLogic } from "./useTableLogic";
import type { Column } from "../Table/type";
import ColumnSelector from "./ColumnSelector";
import Pagination from "../../Pagination";
import { FaFilter } from "react-icons/fa";


interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  showToolbar?: boolean;
  enableAdd?: boolean;
  onAdd?: () => void;
  searchValue?: string;
  onSearch?: (q: string) => void;
  toolbarPlaceholder?: string;
  enableColumnSelector?: boolean;
  initialVisibleColumns?: string[];
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  addLabel?: string;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyMessage = "No data found.",
  showToolbar = false,
  enableAdd = false,
  onAdd,
  searchValue,
  toolbarPlaceholder = "Search...",
  enableColumnSelector = false,
  addLabel = "+ Add",
  currentPage,
  totalPages,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onSearch,
}: TableProps<T>) {
  const {
    effectiveSearch,
    setSearch,
    visibleKeys,
    setVisibleKeys,
    allKeys,
    toggleColumn,
    filtersOpen,
    setFiltersOpen,
    nameFilter,
    setNameFilter,
    typeFilter,
    setTypeFilter,
    minFilter,
    setMinFilter,
    maxFilter,
    setMaxFilter,
    sortOrder,
    setSortOrder,
    processedData,
  } = useTableLogic<T>({ columns, data, searchValue });

  const getAlignment = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-center";
      default:
        return "text-left";
    }
  };

  const filterRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!filtersOpen) return;
      if (!filterRef.current) return;
      if (!filterRef.current.contains(e.target as Node)) setFiltersOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen, setFiltersOpen]);

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-[var(--border)] overflow-hidden">
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  const displayData = processedData;
  const visibleCount = visibleKeys.length || columns.length;

  return (
    <div className="bg-card rounded-lg border border-[var(--border)] flex flex-col overflow-hidden shadow-sm">
      {showToolbar && (
        <div className="px-5 py-4 border-b border-[var(--border)] bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>

            <input
              value={effectiveSearch}
              onChange={(e) => {
                const v = e.target.value;
                if (typeof onSearch === "function") onSearch(v);
                else setSearch(v);
              }}
              placeholder={toolbarPlaceholder}
              className="w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                         transition text-sm bg-card text-main"
              aria-label="Search table"
            />
          </div>

          <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
            {/* Sort button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
              }}
              className={`px-3 py-2 border border-[var(--border)] rounded-md text-sm bg-card row-hover flex items-center gap-2 transition ${
                sortOrder ? "border-primary ring-1 ring-primary" : ""
              } text-main`}
              type="button"
              aria-pressed={sortOrder === "asc" ? "true" : "false"}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
              <span className="text-sm font-medium">
                {sortOrder === "asc" ? "Cust ID ↑" : "Cust ID ↓"}
              </span>
            </button>

            {/* Filters */}
            <div className="relative">
              <button
  onClick={(e) => {
    e.stopPropagation();
    setFiltersOpen((v) => !v);
  }}
  className="px-3 py-2 rounded-md text-sm bg-primary hover:opacity-90 
             text-white flex items-center gap-2 font-medium transition"
  type="button"
>
  <FaFilter className="w-4 h-4" />
  Filters
</button>


              {filtersOpen && (
                <div
                  ref={filterRef}
                  className="absolute right-0 mt-2 w-[340px] bg-card border border-[var(--border)] rounded-lg shadow-lg z-[100] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-3 bg-primary text-white flex items-center justify-between rounded-t-lg">
                    <span className="text-sm font-semibold">Filters</span>
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="p-1 rounded hover:bg-white/20 transition"
                      type="button"
                      aria-label="Close filters"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="p-4 space-y-3 max-h-72 overflow-y-auto bg-card">
                    <div>
                      <label className="text-xs font-semibold text-muted mb-1 block">
                        Name or Email
                      </label>
                      <input
                        type="text"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        placeholder="Search name or email"
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-card text-main"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted mb-1 block">
                        Type
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-card text-main"
                      >
                        <option value="">— Any —</option>
                        <option value="Individual">Individual</option>
                        <option value="Company">Company</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-muted mb-1 block">
                          Min
                        </label>
                        <input
                          type="number"
                          value={minFilter}
                          onChange={(e) => setMinFilter(e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-card text-main"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted mb-1 block">
                          Max
                        </label>
                        <input
                          type="number"
                          value={maxFilter}
                          onChange={(e) => setMaxFilter(e.target.value)}
                          placeholder="∞"
                          className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-card text-main"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[var(--border)] bg-app">
                    <button
                      type="button"
                      onClick={() => {
                        setNameFilter("");
                        setTypeFilter("");
                        setMinFilter("");
                        setMaxFilter("");
                      }}
                      className="px-3 py-1.5 rounded-md border border-[var(--border)] text-sm font-medium row-hover transition text-main bg-card"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiltersOpen(false)}
                      className="px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium hover:opacity-90 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Column selector */}
            {enableColumnSelector && (
              <ColumnSelector
                columns={columns}
                visibleKeys={visibleKeys}
                toggleColumn={toggleColumn}
                setVisibleKeys={setVisibleKeys}
                allKeys={allKeys}
              />
            )}

            {/* Add */}
            {enableAdd && (
              <button
                onClick={() => onAdd?.()}
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition text-sm font-medium"
                type="button"
              >
                {addLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="flex-1 w-full overflow-x-auto">
        <div className="max-h-[420px] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {columns
                  .filter((c) => visibleKeys.includes(c.key))
                  .map((column) => (
                    <th
                      key={column.key}
                      className={`px-4 py-3 text-xs font-bold uppercase tracking-wider table-head sticky top-0 z-10 ${getAlignment(
                        column.align
                      )}`}
                    >
                      {column.header}
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {displayData.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleCount || columns.length}
                    className="px-4 py-12 text-center border-b border-[var(--border)]"
                  >
                    <p className="text-muted font-medium">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                displayData.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onRowClick?.(item)}
                    className="border-b border-[var(--border)] row-hover cursor-pointer transition"
                  >
                    {columns
                      .filter((c) => visibleKeys.includes(c.key))
                      .map((column) => (
                        <td
                          key={column.key}
                          className={`px-4 py-3.5 text-sm text-main ${getAlignment(
                            column.align
                          )}`}
                        >
                          {column.render ? column.render(item) : item[column.key]}
                        </td>
                      ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-[var(--border)] bg-card">
        <Pagination
          currentPage={currentPage || 1}
          totalPages={totalPages || 1}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange || (() => {})}
        />
      </div>
    </div>
  );
}

export default Table;