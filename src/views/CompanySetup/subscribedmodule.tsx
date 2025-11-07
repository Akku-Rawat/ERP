import React, { useState } from 'react';
import type { JSX } from 'react';
import {
  FaBoxes, FaCheckCircle, FaTimes, FaSearch, FaFilter, FaExternalLinkAlt,
  FaChartLine, FaUsers, FaShoppingCart, FaHandshake, FaMoneyCheckAlt, FaUserTie, FaWarehouse
} from 'react-icons/fa';

// Professional "Subscribed Modules" screen to match the HR theme (TailwindCSS)
// Updated to include company-wide ERP modules provided by the user.

type ModuleItem = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  tier: 'Free' | 'Pro' | 'Enterprise';
  users: number;
  icon?: JSX.Element;
};

const sampleModules: ModuleItem[] = [
  { id: 'sales', name: 'Sales Management', description: 'Lead pipeline, quotations, orders and sales analytics.', active: true, tier: 'Pro', users: 78, icon: <FaChartLine /> },
  { id: 'crm', name: 'CRM', description: 'Customer interactions, contacts and relationship tracking.', active: true, tier: 'Pro', users: 145, icon: <FaUsers /> },
  { id: 'procurement', name: 'Procurement', description: 'Purchase orders, approvals and supplier sourcing.', active: true, tier: 'Enterprise', users: 32, icon: <FaShoppingCart /> },
  { id: 'inventory', name: 'Inventory Management', description: 'Stock levels, warehousing and stock valuation.', active: true, tier: 'Enterprise', users: 54, icon: <FaWarehouse /> },
  { id: 'supplier', name: 'Supplier Management', description: 'Supplier records, performance and contracts.', active: false, tier: 'Free', users: 21, icon: <FaHandshake /> },
  { id: 'accounting', name: 'Accounting', description: 'Ledger, invoicing, payments and financial reports.', active: true, tier: 'Enterprise', users: 17, icon: <FaMoneyCheckAlt /> },
  { id: 'hr', name: 'HR', description: 'Employee lifecycle: onboarding, payroll, attendance and more.', active: true, tier: 'Pro', users: 210, icon: <FaUserTie /> },
];

export default function SubscribedModules(): JSX.Element {
  const [query, setQuery] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [modules, setModules] = useState<ModuleItem[]>(sampleModules);

  const filtered = modules.filter(m => {
    if (showOnlyActive && !m.active) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.tier.toLowerCase().includes(q);
  });

  function toggleActive(id: string) {
    setModules(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
       
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2 shadow-sm">
            <FaSearch />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search modules, tiers, descriptions..."
              className="outline-none text-sm w-56"
            />
          </div>

          <button
            onClick={() => setShowOnlyActive(s => !s)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-shadow shadow-sm ${showOnlyActive ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-white text-gray-600 border border-gray-200'}`}
            title="Toggle to show only active modules"
          >
            <FaFilter />
            {showOnlyActive ? 'Active only' : 'Filter'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(m => (
          <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.active ? 'bg-teal-50' : 'bg-gray-100'}`}>
                  <div className={`${m.active ? 'text-teal-600' : 'text-gray-500'}`}>{m.icon ?? <FaBoxes />}</div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-md font-semibold">{m.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${m.tier === 'Enterprise' ? 'bg-gray-900 text-white' : m.tier === 'Pro' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      {m.tier}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${m.active ? 'text-teal-700' : 'text-gray-500'}`}>
                      {m.active ? <FaCheckCircle /> : <FaTimes />} {m.active ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-2">{m.description}</p>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1"> 
                      <span className="font-medium">Users:</span>
                      <span className="text-gray-500">{m.users}</span>
                    </div>

                    <div className="hidden md:flex items-center gap-1"> 
                      <span className="font-medium">Module ID:</span>
                      <span className="text-gray-400">{m.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(m.id)}
                      className={`text-sm font-medium px-3 py-1 rounded-lg transition ${m.active ? 'bg-white border border-teal-200 text-teal-700' : 'bg-teal-600 text-white'}`}
                      title={m.active ? 'Disable module' : 'Enable module'}
                    >
                      {m.active ? 'Disable' : 'Enable'}
                    </button>

                    <button className="text-sm px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-gray-600 flex items-center gap-2" title="Open module settings">
                      Settings
                      <FaExternalLinkAlt className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center">
            <p className="text-lg font-semibold text-gray-700 mb-2">No modules match your search</p>
            <p className="text-sm text-gray-500">Try clearing filters or check back later. You can also visit the <span className="font-medium">Marketplace</span> to add modules.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium">Browse Marketplace</button>
              <button onClick={() => { setQuery(''); setShowOnlyActive(false); }} className="px-4 py-2 rounded-lg bg-white border border-gray-200">Reset</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer summary */}
      <div className="mt-6 text-sm text-gray-600 flex items-center justify-between">
        <div>
          <span className="font-medium">Total:</span> {modules.length} modules • <span className="font-medium">Showing:</span> {filtered.length}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-500">Last synced: <span className="font-medium text-gray-700">Oct 25, 2025</span></div>
          <button className="text-sm px-3 py-1 rounded-lg bg-white border border-gray-200">Sync now</button>
        </div>
      </div>
    </div>
  );
}
