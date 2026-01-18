import React, { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";

import "react-day-picker/dist/style.css";

/* ---------- Local UI Types ---------- */
type LeaveStatus = "approved" | "pending" | "rejected";

interface CalendarLeave {
  start: Date;
  end: Date;
  status: LeaveStatus;
}

interface AdvancedCalendarProps {
  leaves: CalendarLeave[];
  onRangeSelect: (range: DateRange | undefined) => void;
}

/* ---------- Helpers ---------- */
const expandDateRange = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

/* ---------- Component ---------- */
const AdvancedCalendar: React.FC<AdvancedCalendarProps> = ({
  leaves,
  onRangeSelect,
}) => {
  const [selectedRange, setSelectedRange] =
    useState<DateRange | undefined>();

  /* Build modifiers (logic only, no color here) */
  const modifiers = useMemo(() => {
    const result: Record<LeaveStatus, Date[]> = {
      approved: [],
      pending: [],
      rejected: [],
    };

    leaves.forEach((leave) => {
      if (!leave.start || !leave.end) return;

      const days = expandDateRange(
        new Date(leave.start),
        new Date(leave.end)
      );

      result[leave.status].push(...days);
    });

    return result;
  }, [leaves]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const handleSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    onRangeSelect(range);
  };

  return (
    <DayPicker
      mode="range"
      fixedWeeks
      selected={selectedRange}
      onSelect={handleSelect}
      modifiers={modifiers}
      disabled={{ before: today }}

      /* ---------- THEME SAFE STYLES ---------- */
      modifiersClassNames={{
        approved: "bg-card",
        pending: "bg-card",
        rejected: "bg-card",
      }}
      classNames={{
        months: "flex justify-center",
        caption: "font-semibold text-main",
        table: "w-full",
        head_cell: "text-muted text-xs font-semibold",
        cell:
          "h-10 w-10 text-center rounded-md text-main border border-transparent row-hover",
        day_today: "border border-theme",
        day_selected: "bg-primary text-white",
        day_range_middle: "bg-card",
      }}
    />
  );
};

export default AdvancedCalendar;
