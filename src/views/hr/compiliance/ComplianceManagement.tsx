import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  FileText,
  Clipboard,
  Users,
  AlertTriangle,
  Layers,
  Clock,
} from "lucide-react";
import OverviewCards from "./OverviewCards";
import StatutoryPanel from "./StatutoryPanel";
import PolicyPanel from "./PolicyPanel";
import DocumentPanel from "./DocumentPanel";
import TrainingPanel from "./TrainingPanel";
import AuditPanel from "./AuditPanel";
import WorkflowPanel from "./WorkflowPanel";
import VendorPanel from "./VendorPanel";
import MonitoringPanel from "./MonitoringPanel";

/**
 * Improvements in this version:
 * - Accent color changed to teal-like classes consistent with your app's nav (`text-teal-600` etc).
 * - Added breadcrumb-like small header line to match your top bar.
 * - Main monitoring panel promoted to full width at top for immediate visibility.
 * - Side nav compacted, sticky feel, clearer selected state.
 * - Content grid: Monitoring full width, then two-column for details for better reading flow.
 */

const ComplianceManagement: React.FC = () => {
  const [section, setSection] = useState<
    | "overview"
    | "statutory"
    | "policy"
    | "documents"
    | "training"
    | "audit"
    | "workflow"
    | "vendor"
    | "monitoring"
  >("overview");

  const nav = [
    { key: "overview", label: "Overview", icon: <Layers /> },
    { key: "statutory", label: "Statutory", icon: <FileText /> },
    { key: "policy", label: "Policies", icon: <Clipboard /> },
    { key: "documents", label: "Documents", icon: <FileText /> },
    { key: "training", label: "Training", icon: <Users /> },
    { key: "audit", label: "Audit", icon: <ShieldCheck /> },
    { key: "workflow", label: "Workflows", icon: <Clock /> },
    { key: "vendor", label: "Vendors", icon: <Users /> },
    { key: "monitoring", label: "Monitoring", icon: <AlertTriangle /> },
  ];

  const content = useMemo(() => {
    switch (section) {
      case "overview":
        return (
          <>
            <div className="mb-4">
              <MonitoringPanel />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <StatutoryPanel />
                <AuditPanel />
              </div>

              <div className="space-y-4">
                <PolicyPanel />
                <DocumentPanel />
                <TrainingPanel />
              </div>
            </div>
          </>
        );
      case "statutory":
        return <StatutoryPanel />;
      case "policy":
        return <PolicyPanel />;
      case "documents":
        return <DocumentPanel />;
      case "training":
        return <TrainingPanel />;
      case "audit":
        return <AuditPanel />;
      case "workflow":
        return <WorkflowPanel />;
      case "vendor":
        return <VendorPanel />;
      case "monitoring":
        return <MonitoringPanel />;
      default:
        return null;
    }
  }, [section]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb + Title */}
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">HR • Compliance</div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <ShieldCheck className="text-teal-600" /> Compliance Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Policy, statutory, document and audit tracking — alerts, workflows
              and monitoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm shadow-sm hover:bg-teal-700 transition">
              Create policy
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50">
              Run compliance check
            </button>
          </div>
        </div>
      </div>

      {/* Layout: left nav + content */}
      <div className="flex gap-6">
        {/* SIDE NAV */}
        <aside className="w-64 hidden md:block">
          <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-2 space-y-2">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => setSection(n.key as any)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded transition ${
                  section === n.key
                    ? "bg-teal-50 text-teal-700 font-semibold ring-1 ring-teal-100"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="w-5 h-5">{n.icon}</span>
                <span className="text-sm">{n.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1">
          {/* quick summary cards aligned under header for smaller screens */}
          <div className="mb-4 block md:hidden">
            <OverviewCards />
          </div>

          {/* content area */}
          <div>{content}</div>
        </main>
      </div>
    </div>
  );
};

export default ComplianceManagement;
