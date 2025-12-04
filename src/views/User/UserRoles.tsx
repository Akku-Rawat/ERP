import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";

interface Role {
  id: number;
  roleName: string;
  description: string;
  modulePermissions: string[];
  actionPermissions: string[];
  status: "Active" | "Inactive";
}

interface AssignUserRoleForm {
  roleName: string;
  description: string;
  modulePermissions: string[];
  actionPermissions: string[];
  status: "Active" | "Inactive";
}

interface UserRoleProps {
  roles: Role[];
  onSubmit: (data: AssignUserRoleForm, isEdit: boolean, roleId?: number) => void;
  onDelete: (id: number) => void;
}

const UserRole: React.FC<UserRoleProps> = ({ roles, onSubmit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const filteredRoles = roles.filter(role =>
    Object.values(role).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAdd = () => {
    setEditingRole(null);
    setShowModal(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setShowModal(true);
  };

  const handleModalSubmit = (data: AssignUserRoleForm) => {
    if (editingRole) {
      onSubmit(data, true, editingRole.id);
    } else {
      onSubmit(data, false);
    }
    setShowModal(false);
    setEditingRole(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search and Add Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <FaPlus /> Add Role
        </button>
      </div>

      {/* Role Table - Updated Theme */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Module Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 text-sm">{role.roleName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{role.description}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {role.modulePermissions.slice(0, 3).map((module, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {module}
                        </span>
                      ))}
                      {role.modulePermissions.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          +{role.modulePermissions.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {role.actionPermissions.slice(0, 3).map((action, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                        >
                          {action}
                        </span>
                      ))}
                      {role.actionPermissions.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          +{role.actionPermissions.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        role.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {role.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(role)}
                        className="text-indigo-600 hover:text-indigo-800 transition"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(role.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <FaInfoCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No roles found</p>
          </div>
        )}
      </div>

      {/* Role Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editingRole ? "Edit Role" : "Create Role"}
            </h2>
            <p className="text-gray-500 text-sm">
              Modal component would go here (AssignUserRoleModal)
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                setEditingRole(null);
              }}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Demo with sample data
export default function App() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      roleName: "Admin",
      description: "Full system access with all permissions",
      modulePermissions: ["Sales", "CRM", "Procurement", "Inventory", "Accounting"],
      actionPermissions: ["Create", "Read", "Update", "Delete", "Export"],
      status: "Active"
    },
    {
      id: 2,
      roleName: "Manager",
      description: "Department level access and management",
      modulePermissions: ["Sales", "CRM", "HR"],
      actionPermissions: ["Create", "Read", "Update"],
      status: "Active"
    },
    {
      id: 3,
      roleName: "Viewer",
      description: "Read-only access to reports",
      modulePermissions: ["Sales", "CRM"],
      actionPermissions: ["Read"],
      status: "Inactive"
    }
  ]);

  const handleSubmit = (data: AssignUserRoleForm, isEdit: boolean, roleId?: number) => {
    if (isEdit && roleId) {
      setRoles(roles.map(r => r.id === roleId ? { ...data, id: roleId } : r));
    } else {
      setRoles([...roles, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id: number) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  return (
    <UserRole
      roles={roles}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
}