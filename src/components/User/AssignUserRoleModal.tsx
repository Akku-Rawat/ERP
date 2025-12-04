import React, { useState, useEffect } from "react";
import {
  FaBoxOpen,
  FaMoneyBillAlt,
  FaShoppingCart,
  FaCalculator,
  FaUsers,
  FaIndustry,
  FaPhoneVolume,
  FaChartBar,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaShareSquare,
} from "react-icons/fa";

interface AssignUserRoleForm {
  roleName: string;
  description: string;
  modulePermissions: string[];
  actionPermissions: string[];
  status: "Active" | "Inactive";
}

interface AssignUserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignUserRoleForm) => void;
  initialData?: AssignUserRoleForm;
}

const AssignUserRoleModal: React.FC<AssignUserRoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<AssignUserRoleForm>({
    roleName: "",
    description: "",
    modulePermissions: [],
    actionPermissions: [],
    status: "Active",
  });

  const moduleOptions = [
    { id: "inventory", name: "Inventory", icon: <FaBoxOpen /> },
    { id: "sales", name: "Sales", icon: <FaMoneyBillAlt /> },
    { id: "purchase", name: "Purchase", icon: <FaShoppingCart /> },
    { id: "accounting", name: "Accounting", icon: <FaCalculator /> },
    { id: "hr", name: "HR", icon: <FaUsers /> },
    { id: "manufacturing", name: "Manufacturing", icon: <FaIndustry /> },
    { id: "crm", name: "CRM", icon: <FaPhoneVolume /> },
    { id: "reports", name: "Reports", icon: <FaChartBar /> },
  ];

  const actionOptions = [
    { id: "create", name: "Create", icon: <FaPlus />, color: "text-green-600" },
    { id: "edit", name: "Edit", icon: <FaEdit />, color: "text-blue-600" },
    { id: "delete", name: "Delete", icon: <FaTrash />, color: "text-red-600" },
    { id: "view", name: "View", icon: <FaEye />, color: "text-gray-600" },
    {
      id: "export",
      name: "Export",
      icon: <FaShareSquare />,
      color: "text-purple-600",
    },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        roleName: "",
        description: "",
        modulePermissions: [],
        actionPermissions: [],
        status: "Active",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.roleName.trim()) {
      alert("Please enter role name!");
      return;
    }
    if (formData.modulePermissions.length === 0) {
      alert("Please select at least one module permission!");
      return;
    }
    if (formData.actionPermissions.length === 0) {
      alert("Please select at least one action permission!");
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const togglePermission = (type: string, value: string) => {
    const field = type === "module" ? "modulePermissions" : "actionPermissions";
    const current = formData[field];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const selectAllModules = () => {
    setFormData({
      ...formData,
      modulePermissions: moduleOptions.map((m) => m.name),
    });
  };

  const clearAllModules = () => {
    setFormData({ ...formData, modulePermissions: [] });
  };

  const selectAllActions = () => {
    setFormData({
      ...formData,
      actionPermissions: actionOptions.map((a) => a.name),
    });
  };

  const clearAllActions = () => {
    setFormData({ ...formData, actionPermissions: [] });
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-indigo-50/70  border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <FaUsers className="text-2xl" />
            {initialData ? "Edit Role" : "Add New Role"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Role Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.roleName}
                onChange={(e) => handleChange("roleName", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                placeholder="e.g. Admin, HR Manager, Sales Executive"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none transition-all"
                placeholder="Role summary and responsibilities..."
              />
            </div>

            {/* Module Permissions */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <FaBoxOpen className="text-lg" />
                  Module Permissions <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllModules}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold px-3 py-1 bg-white rounded-md hover:bg-teal-50 transition-colors"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearAllModules}
                    className="text-xs text-gray-600 hover:text-gray-700 font-semibold px-3 py-1 bg-white rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {moduleOptions.map((module) => (
                  <label
                    key={module.id}
                    className={`flex items-center gap-2 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all ${
                      formData.modulePermissions.includes(module.name)
                        ? "border-teal-500 bg-teal-50 shadow-md"
                        : "border-gray-200 hover:border-teal-300 hover:bg-teal-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.modulePermissions.includes(module.name)}
                      onChange={() => togglePermission("module", module.name)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-lg">{module.icon}</span>
                    <span className="text-sm font-semibold text-gray-700">
                      {module.name}
                    </span>
                  </label>
                ))}
              </div>
              {formData.modulePermissions.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
                    ✓ {formData.modulePermissions.length} module(s) selected
                  </span>
                </div>
              )}
            </div>

            {/* Action Permissions */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <FaEye className="text-lg" />
                  Action Permissions <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllActions}
                    className="text-xs text-purple-600 hover:text-purple-700 font-semibold px-3 py-1 bg-white rounded-md hover:bg-purple-50 transition-colors"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearAllActions}
                    className="text-xs text-gray-600 hover:text-gray-700 font-semibold px-3 py-1 bg-white rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {actionOptions.map((action) => (
                  <label
                    key={action.id}
                    className={`flex items-center gap-2 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all ${
                      formData.actionPermissions.includes(action.name)
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.actionPermissions.includes(action.name)}
                      onChange={() => togglePermission("action", action.name)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-lg">{action.icon}</span>
                    <span className={`text-sm font-semibold ${action.color}`}>
                      {action.name}
                    </span>
                  </label>
                ))}
              </div>
              {formData.actionPermissions.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                    ✓ {formData.actionPermissions.length} action(s) selected
                  </span>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Status
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="roleStatus"
                    value="Active"
                    checked={formData.status === "Active"}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600">
                    Active
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="roleStatus"
                    value="Inactive"
                    checked={formData.status === "Inactive"}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600">
                    Inactive
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-5 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
            >
              {initialData ? "Update Role" : "Create Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignUserRoleModal;
