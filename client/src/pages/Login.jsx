import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from "react-icons/fi";
import { loginUser } from "../services/authApi";
import ThemeControls from "../components/ThemeControls";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await loginUser(form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMIN") navigate("/admin/dashboard");
      else if (user.role === "MANAGER") navigate("/manager/dashboard");
      else if (user.role === "EMPLOYEE") navigate("/employee/dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main text-main flex items-center justify-center px-4">
      <ThemeControls />

      <div className="w-full max-w-md rounded-2xl border border-subtle bg-elevated p-8 shadow-xl">
        <h2 className="text-2xl font-semibold tracking-tight text-center">
          Sign in
        </h2>

        <p className="mt-2 text-center text-muted text-sm">
          Access your company dashboard
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-subtle bg-main py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-subtle bg-main py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
              <FiAlertCircle />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-medium text-white disabled:opacity-60"
          >
            <FiLogIn />
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}