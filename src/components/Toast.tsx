import { useEffect } from "react";

type ToastProps = {
  show: boolean;
  onClose: () => void;
  message: string;
  icon?: React.ReactNode;
  className?: string;
  duration?: number;
};

const Toast = ({
  show,
  onClose,
  message,
  icon,
  className = "",
  duration = 2500,
}: ToastProps) => {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, duration);
      return () => clearTimeout(t);
    }
  }, [show, duration]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[9999]
                  flex items-center gap-3
                  px-4 py-3 rounded-xl shadow-lg text-sm
                  ${className}`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
