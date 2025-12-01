import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import CreateUserModal from "../../components/User/CreateUserModal";

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
  status: "Active" | "Inactive"; // this must be same everywhere
}

interface User extends UserFormData {
  id: number;
}

interface UserCreationProps {
  users: User[];
  roles: Role[];
  onSubmit: (data: UserFormData, isEdit: boolean, userId?: number) => void;
  onDelete: (id: number) => void;
}

const UserCreation: React.FC<UserCreationProps> = ({
  users,
  roles,
  onSubmit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleModalSubmit = (data: UserFormData) => {
    if (editingUser) {
      onSubmit(data, true, editingUser.id);
    } else {
      onSubmit(data, false);
    }
    setShowModal(false);
    setEditingUser(null);
  };

  return (
    <div>
      {/* Search and Add Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <button
          onClick={handleAdd}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Add User
        </button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Language
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
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
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {user.firstName} {user.middleName} {user.lastName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.username}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.phone}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.language}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                    {user.role || "No Role"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
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
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No users found</div>
        )}
      </div>

      {/* User Modal */}
      {showModal && (
        <CreateUserModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
          onSubmit={handleModalSubmit}
          initialData={editingUser ?? undefined}
          availableRoles={roles}
        />
      )}
    </div>
  );
};

export default UserCreation;
