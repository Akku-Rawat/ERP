import React,{useEffect} from "react";


type EmploymentTabProps = {
  formData: any;
  handleInputChange: (field: string, value: string | boolean) => void;
  departments: string[];
  Level: string[];
  managers: { name: string; employeeId: string }[];
  hrManagers: { name: string; employeeId: string }[];
};


const EmploymentTab: React.FC<EmploymentTabProps> = ({
  formData,
  handleInputChange,
  departments,
  Level,
  managers,
}) => {
  const isContractBased =
  formData.employeeType === "Contract" ||
  formData.employeeType === "Temporary" ||
  formData.employeeType === "Intern";
  useEffect(() => {
    if (!isContractBased && formData.contractEndDate) {
      handleInputChange("contractEndDate", "");
    }
  }, [formData.employeeType]);
  return (
    
    <div className="w-full max-w-5xl mx-auto space-y-5">
      <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Employment Details
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {/* <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Employee ID
            </label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => handleInputChange("employeeId", e.target.value)}
              disabled
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div> */}

          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Department * <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.level}
              onChange={(e) => handleInputChange("level", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Level</option>
              {Level.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              placeholder="e.g., Software Developer"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Reporting Manager <span className="text-red-500">*</span>
            </label>

            <select
              value={formData.reportingManager}
              onChange={(e) =>
                handleInputChange("reportingManager", e.target.value)
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Reporting Manager</option>

              {managers.map((mgr) => (
                <option value={mgr.employeeId}>{mgr.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              HR Manager <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.hrManager}
              onChange={(e) => handleInputChange("hrManager", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select HR Manager</option>

              {managers.map((mgr) => (
                <option value={mgr.employeeId}>{mgr.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Employee Type * <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.employeeType}
              onChange={(e) =>
                handleInputChange("employeeType", e.target.value)
              }
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>Permanent</option>
              <option>Contract</option>
              <option>Temporary</option>
              <option>Intern</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Employment Status
            </label>
            <select
              value={formData.employmentStatus}
              onChange={(e) =>
                handleInputChange("employmentStatus", e.target.value)
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>Active</option>
              <option>On Leave</option>
              <option>Suspended</option>
              <option>Terminated</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Engagement Date *<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.engagementDate}
              onChange={(e) =>
                handleInputChange("engagementDate", e.target.value)
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
  <label className="block text-xs text-gray-600 mb-1 font-medium">
    Contract End Date
    {isContractBased && <span className="text-red-500"> *</span>}
  </label>

  <input
    type="date"
    value={formData.contractEndDate}
    onChange={(e) =>
      handleInputChange("contractEndDate", e.target.value)
    }
    disabled={!isContractBased}
    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2
      ${
        isContractBased
          ? "border-gray-300 focus:ring-purple-500"
          : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
      }`}
  />
</div>

          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Probation Period (months)
            </label>
            <input
              type="number"
              value={formData.probationPeriod}
              onChange={(e) =>
                handleInputChange("probationPeriod", e.target.value)
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Work Address
            </label>
            <input
              type="text"
              value={formData.workAddress}
              onChange={(e) =>
                handleInputChange("workAddress", e.target.value)
              }
              placeholder="Office Address"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            
            <label className="block text-xs text-gray-600 mb-1 font-medium">
              Work Location
            </label>
            <input
              type="text"
              value={formData.workLocation}
              onChange={(e) =>
                handleInputChange("workLocation", e.target.value)
              }
              placeholder="Office location"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmploymentTab;
