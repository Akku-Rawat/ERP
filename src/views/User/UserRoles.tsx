import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import AssignUserRoleModal
 from "../../components/User/AssignUserRoleModal";
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
    <div className="p-6 bg-app min-h-screen">
      {/* Search and Add Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium shadow-sm text-white bg-primary hover:bg-primary-600 transition"

        >
          <FaPlus /> Add Role
        </button>
      </div>

      {/* Role Table - Updated Theme */}
      <div className="bg-white rounded-lg shadow-sm border border-theme overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Role Name</th>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Description</th>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Module Permissions</th>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Action Permissions</th>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:row-hover transition-colors">
                  <td className="px-6 py-4 font-medium text-main text-sm">{role.roleName}</td>
                  <td className="px-6 py-4 text-sm text-muted max-w-xs truncate">{role.description}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {role.modulePermissions.slice(0, 3).map((module, idx) => (
                        <span
                          key={idx}
                          className="badge-theme"
                        >
                          {module}
                        </span>
                      ))}
                      {role.modulePermissions.length > 3 && (
                        <span className="badge-muted">
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
                          className="badge-theme"
                        >
                          {action}
                        </span>
                      ))}
                      {role.actionPermissions.length > 3 && (
                        <span className="badge-muted">
                          +{role.actionPermissions.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        role.status === "Active" ? "badge-success" : "btn-danger"

                      }`}
                    >
                      {role.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(role)}
                        className="text-primary hover:text-[var(--primary-700)] transition"

                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(role.id)}
                        className="text-danger hover:text-danger-700 transition"
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
            <FaInfoCircle className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-muted">No roles found</p>
          </div>
        )}
      </div>

      {/* Role Modal */}
   {showModal && (
        <AssignUserRoleModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingRole(null);
          }}
          onSubmit={handleModalSubmit}
          initialData={
            editingRole
              ? {
                  roleName: editingRole.roleName,
                  description: editingRole.description,
                  modulePermissions: editingRole.modulePermissions,
                  actionPermissions: editingRole.actionPermissions,
                  status: editingRole.status as "Active" | "Inactive",
                }
              : undefined
          }
        />
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