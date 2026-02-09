import React from "react";
import Modal from "../../components/ui/modal/modal";
import DebitNoteForm from "./debitNoteform";
import { FileMinus } from "lucide-react";
import { Button } from "../../components/ui/modal/formComponent";



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
  const footerContent = (
  <>
    <Button variant="secondary" onClick={onClose} type="button">
      Cancel
    </Button>

    <Button
      variant="primary"
      type="submit"
      form="debit-note-form"
    >
      Create Debit Note
    </Button>
  </>
);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Debit Note"
      footer={footerContent}
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
