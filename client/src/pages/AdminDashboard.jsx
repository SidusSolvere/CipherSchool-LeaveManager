import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/adminAPI";
import {
  FiUsers,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiUserPlus,
} from "react-icons/fi";
import ThemeControls from "../components/ThemeControls";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    password: "",
    role: "EMPLOYEE",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingUser) {
      await updateUser(editingUser._id, form);
      setEditingUser(null);
    } else {
      await createUser(form);
    }

    setForm({
      name: "",
      email: "",
      employeeId: "",
      password: "",
      role: "EMPLOYEE",
    });

    loadUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      role: user.role,
      password: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      await deleteUser(id);
      loadUsers();
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-main text-main p-6">
      <ThemeControls />

      <div className="max-w-6xl mx-auto space-y-10">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FiUsers className="text-accent" />
          Admin Dashboard
        </h2>

        <div className="rounded-2xl border border-subtle bg-elevated p-6 space-y-4">
          <h3 className="flex items-center gap-2 font-semibold">
            <FiUserPlus className="text-accent" />
            {editingUser ? "Edit User" : "Add User"}
          </h3>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="rounded-lg border border-subtle bg-main p-2.5"
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="rounded-lg border border-subtle bg-main p-2.5"
            />
            <input
              placeholder="Employee ID"
              value={form.employeeId}
              onChange={(e) =>
                setForm({ ...form, employeeId: e.target.value })
              }
              required
              className="rounded-lg border border-subtle bg-main p-2.5"
            />

            {!editingUser && (
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                className="rounded-lg border border-subtle bg-main p-2.5"
              />
            )}

            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="rounded-lg border border-subtle bg-main p-2.5"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>

            <div className="flex gap-3 md:col-span-2">
              <button className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white">
                {editingUser ? "Update User" : "Add User"}
              </button>

              {editingUser && (
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-lg border border-subtle px-5 py-2.5"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-subtle bg-elevated p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="font-semibold">Users</h3>

            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-muted" />
              <input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-lg border border-subtle bg-main p-2.5"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-subtle text-muted">
                <tr>
                  <th className="text-left py-2">Name</th>
                  <th>Email</th>
                  <th>Employee ID</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b border-subtle">
                    <td className="py-2">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.employeeId}</td>
                    <td>{u.role}</td>
                    <td className="flex gap-3 py-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-accent inline-flex items-center gap-1"
                      >
                        <FiEdit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-500 inline-flex items-center gap-1"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-muted">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}