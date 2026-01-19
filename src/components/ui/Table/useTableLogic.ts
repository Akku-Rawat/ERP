// useTableLogic.ts
import React from "react";
import { compareIdSmart } from "./sortUtils";
import { detectNumericKey, detectCustomerIdKey } from "./filterHelpers";
import type { Column } from "./type";

export type UseTableLogicProps<T> = {
  columns: Column<T>[];
  data: T[];
  searchValue?: string;
};

export const useTableLogic = <T extends Record<string, any>>({
  columns,
  data,
  searchValue,
}: UseTableLogicProps<T>) => {
  const [internalSearch, setInternalSearch] = React.useState("");
  const effectiveSearch = searchValue ?? internalSearch;
  const setSearch = (v: string) => setInternalSearch(v);

  // column visibility
  const allKeys = React.useMemo(() => columns.map((c) => c.key), [columns]);
  const [visibleKeys, setVisibleKeys] = React.useState<string[]>(allKeys);
  React.useEffect(() => setVisibleKeys(allKeys), [allKeys]);

  const toggleColumn = (key: string) =>
    setVisibleKeys((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
    );

  // column selector menu
  const [colMenuOpen, setColMenuOpen] = React.useState(false);
  const [menuSearch, setMenuSearch] = React.useState("");

  // filters
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [nameFilter, setNameFilter] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [minFilter, setMinFilter] = React.useState("");
  const [maxFilter, setMaxFilter] = React.useState("");

  // sort
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc" | null>(
    "asc",
  );

  const numericKey = React.useMemo(() => detectNumericKey(columns), [columns]);
  const customerIdKey = React.useMemo(() => detectCustomerIdKey(columns), [columns]);
  
  const [yearFilter, setYearFilter] = React.useState("");
const [leaveTypeFilter, setLeaveTypeFilter] = React.useState("");

  

  const processedData = React.useMemo(() => {
    const q = (effectiveSearch ?? "").trim().toLowerCase();

    let rows = data.filter((row) => {
      // toolbar search
      if (q) {
        const any = columns.some((col) => {
          const v = row[col.key];
          return (
            v !== undefined && v !== null && String(v).toLowerCase().includes(q)
          );
        });
        if (!any) return false;
      }

      if (nameFilter.trim()) {
        const nf = nameFilter.trim().toLowerCase();
        const nameKeys = [
          "name",
          "customerName",
          "customer_name",
          "fullname",
          "title",
        ];
        const emailKeys = ["email", "emailAddress", "email_address"];
        const foundName = nameKeys.some((k) => {
          const v = row[k];
          return (
            v !== undefined &&
            v !== null &&
            String(v).toLowerCase().includes(nf)
          );
        });
        const foundEmail = emailKeys.some((k) => {
          const v = row[k];
          return (
            v !== undefined &&
            v !== null &&
            String(v).toLowerCase().includes(nf)
          );
        });
        if (!foundName && !foundEmail) return false;
      }

      if (yearFilter) {
  const dateValue = row["date"];
  if (dateValue) {
    const year = String(dateValue).split("-")[2];
    if (year !== yearFilter) return false;
  } else {
    return false;
  }
}


if (leaveTypeFilter) {
  const leaveType = row["type"];
  if (
    !leaveType ||
    String(leaveType).toLowerCase() !== leaveTypeFilter.toLowerCase()
  ) {
    return false;
  }
}


      if (typeFilter) {
        const typeKeys = [
          "type",
          "customerType",
          "customer_type",
          "accountType",
        ];
        const matched = typeKeys.some((k) => {
          const v = row[k];
          return (
            v !== undefined &&
            v !== null &&
            String(v).toLowerCase() === typeFilter.toLowerCase()
          );
        });
        if (!matched) return false;
      }

      if (numericKey) {
        const raw = row[numericKey];
        const num = raw === undefined || raw === null ? NaN : Number(raw);
        if (minFilter) {
          const mn = Number(minFilter);
          if (!Number.isNaN(mn) && (Number.isNaN(num) || num < mn))
            return false;
        }
        if (maxFilter) {
          const mx = Number(maxFilter);
          if (!Number.isNaN(mx) && (Number.isNaN(num) || num > mx))
            return false;
        }
      }

      return true;
    });

    if (customerIdKey && sortOrder) {
      rows = rows.slice().sort((a, b) => {
        const va = a[customerIdKey];
        const vb = b[customerIdKey];
        return compareIdSmart(va, vb, sortOrder);
      });
    }

    return rows;
  }, [
    data,
    effectiveSearch,
    nameFilter,
    typeFilter,
    minFilter,
    maxFilter,
    columns,
     yearFilter,         
  leaveTypeFilter,  
    numericKey,
    customerIdKey,
    sortOrder,
  ]);

  return {
    // states + setters
    effectiveSearch,
    setSearch,
    visibleKeys,
    toggleColumn,
    colMenuOpen,
    setColMenuOpen,
    menuSearch,
    setMenuSearch,
    setVisibleKeys,

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
    yearFilter,
setYearFilter,
leaveTypeFilter,
setLeaveTypeFilter,


    numericKey,
    customerIdKey,
    allKeys,
    // result
    processedData,
  };
};
