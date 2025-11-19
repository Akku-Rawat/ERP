import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RfqTabsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabClass = (active: boolean) =>
  `px-6 py-3 text-sm font-medium transition-colors min-w-[180px]
    ${active ? "text-indigo-600 border-b-2 border-indigo-600 bg-white" : "text-gray-600 hover:text-gray-900"}`;

const RfqTabsModal: React.FC<RfqTabsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"details" | "emailTemplates" | "terms">("details");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-[90vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-3 bg-indigo-50/70 border-b">
            <h2 className="text-2xl font-semibold text-indigo-700">
              New Request for Quotation
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <span className="text-2xl text-gray-600">&times;</span>
            </button>
          </header>

          {/* Tabs - left-aligned, compact */}
          <div className="flex border-b bg-gray-50">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={tabClass(activeTab === "details")}
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("emailTemplates")}
              className={tabClass(activeTab === "emailTemplates")}
            >
              Email Templates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("terms")}
              className={tabClass(activeTab === "terms")}
            >
              Terms and Conditions
            </button>
          </div>

          {/* Tab Content */}
          <section className="flex-1 overflow-y-auto p-6">
            {activeTab === "details" && (<div>{/* Details tab content */}</div>)}
            {activeTab === "emailTemplates" && (<div>{/* Email Templates tab content */}</div>)}
            {activeTab === "terms" && (<div>{/* Terms and Conditions tab content */}</div>)}
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RfqTabsModal;
