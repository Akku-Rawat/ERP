import React from "react";
import { motion } from "framer-motion";
import { Building2, Mail, FileText } from "lucide-react";
import Modal from "../../ui/modal/modal";
import { Button } from "../../ui/modal/formComponent";
import { DetailsTab } from "./DetailsTab";
import { EmailTemplateTab } from "./EmailTemplateTab";
import { TermsTab } from "./TermsTab";
import { useRfqForm } from "../../../hooks/useRfqForm";
import type { RfqFormData, RfqTab } from "../../../types/Supply/rfq";

interface RfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: RfqFormData) => void;
}

const tabs: { key: RfqTab; icon: typeof Building2; label: string }[] = [
  { key: "details", icon: Building2, label: "Details" },
  { key: "emailTemplates", icon: Mail, label: "Email Templates" },
  { key: "terms", icon: FileText, label: "Terms" },
];

const RfqModal: React.FC<RfqModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const {
    form,
    activeTab,
    setActiveTab,
    setRfqNumber,
    setRequestDate,
    setQuoteDeadline,
    setStatus,
    handleSupplierChange,
    addSupplier,
    removeSupplier,
    handleItemChange,
    addItem,
    removeItem,
    handlePaymentRowChange,
    addPaymentRow,
    removePaymentRow,
    setTemplateName,
    setTemplateType,
    setSubject,
    setMessageHtml,
    setSendAttachedFiles,
    setSendPrint,
    handleSaveTemplate,
    resetTemplate,
    setTermsAndConditions,
    handleSubmit,
    reset,
  } = useRfqForm({
    onSuccess: onSubmit,
    onClose,
  });

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
          Save RFQ
        </Button>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Request For Quotation"
      subtitle="Create and send RFQ to suppliers"
      icon={Building2}
      footer={footer}
      maxWidth="6xl"
      height="90vh"
    >
      <div className="h-full flex flex-col">
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
                  layoutId="activeRfqTab"
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
              rfqNumber={form.rfqNumber}
              requestDate={form.requestDate}
              quoteDeadline={form.quoteDeadline}
              status={form.status}
              suppliers={form.suppliers}
              items={form.items}
              onRfqNumberChange={setRfqNumber}
              onRequestDateChange={setRequestDate}
              onQuoteDeadlineChange={setQuoteDeadline}
              onStatusChange={setStatus}
              onSupplierChange={handleSupplierChange}
              onAddSupplier={addSupplier}
              onRemoveSupplier={removeSupplier}
              onItemChange={handleItemChange}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />
          )}

          {activeTab === "emailTemplates" && (
            <EmailTemplateTab
              templateName={form.templateName}
              templateType={form.templateType}
              subject={form.subject}
              messageHtml={form.messageHtml}
              sendAttachedFiles={form.sendAttachedFiles}
              sendPrint={form.sendPrint}
              onTemplateNameChange={setTemplateName}
              onTemplateTypeChange={setTemplateType}
              onSubjectChange={setSubject}
              onMessageHtmlChange={setMessageHtml}
              onSendAttachedFilesChange={setSendAttachedFiles}
              onSendPrintChange={setSendPrint}
              onSaveTemplate={handleSaveTemplate}
              onResetTemplate={resetTemplate}
            />
          )}

          {activeTab === "terms" && (
            <TermsTab
              paymentRows={form.paymentRows}
              termsAndConditions={form.termsAndConditions}
              onPaymentRowChange={handlePaymentRowChange}
              onAddPaymentRow={addPaymentRow}
              onRemovePaymentRow={removePaymentRow}
              onTermsChange={setTermsAndConditions}
            />
          )}
        </section>
      </div>
    </Modal>
  );
};

export default RfqModal;
