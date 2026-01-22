import React, { useState } from "react";
import {
  FaCogs,
  FaPalette,
  FaGlobe,
  FaShieldAlt,
  FaBell,
  FaSave,
  FaUndo,
  FaCheckCircle,
} from "react-icons/fa";
import { ThemeSwitcher } from "../components/ThemeSwitcher"; 

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [showSuccess, setShowSuccess] = useState(false);

  // Form States
  const [taxRate, setTaxRate] = useState(10);
  const [currency, setCurrency] = useState("USD");
  const [invoicePrefix, setInvoicePrefix] = useState("INV");
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState("Cash");

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs = [
    { id: "general", name: "General Settings", icon: <FaGlobe /> },
    { id: "appearance", name: "Appearance", icon: <FaPalette /> },
    { id: "notifications", name: "Notifications", icon: <FaBell /> },
    { id: "security", name: "Security", icon: <FaShieldAlt /> },
  ];

  return (
    <div className="bg-app min-h-screen p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-main flex items-center gap-3 tracking-tight">
              <FaCogs className="text-primary" /> System Settings
            </h1>
            <p className="text-muted text-sm mt-1">
              Manage your ERP configuration and preferences
            </p>
          </div>

          {showSuccess && (
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 animate-bounce">
              <FaCheckCircle />
              <span className="text-sm font-bold">Settings Saved!</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* --- Left Sidebar Tabs --- */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                  : "text-muted hover:bg-card hover:text-main"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* --- Right Content Area --- */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-[2rem] shadow-sm border border-[var(--border)] overflow-hidden">
            {/* Tab Header */}
            <div className="px-8 py-6 border-b border-[var(--border)] bg-row-hover/30">
              <h3 className="text-xl font-bold text-main capitalize">
                {activeTab} Settings
              </h3>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* 1. General Tab */}
              {activeTab === "general" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full bg-app border border-[var(--border)] rounded-xl px-4 py-3 text-main focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">
                      Base Currency
                    </label>
                    <input
                      type="text"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-app border border-[var(--border)] rounded-xl px-4 py-3 text-main focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">
                      Invoice Prefix
                    </label>
                    <input
                      type="text"
                      value={invoicePrefix}
                      onChange={(e) => setInvoicePrefix(e.target.value)}
                      className="w-full bg-app border border-[var(--border)] rounded-xl px-4 py-3 text-main focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">
                      Default Payment Method
                    </label>
                    <select
                      value={defaultPaymentMethod}
                      onChange={(e) => setDefaultPaymentMethod(e.target.value)}
                      className="w-full bg-app border border-[var(--border)] rounded-xl px-4 py-3 text-main focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Online Payment">Online Payment</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 2. Appearance Tab (THEME SWITCHER HERE) */}
              {activeTab === "appearance" && (
                <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-app p-6 rounded-2xl border border-[var(--border)]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-main text-lg">
                          System Theme
                        </h4>
                        <p className="text-muted text-sm">
                          Choose how the ERP looks for you.
                        </p>
                      </div>
                      {/* Integrated Theme Switcher */}
                      <div className="scale-125 origin-right">
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Security/Others Tab (Placeholder) */}
              {(activeTab === "security" || activeTab === "notifications") && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
                  <div className="w-20 h-20 bg-row-hover rounded-full flex items-center justify-center text-3xl mb-4 text-muted">
                    {activeTab === "security" ? <FaShieldAlt /> : <FaBell />}
                  </div>
                  <h4 className="font-bold text-main">
                    Advanced {activeTab} control
                  </h4>
                  <p className="text-muted text-sm max-w-xs">
                    These modules will be available in the next system update.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 border-t border-[var(--border)] bg-row-hover/20 flex justify-end gap-3">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[var(--border)] text-muted font-bold hover:bg-card transition-all">
                <FaUndo className="text-xs" /> Reset
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary text-white font-bold hover:opacity-90 shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                <FaSave /> Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
