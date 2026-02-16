import React from "react";

interface LoadingIndicatorProps {
  label?: string;
  size?: number;
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  label = "Loading…",
  size = 48,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 space-y-3 ${className}`}
    >
      <div
        className="rounded-full border-4 border-theme border-t-primary animate-spin bg-card/40 backdrop-blur-sm"
        style={{ width: size, height: size }}
      />

      {label && <p className="text-sm text-muted tracking-wide">{label}</p>}
    </div>
  );
};

export default LoadingIndicator;
