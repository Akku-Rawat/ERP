import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
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
    <div className="p-6 bg-app min-h-screen">
      {/* Search and Add Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition bg-card text-main"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium shadow-sm bg-primary hover:bg-primary-600 transition"
        >
          <FaPlus /> Add User
        </button>
      </div>

      {/* User Table - Updated Theme */}
      <div className="bg-card rounded-lg shadow-sm border border-theme overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Name</th>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Email</th>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Username</th>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Phone</th>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Language</th>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Role</th>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Status</th>
                <th className="table-head px-6 py-3 text-left text-xs font-semibold text-table-head-text uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:row-hover transition-colors">
                  <td className="px-6 py-4 font-medium text-main text-sm">
                    {user.firstName} {user.middleName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-muted">{user.username}</td>
                  <td className="px-6 py-4 text-sm text-muted">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-muted">{user.language}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--row-hover)', color: 'var(--primary)' }}>
                      {user.role || "No Role"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "badge-success"
                          : "btn-danger"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-primary hover:text-primary-700 transition"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(user.id)}
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FaInfoCircle className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-muted">No users found</p>
          </div>
        )}
      </div>

      {/* User Modal */}
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