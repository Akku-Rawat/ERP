import React from "react";
import Pagination from "../Pagination";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  zebraStripes?: boolean;
  hoverable?: boolean;

  // Add button label (parent controls it)
  addLabel?: string;

  // Toolbar + column selector
  showToolbar?: boolean;
  enableAdd?: boolean;
  onAdd?: () => void;
  searchValue?: string;
  onSearch?: (q: string) => void;
  toolbarPlaceholder?: string;

  enableColumnSelector?: boolean;
  initialVisibleColumns?: string[];

  // pagination props (optional)
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyMessage = "No data found.",
  zebraStripes = false,
  hoverable = true,

  addLabel = "+ Add",

  showToolbar = false,
  enableAdd = false,
  onAdd,
  searchValue,
  onSearch,
  toolbarPlaceholder = "Search...",

  enableColumnSelector = false,
  initialVisibleColumns,

  // pagination (destructured)
  currentPage,
  totalPages,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
}: TableProps<T>) {
  const getAlignment = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  // Search state (toolbar)
  const [internalSearch, setInternalSearch] = React.useState("");
  const effectiveSearch = searchValue ?? internalSearch;
  const setSearch = (val: string) => {
    if (onSearch) onSearch(val);
    else setInternalSearch(val);
  };

  // Column visibility state
  const allKeys = columns.map((c) => c.key);
  const initialKeys = initialVisibleColumns ?? allKeys;
  const [visibleKeys, setVisibleKeys] = React.useState<string[]>(() =>
    allKeys.filter((k) => initialKeys.includes(k)),
  );

  const isVisible = (key: string) => visibleKeys.includes(key);
  const toggleColumn = (key: string) => {
    setVisibleKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // Column selector menu toggle + menu search
  const [colMenuOpen, setColMenuOpen] = React.useState(false);
  const [menuSearch, setMenuSearch] = React.useState("");
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setColMenuOpen(false);
        setMenuSearch("");
      }
    };
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  // Loading view
  if (loading) {
    return (
      <div className="bg-card rounded-xl  overflow-hidden">
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  // filtered columns for the menu search
  const menuFilteredColumns = columns.filter((c) =>
    c.header.toLowerCase().includes(menuSearch.trim().toLowerCase()),
  );

  // Check if pagination should be shown - show even if only 1 page for visibility
  const showPagination = 
    typeof currentPage === "number" &&
    typeof totalPages === "number" &&
    typeof onPageChange === "function" &&
    totalItems > 0;

  return (
    <div className="bg-card rounded-xl  border border-[var(--border)] flex flex-col">
      {/* TOOLBAR */}
      {showToolbar && (
        <div className="px-6 py-4 border-b bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search */}
          <div className="flex items-center w-full sm:max-w-md">
            <input
              value={effectiveSearch}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={toolbarPlaceholder}
              className="w-full pl-4 pr-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
            />
          </div>

          {/* Column Selector + Add Button */}
          <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
            {enableColumnSelector && (
              <div className="relative" ref={menuRef}>
                {/* Button shows selected count */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setColMenuOpen((v) => !v);
                  }}
                  className="px-3 py-2 border rounded-md text-sm bg-card hover:bg-gray-50 flex items-center gap-2"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={colMenuOpen}
                >
                  <span className="whitespace-nowrap">
                    {visibleKeys.length} Selected
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${colMenuOpen ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>

                {colMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-card border border-[var(--border)] rounded-lg shadow-2xl z-[100] overflow-hidden"
                    role="dialog"
                    aria-label="Column selector"
                    onClick={(e) => e.stopPropagation()}
                    style={{ position: 'absolute' }}
                  >
                    {/* Header with gradient */}
                    <div className="bg-primary px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                        <div className="text-sm font-semibold text-white">
                          Columns ({visibleKeys.length}/{columns.length})
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setColMenuOpen(false);
                          setMenuSearch("");
                        }}
                        className="p-1 rounded hover:bg-card/20 text-white transition-colors"
                        type="button"
                        aria-label="Close"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Search inside menu */}
                    <div className="p-3 bg-gray-50 border-b">
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="search"
                          placeholder="Search columns..."
                          value={menuSearch}
                          onChange={(e) => setMenuSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between px-4 py-2 bg-card border-b">
                      <button
                        onClick={() => setVisibleKeys(allKeys)}
                        className="text-xs font-medium bg-primary transition-colors"
                        type="button"
                      >
                        ✓ Show all
                      </button>
                      <button
                        onClick={() => setVisibleKeys([])}
                        className="text-xs font-medium text-[var(--danger)] transition-colors"
                        type="button"
                      >
                        ✕ Hide all
                      </button>
                    </div>

                    {/* List */}
                    <div className="max-h-64 overflow-y-auto bg-card">
                      {menuFilteredColumns.length > 0 ? (
                        <div className="p-2">
                          {menuFilteredColumns.map((col) => (
                            <label
                              key={col.key}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-blue-50 cursor-pointer select-none transition-colors group"
                            >
                              <input
                                type="checkbox"
                                checked={isVisible(col.key)}
                                onChange={() => toggleColumn(col.key)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 text-[var(--primary)] rounded border-[var(--border)] focus:ring-[var(--primary)]"

                              />
                              <div className="flex-1 text-sm text-gray-700 group-hover:text-gray-900 font-medium">{col.header}</div>
                              {isVisible(col.key) && (
                                <svg className="w-4 h-4 text-[var(--success)]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                          No columns found
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-3 py-3 bg-gray-50 border-t flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setColMenuOpen(false);
                          setMenuSearch("");
                        }}
                        className="text-sm px-4 py-1.5 rounded-md border border-[var(--border)] hover:bg-gray-100 transition-colors font-medium"
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setColMenuOpen(false);
                          setMenuSearch("");
                        }}
                        className="text-sm px-4 py-1.5 rounded-md bg-primary text-white transition-colors font-medium shadow-sm"
                        type="button"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add Button */}
            {enableAdd && (
              <button
                onClick={() => onAdd?.()}
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:opacity-95 transition shadow-sm text-sm"
                type="button"
              >
                {addLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* TABLE: fixed-height scroll body */}
      <div className="flex-1 w-full overflow-x-auto">
        <div className="max-h-[420px] overflow-y-auto">
          <table className="min-w-full table-fixed">
            <thead className="table-head sticky top-0 z-10">
              <tr>
                {columns
                  .filter((c) => isVisible(c.key))
                  .map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-sm font-semibold uppercase tracking-wide bg-primary text-white align-middle ${getAlignment(
                        column.align,
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        {column.header}
                        {column.sortable && (
                          <svg
                            className="w-4 h-4 opacity-60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleKeys.length || columns.length}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <svg
                        className="w-16 h-16 text-muted opacity-30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-muted font-medium">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => onRowClick?.(item)}
                    className={`transition-colors duration-150 ${
                      hoverable ? "hover:bg-gray-50 cursor-pointer" : ""
                    }`}
                  >
                    {columns
                      .filter((c) => isVisible(c.key))
                      .map((column) => (
                        <td
                          key={column.key}
                          className={`px-6 py-3 text-sm text-main align-middle ${getAlignment(
                            column.align,
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

      {/* FOOTER: summary + pagination */}
      {showPagination && (
        <div className="px-6 py-4 border-t bg-card flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {Math.min((currentPage! - 1) * pageSize + 1, totalItems)}
            </span>{" "}
            –{" "}
            <span className="font-medium">
              {Math.min(currentPage! * pageSize, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange!(currentPage! - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-md border font-medium text-sm flex items-center gap-1 transition-colors ${
                currentPage === 1
                  ? "border-[var(--border)] text-gray-400 cursor-not-allowed"
                  : "border-[var(--border)] text-gray-700 hover:bg-gray-50"
              }`}
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage!}
              totalPages={totalPages!}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={onPageChange!}
            />

            {/* Next Button */}
            <button
              onClick={() => onPageChange!(currentPage! + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-md border font-medium text-sm flex items-center gap-1 transition-colors ${
                currentPage === totalPages
                  ? "border-[var(--border)] text-gray-400 cursor-not-allowed"
                  : "border-[var(--border)] text-gray-700 hover:bg-gray-50"
              }`}
              type="button"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;