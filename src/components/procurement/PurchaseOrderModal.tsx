import React from "react";
import { motion } from "framer-motion";
import { Building2, Mail, Calculator, MapPin, FileText } from "lucide-react";
import Modal from "../ui/modal/modal";
import { Button } from "../ui/modal/formComponent";
import { DetailsTab } from "../procurement/purchaseorder/DetailsTab";
import { EmailTab } from "../procurement/purchaseorder/EmailTab";
import { TaxTab } from "../procurement/purchaseorder/TaxTab";
import { AddressTab } from "../procurement/purchaseorder/AddressTab";
import { TermsTab } from "../procurement/purchaseorder/TermsTab";
import { usePurchaseOrderForm } from "../../hooks/usePurchaseOrderForm";
import type { POTab } from "../../types/Supply/purchaseOrder";



interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
   poId?: string | number; 
}

const tabs: { key: POTab; icon: typeof Building2; label: string }[] = [
  { key: "details", icon: Building2, label: "Details" },
  { key: "email", icon: Mail, label: "Email" },
  { key: "tax", icon: Calculator, label: "Tax" },
  { key: "address", icon: MapPin, label: "Address" },
  { key: "terms", icon: FileText, label: "Terms" },
];

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  poId,
}) => {
  const {
    form,
    activeTab,
    setActiveTab,
    suppliers,
    suppLoading,
    handleFormChange,
    handleSupplierChange,
    handleItemChange,
    addItem,
    removeItem,
    handleTaxRowChange,
    addTaxRow,
    removeTaxRow,
    handlePaymentRowChange,
    addPaymentRow,
    removePaymentRow,
    handleSaveTemplate,
    resetTemplate,
    getCurrencySymbol,
    handleSubmit,
    reset,
} = usePurchaseOrderForm({ isOpen, onSuccess: onSubmit, onClose, poId });

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Purchase Order
        </Button>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={poId ? "Edit Purchase Order" : "New Purchase Order"}
      subtitle="Create and manage purchase order"
      icon={Building2}
      maxWidth="6xl"
      height="90vh"
      footer={footer}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="h-full flex flex-col"
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="flex gap-1 -mx-6 -mt-6 px-6 pt-4 bg-app sticky top-0 z-10 shrink-0">
            {tabs.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`relative px-6 py-3 font-semibold text-sm capitalize rounded-t-lg ${
                  activeTab === key
                    ? "text-primary bg-card shadow-sm"
                    : "text-muted hover:bg-card/50"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
                {activeTab === key && (
                  <motion.div
                    layoutId="activePoTab"
                    className="absolute inset-0 bg-card rounded-t-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </button>
            ))}
          </div>

          <section className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === "details" && (
              <DetailsTab
                form={form}
                items={form.items}
                suppliers={suppliers}
                suppLoading={suppLoading}
                onFormChange={handleFormChange}
                onSupplierChange={handleSupplierChange}
                onItemChange={handleItemChange}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                getCurrencySymbol={getCurrencySymbol}
              />
            )}

            {activeTab === "email" && (
              <EmailTab
                templateName={form.templateName}
                templateType={form.templateType}
                subject={form.subject}
                sendAttachedFiles={form.sendAttachedFiles}
                sendPrint={form.sendPrint}
                onTemplateNameChange={(v) => setForm((p: any) => ({ ...p, templateName: v }))}
                onTemplateTypeChange={(v) => setForm((p: any) => ({ ...p, templateType: v }))}
                onSubjectChange={(v) => setForm((p: any) => ({ ...p, subject: v }))}
                onSendAttachedFilesChange={(v) => setForm((p: any) => ({ ...p, sendAttachedFiles: v }))}
                onSendPrintChange={(v) => setForm((p: any) => ({ ...p, sendPrint: v }))}
                onSaveTemplate={handleSaveTemplate}
                onResetTemplate={resetTemplate}
              />
            )}

            {activeTab === "tax" && (
              <TaxTab
                form={form}
                taxRows={form.taxRows}
                onFormChange={handleFormChange}
                onTaxRowChange={handleTaxRowChange}
                onAddTaxRow={addTaxRow}
                onRemoveTaxRow={removeTaxRow}
              />
            )}

            {activeTab === "address" && (
              <AddressTab form={form} onFormChange={handleFormChange} />
            )}

            {activeTab === "terms" && (
              <TermsTab
                form={form}
                paymentRows={form.paymentRows}
                onPaymentRowChange={handlePaymentRowChange}
                onAddPaymentRow={addPaymentRow}
                onRemovePaymentRow={removePaymentRow}
                onTermsChange={handleFormChange}
              />
            )}
          </section>
        </form>
      </motion.div>
    </Modal>
  );
};

export default PurchaseOrderModal;
