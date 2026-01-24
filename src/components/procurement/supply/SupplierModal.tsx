import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, DollarSign } from "lucide-react";
import Modal from "../../ui/modal/modal";
import { Button } from "../../ui/modal/formComponent";
import { SupplierInfoTab } from "./SupplierInfoTab";
import { PaymentInfoTab } from "./PaymentInfoTab";
import { useSupplierForm } from "../../../hooks/useSupplierForm";
import type { SupplierFormData, SupplierTab } from "../../../types/Supply/supplier";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: SupplierFormData) => void;
  initialData?: SupplierFormData | null;
  isEditMode?: boolean;
}

const tabs: { key: SupplierTab; icon: typeof Building2; label: string }[] = [
  { key: "supplier", icon: Building2, label: "Supplier" },
  { key: "payment", icon: DollarSign, label: "Payment" },
];

const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const {
    form,
    loading,
    activeTab,
    setActiveTab,
    handleChange,
    handleSubmit,
    reset,
    goToNextTab,
  } = useSupplierForm({
    initialData,
    isEditMode,
    onSuccess: onSubmit,
    onClose,
  });

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
        <Button
          variant="secondary"
          onClick={goToNextTab}
          disabled={activeTab === "payment"}
          type="button"
        >
          Next →
        </Button>
        <Button variant="primary" onClick={handleSubmit} loading={loading} type="submit">
          {isEditMode ? "Update Supplier" : "Save Supplier"}
        </Button>

      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Supplier" : "Add New Supplier"}
      subtitle={
        isEditMode
          ? "Update supplier information"
          : "Fill in the details to create a new supplier"
      }
      icon={Building2}
      footer={footer}
      maxWidth="6xl"
      height="90vh"
    >
      <div className="h-full flex flex-col">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Tabs */}
          <div className="flex gap-1 -mx-6 -mt-6 px-6 pt-4 bg-app sticky top-0 z-10 shrink-0">
            {tabs.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`relative px-6 py-3 font-semibold text-sm capitalize transition-all duration-200 rounded-t-lg ${
                  activeTab === key
                    ? "text-primary bg-card shadow-sm"
                    : "text-muted hover:text-main hover:bg-card/50"
                  }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
                {activeTab === key && (
                  <motion.div
                    layoutId="activeSupplierTab"
                    className="absolute inset-0 bg-card rounded-t-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-1 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "supplier" && (
                  <SupplierInfoTab form={form} onChange={handleChange} />
                )}
                {activeTab === "payment" && (
                  <PaymentInfoTab form={form} onChange={handleChange} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SupplierModal;