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
        className="rounded-full border-4 border-indigo-500 border-t-transparent animate-spin backdrop-blur-sm bg-white/30"
        style={{ width: size, height: size }}
      />

      {label && <p className="text-sm text-gray-500 tracking-wide">{label}</p>}
    </div>
  );
};

export default LoadingIndicator;
