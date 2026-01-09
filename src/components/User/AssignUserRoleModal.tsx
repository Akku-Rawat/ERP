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
    {
      id: "create",
      name: "Create",
      icon: <FaPlus />,
      color: "text-[var(--success)]",
    },
    { id: "edit", name: "Edit", icon: <FaEdit />, color: "text-primary" },
    {
      id: "delete",
      name: "Delete",
      icon: <FaTrash />,
      color: "text-[var(--danger)]",
    },
    { id: "view", name: "View", icon: <FaEye />, color: "text-muted" },
    {
      id: "export",
      name: "Export",
      icon: <FaShareSquare />,
      color: "text-primary",
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar border border-[var(--border)]">
        {/* Header */}
        <div className="sticky top-0 bg-primary/10 border-b border-[var(--border)] px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-primary flex items-center gap-3">
            <FaUsers className="text-2xl" />
            {initialData ? "Edit Role" : "Add New Role"}
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
          <div className="space-y-6">
            {/* Role Name */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Role Name <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                type="text"
                value={formData.roleName}
                onChange={(e) => handleChange("roleName", e.target.value)}
                className="w-full px-4 py-2.5 bg-app border border-[var(--border)] rounded-xl text-main placeholder:text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="e.g. Admin, HR Manager, Sales Executive"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-app border border-[var(--border)] rounded-xl text-main placeholder:text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all"
                placeholder="Role summary and responsibilities..."
              />
            </div>

            {/* Module Permissions */}
            <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-main flex items-center gap-2">
                  <FaBoxOpen className="text-lg text-primary" />
                  Module Permissions{" "}
                  <span className="text-[var(--danger)]">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllModules}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-[var(--primary-600)] px-3 py-1.5 bg-card rounded-lg hover:bg-primary/10 transition-colors border border-[var(--border)]"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearAllModules}
                    className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-[var(--danger)] px-3 py-1.5 bg-card rounded-lg hover:bg-[var(--danger)]/10 transition-colors border border-[var(--border)]"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {moduleOptions.map((module) => (
                  <label
                    key={module.id}
                    className={`flex items-center gap-2 p-3 bg-card border-2 rounded-xl cursor-pointer transition-all ${
                      formData.modulePermissions.includes(module.name)
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-[var(--border)] hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.modulePermissions.includes(module.name)}
                      onChange={() => togglePermission("module", module.name)}
                      className="w-4 h-4 rounded accent-[var(--primary)] cursor-pointer"
                    />
                    <span className="text-lg text-primary">{module.icon}</span>
                    <span className="text-xs font-semibold text-main">
                      {module.name}
                    </span>
                  </label>
                ))}
              </div>

              {formData.modulePermissions.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    ✓ {formData.modulePermissions.length} module(s) selected
                  </span>
                </div>
              )}
            </div>

            {/* Action Permissions */}
            <div className="bg-[var(--success)]/5 p-5 rounded-2xl border border-[var(--success)]/20">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-main flex items-center gap-2">
                  <FaEye className="text-lg text-[var(--success)]" />
                  Action Permissions{" "}
                  <span className="text-[var(--danger)]">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllActions}
                    className="text-[10px] font-black uppercase tracking-widest text-[var(--success)] hover:opacity-80 px-3 py-1.5 bg-card rounded-lg hover:bg-[var(--success)]/10 transition-colors border border-[var(--border)]"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearAllActions}
                    className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-[var(--danger)] px-3 py-1.5 bg-card rounded-lg hover:bg-[var(--danger)]/10 transition-colors border border-[var(--border)]"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {actionOptions.map((action) => (
                  <label
                    key={action.id}
                    className={`flex items-center gap-2 p-3 bg-card border-2 rounded-xl cursor-pointer transition-all ${
                      formData.actionPermissions.includes(action.name)
                        ? "border-[var(--success)] bg-[var(--success)]/5 shadow-md shadow-[var(--success)]/10"
                        : "border-[var(--border)] hover:border-[var(--success)]/50 hover:bg-[var(--success)]/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.actionPermissions.includes(action.name)}
                      onChange={() => togglePermission("action", action.name)}
                      className="w-4 h-4 rounded accent-[var(--success)] cursor-pointer"
                    />
                    <span className={`text-lg ${action.color}`}>
                      {action.icon}
                    </span>
                    <span className={`text-xs font-semibold ${action.color}`}>
                      {action.name}
                    </span>
                  </label>
                ))}
              </div>

              {formData.actionPermissions.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--success)] bg-[var(--success)]/10 px-3 py-1.5 rounded-full">
                    ✓ {formData.actionPermissions.length} action(s) selected
                  </span>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-main mb-3">
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
                    name="roleStatus"
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
              {initialData ? "Update Role" : "Create Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignUserRoleModal;
