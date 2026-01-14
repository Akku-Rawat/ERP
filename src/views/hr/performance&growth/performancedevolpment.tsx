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
    <div className="bg-app">
      <div className="space-y-6">
        {/* top tabs */}
        <div className="flex gap-8 border-b border-gray-300 pb-4 overflow-x-auto">
          <button
            onClick={() => setTab("performance")}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition ${
              tab === "performance"
                ? "text-primary border-primary"
        : "text-muted border-transparent hover:text-main"
            }`}
          >
            <Clipboard size={15}/> Performance Reviews
          </button>

          <button
            onClick={() => setTab("training")}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition ${
              tab === "training"
                 ? "text-primary border-primary"
        : "text-muted border-transparent hover:text-main"
            }`}
          >
            <BookOpen size={15}/> Training & Development
          </button>

          <button
            onClick={() => setTab("appraisals")}
            className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition ${
              tab === "appraisals"
                  ? "text-primary border-primary"
        : "text-muted border-transparent hover:text-main"
            }`}
          >
            <FaMedal size={15}/> Appraisals
          </button>
        </div>

        {/* content switch (force remount with keys) */}
        <div>{screens[tab]}</div>
      </div>
    </div>
  );
};

export default PerformanceDevelopment;
