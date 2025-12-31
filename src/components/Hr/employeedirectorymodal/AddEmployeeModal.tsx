import React, { useState } from "react";
import { X, Upload, User } from "lucide-react";
import SSNSearchStep from "./SSNSearch";
import { useEffect } from "react";



type AddEmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
};

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  departments,
}) => {

  useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [isOpen]);

   const [step, setStep] = useState<"search" | "form">("search");
  const [activeTab, setActiveTab] = useState("Work");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    mobile: "",
    tags: "",
    department: "",
    jobPosition: "",
    jobTitle: "",
    manager: "",
    workAddress: "",
    workLocation: "",
    monday: "Unspecified",
    tuesday: "Unspecified",
    wednesday: "Unspecified",
    thursday: "Unspecified",
    friday: "Unspecified",
    saturday: "Unspecified",
    sunday: "Unspecified",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in required fields (Name and Email)");
      return;
    }
    console.log("Saving employee:", formData);
    alert("Employee created successfully!");
    onClose();
  };

  if (!isOpen) return null;

  const tabs = [
    "Work",
    "Resume",
    "Certifications",
    "Personal",
    "Payroll",
    "Salary Adjustments",
    "Settings",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto pt-8 pb-8">
      <div className="bg-white rounded-none shadow-2xl w-full max-w-5xl mx-4 min-h-[600px] flex flex-col">
        {/* Top Bar with Close Button */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
              A
            </span>
            <span className="font-medium">MNSIS</span>
            <span className="text-gray-400">11:11 AM</span>
            <span className="ml-4">Creating a new record...</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-8 py-6 border-b border-gray-200 bg-white">
          <div className="flex gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                  <User className="w-12 h-12 text-gray-300" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition shadow-sm">
                  <Upload className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Name and Contact Info */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Employee's Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="text-2xl font-normal text-gray-400 bg-transparent border-b-2 border-gray-300 outline-none w-full mb-4 pb-1 focus:border-gray-500 transition"
              />

              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📧</span>
                  <input
                    type="email"
                    placeholder="e.g. johndoe@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-transparent outline-none flex-1 placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <span>☎️</span>
                  <input
                    type="tel"
                    placeholder="Work Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-transparent outline-none flex-1 placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <span>📱</span>
                  <input
                    type="tel"
                    placeholder="Work Mobile"
                    value={formData.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    className="bg-transparent outline-none flex-1 placeholder-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <span>🏷️</span>
                  <input
                    type="text"
                    placeholder="e.g. Founder, Motorhead..."
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    className="bg-transparent outline-none flex-1 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white px-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition relative ${
                activeTab === tab
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}


        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeTab === "Work" && (
            <div className="px-8 py-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      WORK
                    </h3>

                    <div className="space-y-4 bg-white p-4 rounded-sm border border-gray-200">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Department
                        </label>
                        <select
                          value={formData.department}
                          onChange={(e) =>
                            handleInputChange("department", e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        >
                          <option value=""></option>
                          {departments.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Job Position
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sales Manager"
                          value={formData.jobPosition}
                          onChange={(e) =>
                            handleInputChange("jobPosition", e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Job Title
                        </label>
                        <input
                          type="text"
                          placeholder="Manager"
                          value={formData.jobTitle}
                          onChange={(e) =>
                            handleInputChange("jobTitle", e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      LOCATION
                    </h3>
                    <div className="space-y-4 bg-white p-4 rounded-sm border border-gray-200">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Work Address
                        </label>
                        <input
                          type="text"
                          placeholder="Indore, India"
                          value={formData.workAddress}
                          onChange={(e) =>
                            handleInputChange("workAddress", e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Work Location
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Building 2, Remote, etc."
                          value={formData.workLocation}
                          onChange={(e) =>
                            handleInputChange("workLocation", e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Usual Work Location */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      USUAL WORK LOCATION
                    </h3>
                    <div className="space-y-3 bg-white p-4 rounded-sm border border-gray-200">
                      {[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ].map((day) => (
                        <div
                          key={day}
                          className="flex items-center justify-between"
                        >
                          <label className="text-xs text-gray-700 font-medium capitalize w-24">
                            {day}
                          </label>
                          <select
                            value={formData[day as keyof typeof formData]}
                            onChange={(e) =>
                              handleInputChange(day, e.target.value)
                            }
                            className="flex-1 px-2 py-1 text-xs border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                          >
                            <option value="Unspecified">Unspecified</option>
                            <option value="Office">Office</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      NOTE
                    </h3>
                    <div className="bg-white p-4 rounded-sm border border-gray-200">
                      <textarea
                        placeholder="Provide additional information about this person..."
                        value={formData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        rows={4}
                        className="w-full text-sm outline-none resize-none placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Organization Chart */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                    ORGANIZATION CHART
                  </h3>
                  <div className="bg-white p-6 rounded-sm border border-gray-200">
                    <p className="text-xs text-gray-500 mb-6">
                      Set a manager for reports to show in org chart
                    </p>
                    <div className="space-y-4">
                      <div className="bg-gray-100 rounded p-4">
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      </div>
                      <div className="ml-8 bg-gray-50 rounded p-4 border border-gray-200">
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="ml-8 bg-gray-50 rounded p-4 border border-gray-200">
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Payroll" && (
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Contract Overview */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-semibold text-gray-600 tracking-wider">
                        CONTRACT OVERVIEW
                      </h3>
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          Load a Template
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          New Contract
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 font-medium">
                            Contract
                          </label>
                          <input
                            type="text"
                            placeholder="20 Nov"
                            className="w-20 px-2 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                          />
                          <span className="text-xs text-gray-500 mx-2">to</span>
                          <input
                            type="text"
                            placeholder="Indefinite"
                            className="w-24 px-2 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 font-medium">
                            Wage Type
                          </label>
                          <select className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent">
                            <option>Fixed Wage</option>
                            <option>Hourly</option>
                            <option>Commission</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 font-medium">
                            Wage
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">₹</span>
                            <input
                              type="text"
                              placeholder="0.00"
                              className="w-24 px-2 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                            />
                            <span className="text-xs text-gray-500">
                              / month
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 font-medium">
                            Employee Type
                          </label>
                          <input
                            type="text"
                            placeholder="Employee"
                            className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 font-medium">
                            Contract Type
                          </label>
                          <input
                            type="text"
                            placeholder="Contract Type"
                            className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 font-medium">
                            Pay Category
                          </label>
                          <input
                            type="text"
                            placeholder="Employee"
                            className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      SCHEDULE
                    </h3>
                    <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Work Entry Source
                        </label>
                        <input
                          type="text"
                          placeholder="Working Schedule"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Working Hours
                        </label>
                        <input
                          type="text"
                          placeholder="Standard 40 hours/week"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>

                      <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium mt-4">
                        <Upload className="w-3 h-3" />
                        Add Inputs
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="bg-gray-50 rounded p-6 flex items-center justify-center text-gray-400 text-sm">
                  Additional payroll details
                </div>
              </div>
            </div>
          )}

          {activeTab === "Salary Adjustments" && (
            <div className="px-8 py-6">
              <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                  <div>Type</div>
                  <div>Start Date</div>
                  <div>Note</div>
                  <div>Amount</div>
                  <div>Until</div>
                </div>

                {/* Empty State */}
                <div className="p-12 text-center">
                  <p className="text-gray-400 text-sm mb-4">
                    No salary adjustments yet
                  </p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mx-auto">
                    <Upload className="w-4 h-4" />
                    Add a salary adjustment
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Personal" && (
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Private Contact */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      PRIVATE CONTACT
                    </h3>
                    <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. myprivateemail@example.com"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Phone
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Bank Accounts
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      EMERGENCY CONTACT
                    </h3>
                    <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Contact
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Phone
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Citizenship */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      CITIZENSHIP
                    </h3>
                    <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Nationality (Country)
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <label className="text-xs text-gray-700 font-medium">
                          Non-resident
                        </label>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Identification No
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          SSN No
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Passport No
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Family */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      FAMILY
                    </h3>
                    <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-4">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <label className="text-xs text-gray-700 font-medium">
                          Disabled
                        </label>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Marital Status
                        </label>
                        <select className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent">
                          <option>Single</option>
                          <option>Married</option>
                          <option>Divorced</option>
                          <option>Widowed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Dependent Children
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      PERSONAL INFORMATION
                    </h3>
                    <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Legal Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Birthday
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 font-medium">
                            Place of Birth - City
                          </label>
                          <input
                            type="text"
                            placeholder="City"
                            className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 font-medium">
                            Country
                          </label>
                          <input
                            type="text"
                            placeholder="Country"
                            className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Gender
                        </label>
                        <select className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent">
                          <option value="">Select</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Payslip Language
                        </label>
                        <input
                          type="text"
                          placeholder="User Language"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visa & Work Permit */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      VISA & WORK PERMIT
                    </h3>
                    <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Visa No
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Work Permit No
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Document
                        </label>
                        <button className="px-4 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50 transition">
                          Upload your file
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      LOCATION
                    </h3>
                    <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Private Address
                        </label>
                        <input
                          type="text"
                          placeholder="Street..."
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400 mb-2"
                        />
                        <input
                          type="text"
                          placeholder="Street 2..."
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400 mb-2"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            className="px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            className="px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                          />
                          <input
                            type="text"
                            placeholder="ZIP"
                            className="px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Country"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent placeholder-gray-400 mt-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Home-Work Distance
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="0"
                            className="w-20 px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                          />
                          <span className="text-xs text-gray-500">km</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-4 tracking-wider">
                      EDUCATION
                    </h3>
                    <div className="bg-white p-5 rounded-sm border border-gray-200 space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Certificate Level
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-sm border-b border-gray-300 focus:border-gray-500 outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

                   {activeTab === "Resume" && (
  <div className="px-8 py-6">
    <div className="bg-white rounded-sm border border-gray-200 p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Upload Resume
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Upload employee resume or CV (PDF, DOC, DOCX)
        </p>
        <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition">
          Choose File
        </button>
      </div>
    </div>
  </div>
)}

{activeTab === "Certifications" && (
  <div className="px-8 py-6">
    <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
        <div>Certification Name</div>
        <div>Issuing Organization</div>
        <div>Issue Date</div>
        <div>Expiry Date</div>
      </div>
      <div className="p-12 text-center">
        <p className="text-gray-400 text-sm mb-4">
          No certifications added yet
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mx-auto">
          <Upload className="w-4 h-4" />
          Add Certification
        </button>
      </div>
    </div>
  </div>
)}

{activeTab === "Settings" && (
  <div className="px-8 py-16 text-center">
    <p className="text-gray-500">
      Settings content will appear here
    </p>
  </div>
)}
  </div>
         


        {/* Bottom Action Bar */}
        <div className="border-t border-gray-200 bg-white px-8 py-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
          >
            Discard
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      
  {step === "search" && (
      <SSNSearchStep
        onSSNFound={(employeeData) => {
          setFormData({
            ...formData,
            name: employeeData.name || "",
            email: employeeData.email || "",
            phone: employeeData.phone || "",
            mobile: employeeData.mobile || "",
            department: employeeData.department || "",
            jobPosition: employeeData.jobPosition || "",
            jobTitle: employeeData.jobTitle || "",
            workAddress: employeeData.workAddress || "",
          });
          setStep("form");
        }}
        onCreateManually={() => setStep("form")}
      />
    )}
    </div>
);
};

export default AddEmployeeModal;
