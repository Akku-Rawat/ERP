import React, { useState } from "react";
import {
  Settings,
  Users,
  LayoutGrid,
} from "lucide-react";
import LeaveSetupModal from "../../../components/Hr/leavemanagemnetmodal/leavesetupmodal";

type ModalType = "setup" | "allocation" | null;

const Setup: React.FC = () => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const setupCategories = [
    {
      title: "Leave Configuration",
      description: "Configure leave types, periods, and policies",
      icon: <Settings size={32} className="text-primary" />,
      items: ["Leave Types", "Leave Periods", "Leave Policies", "Holiday Lists", "Leave Block List"],
      modalType: "setup" as ModalType,
    },
    {
      title: "Leave Allocation",
      description: "Manage leave allocations and encashments",
      icon: <Users size={32} className="text-primary" />,
      items: ["Leave Allocation", "Leave Policy Assignment", "Leave Encashment"],
      modalType: "allocation" as ModalType,
    },
  ];

  return (
    <div className="bg-app">
      <div className="max-w-7xl mx-auto">
        

        {/* Setup Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {setupCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-card border border-theme rounded-2xl p-6 transition cursor-pointer group hover:border-primary/50"
              onClick={() => setModalType(category.modalType)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-card border border-theme rounded-xl transition group-hover:border-primary/50">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-main text-lg mb-1">
                    {category.title}
                  </h3>
                  <p className="text-muted text-sm">{category.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                {category.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center gap-2 text-sm text-muted group-hover:text-primary transition"
                  >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal */}
      <LeaveSetupModal 
        isOpen={modalType !== null} 
        onClose={() => setModalType(null)}
        initialView={modalType === "allocation" ? "allocation-menu" : "setup-menu"}
      />
    </div>
  );
};

export default Setup;