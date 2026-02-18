
import React, { useState } from "react";
import { Search, UserPlus, AlertCircle } from "lucide-react";

type IdentityVerificationModalProps = {
  onVerified: (data: any) => void;
  onManualEntry: () => void;
  onClose: () => void;
};
import { verifyEmployeeIdentity } from "../../../api/employeeapi";

const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({
  onVerified,
  onManualEntry,
  onClose,
}) => {
  const [identityType, setIdentityType] = useState<"NRC" | "SSN">("NRC");
  const [identityValue, setIdentityValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setError(null);

    if (!identityValue.trim()) {
      setError("Please enter an NRC or SSN number");
      return;
    }

    setLoading(true);

    try {
      const result = await verifyEmployeeIdentity(
        identityType,
        identityValue.trim(),
      );

      if (result.status !== "success") {
        throw new Error(result.message || "Verification failed");
      }
      const mappedData = {
        identityInfo: {
          nrc: identityType === "NRC" ? identityValue : "",
          ssn: result.data.ssn || "",
        },
        personalInfo: {
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          gender: result.data.gender === "F" ? "Female" : "Male",
        },
      };

      onVerified(mappedData);
    } catch (err: any) {
      setError(err.message || "Unable to verify identity");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl border border-theme w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-app transition text-muted hover:text-main"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-6 px-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-main mb-2">
            Verify Employee Identity
          </h2>
          <p className="text-sm text-muted">
            🇿🇲 Search using NRC or NAPSA SSN
          </p>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          {/* Identity Type Toggle */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-main mb-2">
              Identity Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIdentityType("NRC")}
                className={`py-3 px-4 rounded-lg font-semibold text-sm transition ${
                  identityType === "NRC"
                    ? "bg-primary text-white shadow-md"
                    : "bg-app text-main hover:bg-primary/10"
                }`}
              >
                NRC
              </button>
              <button
                onClick={() => setIdentityType("SSN")}
                className={`py-3 px-4 rounded-lg font-semibold text-sm transition ${
                  identityType === "SSN"
                    ? "bg-primary text-white shadow-md"
                    : "bg-app text-main hover:bg-primary/10"
                }`}
              >
                SSN (NAPSA)
              </button>
            </div>
          </div>

          {/* Input Field */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-main mb-2">
              {identityType === "NRC"
                ? "National Registration Card"
                : "Social Security Number"}
            </label>
            <input
              type="text"
              value={identityValue}
              onChange={(e) => setIdentityValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                identityType === "NRC" ? "123456/78/9" : "SS2024001234"
              }
              className="w-full px-4 py-3 border border-theme bg-card text-main rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-xs text-danger whitespace-pre-line">
                {error}
              </p>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold  transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          >
            <Search className="w-4 h-4" />
            {loading ? "Verifying..." : "Verify Identity"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border-theme"></div>
            <span className="text-xs text-muted font-medium">OR</span>
            <div className="flex-1 h-px bg-border-theme"></div>
          </div>

          {/* Manual Entry Button */}
          <button
            onClick={onManualEntry}
            className="w-full bg-card text-primary py-3 rounded-lg font-semibold border-2 border-primary hover:bg-primary/10 transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Enter Details Manually
          </button>

          {/* Info Text */}
          <p className="text-xs text-muted text-center mt-4 leading-relaxed">
            Identity verification helps prevent duplicates and auto-fills data
            from national databases.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerificationModal;
