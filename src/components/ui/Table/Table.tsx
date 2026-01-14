import React, { useEffect, useRef, useState } from "react";
import { useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useTableLogic } from "./useTableLogic";
import type { Column } from "../Table/type";
import ColumnSelector from "./ColumnSelector";
import Pagination from "../../Pagination";
import {
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSearch,
} from "react-icons/fa";

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  showToolbar?: boolean;
  enableAdd?: boolean;
  enableExport?: boolean;
  onExport?: () => void;
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
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  addLabel?: string;
  rowKey?: (row: T) => string;
  serverSide?: boolean;
}

/**
 * Skeleton Loading Row Component
 */
const SkeletonRow: React.FC<{ columnsCount: number }> = ({ columnsCount }) => (
  <tr className="bg-transparent">
    {Array.from({ length: columnsCount }).map((_, idx) => (
      <td key={idx} className="px-5 py-3.5 border-b border-[var(--border)]/20">
        <div className="h-4 bg-gradient-to-r from-app via-row-hover to-app bg-[length:200%_100%] animate-shimmer rounded" />
      </td>
    ))}
  </tr>
);

/**
 * Filter dropdown component
 */
interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
  nameFilter: string;
  setNameFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  onReset: () => void;
}

function FilterDropdown({
  isOpen,
  onClose,
  anchorRef,
  nameFilter,
  setNameFilter,
  typeFilter,
  setTypeFilter,
  onReset,
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const dropdownWidth = 320;
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: Math.max(rect.right + window.scrollX - dropdownWidth, 8),
      });
    }
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen || !position) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed w-80 bg-card border border-[var(--border)] rounded-2xl shadow-2xl z-[9999] overflow-hidden"
      style={{ top: position.top, left: position.left }}
    >
      <div className="px-5 py-3 border-b border-[var(--border)] bg-row-hover/30">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-main">
          Filter Records
        </h4>
      </div>
      <div className="p-5 space-y-4">
        <FilterField label="Search Keywords">
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-app border border-[var(--border)] rounded-xl text-xs font-medium text-main focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            placeholder="Enter keywords..."
          />
        </FilterField>
        <FilterField label="Category/Type">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-app border border-[var(--border)] rounded-xl text-xs font-medium text-main focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Individual">Individual</option>
            <option value="Company">Company</option>
          </select>
        </FilterField>
      </div>
      <div className="px-5 py-3 border-t border-[var(--border)] bg-row-hover/10 flex items-center justify-between">
        <button
          onClick={onReset}
          className="text-[10px] font-black uppercase text-muted hover:text-danger transition-colors"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="bg-primary text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase shadow-md hover:opacity-90 transition-all"
        >
          Apply
        </button>
      </div>
    </div>,
    document.body
  );
}

interface FilterFieldProps {
  label: string;
  children: React.ReactNode;
}

const FilterField: React.FC<FilterFieldProps> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">
      {label}
    </label>
    {children}
  </div>
);

/**
 * Main Table Component
 */
function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  rowKey,
  loading = false,
  emptyMessage = "No records found.",
  showToolbar = false,
  enableAdd = false,
  onAdd,
  enableExport = false,
  onExport,
  searchValue,
  toolbarPlaceholder = "Search...",
  enableColumnSelector = false,
  addLabel = "+ Add",
  currentPage,
  totalPages,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  onSearch,
  serverSide = false,
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
    setMinFilter,
    setMaxFilter,
    sortOrder,
    setSortOrder,
    processedData,
  } = useTableLogic<T>({ columns, data, searchValue });

  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const getAlignment = (align?: "left" | "center" | "right"): string => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setTypeFilter("");
    setMinFilter("");
    setMaxFilter("");
  };

  const displayData = serverSide ? data : (processedData ?? []);
 const visibleColumns = loading ? columns : columns.filter((col) => visibleKeys.includes(col.key));

  return (
    <div className="bg-card rounded-2xl border border-[var(--border)] flex flex-col shadow-sm transition-all relative z-10 w-full overflow-hidden">
      {/* Toolbar Section */}
      {showToolbar && (
        <div className="px-5 py-4 border-b border-[var(--border)] bg-card flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shrink-0">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-sm group">
            {loading ? (
              <div className="h-10 w-full bg-gradient-to-r from-app via-row-hover to-app bg-[length:200%_100%] animate-shimmer rounded-xl" />
            ) : (
              <>
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs group-focus-within:text-primary transition-colors" />
                <input
                  value={effectiveSearch}
                  onChange={(e) =>
                    typeof onSearch === "function"
                      ? onSearch(e.target.value)
                      : setSearch(e.target.value)
                  }
                  placeholder={toolbarPlaceholder}
                  className="w-full pl-10 pr-4 py-2 bg-app border border-[var(--border)] rounded-xl text-xs font-medium text-main focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                />
              </>
            )}
          </div>

          {/* Action Buttons */}
          {onPageSizeChange && (
                <div className="flex items-center gap-2">
                  <label className="text-[9px] font-black uppercase text-muted tracking-[0.2em] opacity-50">
                    Show:
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="px-3 py-1.5 bg-app border border-[var(--border)] rounded-lg text-[10px] font-black uppercase text-main focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer"
                  >
                    {pageSizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}
          
          <div className="flex items-center gap-2 shrink-0">
            {loading ? (
              <>
                <div className="h-10 w-20 bg-gradient-to-r from-app via-row-hover to-app bg-[length:200%_100%] animate-shimmer rounded-xl" />
                <div className="h-10 w-24 bg-gradient-to-r from-app via-row-hover to-app bg-[length:200%_100%] animate-shimmer rounded-xl" />
                {enableColumnSelector && (
                  <div className="h-10 w-28 bg-gradient-to-r from-app via-row-hover to-app bg-[length:200%_100%] animate-shimmer rounded-xl" />
                )}
                {enableAdd && (
                  <div className="h-10 w-32 bg-gradient-to-r from-app via-row-hover to-app bg-[length:200%_100%] animate-shimmer rounded-xl ml-2" />
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className={`p-2 rounded-xl border border-[var(--border)] bg-app text-muted hover:text-primary hover:border-primary transition-all flex items-center gap-2 px-3 whitespace-nowrap ${
                    sortOrder ? "border-primary text-primary" : ""
                  }`}
                >
                  {sortOrder === "asc" ? (
                    <FaSortAmountUp size={12} />
                  ) : (
                    <FaSortAmountDown size={12} />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Sort
                  </span>
                </button>

                <button
                  ref={filterButtonRef}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className={`p-2 rounded-xl border border-[var(--border)] bg-app text-muted hover:text-primary hover:border-primary transition-all flex items-center gap-2 px-3 whitespace-nowrap ${
                    filtersOpen
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : ""
                  }`}
                >
                  <FaFilter size={10} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Filters
                  </span>
                </button>

                <FilterDropdown
                  isOpen={filtersOpen}
                  onClose={() => setFiltersOpen(false)}
                  anchorRef={filterButtonRef}
                  nameFilter={nameFilter}
                  setNameFilter={setNameFilter}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  onReset={handleResetFilters}
                />

                {enableColumnSelector && (
                  <ColumnSelector
                    columns={columns}
                    visibleKeys={visibleKeys}
                    toggleColumn={toggleColumn}
                    setVisibleKeys={setVisibleKeys}
                    allKeys={allKeys}
                  />
                )}

                {enableAdd && (
                  <button
                    onClick={onAdd}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all whitespace-nowrap ml-2"
                  >
                    {addLabel}
                  </button>
                )}

                {enableExport && (
                  <button
                    onClick={onExport}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all"
                  >
                    Export
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Table Container */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <div className="max-h-[420px] overflow-y-auto min-w-[800px] relative">
          <table className="w-full border-separate border-spacing-0">
            {/* Table Header */}
            <thead className="sticky top-0 z-30 shadow-sm">
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-5 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted border-b border-[var(--border)] bg-card whitespace-nowrap ${getAlignment(column.align)}`}
                    style={{ backgroundColor: "var(--card)" }}
                  >
                    {loading ? (
                      <div className="h-3 bg-gradient-to-r from-app via-row-hover to-app bg-[length:200%_100%] animate-shimmer rounded" />
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="relative z-10">
              {loading ? (
                Array.from({ length: pageSize }).map((_, idx) => (
                  <SkeletonRow key={idx} columnsCount={visibleColumns.length} />
                ))
              ) : displayData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-24 text-center"
                  >
                    <p className="text-xs font-bold text-muted uppercase tracking-widest opacity-40">
                      {emptyMessage}
                    </p>
                  </td>
                </tr>
              ) : (
                displayData.map((item, idx) => (
                  <tr
                    key={rowKey ? rowKey(item) : JSON.stringify(item)}
                    onClick={() => onRowClick?.(item)}
                    className={`group transition-none cursor-pointer ${
                      idx % 2 === 0 ? "bg-transparent" : "bg-row-hover/10"
                    } hover:bg-row-hover`}
                  >
                    {visibleColumns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-5 py-3.5 text-xs font-medium text-main border-b border-[var(--border)]/20 ${getAlignment(column.align)}`}
                      >
                        {column.render ? (
                          column.render(item)
                        ) : (
                          <span className="opacity-90">{item[column.key]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer with Pagination */}
      <div className="px-5 py-3 border-t border-[var(--border)] bg-card flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        {loading ? (
          <>
            <div className="h-4 w-32 bg-gradient-to-r from-app via-row-hover to-app bg-[length:200%_100%] animate-shimmer rounded" />
            <div className="h-8 w-64 bg-gradient-to-r from-app via-row-hover to-app bg-[length:200%_100%] animate-shimmer rounded" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="text-[9px] font-black uppercase text-muted tracking-[0.2em] opacity-50">
                Total: {totalItems}
              </div>

             
            </div>

            <Pagination
              currentPage={currentPage || 1}
              totalPages={totalPages || 1}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={onPageChange || (() => {})}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Table;
