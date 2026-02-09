import React from "react";
import Modal from "../../components/ui/modal/modal";
import CreditNoteInvoiceLikeForm from "./CreditNoteForm";
import { FileMinus } from "lucide-react";
import { Button } from "../../components/ui/modal/formComponent";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  invoiceId: string;
}

const CreateCreditNoteModal: React.FC<Props> = ({
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
      form="credit-note-form"
    >
      Create Credit Note
    </Button>
  </>
);

  return (
    
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Credit Note"
      subtitle="Sales Invoice Adjustment"
  footer={footerContent} 
      icon={FileMinus}
      maxWidth="6xl"
      height="90vh"
    >
      <CreditNoteInvoiceLikeForm onSubmit={onSubmit} invoiceId={invoiceId} />
    </Modal>
  );
};

export default CreateCreditNoteModal;
