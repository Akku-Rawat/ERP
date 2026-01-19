import React from "react";
import Modal from "../../components/ui/modal/modal";
import debitNoteForm from "./debitNoteform";
import { FileMinus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
}

const CreateDebitNoteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Credit Note"
      subtitle="Sales Invoice Adjustment"
      icon={FileMinus}
      maxWidth="6xl"
      height="90vh"
    >
      <debitNoteForm  onSubmit={onSubmit} />
    </Modal>
  );
};

export default CreateDebitNoteModal;
