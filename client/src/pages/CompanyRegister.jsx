import { useState } from "react";
import {
  FiBriefcase,
  FiMail,
  FiHash,
  FiCheckCircle,
  FiAlertCircle,
  FiKey,
} from "react-icons/fi";
import { registerCompany } from "../services/companyApi";
import ThemeControls from "../components/ThemeControls";

export default function CompanyRegister() {
  const [form, setForm] = useState({
    name: "",
    emailDomain: "",
    governmentId: {
      idType: "GSTIN",
      idValue: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminCredentials, setAdminCredentials] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "idType" || name === "idValue") {
      setForm({
        ...form,
        governmentId: {
          ...form.governmentId,
          [name]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAdminCredentials(null);

    try {
      setLoading(true);
      const res = await registerCompany(form);
      setSuccess(res.data.message);
      setAdminCredentials(res.data.adminCredentials);
      setForm({
        name: "",
        emailDomain: "",
        governmentId: { idType: "GSTIN", idValue: "" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main text-main flex items-center justify-center px-4">
      <ThemeControls />

      <div className="w-full max-w-lg rounded-2xl border border-subtle bg-elevated p-8 shadow-xl">
        <h2 className="text-2xl font-semibold tracking-tight text-center">
          Register Your Company
        </h2>

        <p className="mt-2 text-center text-sm text-muted">
          Create your organization and admin account
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="relative">
            <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              name="name"
              placeholder="Company name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-subtle bg-main py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              name="emailDomain"
              placeholder="Email domain (example.com)"
              value={form.emailDomain}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-subtle bg-main py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <select
              name="idType"
              value={form.governmentId.idType}
              onChange={handleChange}
              className="w-full rounded-lg border border-subtle bg-main py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="CIN">CIN</option>
              <option value="LLPIN">LLPIN</option>
              <option value="PAN">PAN</option>
              <option value="GSTIN">GSTIN</option>
              <option value="UDYAM">UDYAM</option>
              <option value="SEBI">SEBI</option>
              <option value="OTHER">OTHER</option>
            </select>

            <div className="relative">
              <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                name="idValue"
                placeholder="Government ID"
                value={form.governmentId.idValue}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-subtle bg-main py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
              <FiAlertCircle />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-500">
              <FiCheckCircle />
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-medium text-white disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register Company"}
          </button>
        </form>

        {adminCredentials && (
          <div className="mt-6 rounded-xl border border-subtle bg-muted p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <FiKey className="text-accent" />
              Admin Account Created
            </h3>

            <p className="mt-2 text-sm">
              <span className="font-medium">Email:</span>{" "}
              {adminCredentials.email}
            </p>
            <p className="text-sm">
              <span className="font-medium">Password:</span>{" "}
              {adminCredentials.password}
            </p>

            <p className="mt-2 text-xs text-red-500">
              Save these credentials now. They will not be shown again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}