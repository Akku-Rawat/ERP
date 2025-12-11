import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  // optional: handle page size change (if you want a selector)
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[]; // defaults [10,20,50]
}

/**
 * Smart page range generator: returns array with numbers and '...' strings
 * Eg: [1, '...', 4,5,6, '...', 20]
 */
function makeRange(current: number, total: number, delta = 1) {
  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("...");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("...");
  if (total > 1) range.push(total);
  return range;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: Props) {
  if (totalPages <= 1) return null;

  const range = makeRange(currentPage, totalPages, 1);

  const goto = (p: number) => {
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    if (p === currentPage) return;
    onPageChange(p);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Left: summary */}
      <div className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-medium">
          {(currentPage - 1) * pageSize + 1}
        </span>{" "}
        –{" "}
        <span className="font-medium">
          {Math.min(currentPage * pageSize, totalItems)}
        </span>{" "}
        of <span className="font-medium">{totalItems}</span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        {/* Prev */}
        <button
          onClick={() => goto(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-3 py-1 rounded-md border text-sm ${currentPage <= 1 ? "opacity-50 cursor-not-allowed bg-white" : "bg-white hover:bg-gray-50"}`}
          aria-label="Previous page"
        >
          ‹ Prev
        </button>

        {/* Page numbers */}
        <nav aria-label="Pagination" className="flex items-center gap-2">
          {range.map((r, i) =>
            typeof r === "string" ? (
              <span key={`dot-${i}`} className="px-3 py-1 text-sm text-gray-400">
                {r}
              </span>
            ) : (
              <button
                key={r}
                onClick={() => goto(r)}
                className={`min-w-[36px] h-8 flex items-center justify-center px-2 rounded-md text-sm border ${
                  r === currentPage
                    ? "bg-primary text-white border-teal-600 shadow"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                aria-current={r === currentPage ? "page" : undefined}
              >
                {r}
              </button>
            ),
          )}
        </nav>

        {/* Next */}
        <button
          onClick={() => goto(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-3 py-1 rounded-md border text-sm ${currentPage >= totalPages ? "opacity-50 cursor-not-allowed bg-white" : "bg-white hover:bg-gray-50"}`}
          aria-label="Next page"
        >
          Next ›
        </button>

        {/* Optional page size selector */}
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="ml-3 border rounded px-2 py-1 text-sm bg-white"
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
