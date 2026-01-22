export const HolidayListForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  return (
    <div className="bg-card border border-theme rounded-2xl overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-theme">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-muted hover:text-main transition"
          >
            -
          </button>
          <div>
            <h2 className="text-xl font-bold text-main">New Holiday List</h2>
            <span className="text-xs font-medium text-orange-600">
              Not Saved
            </span>
          </div>
        </div>
        <button className="px-6 py-2 bg-primary rounded-xl font-semibold transition">
          Save
        </button>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Holiday List Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., India Holidays 2026"
              className="w-full px-4 py-3 rounded-xl border border-theme bg-app text-main placeholder:text-muted outline-none focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-main mb-2">
              Total Holidays
            </label>
            <input
              type="text"
              value="0"
              disabled
              className="w-full px-4 py-3 rounded-xl border border-theme bg-card text-main outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 pt-6 mt-6 border-t border-theme">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-theme rounded-xl font-medium text-muted hover:text-main transition"
          >
            Cancel
          </button>
          <button className="px-6 py-3 bg-primary rounded-xl font-semibold transition">
            Save Holiday List
          </button>
        </div>
      </div>
    </div>
  );
};
