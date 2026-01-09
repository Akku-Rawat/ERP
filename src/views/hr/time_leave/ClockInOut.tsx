// src/components/Hr/Attendance/ClockInOut.tsx
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "../../../components/ui/modal/formComponent";
// import { useToast } from "../../hooks/use-toast"; // if you have a toast hook

interface ClockInOutProps {
  employeeId: string;
  onClockIn: (data: { employeeId: string; timestamp: string }) => Promise<void>;
  onClockOut: (data: {
    employeeId: string;
    timestamp: string;
  }) => Promise<void>;
}

const ClockInOut: React.FC<ClockInOutProps> = ({
  employeeId,
  onClockIn,
  onClockOut,
}) => {
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<"in" | "out" | null>(null);
  //   const { toast } = useToast();

  // Check current status on mount
  const [status, setStatus] = useState<
    "checking" | " clocked-in" | "clocked-out"
  >("checking");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(
          `/api/attendance/status?employeeId=${employeeId}`,
        );
        const data = await res.json();
        setStatus(data.status);
        setLastAction(data.lastAction);
      } catch (error) {
        console.error("Failed to fetch attendance status", error);
        setStatus("clocked-out"); // Default to safe state
      }
    };
    checkStatus();
  }, [employeeId]);

  const handleAction = async (action: "in" | "out") => {
    setLoading(true);
    try {
      const timestamp = new Date().toISOString();
      if (action === "in") {
        await onClockIn({ employeeId, timestamp });
        setStatus("clocked-in");
        setLastAction("in");
        toast({
          title: "Clocked In",
          description: `You have successfully clocked in at ${new Date(timestamp).toLocaleTimeString()}`,
        });
      } else {
        await onClockOut({ employeeId, timestamp });
        setStatus("clocked-out");
        setLastAction("out");
        toast({
          title: "Clocked Out",
          description: `You have successfully clocked out at ${new Date(timestamp).toLocaleTimeString()}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-[var(--border)] rounded-xl p-6 flex flex-col items-center gap-4">
      <Clock className="w-10 h-10 text-primary" />
      <h2 className="text-lg font-semibold text-main">Attendance</h2>

      <div className="text-sm text-muted">
        {status === "checking" ? (
          <span className="animate-pulse">Checking status...</span>
        ) : (
          <>
            Status:{" "}
            <span
              className={`font-medium ${status === "clocked-in" ? "text-success" : "text-muted"}`}
            >
              {status}
            </span>
            {lastAction && (
              <span className="ml-2">
                (Last: {lastAction === "in" ? "Clocked In" : "Clocked Out"}
                {lastAction === "in" && " • " + new Date().toLocaleTimeString()}
                )
              </span>
            )}
          </>
        )}
      </div>

      <div className="flex gap-3 mt-2">
        <Button
          variant="primary"
          icon={<Clock className="w-4 h-4" />}
          loading={loading && status === "checking"}
          disabled={status === "checking" || loading}
          onClick={() => handleAction("in")}
        >
          Clock In
        </Button>
        <Button
          variant="secondary"
          icon={<Clock className="w-4 h-4" />}
          loading={loading && status === "checking"}
          disabled={status === "checking" || loading}
          onClick={() => handleAction("out")}
        >
          Clock Out
        </Button>
      </div>
    </div>
  );
};

export default ClockInOut;
