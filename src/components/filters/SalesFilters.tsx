import React from "react";

type SalesFilterProps = {
  status: string;
  setStatus: (v: string) => void;
  fromDate: string;
  setFromDate: (v: string) => void;
  toDate: string;
  setToDate: (v: string) => void;
};

const SalesFilter: React.FC<SalesFilterProps> = ({
  status,
  setStatus,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) => {
  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 border rounded"
      >
        <option value="">All Status</option>
        <option value="Export">Export</option>
        <option value="Non-Export">Non-Export</option>
        {/* <option value="Cancelled">Cancelled</option> */}
      </select>

      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="px-3 py-2 border rounded"
      />

      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="px-3 py-2 border rounded"
      />
    </div>
  );
};

export default SalesFilter;
