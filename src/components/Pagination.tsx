import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}) => {
  if (!totalPages || totalPages < 1) return null;
  console.log("totalItems: ", totalItems);

  const getPages = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 4) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  const showingStart =
    pageSize && totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const showingEnd =
    pageSize && totalItems
      ? Math.min(currentPage * pageSize, totalItems)
      : 0;

  return (
    <div className="flex flex-row justify-between items-center py-4 select-none">

      {totalItems !== undefined && pageSize !== undefined && (
        <div className="text-md text-gray-600 mb-2">
          Showing {showingEnd === 0 ? 0 : showingStart}–{showingEnd} of {totalItems} results
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Prev */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`px-2 py-1 rounded border transition ${currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100"
            }`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="px-2 py-1 text-gray-400 font-medium">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`px-2 py-1 rounded border transition ${p === currentPage
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white hover:bg-gray-100"
                  }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`px-2 py-1 rounded border transition ${currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
