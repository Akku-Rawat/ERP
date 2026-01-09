import { Save } from "lucide-react";

export default function GeneralSettingsTab() {
  const handleSave = () => {
    alert("General Settings saved successfully!");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          General Settings
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Company-wide HR configurations
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Currency *
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="ZMW">ZMW - Zambian Kwacha</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              ⚠️ Cannot change after first payroll
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payroll Cycle *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cycle"
                  value="monthly"
                  defaultChecked
                  className="mr-2"
                />
                <span className="text-sm">Monthly</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cycle"
                  value="biweekly"
                  className="mr-2"
                />
                <span className="text-sm">Bi-weekly</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payroll Cut-off Day *
            </label>
            <input
              type="number"
              min="1"
              max="28"
              defaultValue="25"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Day of month (1-28)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Hours per Day *
            </label>
            <input
              type="number"
              min="1"
              max="12"
              defaultValue="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Probation Period (months) *
            </label>
            <input
              type="number"
              min="0"
              max="12"
              defaultValue="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notice Period (days) *
            </label>
            <input
              type="number"
              min="0"
              max="90"
              defaultValue="30"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Statutory Compliance */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Statutory Compliance (Zambia)
          </h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">
                NAPSA (Social Security)
              </span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">
                NHIMA (Health Insurance)
              </span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-3" />
              <span className="text-sm text-gray-700">PAYE (Income Tax)</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
