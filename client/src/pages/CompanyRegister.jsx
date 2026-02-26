import { useState } from "react";
import { registerCompany } from "../services/companyApi";

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
    <div>
      <h2>Company Registration</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="emailDomain"
          placeholder="Email Domain (example.com)"
          value={form.emailDomain}
          onChange={handleChange}
          required
        />

        <select
          name="idType"
          value={form.governmentId.idType}
          onChange={handleChange}
        >
          <option value="CIN">CIN</option>
          <option value="LLPIN">LLPIN</option>
          <option value="PAN">PAN</option>
          <option value="GSTIN">GSTIN</option>
          <option value="UDYAM">UDYAM</option>
          <option value="SEBI">SEBI</option>
          <option value="OTHER">OTHER</option>
        </select>

        <input
          name="idValue"
          placeholder="Government ID Value"
          value={form.governmentId.idValue}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      {adminCredentials && adminCredentials.email && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            border: "1px solid #ccc",
          }}
        >
          <h3>Admin Account Created</h3>

          <p>
            <strong>Email:</strong> {adminCredentials.email}
          </p>

          <p>
            <strong>Password:</strong> {adminCredentials.password}
          </p>

          <p style={{ color: "red" }}>
            ⚠ Save this password now. It will not be shown again.
          </p>
        </div>
      )}
    </div>
  );
}
