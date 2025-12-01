import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import AssignUserRoleModal from '../../components/User/AssignUserRoleModal';



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
    <div>
      {/* Search and Add Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <button
          onClick={handleAdd}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Add Role
        </button>
      </div>

      {/* Role Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module Permissions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action Permissions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRoles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {role.roleName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {role.description}
                </td>
                <td className="px-4 py-3 text-sm">
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
                <td className="px-4 py-3 text-sm">
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
                <td className="px-4 py-3 text-sm">
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
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(role.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
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
        {filteredRoles.length === 0 && (
          <div className="text-center py-8 text-gray-500">No roles found</div>
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
    initialData={editingRole ? {
      roleName: editingRole.roleName,
      description: editingRole.description,
      modulePermissions: editingRole.modulePermissions,
      actionPermissions: editingRole.actionPermissions,
      status: editingRole.status as "Active" | "Inactive"
    } : undefined}
  />
)}
    </div>
  );
};

export default UserRole;