import React, { useState, useEffect } from "react";
import { Clipboard, BookOpen } from "lucide-react";
import { FaMedal } from "react-icons/fa";
import Appraisals from "../performance&growth/appraisals";
import PerformanceReviews from "../performance&growth/PerformanceReviews";
import TrainingDevelopment from "../performance&growth/TrainingDevelopment";

const PerformanceDevelopment: React.FC = () => {
  const [tab, setTab] = useState<"performance" | "training" | "appraisals">(
    "performance",
  );
  const screens = {
    performance: <PerformanceReviews key="performance" />,
    training: <TrainingDevelopment key="training" />,
    appraisals: <Appraisals key="appraisals" />,
  };

  // debug - remove after verifying
  useEffect(() => {
    console.log("PerformanceDevelopment active tab:", tab);
  }, [tab]);

  return (
    <div className="p-6 bg-app">
      <div className="space-y-6">
        {/* top tabs */}
        <div className="flex gap-8 border-b border-gray-300 pb-4 overflow-x-auto">
          <button
            onClick={() => setTab("performance")}
            className={`flex items-center gap-2 text-lg font-semibold transition pb-2 border-b-4 whitespace-nowrap ${
              tab === "performance"
                ? "text-indigo-600 border-indigo-500"
                : "text-gray-500 border-transparent hover:text-indigo-600"
            }`}
          >
            <Clipboard /> Performance Reviews
          </button>

          <button
            onClick={() => setTab("training")}
            className={`flex items-center gap-2 text-lg font-semibold transition pb-2 border-b-4 whitespace-nowrap ${
              tab === "training"
                ? "text-indigo-600 border-indigo-500"
                : "text-gray-500 border-transparent hover:text-indigo-600"
            }`}
          >
            <BookOpen /> Training & Development
          </button>

          <button
            onClick={() => setTab("appraisals")}
            className={`flex items-center gap-2 text-lg font-semibold transition pb-2 border-b-4 whitespace-nowrap ${
              tab === "appraisals"
                ? "text-indigo-600 border-indigo-500"
                : "text-gray-500 border-transparent hover:text-indigo-600"
            }`}
          >
            <FaMedal /> Appraisals
          </button>
        </div>

        {/* content switch (force remount with keys) */}
        <div>{screens[tab]}</div>
      </div>
    </div>
  );
};

export default PerformanceDevelopment;
