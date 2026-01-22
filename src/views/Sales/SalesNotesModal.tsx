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
      maxWidth="6xl"
      height="620px"
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
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

      {/* Tables */}
      {activeTab === "credit" ? <CreditNotesTable /> : <DebitNotesTable />}
    </Modal>
  );
};

export default SalesNotesModal;
