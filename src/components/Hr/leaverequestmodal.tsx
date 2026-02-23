// src/components/Hr/Leave/LeaveRequestModal.tsx
import React, { useState } from "react";
import Modal from "../ui/modal/modal";
import { Select, Textarea, Button } from "../ui/modal/formComponent";
import { CalendarPlus } from "lucide-react";
import HrDateInput from "./HrDateInput";
import { showApiError, showSuccess } from "../../utils/alert";

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  onSubmit: (data: {
    employeeId: string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => Promise<void>;
}

const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  onSubmit,
}) => {
  const [type, setType] = useState("Vacation");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      showApiError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        employeeId,
        type,
        startDate,
        endDate,
        reason,
      });
      onClose();
      showSuccess("Your leave request has been submitted successfully");
    } catch (error: any) {
      showApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Leave"
      subtitle="Submit a new leave request"
      icon={CalendarPlus}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Submit Request
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Leave Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Vacation">Vacation</option>
          <option value="Sick">Sick Leave</option>
          <option value="Personal">Personal Leave</option>
          <option value="Maternity">Maternity/Paternity</option>
          <option value="Bereavement">Bereavement</option>
        </Select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HrDateInput
            label="Start Date"
            value={startDate}
            onChange={(v) => setStartDate(v)}
            required
            placeholder="DD/MM/YYYY"
          />
          <HrDateInput
            label="End Date"
            value={endDate}
            onChange={(v) => setEndDate(v)}
            required
            placeholder="DD/MM/YYYY"
          />
        </div>

        <Textarea
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Briefly explain the reason for your leave..."
          required
        />
      </form>
    </Modal>
  );
};

export default LeaveRequestModal;
