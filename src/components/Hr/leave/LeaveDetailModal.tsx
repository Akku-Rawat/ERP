import React, { useEffect, useState } from "react";
import Modal from "../../ui/modal/modal";
import { Card } from "../../ui/modal/formComponent";
import { CalendarDays } from "lucide-react";
import { getLeaveById } from "../../../api/leaveApi";
import type { LeaveDetailResponse } from "../../../types/leave/leave";

interface LeaveDetailModalProps {
  leaveId: string | null;
  onClose: () => void;
}

const LeaveDetailModal: React.FC<LeaveDetailModalProps> = ({
  leaveId,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LeaveDetailResponse["data"] | null>(null);

  useEffect(() => {
    if (!leaveId) return;

    const fetchLeaveDetail = async () => {
      try {
        setLoading(true);
        const res: LeaveDetailResponse = await getLeaveById(leaveId);
        setData(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveDetail();
  }, [leaveId]);

  return (
    <Modal
      isOpen={!!leaveId}
      onClose={onClose}
      title="Leave Details"
      subtitle="Applied leave information"
      icon={CalendarDays}
      maxWidth="md"
    >
      {loading && <p className="text-sm text-muted">Loading...</p>}

      {!loading && data && (
        <Card title="Leave Information">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted">Employee</span>
              <p className="font-semibold">{data.employee.employeeName}</p>
            </div>

            <div>
              <span className="text-muted">Department</span>
              <p>{data.employee.department}</p>
            </div>

            <div>
              <span className="text-muted">Leave Type</span>
              <p className="font-semibold">{data.leaveType}</p>
            </div>

            <div>
              <span className="text-muted">Status</span>
              <p className="font-semibold">{data.status}</p>
            </div>

            <div>
              <span className="text-muted">Period</span>
              <p>
                {data.fromDate} → {data.toDate}
              </p>
            </div>

            <div>
              <span className="text-muted">Days</span>
              <p>{data.totalDays}</p>
            </div>

            <div className="col-span-2">
              <span className="text-muted">Reason</span>
              <p className="italic mt-1">“{data.leaveReason}”</p>
            </div>

            {data.rejectionReason && (
              <div className="col-span-2 text-red-600">
                <span className="text-muted">Rejection Reason</span>
                <p className="italic mt-1">“{data.rejectionReason}”</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </Modal>
  );
};

export default LeaveDetailModal;
