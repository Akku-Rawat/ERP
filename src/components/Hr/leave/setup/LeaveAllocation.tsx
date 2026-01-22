import React, { useEffect, useState } from "react";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import { getLeaveAllocationsByEmployee } from "../../../../api/leaveApi";
import { mapAllocationFromApi } from "../../../../types/leave/leaveMapper";
import type { LeaveAllocationUI } from "../../../../types/leave/uiLeave";

export interface LeaveAllocationProps {
  employeeId: string;
  onAdd: () => void;
  onClose?: () => void;
}

const LeaveAllocation: React.FC<LeaveAllocationProps> = ({
  employeeId,
  onAdd,
  onClose,
}) => {
  const [allocations, setAllocations] = useState<LeaveAllocationUI[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!employeeId) return;

    const fetchAllocations = async () => {
      try {
        setLoading(true);
        const res = await getLeaveAllocationsByEmployee(employeeId, 1, 20);
        const list = res.data.allocations || [];
        setAllocations(list.map(mapAllocationFromApi));
      } catch (err) {
        console.error("Failed to fetch leave allocations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllocations();
  }, [employeeId]);

  return (
    <div className="bg-card border border-theme rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-theme">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-muted hover:text-main transition"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-xl font-bold text-main">Leave Allocation</h2>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl font-semibold transition"
        >
          <Plus size={18} />
          Add Leave Allocation
        </button>
      </div>

      {/* Meta */}
      <div className="px-6 py-3 border-b border-theme flex items-center justify-between">
        <span className="text-sm text-muted">
          {allocations.length} Allocations
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-sm text-muted">Loading allocations…</div>
        ) : allocations.length === 0 ? (
          /* Empty State */
          <div className="p-16 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="mb-6 w-20 h-20 mx-auto rounded-2xl bg-card border border-theme inline-flex items-center justify-center">
                <FileText size={40} className="text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-main mb-2">
                No Leave Allocations Yet
              </h3>
              <p className="text-muted text-sm">
                Allocate leaves to employees for specific periods and leave
                types
              </p>
            </div>
          </div>
        ) : (
          /* Allocation List */
          <div className="space-y-4">
            {allocations.map((a) => (
              <div
                key={a.id}
                className="border border-theme rounded-xl p-4 bg-app"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-main">{a.leaveType}</div>
                    <div className="text-xs text-muted">{a.period}</div>
                  </div>

                  <div className="text-right text-xs">
                    <div>
                      <span className="font-semibold">Allocated:</span>{" "}
                      {a.allocated}
                    </div>
                    <div>
                      <span className="font-semibold">Used:</span> {a.used}
                    </div>
                    <div>
                      <span className="font-semibold">Remaining:</span>{" "}
                      {a.remaining}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveAllocation;
