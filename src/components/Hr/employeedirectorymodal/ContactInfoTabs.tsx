import React from "react";

type ContactInfoTabProps = {
  formData: any;
  handleInputChange: (field: string, value: string | boolean) => void;
};

const ContactInfoTab: React.FC<ContactInfoTabProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Contact Information */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Contact Information
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Personal Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Company Email
            </label>
            <input
              type="email"
              value={formData.CompanyEmail}
              onChange={(e) =>
                handleInputChange("CompanyEmail", e.target.value)
              }
              placeholder="@company.co.zm"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="+260971234567"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Alternate Phone
            </label>
            <input
              type="tel"
              value={formData.alternatePhone}
              onChange={(e) =>
                handleInputChange("alternatePhone", e.target.value)
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Address
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Street Address
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              placeholder="Plot number, street name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                Province
              </label>
              <select
                value={formData.province}
                onChange={(e) => handleInputChange("province", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select</option>
                <option>Central Province</option>
                <option>Copperbelt Province</option>
                <option>Eastern Province</option>
                <option>Luapula Province</option>
                <option>Lusaka Province</option>
                <option>Muchinga Province</option>
                <option>Northern Province</option>
                <option>North-Western Province</option>
                <option>Southern Province</option>
                <option>Western Province</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Emergency Contact
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Name
            </label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) =>
                handleInputChange("emergencyContactName", e.target.value)
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Phone
            </label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) =>
                handleInputChange("emergencyContactPhone", e.target.value)
              }
              placeholder="+260"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Relationship
            </label>
            <input
              type="text"
              value={formData.emergencyContactRelationship}
              onChange={(e) =>
                handleInputChange(
                  "emergencyContactRelationship",
                  e.target.value,
                )
              }
              placeholder="e.g., Spouse, Parent"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoTab;
