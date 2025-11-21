import React, { useMemo, useState } from 'react';
import type { JSX } from 'react';
import {
  FaBoxes, FaCheckCircle, FaTimes, FaSearch, FaExternalLinkAlt,
  FaChartLine, FaUsers, FaShoppingCart, FaHandshake, FaMoneyCheckAlt, FaUserTie, FaWarehouse,
  FaChevronDown, FaSortAmountDown, FaList, FaThLarge, FaSyncAlt, FaEraser, FaChevronRight, FaChevronLeft
} from 'react-icons/fa';

// ---------- Types ----------

type Tier = 'Free' | 'Pro' | 'Enterprise';

type ModuleItem = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  tier: Tier;
  users: number;
  icon?: JSX.Element;
};

// ---------- Sample Data ----------

const sampleModules: ModuleItem[] = [
  { id: 'sales', name: 'Sales Management', description: 'Lead pipeline, quotations, orders and sales analytics.', active: true, tier: 'Pro', users: 78, icon: <FaChartLine /> },
  { id: 'crm', name: 'CRM', description: 'Customer interactions, contacts and relationship tracking.', active: true, tier: 'Pro', users: 145, icon: <FaUsers /> },
  { id: 'procurement', name: 'Procurement', description: 'Purchase orders, approvals and supplier sourcing.', active: true, tier: 'Enterprise', users: 32, icon: <FaShoppingCart /> },
  { id: 'inventory', name: 'Inventory Management', description: 'Stock levels, warehousing and stock valuation.', active: true, tier: 'Enterprise', users: 54, icon: <FaWarehouse /> },
  { id: 'supplier', name: 'Supplier Management', description: 'Supplier records, performance and contracts.', active: false, tier: 'Free', users: 21, icon: <FaHandshake /> },
  { id: 'accounting', name: 'Accounting', description: 'Ledger, invoicing, payments and financial reports.', active: true, tier: 'Enterprise', users: 17, icon: <FaMoneyCheckAlt /> },
  { id: 'hr', name: 'HR', description: 'Employee lifecycle: onboarding, payroll, attendance and more.', active: true, tier: 'Pro', users: 210, icon: <FaUserTie /> },
];

// ---------- Helpers ----------

const tierBadge = (tier: Tier) => {
  if (tier === 'Enterprise') return 'bg-gray-900 text-white';
  if (tier === 'Pro') return 'bg-green-600 text-white';
  return 'bg-gray-100 text-gray-700';
};

// ---------- Component ----------

export default function SubscribedModules(): JSX.Element {
  const [query, setQuery] = useState('');
  const [modules, setModules] = useState<ModuleItem[]>(sampleModules);
  const [selectedTier, setSelectedTier] = useState<Tier | 'All'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'users' | 'tier'>('users');
  const [view, setView] = useState<'cards' | 'compact'>('cards');
  const [showAvailable, setShowAvailable] = useState(false); // toggles available modules panel

  // Derived lists
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return modules.filter(m => {
      if (selectedTier !== 'All' && m.tier !== selectedTier) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tier.toLowerCase().includes(q)
      );
    });
  }, [modules, query, selectedTier]);

  const subscribedModules = useMemo(() => filtered.filter(m => m.active), [filtered]);
  const nonSubscribedModules = useMemo(() => filtered.filter(m => !m.active), [filtered]);

  // Sorting
  const sortModules = (list: ModuleItem[]) => {
    const copy = [...list];
    if (sortBy === 'users') return copy.sort((a, b) => b.users - a.users);
    if (sortBy === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name));
    // tier ordering: Enterprise > Pro > Free
    if (sortBy === 'tier') return copy.sort((a, b) => {
      const order = { Enterprise: 0, Pro: 1, Free: 2 } as any;
      return order[a.tier] - order[b.tier];
    });
    return copy;
  };

  function toggleActive(id: string) {
    setModules(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  }

  function resetFilters() {
    setQuery('');
    setSelectedTier('All');
    setSortBy('users');
  }

  const lastSynced = new Date().toLocaleString();

  // ---------- Render helpers ----------

  function ModuleCard({ m }: { m: ModuleItem }) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50">
              <div className="text-green-600 text-lg">{m.icon ?? <FaBoxes />}</div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-md font-semibold truncate">{m.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${tierBadge(m.tier)}`}>
                  {m.tier}
                </span>
                {m.active ? <FaCheckCircle className="text-green-600" /> : <FaTimes className="text-gray-400" />}
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-2 truncate">{m.description}</p>

            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1"> 
                  <span className="font-medium">Users:</span>
                  <span className="text-gray-500">{m.users}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {m.active ? (
                  <button
                    onClick={() => toggleActive(m.id)}
                    className="text-sm font-medium px-3 py-1 rounded-lg transition bg-white border border-green-200 text-green-700"
                    title="Disable module"
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => toggleActive(m.id)}
                    className="text-sm font-medium px-3 py-1 rounded-lg transition bg-green-600 text-white"
                    title="Enable module"
                  >
                    Enable
                  </button>
                )}

                <button className="text-sm px-2 py-1 rounded-lg bg-gray-50 border border-gray-100 text-gray-600 flex items-center gap-1" title="Open module settings">
                  <FaExternalLinkAlt className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function CompactRow({ m }: { m: ModuleItem }) {
    return (
      <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50">
            <div className="text-green-600">{m.icon ?? <FaBoxes />}</div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium truncate">{m.name}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${tierBadge(m.tier)}`}>{m.tier}</span>
            </div>
            <div className="text-xs text-gray-500 truncate">{m.description}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-600">{m.users}</div>
          <button onClick={() => toggleActive(m.id)} className={`text-sm px-2 py-1 rounded ${m.active ? 'bg-white border border-green-200 text-green-700' : 'bg-green-600 text-white'}`}>
            {m.active ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    );
  }

  // ---------- JSX ----------

  return (
    <div className="bg-gray-50 p-6 rounded-lg">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2 shadow-sm w-full md:w-72">
            <FaSearch />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search modules, tiers, descriptions..."
              className="outline-none text-sm w-full"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600" title="Clear">
                <FaEraser />
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => setView(v => v === 'cards' ? 'compact' : 'cards')} className="px-3 py-2 rounded-lg bg-white border border-gray-200">
              {view === 'cards' ? <FaList /> : <FaThLarge />}
            </button>

            <div className="relative inline-block">
              <button className="px-3 py-2 rounded-lg bg-white border border-gray-200 flex items-center gap-2">
                <FaSortAmountDown />
                <span className="text-sm">Sort</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="text-sm text-gray-600 mr-2 hidden md:block">
            <span className="font-medium">Total:</span> {modules.length} • <span className="font-medium">Subscribed:</span> {modules.filter(m => m.active).length} • <span className="font-medium">Available:</span> {modules.filter(m => !m.active).length}
          </div>

          <div className="flex items-center gap-2">
            <select value={selectedTier} onChange={e => setSelectedTier(e.target.value as any)} className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white">
              <option value="All">All tiers</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Free">Free</option>
            </select>

            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white">
              <option value="users">Most used</option>
              <option value="name">Name</option>
              <option value="tier">Tier</option>
            </select>

            <button onClick={() => setModules(sampleModules)} className="px-3 py-2 rounded-lg bg-white border border-gray-200 flex items-center gap-2">
              <FaSyncAlt />
              Restore
            </button>

            <button onClick={resetFilters} className="px-3 py-2 rounded-lg bg-white border border-gray-200">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: left = subscribed, right = trigger + collapsible available */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Subscribed Modules (left) */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-600" />
            Subscribed Modules ({subscribedModules.length})
          </h2>

          <div className="space-y-4">
            {sortModules(subscribedModules).map(m => (
              view === 'cards' ? <ModuleCard key={m.id} m={m} /> : <CompactRow key={m.id} m={m} />
            ))}

            {subscribedModules.length === 0 && (
              <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center">
                <p className="text-lg font-semibold text-gray-700 mb-2">No subscribed modules</p>
                <p className="text-sm text-gray-500">Enable modules from the available list.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: trigger button + collapsible available modules */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaTimes className="text-gray-500" />
              Available
            </h2>

            {/* Trigger button that toggles the available modules panel */}
            <button
              onClick={() => setShowAvailable(s => !s)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm"
              aria-expanded={showAvailable}
              aria-controls="available-panel"
            >
              <span className="text-sm font-medium">{showAvailable ? 'Hide' : 'Show'} available modules</span>
              <span className="text-xs text-gray-500">({nonSubscribedModules.length})</span>
              <span className={`transition-transform ${showAvailable ? 'rotate-180' : ''}`}>
                <FaChevronDown />
              </span>
            </button>
          </div>

          {/* Collapsible panel */}
          <div
            id="available-panel"
            className={`overflow-hidden transition-all duration-300 ${showAvailable ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="space-y-4">
              {sortModules(nonSubscribedModules).map(m => (
                view === 'cards' ? <ModuleCard key={m.id} m={m} /> : <CompactRow key={m.id} m={m} />
              ))}

              {nonSubscribedModules.length === 0 && (
                <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center">
                  <p className="text-lg font-semibold text-gray-700 mb-2">All modules are subscribed!</p>
                  <p className="text-sm text-gray-500">Visit the <span className="font-medium">Marketplace</span> to discover more.</p>
                </div>
              )}
            </div>
          </div>

          {/* When collapsed, show a small hint card with count so user knows it's available */}
          {!showAvailable && (
            <div className="mt-3 bg-white rounded-lg p-3 border border-gray-100 text-sm text-gray-600 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{nonSubscribedModules.length} available</div>
                  <div className="text-xs text-gray-500">Click the button to view and enable modules.</div>
                </div>
                <div>
                  <FaChevronRight className="text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center mt-6">
          <p className="text-lg font-semibold text-gray-700 mb-2">No modules match your search</p>
          <p className="text-sm text-gray-500">Try clearing the search or browse the Marketplace.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium">Browse Marketplace</button>
            <button onClick={() => setQuery('')} className="px-4 py-2 rounded-lg bg-white border border-gray-200">Reset</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 text-sm text-gray-600 flex items-center gap-2 justify-between">
        <div className="text-xs text-gray-500">
          Last synced: <span className="font-medium text-gray-700">{lastSynced}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm px-3 py-1 rounded-lg bg-white border border-gray-200 flex items-center gap-2">
            <FaSyncAlt />
            Sync now
          </button>
          <div className="text-xs text-gray-400">UI v2</div>
        </div>
      </div>
    </div>
  );
}
