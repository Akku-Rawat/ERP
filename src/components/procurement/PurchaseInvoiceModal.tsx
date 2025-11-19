import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PurchaseInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

// Compact tab, left aligned
const tabClass = (active: boolean) =>
  `px-6 py-3 text-sm font-medium transition-colors min-w-[160px]
    ${active ? "text-indigo-600 border-b-2 border-indigo-600 bg-white" : "text-gray-600 hover:text-gray-900"}`;

const PurchaseInvoiceModal: React.FC<PurchaseInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<
    "details" | "emailTemplates" | "address" | "tax" | "terms"
  >("details");

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
              Create Purchase Invoice
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <span className="text-2xl text-gray-600">&times;</span>
            </button>
          </header>

          {/* Tabs - left aligned */}
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
              onClick={() => setActiveTab("address")}
              className={tabClass(activeTab === "address")}
            >
              Address
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tax")}
              className={tabClass(activeTab === "tax")}
            >
              Tax
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
            {activeTab === "details" && (
              <div>
                {/* Purchase Invoice details tab content here */}
              </div>
            )}
            {activeTab === "emailTemplates" && (
              <div>
                {/* Email Templates tab content here */}
              </div>
            )}
            {activeTab === "address" && (
              <div>
                {/* Address tab content here */}
              </div>
            )}
            {activeTab === "tax" && (
              <div>
                {/* Tax tab content here */}
              </div>
            )}
            {activeTab === "terms" && (
              <div>
                {/* Terms and Conditions tab content here */}
              </div>
            )}
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PurchaseInvoiceModal;
