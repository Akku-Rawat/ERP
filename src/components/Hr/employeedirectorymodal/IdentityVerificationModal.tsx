// FILE: components/IdentityVerificationModal.tsx
import React, { useState } from "react";
import { Search, UserPlus, AlertCircle } from "lucide-react";

type IdentityVerificationModalProps = {
  onVerified: (data: any) => void;
  onManualEntry: () => void;
  onClose: () => void;
};

// DEMO DATA - Mock employee records
const DEMO_EMPLOYEES = {
  // NRC Records
  "123456/78/9": {
    identityInfo: {
      nrc: "123456/78/9",
      ssn: "SS2024001234",
      verifiedFromSource: true,
    },
    personalInfo: {
      firstName: "Dixant",
      middleName: "",
      lastName: "Negi",
      dateOfBirth: "1990-05-15",
      gender: "Male",
      nationality: "indian",
    },
    contactInfo: {
      email: "dixant.negi@gmail.com",
      phone: "9988776655",
      alternatePhone: "+260966789012",
      address: {
        street: "Plot 1234, ghnatagahr",
        city: "deharadun",
        province: "Lusaka Province",
        postalCode: "548001",
        country: "india",
      },
    },
  },
  "987654/32/1": {
    identityInfo: {
      nrc: "987654/32/1",
      ssn: "SS2024005678",
      verifiedFromSource: true,
    },
    personalInfo: {
      firstName: "Mary",
      middleName: "Chitalu",
      lastName: "Mwape",
      dateOfBirth: "1988-08-22",
      gender: "Female",
      nationality: "Zambian",
    },
    contactInfo: {
      email: "mary.mwape@yahoo.com",
      phone: "+260966555777",
      alternatePhone: "",
      address: {
        street: "House 567, Kabulonga",
        city: "Lusaka",
        province: "Lusaka Province",
        postalCode: "10101",
        country: "Zambia",
      },
    },
  },
  // SSN Records
  "SS2024001234": {
    identityInfo: {
      nrc: "123456/78/9",
      ssn: "SS2024001234",
      verifiedFromSource: true,
    },
    personalInfo: {
      firstName: "John",
      middleName: "Mwansa",
      lastName: "Banda",
      dateOfBirth: "1990-05-15",
      gender: "Male",
      nationality: "Zambian",
    },
    contactInfo: {
      email: "john.banda@gmail.com",
      phone: "+260977123456",
      alternatePhone: "+260966789012",
      address: {
        street: "Plot 1234, Independence Ave",
        city: "Lusaka",
        province: "Lusaka Province",
        postalCode: "10101",
        country: "Zambia",
      },
    },
  },
  "SS2024009999": {
    identityInfo: {
      nrc: "555555/55/5",
      ssn: "SS2024009999",
      verifiedFromSource: true,
    },
    personalInfo: {
      firstName: "Peter",
      middleName: "Chilufya",
      lastName: "Mulenga",
      dateOfBirth: "1995-03-10",
      gender: "Male",
      nationality: "Zambian",
    },
    contactInfo: {
      email: "peter.mulenga@gmail.com",
      phone: "+260955444333",
      alternatePhone: "",
      address: {
        street: "Plot 789, Cairo Road",
        city: "Kitwe",
        province: "Copperbelt Province",
        postalCode: "50101",
        country: "Zambia",
      },
    },
  },
};

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

    // Simulate API delay
    setTimeout(() => {
      // Search in demo data
      const employeeData = DEMO_EMPLOYEES[identityValue as keyof typeof DEMO_EMPLOYEES];

      if (employeeData) {
        // Found in demo database
        onVerified(employeeData);
      } else {
        // Not found
        setError(`No employee found with ${identityType}: ${identityValue}. Try these demo values:
        
NRC: 123456/78/9 or 987654/32/1
SSN: SS2024001234 or SS2024009999`);
      }
      
      setLoading(false);
    }, 1000);
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
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
              {identityType === "NRC" ? "National Registration Card" : "Social Security Number"}
            </label>
            <input
              type="text"
              value={identityValue}
              onChange={(e) => setIdentityValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                identityType === "NRC"
                  ? "123456/78/9"
                  : "SS2024001234"
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 whitespace-pre-line">{error}</p>
            </div>
          )}

          {/* Demo Data Info */}
          <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">📋 Demo Mode Active</p>
            <p className="text-xs text-blue-700">
              Try: <span className="font-mono font-semibold">123456/78/9</span> (NRC) or <span className="font-mono font-semibold">SS2024001234</span> (SSN)
            </p>
          </div>

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
            Identity verification helps prevent duplicates and auto-fills data from
            national databases.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerificationModal;