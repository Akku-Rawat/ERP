import React from "react";
import Modal from "../../components/ui/modal/modal";
import CreditNoteInvoiceLikeForm from "./CreditNoteForm";
import { FileMinus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
}

const CreateCreditNoteModal: React.FC<Props> = ({
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
      <CreditNoteInvoiceLikeForm onSubmit={onSubmit} />
    </Modal>
  );
};

export default CreateCreditNoteModal;
