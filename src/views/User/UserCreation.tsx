import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import CreateUserModal from '../../components/User/CreateUserModal';

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
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search and Add Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <FaPlus /> Add User
        </button>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Username</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Language</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.firstName} {user.middleName} {user.lastName}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">{user.username}</td>
                <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                <td className="px-6 py-4 text-gray-600">{user.language}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                    {user.role || "No Role"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
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
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-800 transition"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
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
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">No users found</div>
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
