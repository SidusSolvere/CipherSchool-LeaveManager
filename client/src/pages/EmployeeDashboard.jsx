import { useEffect, useState } from "react";
import {
  applyLeave,
  getMyLeaves,
  applyReimbursement,
  getMyReimbursements,
} from "../services/employeeApi";

const EmployeeDashboard = () => {
  const [leaveForm, setLeaveForm] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [leaves, setLeaves] = useState([]);

  const [reimbursements, setReimbursements] = useState([]);
  const [reimbForm, setReimbForm] = useState({
    amount: "",
    category: "",
    description: "",
    receipt: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchLeaves = async () => {
    try {
      const res = await getMyLeaves();
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error("FETCH LEAVES ERROR", err);
    }
  };

  const fetchReimbursements = async () => {
    try {
      const res = await getMyReimbursements();
      setReimbursements(res.data.reimbursements || []);
    } catch (err) {
      console.error("FETCH REIMBURSEMENTS ERROR", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchReimbursements();
  }, []);

  const handleLeaveChange = (e) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await applyLeave(leaveForm);
      setMessage("Leave applied successfully");
      setLeaveForm({
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      fetchLeaves();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  const handleReimbChange = (e) => {
    const { name, value, files } = e.target;
    setReimbForm({
      ...reimbForm,
      [name]: files ? files[0] : value,
    });
  };

  const handleReimbSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("amount", reimbForm.amount);
    data.append("category", reimbForm.category);
    data.append("description", reimbForm.description);
    data.append("receipt", reimbForm.receipt);

    try {
      await applyReimbursement(data);
      setReimbForm({
        amount: "",
        category: "",
        description: "",
        receipt: null,
      });
      fetchReimbursements();
    } catch (err) {
      console.error("REIMBURSEMENT ERROR", err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px" }}>
      <h2>Employee Dashboard</h2>

      <h3>Apply Leave</h3>
      <form onSubmit={handleLeaveSubmit}>
        <select
          name="type"
          value={leaveForm.type}
          onChange={handleLeaveChange}
          required
        >
          <option value="">Select Leave Type</option>
          <option value="SICK">Sick</option>
          <option value="CASUAL">Casual</option>
          <option value="PAID">Paid</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={leaveForm.startDate}
          onChange={handleLeaveChange}
          required
        />

        <input
          type="date"
          name="endDate"
          value={leaveForm.endDate}
          onChange={handleLeaveChange}
          required
        />

        <textarea
          name="reason"
          value={leaveForm.reason}
          onChange={handleLeaveChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Applying..." : "Apply Leave"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h3>My Leaves</h3>
      {leaves.length === 0 ? (
        <p>No leaves applied yet.</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.type}</td>
                <td>{leave.startDate?.slice(0, 10)}</td>
                <td>{leave.endDate?.slice(0, 10)}</td>
                <td>{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      <h3>Apply Reimbursement</h3>
      <form onSubmit={handleReimbSubmit}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={reimbForm.amount}
          onChange={handleReimbChange}
          required
        />

        <select
          name="category"
          value={reimbForm.category}
          onChange={handleReimbChange}
          required
        >
          <option value="">Select Category</option>
          <option value="TRAVEL">Travel</option>
          <option value="FOOD">Food</option>
          <option value="OFFICE">Office</option>
          <option value="OTHER">Other</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={reimbForm.description}
          onChange={handleReimbChange}
        />

        <input
          type="file"
          name="receipt"
          accept="image/*,application/pdf"
          onChange={handleReimbChange}
          required
        />

        <button type="submit">Submit Reimbursement</button>
      </form>

      <hr />

      <h3>My Reimbursements</h3>
      {reimbursements.length === 0 ? (
        <p>No reimbursements submitted yet.</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {reimbursements.map((r) => (
              <tr key={r._id}>
                <td>{r.category}</td>
                <td>₹{r.amount}</td>
                <td>{r.status}</td>
                <td>
                  {r.receiptUrl ? (
                    <a
                      href={r.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    <span>Not available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeDashboard;
