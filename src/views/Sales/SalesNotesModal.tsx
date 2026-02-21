import React, { useState } from "react";
import Modal from "../../components/ui/modal/modal";
import CreditNotesTable from "./CreditNotesTable";
import DebitNotesTable from "./DebitNotesTable";
import { FileText } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SalesNotesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"credit" | "debit">("credit");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sales Notes"
      subtitle="Credit & Debit Notes"
      icon={FileText}
      maxWidth="wide"
      height="84vh"
    >
      {/* Tabs */}
      <div className="bg-app border-b border-theme px-8 shrink-0">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("credit")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${
              activeTab === "credit"
                ? "bg-primary text-white"
                : "bg-app border border-[var(--border)] text-muted"
            }`}
          >
            Credit Notes
          </button>

          <button
            onClick={() => setActiveTab("debit")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${
              activeTab === "debit"
                ? "bg-primary text-white"
                : "bg-app border border-[var(--border)] text-muted"
            }`}
          >
            Debit Notes
          </button>
        </div>
      </div>

      {/* Tables */}
      {activeTab === "credit" ? <CreditNotesTable /> : <DebitNotesTable />}
    </Modal>
  );
};

export default SalesNotesModal;
