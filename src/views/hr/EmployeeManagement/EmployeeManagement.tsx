import React, { useState } from "react";
import { Users, UserCheck } from "lucide-react";

import EmployeeDirectory from "./EmployeeDirectory";
import Recruitment from "./Recruitment";

const EmployeeManagement: React.FC = () => {
  const [mainTab, setMainTab] = useState<"directory" | "recruitment">(
    "directory",
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        <div className="flex gap-8 border-b border-gray-300 pb-4 overflow-x-auto">
          <button
            onClick={() => setMainTab("directory")}
            className={`flex items-center gap-2 text-lg font-semibold transition pb-2 border-b-4 whitespace-nowrap ${
              mainTab === "directory"
                ? "text-indigo-600 border-indigo-500"
                : "text-gray-500 border-transparent hover:text-indigo-600"
            }`}
          >
            <Users /> Employee Directory
          </button>

          <button
            onClick={() => setMainTab("recruitment")}
            className={`flex items-center gap-2 text-lg font-semibold transition pb-2 border-b-4 whitespace-nowrap ${
              mainTab === "recruitment"
                ? "text-indigo-600 border-indigo-500"
                : "text-gray-500 border-transparent hover:text-indigo-600"
            }`}
          >
            <UserCheck /> Recruitment
          </button>
        </div>

        <div>
          {mainTab === "directory" && <EmployeeDirectory />}
          {mainTab === "recruitment" && <Recruitment />}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
