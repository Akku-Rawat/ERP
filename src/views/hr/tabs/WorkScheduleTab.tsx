import { useState } from "react";
import { Save, Check } from "lucide-react";

type WorkDay = {
  day: string;
  working: boolean;
  start: string;
  end: string;
  breakHours: number;
};

export default function WorkScheduleTab() {
  const [scheduleName, setScheduleName] = useState("Standard Work Week");
  const [workingDays, setWorkingDays] = useState<WorkDay[]>([
    { day: "Monday", working: true, start: "08:00", end: "17:00", breakHours: 1 },
    { day: "Tuesday", working: true, start: "08:00", end: "17:00", breakHours: 1 },
    { day: "Wednesday", working: true, start: "08:00", end: "17:00", breakHours: 1 },
    { day: "Thursday", working: true, start: "08:00", end: "17:00", breakHours: 1 },
    { day: "Friday", working: true, start: "08:00", end: "17:00", breakHours: 1 },
    { day: "Saturday", working: false, start: "", end: "", breakHours: 0 },
    { day: "Sunday", working: false, start: "", end: "", breakHours: 0 },
  ]);

  const handleSave = () => {
    alert("Work Schedule saved successfully!");
  };

  const toggleWorking = (index: number) => {
    const updated = [...workingDays];
    updated[index].working = !updated[index].working;
    setWorkingDays(updated);
  };

  const totalHours = workingDays.filter((d) => d.working).length * 8;
  const workingDaysCount = workingDays.filter((d) => d.working).length;

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Work Schedule</h2>
        <p className="text-sm text-gray-600 mt-1">Configure working hours and patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Name *</label>
              <input
                type="text"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                placeholder="e.g., Standard Work Week"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Effective From *</label>
                <input
                  type="date"
                  defaultValue="2025-01-01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Fixed</option>
                  <option>Rotating</option>
                  <option>Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Weekly Schedule Table */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Weekly Schedule</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Day</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Working?</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Start</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">End</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Break (hrs)</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {workingDays.map((day, idx) => (
                    <tr key={idx} className={day.working ? "" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-medium text-gray-900">{day.day}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={day.working}
                          onChange={() => toggleWorking(idx)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {day.working && (
                          <input
                            type="time"
                            value={day.start}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {day.working && (
                          <input
                            type="time"
                            value={day.end}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {day.working && (
                          <input
                            type="number"
                            value={day.breakHours}
                            min="0"
                            max="4"
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{day.working ? "8 hrs" : "0 hrs"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Week Summary:</span>
                <span className="font-semibold text-blue-900">
                  {totalHours} hours/week • {workingDaysCount} working days
                </span>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Additional Settings</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Half-Day Hours</label>
                <input
                  type="number"
                  defaultValue="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (min)</label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Rate (×)</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue="1.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekend Rate (×)</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue="2.0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Schedule
            </button>
          </div>
        </div>

        {/* Right - Preview */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">🕐 Schedule Preview</h3>

            <div className="bg-white rounded-lg p-4 text-sm space-y-3">
              <div className="space-y-2">
                {workingDays
                  .filter((d) => d.working)
                  .map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-gray-700">{day.day}</span>
                      <span className="font-medium text-gray-900">
                        {day.start} - {day.end}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Working Days:</span>
                  <span className="font-medium">{workingDaysCount} days/week</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-medium">{totalHours} hrs/week</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Daily Hours:</span>
                  <span className="font-medium">8 hrs/day</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-indigo-50 rounded border border-indigo-200">
              <p className="text-xs text-indigo-800">
                <strong>⚠️ Law:</strong> Max 48 hrs/week per Zambian Labour Act
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}