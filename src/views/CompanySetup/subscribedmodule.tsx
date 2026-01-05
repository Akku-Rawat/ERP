
import React, { useMemo, useState } from "react";
import type { JSX } from "react";
import {
  FaBoxes,
  FaCheckCircle,
  FaSearch,
  FaChartLine,
  FaUsers,
  FaShoppingCart,
  FaHandshake,
  FaMoneyCheckAlt,
  FaUserTie,
  FaWarehouse,
  FaStar,
  FaCrown,
  FaRocket,
  FaInfoCircle,
  FaCog,
} from "react-icons/fa";

// Import your reusable Table component
import Table from "../../components/ui/Table/Table";
import type { Column } from "../ui/Table/type"; // Adjust path

// ---------- Types ----------
type Tier = "Free" | "Pro" | "Enterprise";

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
  {
    id: "sales",
    name: "Sales Management",
    description: "Lead pipeline, quotations, orders and sales analytics.",
    active: true,
    tier: "Pro",
    users: 78,
    icon: <FaChartLine />,
  },
  {
    id: "crm",
    name: "CRM",
    description: "Customer interactions, contacts and relationship tracking.",
    active: true,
    tier: "Pro",
    users: 145,
    icon: <FaUsers />,
  },
  {
    id: "procurement",
    name: "Procurement",
    description: "Purchase orders, approvals and supplier sourcing.",
    active: true,
    tier: "Enterprise",
    users: 32,
    icon: <FaShoppingCart />,
  },
  {
    id: "inventory",
    name: "Inventory Management",
    description: "Stock levels, warehousing and stock valuation.",
    active: true,
    tier: "Enterprise",
    users: 54,
    icon: <FaWarehouse />,
  },
  {
    id: "supplier",
    name: "Supplier Management",
    description: "Supplier records, performance and contracts.",
    active: false,
    tier: "Free",
    users: 21,
    icon: <FaHandshake />,
  },
  {
    id: "accounting",
    name: "Accounting",
    description: "Ledger, invoicing, payments and financial reports.",
    active: true,
    tier: "Enterprise",
    users: 17,
    icon: <FaMoneyCheckAlt />,
  },
  {
    id: "hr",
    name: "HR",
    description:
      "Employee lifecycle: onboarding, payroll, attendance and more.",
    active: true,
    tier: "Pro",
    users: 210,
    icon: <FaUserTie />,
  },
];

const tierStyle = (tier: Tier) => {
  return {
    background: "var(--row-hover)",
    color: "var(--primary-700)",
    padding: "0.25rem 0.625rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    fontWeight: 600 as const,
  };
};

// ---------- Component ----------
export default function SubscribedModules(): JSX.Element {
  const [query, setQuery] = useState("");
  const [modules, setModules] = useState<ModuleItem[]>(sampleModules);
  const [selectedTier, setSelectedTier] = useState<Tier | "All">("All");
  const [sortBy, setSortBy] = useState<"name" | "users" | "tier">("name");

  // Filtering Logic
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return modules.filter((m) => {
      if (selectedTier !== "All" && m.tier !== selectedTier) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    });
  }, [modules, query, selectedTier]);

  // Sorting Logic
  const sortedModules = useMemo(() => {
    const copy = [...filtered];
    if (sortBy === "users") return copy.sort((a, b) => b.users - a.users);
    if (sortBy === "name")
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "tier") {
      const order = { Enterprise: 0, Pro: 1, Free: 2 } as any;
      return copy.sort((a, b) => order[a.tier] - order[b.tier]);
    }
    return copy;
  }, [filtered, sortBy]);

  function toggleActive(id: string) {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
  }

  // --- Table Column Definitions ---
  const columns: Column<ModuleItem>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Module",
        align: "left",
        render: (m) => (
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: m.active ? "rgba(13,148,136,0.08)" : "var(--bg)", // light hint or bg
                color: m.active ? "var(--primary)" : "var(--muted)",
              }}
            >
              {m.icon ?? <FaBoxes />}
            </div>
            <div className="font-medium text-main text-sm">{m.name}</div>
          </div>
        ),
      },
      {
        key: "description",
        header: "Description",
        align: "left",
        render: (m) => (
          <div className="text-sm text-muted max-w-xs truncate" title={m.description}>
            {m.description}
          </div>
        ),
      },
      {
        key: "tier",
        header: "Tier",
        align: "left",
        render: (m) => (
          <div style={tierStyle(m.tier)}>
            {m.tier === "Enterprise" ? (
              <FaCrown className="w-3 h-3" />
            ) : m.tier === "Pro" ? (
              <FaRocket className="w-3 h-3" />
            ) : (
              <FaStar className="w-3 h-3" />
            )}
            <span style={{ marginLeft: 6 }}>{m.tier}</span>
          </div>
        ),
      },
      {
        key: "users",
        header: "Users",
        align: "left",
        render: (m) => (
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <FaUsers className="w-3.5 h-3.5" style={{ color: "var(--muted)" }} />
            {m.users}
          </div>
        ),
      },
      {
        key: "active",
        header: "Status",
        align: "left",
        render: (m) =>
          m.active ? (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: "rgba(13,148,136,0.08)",
                color: "var(--primary)",
              }}
            >
              <FaCheckCircle className="w-3 h-3" />
              Active
            </div>
          ) : (
            <div className="inline-flex items-center text-muted text-xs font-medium bg-row-hover px-2.5 py-1 rounded-full">
              Inactive
            </div>
          ),
      },
      {
        key: "id", // using 'id' as key for actions
        header: "Actions",
        align: "right",
        render: (m) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleActive(m.id);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                m.active
                  ? {
                      background: "var(--card)",
                      border: "1px solid var(--danger)",
                      color: "var(--danger)",
                    }
                  : {
                      background: "var(--primary)",
                      color: "#fff",
                    }
              }
            >
              {m.active ? "Disable" : "Enable"}
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg text-muted hover:text-main hover:bg-row-hover transition-all"
              title="Settings"
            >
              <FaCog className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="bg-app">
      <div className="w-full">
        {/* Stats & Controls (Keeping your custom filters) */}
        <div
          className="rounded-lg shadow-sm border border-[var(--border)] p-4 mb-0.3"
          style={{
            background: "var(--card)",
            color: "var(--table-head-text)",
          }}
        >
          <div className="w-full">
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-5xl mx-auto">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <FaSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  style={{ width: 16, height: 16 }}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search modules..."
                  className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-lg 
             text-sm bg-card shadow-sm text-main
             focus:ring-2 focus:ring-[var(--primary)]
             focus:border-[var(--primary-600)] transition-all placeholder:text-muted"
                />
              </div>

              {/* Tier Dropdown */}
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as any)}
                className="px-4 py-2.5 border border-[var(--border)] rounded-lg bg-card text-sm 
                 shadow-sm text-muted focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
              >
                <option value="All">All Tiers</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Pro">Pro</option>
                <option value="Free">Free</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 border border-[var(--border)] rounded-lg bg-card text-sm 
                 shadow-sm text-muted focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
              >
                <option value="name">Name (A-Z)</option>
                <option value="users">Most Used</option>
                <option value="tier">By Tier</option>
              </select>
            </div>
          </div>
        </div>

        {/* REUSABLE TABLE IMPLEMENTATION */}
        {sortedModules.length > 0 ? (
          <Table
            columns={columns}
            data={sortedModules}
            showToolbar={false} // We are using the custom toolbar above
            loading={false}
            currentPage={1}
            totalPages={1}
            // Add pagination functionality here if needed in future
          />
        ) : (
          <div className="bg-card rounded-lg shadow-sm border border-[var(--border)] p-12 text-center">
            <FaInfoCircle className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-muted">No modules found matching your filters</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-muted">
          Last synced: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}