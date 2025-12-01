import React, { useState } from 'react';
import type { JSX } from 'react';
import {
  FaBoxes, FaCheckCircle, FaTimes, FaSearch, FaExternalLinkAlt,
  FaChartLine, FaUsers, FaShoppingCart, FaHandshake, FaMoneyCheckAlt, FaUserTie, FaWarehouse
} from 'react-icons/fa';


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
  const [modules, setModules] = useState<ModuleItem[]>(sampleModules);


  const filtered = modules.filter(m => {
    if (!query) return true;
    const q = query.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.tier.toLowerCase().includes(q);
  });

  const subscribedModules = filtered.filter(m => m.active);
  const nonSubscribedModules = filtered.filter(m => !m.active);


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
        </div>
        
        <div className="text-sm text-gray-600">
          <span className="font-medium">Total:</span> {modules.length} modules • <span className="font-medium">Subscribed:</span> {modules.filter(m => m.active).length} • <span className="font-medium">Available:</span> {modules.filter(m => !m.active).length}
        </div>
      </div>


      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subscribed Modules */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-teal-600" />
            Subscribed Modules ({subscribedModules.length})
          </h2>
          <div className="space-y-4">
            {subscribedModules.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-teal-100">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50">
                      <div className="text-teal-600">{m.icon ?? <FaBoxes />}</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-md font-semibold">{m.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${m.tier === 'Enterprise' ? 'bg-gray-900 text-white' : m.tier === 'Pro' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                          {m.tier}
                        </span>
                        <span className="text-xs flex items-center gap-1 text-teal-700">
                          <FaCheckCircle />
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
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(m.id)}
                          className="text-sm font-medium px-3 py-1 rounded-lg transition bg-white border border-teal-200 text-teal-700"
                          title="Disable module"
                        >
                          Disable
                        </button>

                        <button className="text-sm px-2 py-1 rounded-lg bg-gray-50 border border-gray-100 text-gray-600 flex items-center gap-1" title="Open module settings">
                          <FaExternalLinkAlt className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {subscribedModules.length === 0 && (
              <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center">
                <p className="text-lg font-semibold text-gray-700 mb-2">No subscribed modules</p>
                <p className="text-sm text-gray-500">Enable modules from the available list.</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Modules (Non-Subscribed) */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTimes className="text-gray-500" />
            Available Modules ({nonSubscribedModules.length})
          </h2>
          <div className="space-y-4">
            {nonSubscribedModules.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100">
                      <div className="text-gray-500">{m.icon ?? <FaBoxes />}</div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-md font-semibold">{m.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${m.tier === 'Enterprise' ? 'bg-gray-900 text-white' : m.tier === 'Pro' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                          {m.tier}
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
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(m.id)}
                          className="text-sm font-medium px-3 py-1 rounded-lg transition bg-teal-600 text-white"
                          title="Enable module"
                        >
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {nonSubscribedModules.length === 0 && (
              <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center">
                <p className="text-lg font-semibold text-gray-700 mb-2">All modules are subscribed!</p>
                <p className="text-sm text-gray-500">Visit the <span className="font-medium">Marketplace</span> to discover more.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center mt-6">
          <p className="text-lg font-semibold text-gray-700 mb-2">No modules match your search</p>
          <p className="text-sm text-gray-500">Try clearing the search or browse the Marketplace.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium">Browse Marketplace</button>
            <button onClick={() => setQuery('')} className="px-4 py-2 rounded-lg bg-white border border-gray-200">Reset</button>
          </div>
        </div>
      )}


      {/* Footer */}
     <div className="mt-6 text-sm text-gray-600 flex items-center gap-2">
 
  <div className="text-xs text-gray-500">
    Last synced: <span className="font-medium text-gray-700">Oct 25, 2025</span>
  </div>
   <button className="text-sm px-3 py-1 rounded-lg bg-white border border-gray-200">
    Sync now
  </button>
</div>

    </div>
  );
}