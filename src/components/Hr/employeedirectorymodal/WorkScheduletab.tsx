// WorkScheduleTab.tsx - UPDATED TO USE HR SETTINGS
import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";

type WorkScheduleTabProps = {
  formData: any;
  handleInputChange: (field: string, value: string | boolean | any) => void;
};

// Mock data - Replace with API call
const WORK_SCHEDULES = [
  {
    id: "standard",
    name: "Standard Work Week",
    pattern: {
      monday: "Office",
      tuesday: "Office",
      wednesday: "Office",
      thursday: "Office",
      friday: "Office",
      saturday: "Off",
      sunday: "Off"
    },
    hours: "40 hrs/week",
    days: "Mon-Fri"
  },
  {
    id: "hybrid",
    name: "Hybrid Schedule",
    pattern: {
      monday: "Office",
      tuesday: "Office",
      wednesday: "Remote",
      thursday: "Office",
      friday: "Remote",
      saturday: "Off",
      sunday: "Off"
    },
    hours: "40 hrs/week",
    days: "3 Office, 2 Remote"
  },
  {
    id: "shift",
    name: "Shift Pattern A",
    pattern: {
      monday: "Office",
      tuesday: "Office",
      wednesday: "Office",
      thursday: "Office",
      friday: "Office",
      saturday: "Office",
      sunday: "Off"
    },
    hours: "48 hrs/week",
    days: "Mon-Sat"
  }
];

export const WorkScheduleTab: React.FC<WorkScheduleTabProps> = ({
  formData,
  handleInputChange,
}) => {
  const [selectedSchedule, setSelectedSchedule] = useState(formData.workSchedule || "");
  const [scheduleDetails, setScheduleDetails] = useState<any>(null);

  useEffect(() => {
    if (!selectedSchedule) {
      setScheduleDetails(null);
      return;
    }

    const schedule = WORK_SCHEDULES.find(s => s.id === selectedSchedule);
    if (schedule) {
      setScheduleDetails(schedule);
      
handleInputChange("workSchedule", selectedSchedule);

      handleInputChange("workScheduleDetails", schedule);
    }
  }, [selectedSchedule]);

  const getWorkDaysCount = () => {
    if (!scheduleDetails) return 0;
    return Object.values(scheduleDetails.pattern).filter(
      (v: any) => v === "Office" || v === "Remote"
    ).length;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Work Schedule
            </h4>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-2 font-medium">
              Select Work Schedule *
            </label>
            <select
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Choose work schedule...</option>
              {WORK_SCHEDULES.map(schedule => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.name} - {schedule.days}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              ⚙️ Managed in HR Settings → Work Schedule
            </p>
          </div>

          {/* Schedule Preview */}
          {scheduleDetails && (
            <div className="border-t pt-4 mt-4">
              <p className="text-xs font-semibold text-gray-700 mb-3">Weekly Pattern:</p>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {[
                  { day: "monday", label: "Mon" },
                  { day: "tuesday", label: "Tue" },
                  { day: "wednesday", label: "Wed" },
                  { day: "thursday", label: "Thu" },
                  { day: "friday", label: "Fri" },
                  { day: "saturday", label: "Sat" },
                  { day: "sunday", label: "Sun" }
                ].map(({ day, label }) => {
                  const value = scheduleDetails.pattern[day];
                  return (
                    <div key={day} className="text-center">
                      <div className="text-xs font-semibold text-gray-700 mb-1">{label}</div>
                      <div
                        className={`px-2 py-3 rounded-lg text-xs font-medium ${
                          value === "Office"
                            ? "bg-purple-100 text-purple-700 border border-purple-300"
                            : value === "Remote"
                              ? "bg-blue-100 text-blue-700 border border-blue-300"
                              : "bg-gray-100 text-gray-500 border border-gray-300"
                        }`}
                      >
                        {value === "Office" ? "🏢" : value === "Remote" ? "🏠" : "🚫"}
                        <div className="mt-1">{value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-gray-600 mb-1">Working Days</p>
                    <p className="text-lg font-bold text-gray-900">{getWorkDaysCount()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Weekly Hours</p>
                    <p className="text-lg font-bold text-gray-900">{scheduleDetails.hours}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Pattern</p>
                    <p className="text-sm font-semibold text-gray-900">{scheduleDetails.days}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Message */}
          {!selectedSchedule && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 Select a work schedule to apply it to this employee
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};