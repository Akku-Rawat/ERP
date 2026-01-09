import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Calendar,
  AlertTriangle,
  Check,
} from "lucide-react";

type LeaveType = {
  id: string;
  name: string;
  code: string;
  accrual: "Monthly" | "Yearly" | "One-time" | "On-demand";
  quota: number;
  carryForward: boolean;
  maxCarry: number;
  description?: string;
  isPaid: boolean;
  requiresApproval: boolean;
};

type LeavePolicy = {
  id: string;
  name: string;
  applicableFrom: string;
  status: "Active" | "Draft";
  leaveTypes: LeaveType[];
  usedBy: number;
};

// Mock data store
let policiesStore: LeavePolicy[] = [
  {
    id: "policy_1",
    name: "Standard Leave Policy 2025",
    applicableFrom: "2025-01-01",
    status: "Active",
    usedBy: 45,
    leaveTypes: [
      {
        id: "lt_1",
        name: "Annual Leave",
        code: "AL",
        accrual: "Monthly",
        quota: 24,
        carryForward: true,
        maxCarry: 12,
        isPaid: true,
        requiresApproval: true,
      },
      {
        id: "lt_2",
        name: "Sick Leave",
        code: "SL",
        accrual: "Yearly",
        quota: 14,
        carryForward: false,
        maxCarry: 0,
        isPaid: true,
        requiresApproval: false,
      },
      {
        id: "lt_3",
        name: "Maternity Leave",
        code: "ML",
        accrual: "One-time",
        quota: 90,
        carryForward: false,
        maxCarry: 0,
        isPaid: true,
        requiresApproval: true,
      },
      {
        id: "lt_4",
        name: "Compassionate Leave",
        code: "CL",
        accrual: "On-demand",
        quota: 5,
        carryForward: false,
        maxCarry: 0,
        isPaid: true,
        requiresApproval: true,
      },
    ],
  },
];

const getPolicies = () => [...policiesStore];
const createPolicy = (policy: LeavePolicy) => {
  policiesStore.push(policy);
};
const updatePolicy = (id: string, policy: LeavePolicy) => {
  const idx = policiesStore.findIndex((p) => p.id === id);
  if (idx >= 0) policiesStore[idx] = policy;
};
const deletePolicy = (id: string) => {
  policiesStore = policiesStore.filter((p) => p.id !== id);
};

export default function LeavePolicyTab() {
  const [policies, setPolicies] = useState<LeavePolicy[]>(getPolicies());
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LeavePolicy | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  const refreshPolicies = () => {
    setPolicies(getPolicies());
  };

  const handleCreateNew = () => {
    setEditingPolicy({
      id: `policy_${Date.now()}`,
      name: "",
      applicableFrom: new Date().toISOString().split("T")[0],
      status: "Draft",
      usedBy: 0,
      leaveTypes: [],
    });
    setShowModal(true);
  };

  const handleEdit = (policy: LeavePolicy) => {
    setEditingPolicy(JSON.parse(JSON.stringify(policy)));
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    const policy = policies.find((p) => p.id === id);
    if (policy && policy.usedBy > 0) {
      alert(
        `Cannot delete! This policy is used by ${policy.usedBy} employees.`,
      );
      return;
    }
    deletePolicy(id);
    refreshPolicies();
    setShowDeleteConfirm(null);
  };

  const handleSave = (policy: LeavePolicy) => {
    const existingIndex = policies.findIndex((p) => p.id === policy.id);
    if (existingIndex >= 0) {
      updatePolicy(policy.id, policy);
    } else {
      createPolicy(policy);
    }
    refreshPolicies();
    setShowModal(false);
    setEditingPolicy(null);
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Leave Policies
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage leave types and accrual rules
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Policy
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {policies.map((policy) => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            onEdit={handleEdit}
            onDelete={() => setShowDeleteConfirm(policy.id)}
          />
        ))}
      </div>

      {policies.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No leave policies created yet</p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Create Your First Policy
          </button>
        </div>
      )}

      {showModal && editingPolicy && (
        <PolicyModal
          policy={editingPolicy}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingPolicy(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          policy={policies.find((p) => p.id === showDeleteConfirm)!}
          onConfirm={() => handleDelete(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

function PolicyCard({
  policy,
  onEdit,
  onDelete,
}: {
  policy: LeavePolicy;
  onEdit: (p: LeavePolicy) => void;
  onDelete: () => void;
}) {
  const totalQuota = policy.leaveTypes.reduce((sum, lt) => sum + lt.quota, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {policy.name}
            </h3>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded ${
                policy.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {policy.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>📋 {policy.leaveTypes.length} leave types</span>
            <span>👥 Used by {policy.usedBy} employees</span>
            <span>
              📅 From: {new Date(policy.applicableFrom).toLocaleDateString()}
            </span>
            <span>📊 Total: {totalQuota} days/year</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(policy)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            disabled={policy.usedBy > 0}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {policy.leaveTypes.slice(0, 4).map((lt) => (
            <div key={lt.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-mono">
                  {lt.code}
                </span>
                <span className="text-gray-700">{lt.name}</span>
              </div>
              <span className="font-medium text-gray-900">{lt.quota}d</span>
            </div>
          ))}
          {policy.leaveTypes.length > 4 && (
            <p className="text-xs text-gray-500 col-span-2">
              +{policy.leaveTypes.length - 4} more types...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PolicyModal({
  policy,
  onSave,
  onClose,
}: {
  policy: LeavePolicy;
  onSave: (p: LeavePolicy) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<LeavePolicy>(policy);
  const [showLeaveTypeModal, setShowLeaveTypeModal] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(
    null,
  );

  const handleAddLeaveType = () => {
    setEditingLeaveType({
      id: `lt_${Date.now()}`,
      name: "",
      code: "",
      accrual: "Monthly",
      quota: 0,
      carryForward: false,
      maxCarry: 0,
      isPaid: true,
      requiresApproval: true,
    });
    setShowLeaveTypeModal(true);
  };

  const handleEditLeaveType = (leaveType: LeaveType) => {
    setEditingLeaveType(JSON.parse(JSON.stringify(leaveType)));
    setShowLeaveTypeModal(true);
  };

  const handleSaveLeaveType = (leaveType: LeaveType) => {
    const existingIndex = formData.leaveTypes.findIndex(
      (lt) => lt.id === leaveType.id,
    );
    if (existingIndex >= 0) {
      const updated = [...formData.leaveTypes];
      updated[existingIndex] = leaveType;
      setFormData({ ...formData, leaveTypes: updated });
    } else {
      setFormData({
        ...formData,
        leaveTypes: [...formData.leaveTypes, leaveType],
      });
    }
    setShowLeaveTypeModal(false);
    setEditingLeaveType(null);
  };

  const handleDeleteLeaveType = (id: string) => {
    if (confirm("Delete this leave type?")) {
      setFormData({
        ...formData,
        leaveTypes: formData.leaveTypes.filter((lt) => lt.id !== id),
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Please enter policy name");
      return;
    }
    if (formData.leaveTypes.length === 0) {
      alert("Please add at least one leave type");
      return;
    }
    onSave(formData);
  };

  const totalQuota = formData.leaveTypes.reduce((sum, lt) => sum + lt.quota, 0);
  const annualLeave = formData.leaveTypes.find((lt) => lt.code === "AL");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {policy.id.startsWith("policy_") ? "Create" : "Edit"} Leave Policy
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Define leave types and accrual rules
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Policy Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Standard Leave Policy 2025"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Applicable From *
                    </label>
                    <input
                      type="date"
                      value={formData.applicableFrom}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          applicableFrom: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "Active" | "Draft",
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                    </select>
                  </div>
                </div>

                {annualLeave && annualLeave.quota < 24 && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      Warning: Zambian Labour Law requires minimum 24 days
                      annual leave per year
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Leave Types
                  </h4>
                  <button
                    onClick={handleAddLeaveType}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Leave Type
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.leaveTypes.map((leaveType) => (
                    <div
                      key={leaveType.id}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 transition"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-mono">
                            {leaveType.code}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {leaveType.name}
                          </span>
                          {leaveType.carryForward && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                              Carry {leaveType.maxCarry}d
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>{leaveType.accrual}</span>
                          <span>•</span>
                          <span className="font-medium">
                            {leaveType.quota} days
                          </span>
                          <span>•</span>
                          <span>{leaveType.isPaid ? "Paid" : "Unpaid"}</span>
                          <span>•</span>
                          <span>
                            {leaveType.requiresApproval
                              ? "Needs approval"
                              : "No approval"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditLeaveType(leaveType)}
                          className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLeaveType(leaveType.id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {formData.leaveTypes.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        No leave types added yet
                      </p>
                      <button
                        onClick={handleAddLeaveType}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Add your first leave type
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200 p-4 sticky top-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  📅 Accrual Preview
                </h4>

                <div className="bg-white rounded-lg p-4 text-sm space-y-3">
                  <div className="text-center pb-3 border-b">
                    <p className="text-xs text-gray-600">Employee joins</p>
                    <p className="text-lg font-bold text-gray-900">
                      15 Mar 2025
                    </p>
                  </div>

                  {annualLeave && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        {annualLeave.name} ({annualLeave.quota} days/year):
                      </p>
                      <div className="space-y-1 pl-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Mar (prorated)</span>
                          <span className="font-medium">1 day</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">
                            Apr-Dec (9 months)
                          </span>
                          <span className="font-medium">18 days</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs font-semibold pt-2 mt-2 border-t">
                        <span>Total 2025</span>
                        <span className="text-green-600">19 days</span>
                      </div>

                      {annualLeave.carryForward && (
                        <div className="p-3 bg-blue-50 rounded border border-blue-200 mt-2">
                          <p className="text-xs text-gray-700">
                            <strong>Carry Forward:</strong> Up to{" "}
                            {annualLeave.maxCarry} days to 2026
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.leaveTypes.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Summary:
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">
                            Total leave types
                          </span>
                          <span className="font-medium">
                            {formData.leaveTypes.length}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">
                            Total quota/year
                          </span>
                          <span className="font-medium text-purple-600">
                            {totalQuota} days
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">
                            Paid leave types
                          </span>
                          <span className="font-medium">
                            {
                              formData.leaveTypes.filter((lt) => lt.isPaid)
                                .length
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200">
                  <p className="text-xs text-amber-800">
                    <strong>⚠️ Zambian Law:</strong> Minimum 24 days annual
                    leave required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Policy
          </button>
        </div>

        {showLeaveTypeModal && editingLeaveType && (
          <LeaveTypeModal
            leaveType={editingLeaveType}
            onSave={handleSaveLeaveType}
            onClose={() => {
              setShowLeaveTypeModal(false);
              setEditingLeaveType(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function LeaveTypeModal({
  leaveType,
  onSave,
  onClose,
}: {
  leaveType: LeaveType;
  onSave: (lt: LeaveType) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<LeaveType>(leaveType);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Please enter leave type name");
      return;
    }
    if (!formData.code.trim()) {
      alert("Please enter leave code");
      return;
    }
    if (formData.quota <= 0) {
      alert("Please enter valid quota");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            {leaveType.id.startsWith("lt_") ? "Add" : "Edit"} Leave Type
          </h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Leave Type Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Annual Leave, Sick Leave"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="AL, SL, ML"
                maxLength={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Accrual Method *
              </label>
              <select
                value={formData.accrual}
                onChange={(e) =>
                  setFormData({ ...formData, accrual: e.target.value as any })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="One-time">One-time</option>
                <option value="On-demand">On-demand</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Annual Quota (Days) *
              </label>
              <input
                type="number"
                value={formData.quota}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quota: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="24"
                min="0"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Carry Forward
                </label>
                <p className="text-xs text-gray-500">
                  Allow unused days to carry to next year
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.carryForward}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    carryForward: e.target.checked,
                    maxCarry: e.target.checked ? formData.maxCarry : 0,
                  })
                }
                className="w-4 h-4 text-purple-600 rounded"
              />
            </div>

            {formData.carryForward && (
              <div className="pl-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Maximum Carry Forward (Days) *
                </label>
                <input
                  type="number"
                  value={formData.maxCarry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxCarry: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="12"
                  min="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Paid Leave
                </label>
                <p className="text-xs text-gray-500">
                  Employee receives salary during leave
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.isPaid}
                onChange={(e) =>
                  setFormData({ ...formData, isPaid: e.target.checked })
                }
                className="w-4 h-4 text-purple-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Requires Approval
                </label>
                <p className="text-xs text-gray-500">
                  Manager approval needed before leave
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.requiresApproval}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiresApproval: e.target.checked,
                  })
                }
                className="w-4 h-4 text-purple-600 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Additional details about this leave type..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Preview:</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-mono">
                {formData.code || "---"}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {formData.name || "Leave Type Name"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {formData.accrual}
              </span>
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                {formData.quota} days/year
              </span>
              {formData.carryForward && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                  Carry {formData.maxCarry}d
                </span>
              )}
              <span
                className={`text-xs px-2 py-1 rounded ${
                  formData.isPaid
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {formData.isPaid ? "Paid" : "Unpaid"}
              </span>
              {formData.requiresApproval && (
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">
                  Needs Approval
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Leave Type
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  policy,
  onConfirm,
  onCancel,
}: {
  policy: LeavePolicy;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              Delete Leave Policy?
            </h4>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>"{policy.name}"</strong>?
            </p>
          </div>
        </div>

        {policy.usedBy > 0 ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-sm text-red-700">
              ⚠️ Cannot delete! This policy is used by{" "}
              <strong>{policy.usedBy} employees</strong>. Please reassign them
              first.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg mb-4">
            <p className="text-sm text-gray-700">
              This action cannot be undone. The policy and all{" "}
              {policy.leaveTypes.length} leave types will be permanently
              deleted.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={policy.usedBy > 0}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Policy
          </button>
        </div>
      </div>
    </div>
  );
}
