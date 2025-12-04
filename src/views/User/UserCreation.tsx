import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";

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

      {/* User Table - Updated Theme */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="bg-primary px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="bg-primary px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="bg-primary px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                <th className="bg-primary px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="bg-primary px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Language</th>
                <th className="bg-primary px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="bg-primary px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="bg-primary px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 text-sm">
                    {user.firstName} {user.middleName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.language}</td>
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
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FaInfoCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editingUser ? "Edit User" : "Create User"}
            </h2>
            <p className="text-gray-500 text-sm">
              Modal component would go here (CreateUserModal)
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                setEditingUser(null);
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
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: "John",
      middleName: "A",
      lastName: "Doe",
      gender: "Male",
      phone: "+1234567890",
      dob: "1990-01-01",
      email: "john.doe@example.com",
      username: "johndoe",
      language: "English",
      timezone: "UTC",
      role: "Admin",
      status: "Active"
    },
    {
      id: 2,
      firstName: "Jane",
      middleName: "B",
      lastName: "Smith",
      gender: "Female",
      phone: "+0987654321",
      dob: "1992-05-15",
      email: "jane.smith@example.com",
      username: "janesmith",
      language: "English",
      timezone: "EST",
      role: "User",
      status: "Active"
    }
  ]);

  const roles: Role[] = [
    { id: 1, roleName: "Admin", description: "Administrator", status: "Active" },
    { id: 2, roleName: "User", description: "Regular User", status: "Active" }
  ];

  const handleSubmit = (data: UserFormData, isEdit: boolean, userId?: number) => {
    if (isEdit && userId) {
      setUsers(users.map(u => u.id === userId ? { ...data, id: userId } : u));
    } else {
      setUsers([...users, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <UserCreation
      users={users}
      roles={roles}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
}