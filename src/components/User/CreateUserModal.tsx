import React, { useState, useEffect } from "react";
import { FaUser, FaInfoCircle } from "react-icons/fa";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData;
  availableRoles?: Role[];
}

interface Role {
  id: number;
  roleName: string;
  description: string;
  status: "Active" | "Inactive";
}

interface UserFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  phone: string;
  dob: string;
  email: string;
  username: string;
  language: string;
  timezone: string;
  role: string;
  status: "Active" | "Inactive";
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  availableRoles = [],
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    phone: "",
    dob: "",
    email: "",
    username: "",
    language: "English",
    timezone: "Asia/Kolkata",
    role: "",
    status: "Active",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        phone: "",
        dob: "",
        email: "",
        username: "",
        language: "English",
        timezone: "Asia/Kolkata",
        role: "",
        status: "Active",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.firstName.trim()) {
      alert("Please enter first name!");
      return;
    }
    if (!formData.lastName.trim()) {
      alert("Please enter last name!");
      return;
    }
    if (!formData.gender) {
      alert("Please select gender!");
      return;
    }
    if (!formData.phone.trim()) {
      alert("Please enter phone number!");
      return;
    }
    if (!formData.dob) {
      alert("Please select date of birth!");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter email!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address!");
      return;
    }
    if (!formData.username.trim()) {
      alert("Please enter username!");
      return;
    }
    if (!formData.role) {
      alert("Please select a role!");
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Get active roles only
  const activeRoles = availableRoles.filter((role) => role.status === "Active");

  // Common input class for reusability
  const inputClass =
    "w-full px-4 py-2.5 bg-app border border-[var(--border)] rounded-xl text-main placeholder:text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

  const selectClass =
    "w-full px-4 py-2.5 bg-app border border-[var(--border)] rounded-xl text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar border border-[var(--border)]">
        {/* Header */}
        <div className="sticky top-0 bg-primary/10 border-b border-[var(--border)] px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-primary flex items-center gap-3">
            <FaUser className="text-xl" />
            {initialData ? "Edit User" : "Add New User"}
          </h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-main text-xl leading-none w-8 h-8 flex items-center justify-center hover:bg-[var(--row-hover)] rounded-full transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                First Name <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={inputClass}
                placeholder="Enter first name"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Middle Name
              </label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => handleChange("middleName", e.target.value)}
                className={inputClass}
                placeholder="Enter middle name (optional)"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Last Name <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={inputClass}
                placeholder="Enter last name"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Gender <span className="text-[var(--danger)]">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className={selectClass}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Phone <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={inputClass}
                placeholder="+91-9876543210"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Date of Birth <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-main mb-2">
                Email <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass}
                placeholder="user@example.com"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Username <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className={inputClass}
                placeholder="Enter username"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Assign Role <span className="text-[var(--danger)]">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className={selectClass}
              >
                <option value="">Select Role</option>
                {activeRoles.map((role) => (
                  <option key={role.id} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              {activeRoles.length === 0 && (
                <p className="text-[10px] font-semibold text-[var(--danger)] mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> No active roles available. Please create roles
                  first.
                </p>
              )}
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className={selectClass}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Mandarin">Mandarin</option>
              </select>
            </div>

            {/* Time Zone */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Time Zone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
                className={selectClass}
              >
                <option value="Asia/Kolkata">
                  🇮🇳 Asia/Kolkata (IST +5:30)
                </option>
                <option value="America/New_York">
                  🇺🇸 America/New_York (EST -5:00)
                </option>
                <option value="Europe/London">
                  🇬🇧 Europe/London (GMT +0:00)
                </option>
                <option value="Asia/Dubai">🇦🇪 Asia/Dubai (GST +4:00)</option>
                <option value="Asia/Tokyo">🇯🇵 Asia/Tokyo (JST +9:00)</option>
                <option value="Australia/Sydney">
                  🇦🇺 Australia/Sydney (AEDT +11:00)
                </option>
                <option value="Asia/Shanghai">
                  🇨🇳 Asia/Shanghai (CST +8:00)
                </option>
                <option value="Europe/Paris">
                  🇫🇷 Europe/Paris (CET +1:00)
                </option>
              </select>
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-main mb-3">
                Status
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={formData.status === "Active"}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-4 h-4 accent-[var(--success)] cursor-pointer"
                  />
                  <span className="text-sm font-medium text-main group-hover:text-[var(--success)] transition-colors">
                    Active
                  </span>
                  {formData.status === "Active" && (
                    <span className="text-[9px] font-black uppercase bg-[var(--success)]/10 text-[var(--success)] px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )}
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={formData.status === "Inactive"}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-4 h-4 accent-[var(--danger)] cursor-pointer"
                  />
                  <span className="text-sm font-medium text-main group-hover:text-[var(--danger)] transition-colors">
                    Inactive
                  </span>
                  {formData.status === "Inactive" && (
                    <span className="text-[9px] font-black uppercase bg-[var(--danger)]/10 text-[var(--danger)] px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )}
                </label>
              </div>
            </div>

            {/* Role Info Box */}
            {formData.role && (
              <div className="md:col-span-2 bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-xl text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-primary mb-1">
                      Selected Role: {formData.role}
                    </h4>
                    <p className="text-sm text-muted">
                      {availableRoles.find((r) => r.roleName === formData.role)
                        ?.description || "Role permissions will be applied"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-[var(--border)] rounded-xl text-main font-semibold hover:bg-[var(--row-hover)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              {initialData ? "Update User" : "Create User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
