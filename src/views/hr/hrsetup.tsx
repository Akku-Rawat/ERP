import { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import GeneralSettingsTab from "./tabs/GeneralSettingsTab";
import SalaryStructureTab from "./tabs/SalaryStructureTab";
import { LeavePolicy } from "../../components/Hr/leavemanagemnetmodal/LeavePolicy";
import  LeaveSetupTab  from "./tabs/LeavePolicyTab";
import WorkScheduleTab  from "./tabs/WorkScheduleTab";
import CompanyMappingTab from "./tabs/MappingTab";

const TABS = [
  "General Settings",
  "Salary Structure",
  "Leave Policy",
  "Work Schedule",
  "Company Mapping",
];

export default function HRSettings() {
  const [activeTab, setActiveTab] = useState("General Settings");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SettingsSidebar
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "General Settings" && <GeneralSettingsTab />}
        {activeTab === "Salary Structure" && <SalaryStructureTab />}
        {activeTab === "Leave Policy" && <LeaveSetupTab />}
        {activeTab === "Work Schedule" && <WorkScheduleTab />}
        {activeTab === "Company Mapping" && <CompanyMappingTab />}
      </div>
    </div>
  );
}