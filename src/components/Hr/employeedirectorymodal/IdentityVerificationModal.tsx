// FILE: components/IdentityVerificationModal.tsx
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
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
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verify Employee Identity
          </h2>
          <p className="text-sm text-gray-500">
            🇿🇲 Search using NRC or NAPSA SSN
          </p>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          {/* Identity Type Toggle */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Identity Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIdentityType("NRC")}
                className={`py-3 px-4 rounded-lg font-semibold text-sm transition ${
                  identityType === "NRC"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                NRC
              </button>
              <button
                onClick={() => setIdentityType("SSN")}
                className={`py-3 px-4 rounded-lg font-semibold text-sm transition ${
                  identityType === "SSN"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                SSN (NAPSA)
              </button>
            </div>
          </div>

          {/* Input Field */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 whitespace-pre-line">
                {error}
              </p>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          >
            <Search className="w-4 h-4" />
            {loading ? "Verifying..." : "Verify Identity"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Manual Entry Button */}
          <button
            onClick={onManualEntry}
            className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Enter Details Manually
          </button>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
            Identity verification helps prevent duplicates and auto-fills data
            from national databases.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerificationModal;
