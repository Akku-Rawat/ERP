import React from "react";
import Modal from "../../components/ui/modal/modal";
import DebitNoteForm from "./debitNoteform";
import { FileMinus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  invoiceId: string;
  
}

const CreateDebitNoteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  invoiceId,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Debit Note"
      subtitle="Sales Invoice Adjustment"
      icon={FileMinus}
      maxWidth="6xl"
      height="90vh"
    >
      <DebitNoteForm onSubmit={onSubmit} invoiceId={invoiceId} />

    </Modal>
  );
};

export default CreateDebitNoteModal;
