type Props = {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
};

export default function SettingsSidebar({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">HR Settings</h2>
        <p className="text-xs text-gray-500 mt-1">Company Configuration</p>
      </div>

      <nav className="p-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors mb-1 ${
              activeTab === tab
                ? "bg-purple-50 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
