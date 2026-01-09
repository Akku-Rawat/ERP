// WorkScheduleTab.tsx - FIXED VERSION
import React from "react";
import { Clock, Calendar } from "lucide-react";

type WorkScheduleTabProps = {
  formData: any;
  handleInputChange: (field: string, value: string | boolean | any) => void;
};

const DAYS = [
  { key: "Monday", label: "Monday", field: "weeklyScheduleMonday" },
  { key: "Tuesday", label: "Tuesday", field: "weeklyScheduleTuesday" },
  { key: "Wednesday", label: "Wednesday", field: "weeklyScheduleWednesday" },
  { key: "Thursday", label: "Thursday", field: "weeklyScheduleThursday" },
  { key: "Friday", label: "Friday", field: "weeklyScheduleFriday" },
  { key: "Saturday", label: "Saturday", field: "weeklyScheduleSaturday" },
  { key: "Sunday", label: "Sunday", field: "weeklyScheduleSunday" },
];

const TIME_SLOTS = [
  "Off",
  "08:00-17:00",
  "09:00-18:00",
  "07:00-16:00",
  "10:00-19:00",
  "Custom"
];

export const WorkScheduleTab: React.FC<WorkScheduleTabProps> = ({
  formData,
  handleInputChange,
}) => {
  const handleQuickFill = (template: string) => {
    const schedules: Record<string, string> = {};
    
    if (template === "standard") {
      DAYS.slice(0, 5).forEach(day => {
        schedules[day.field] = "08:00-17:00";
      });
      schedules["weeklyScheduleSaturday"] = "Off";
      schedules["weeklyScheduleSunday"] = "Off";
    } else if (template === "shift") {
      DAYS.forEach(day => {
        schedules[day.field] = "09:00-18:00";
      });
    }
    
    Object.entries(schedules).forEach(([field, value]) => {
      handleInputChange(field, value);
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Weekly Work Schedule
          </h4>
          <Clock className="w-4 h-4 text-gray-400" />
        </div>

        {/* Quick Fill Templates */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill("standard")}
            className="px-3 py-1.5 text-xs bg-purple-50 text-purple-600 rounded border border-purple-200 hover:bg-purple-100"
          >
            📅 Standard (Mon-Fri: 8am-5pm)
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("shift")}
            className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100"
          >
            🔄 Shift Work (9am-6pm)
          </button>
        </div>

        {/* Day Schedule Inputs */}
        <div className="space-y-3">
          {DAYS.map(day => (
            <div key={day.key} className="grid grid-cols-3 gap-3 items-center">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {day.label}
              </label>
              <select
                value={formData[day.field] || ""}
                onChange={(e) => handleInputChange(day.field, e.target.value)}
                className="col-span-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select schedule...</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              
              {/* Show custom input if Custom selected */}
              {formData[day.field] === "Custom" && (
                <input
                  type="text"
                  placeholder="e.g., 10:00-14:00"
                  value={formData[`${day.field}Custom`] || ""}
                  onChange={(e) => handleInputChange(`${day.field}Custom`, e.target.value)}
                  className="col-span-2 col-start-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">📊 Weekly Summary:</p>
          <div className="text-xs text-gray-600">
            {DAYS.map(day => {
              const schedule = formData[day.field];
              if (!schedule) return null;
              return (
                <div key={day.key} className="flex justify-between py-1">
                  <span>{day.label}:</span>
                  <span className={schedule === "Off" ? "text-red-600" : "text-green-600 font-medium"}>
                    {schedule}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};