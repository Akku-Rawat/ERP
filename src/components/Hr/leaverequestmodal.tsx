// src/components/Hr/Leave/LeaveRequestModal.tsx
import React, { useState } from "react";
import { Modal } from "../../ui/Modal";
import { Input, Select, Textarea, Button } from "../../ui/FormComponents";
import { CalendarPlus } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

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
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
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
      toast({
        title: "Leave Requested",
        description: "Your leave request has been submitted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
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
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
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
