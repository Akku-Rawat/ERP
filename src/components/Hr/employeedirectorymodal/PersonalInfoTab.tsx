// PersonalInfoTab.tsx
import React from "react";

type PersonalInfoTabProps = {
  formData: any;
  handleInputChange: (field: string, value: string | boolean) => void;
  verifiedFields: Record<string, boolean>;
};

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  formData,
  handleInputChange,
  verifiedFields,
}) => {
  const [dobError, setDobError] = React.useState<string | null>(null);

  const verifiedInputStyle =
    "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300";

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Identity & Statutory Information - TOP */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Identity & Statutory Information
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              NRC Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nrcId}
              disabled={verifiedFields.nrcId}
              onChange={(e) => handleInputChange("nrcId", e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none
    ${
      verifiedFields.nrcId
        ? verifiedInputStyle
        : "border-gray-300 focus:ring-2 focus:ring-purple-500"
    }`}
            />
            {verifiedFields.nrcId && (
              <p className="text-[10px] text-green-600 mt-1 font-medium">
                ✓ Verified from NAPSA
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              SSN
            </label>
            <input
              type="text"
              value={formData.socialSecurityNapsa}
              disabled={verifiedFields.socialSecurityNapsa}
              onChange={(e) =>
                handleInputChange("socialSecurityNapsa", e.target.value)
              }
              className={`w-full px-3 py-2 text-sm rounded-lg border
    ${
      verifiedFields.socialSecurityNapsa
        ? verifiedInputStyle
        : "border-gray-300 focus:ring-2 focus:ring-purple-500"
    }`}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              NHIMA Number
            </label>
            <input
              type="text"
              value={formData.nhimaHealthInsurance}
              onChange={(e) =>
                handleInputChange("nhimaHealthInsurance", e.target.value)
              }
              placeholder="e.g., 91897177171"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              TPIN
            </label>
            <input
              type="text"
              value={formData.tpinId}
              onChange={(e) => handleInputChange("tpinId", e.target.value)}
              placeholder="e.g., 10000000000"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Personal Information
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              value={formData.firstName}
              disabled={verifiedFields.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border
    ${
      verifiedFields.firstName
        ? verifiedInputStyle
        : "border-gray-300 focus:ring-2 focus:ring-purple-500"
    }`}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Other Names
            </label>
            <input
              type="text"
              value={formData.otherNames}
              onChange={(e) => handleInputChange("otherNames", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              value={formData.lastName}
              disabled={verifiedFields.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border
    ${
      verifiedFields.lastName
        ? verifiedInputStyle
        : "border-gray-300 focus:ring-2 focus:ring-purple-500"
    }`}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => {
                const selectedDate = e.target.value;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const dob = new Date(selectedDate);

                if (dob >= today) {
                  setDobError("Date of birth cannot be today or a future date");
                } else {
                  setDobError(null);
                  handleInputChange("dateOfBirth", selectedDate);
                }
              }}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none
    ${
      dobError
        ? "border-red-400 focus:ring-2 focus:ring-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-purple-500"
    }`}
            />
            {dobError && (
              <p className="text-[10px] text-red-600 mt-1 font-medium">
                {dobError}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              disabled={verifiedFields.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border
    ${
      verifiedFields.gender
        ? verifiedInputStyle
        : "border-gray-300 focus:ring-2 focus:ring-purple-500"
    }`}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Marital Status
            </label>
            <select
              value={formData.maritalStatus}
              onChange={(e) =>
                handleInputChange("maritalStatus", e.target.value)
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select</option>
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
