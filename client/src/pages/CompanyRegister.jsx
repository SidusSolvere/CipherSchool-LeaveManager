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

    try {
      setLoading(true);
      await registerCompany(form);
      setSuccess("Company registered successfully");
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
    <div >
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
    </div>
  );
}