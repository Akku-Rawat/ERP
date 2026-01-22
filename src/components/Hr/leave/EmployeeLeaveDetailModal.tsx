import React from "react";
import { CalendarDays } from "lucide-react";
import Modal from "../../ui/modal/modal";
import { Card } from "../../ui/modal/formComponent";
import StatusBadge from "../../ui/Table/StatusBadge";
import type { LeaveUI } from "../../../types/leave/uiLeave";

interface Props {
  leave: LeaveUI | null;
  onClose: () => void;
}

const EmployeeLeaveDetailModal: React.FC<Props> = ({ leave, onClose }) => {
  return (
    <Modal
      isOpen={!!leave}
      onClose={onClose}
      title="Leave Request Details"
      subtitle="Complete leave information"
      icon={CalendarDays}
      maxWidth="md"
    >
      {leave && (
        <div className="space-y-4">
          {/* Employee Info */}
          <Card title="Employee Information">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted">Employee Name</span>
                <p className="font-semibold">{leave.employeeName}</p>
              </div>
              <div>
                <span className="text-muted">Employee ID</span>
                <p className="font-semibold">{leave.employeeId}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted">Department</span>
                <p className="font-semibold">{leave.department}</p>
              </div>
            </div>
          </Card>

          {/* Leave Info */}
          <Card title="Leave Details">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted">Type</span>
                <p className="font-semibold">{leave.leaveType}</p>
              </div>

              <div>
                <span className="text-muted">Status</span>
                <div className="mt-1">
                  <StatusBadge status={leave.status} />
                </div>
              </div>

              <div>
                <span className="text-muted">Period</span>
                <p>
                  {leave.startDate} → {leave.endDate}
                </p>
              </div>

              <div>
                <span className="text-muted">Days</span>
                <p>{leave.totalDays}</p>
              </div>

              <div>
                <span className="text-muted">Applied Date</span>
                <p>{leave.appliedOn}</p>
              </div>

              <div className="col-span-2">
                <span className="text-muted">Reason</span>
                <p className="italic mt-1">"{leave.reason}"</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Modal>
  );
};

export default EmployeeLeaveDetailModal;
