import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/adminAPI";

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
      u.employeeId.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      <input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 10, width: "300px" }}
      />

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
          required
        />
        {!editingUser && (
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        )}

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit">
          {editingUser ? "Update User" : "Add User"}
        </button>

        {editingUser && (
          <button type="button" onClick={() => setEditingUser(null)}>
            Cancel
          </button>
        )}
      </form>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Employee ID</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.employeeId}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
