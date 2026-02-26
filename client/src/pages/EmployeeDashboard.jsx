import { useEffect, useState } from "react";
import {
  applyLeave,
  getMyLeaves,
  applyReimbursement,
  getMyReimbursements,
} from "../services/employeeApi";
import {
  FiCalendar,
  FiFileText,
  FiUpload,
  FiCheckCircle,
  FiAlertCircle,
  FiExternalLink,
} from "react-icons/fi";
import ThemeControls from "../components/ThemeControls";

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
    const res = await getMyLeaves();
    setLeaves(res.data.leaves || []);
  };

  const fetchReimbursements = async () => {
    const res = await getMyReimbursements();
    setReimbursements(res.data.reimbursements || []);
  };

  useEffect(() => {
    fetchLeaves();
    fetchReimbursements();
  }, []);

  const handleLeaveChange = (e) =>
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await applyLeave(leaveForm);
      setMessage("Leave applied successfully");
      setLeaveForm({ type: "", startDate: "", endDate: "", reason: "" });
      fetchLeaves();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  const handleReimbChange = (e) => {
    const { name, value, files } = e.target;
    setReimbForm({ ...reimbForm, [name]: files ? files[0] : value });
  };

  const handleReimbSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(reimbForm).forEach(([k, v]) => data.append(k, v));
    await applyReimbursement(data);
    setReimbForm({
      amount: "",
      category: "",
      description: "",
      receipt: null,
    });
    fetchReimbursements();
  };

  const badge = (status) =>
    status === "APPROVED"
      ? "bg-green-500/10 text-green-500"
      : status === "REJECTED"
      ? "bg-red-500/10 text-red-500"
      : "bg-yellow-500/10 text-yellow-500";

  return (
    <div className="min-h-screen bg-main text-main p-6">
      <ThemeControls />

      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="text-2xl font-semibold">Employee Dashboard</h2>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-subtle bg-elevated p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <FiCalendar className="text-accent" />
              Apply Leave
            </h3>

            <form onSubmit={handleLeaveSubmit} className="mt-4 space-y-4">
              <select
                name="type"
                value={leaveForm.type}
                onChange={handleLeaveChange}
                required
                className="w-full rounded-lg border border-subtle bg-main p-2.5"
              >
                <option value="">Leave Type</option>
                <option value="SICK">Sick</option>
                <option value="CASUAL">Casual</option>
                <option value="PAID">Paid</option>
              </select>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="startDate"
                  value={leaveForm.startDate}
                  onChange={handleLeaveChange}
                  required
                  className="rounded-lg border border-subtle bg-main p-2.5"
                />
                <input
                  type="date"
                  name="endDate"
                  value={leaveForm.endDate}
                  onChange={handleLeaveChange}
                  required
                  className="rounded-lg border border-subtle bg-main p-2.5"
                />
              </div>

              <textarea
                name="reason"
                placeholder="Reason"
                value={leaveForm.reason}
                onChange={handleLeaveChange}
                required
                className="w-full rounded-lg border border-subtle bg-main p-2.5"
              />

              <button
                disabled={loading}
                className="w-full rounded-lg bg-accent py-2.5 font-medium text-white"
              >
                {loading ? "Applying..." : "Apply Leave"}
              </button>

              {message && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <FiCheckCircle />
                  {message}
                </div>
              )}
            </form>
          </div>

          <div className="rounded-2xl border border-subtle bg-elevated p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <FiFileText className="text-accent" />
              Apply Reimbursement
            </h3>

            <form onSubmit={handleReimbSubmit} className="mt-4 space-y-4">
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={reimbForm.amount}
                onChange={handleReimbChange}
                required
                className="w-full rounded-lg border border-subtle bg-main p-2.5"
              />

              <select
                name="category"
                value={reimbForm.category}
                onChange={handleReimbChange}
                required
                className="w-full rounded-lg border border-subtle bg-main p-2.5"
              >
                <option value="">Category</option>
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
                className="w-full rounded-lg border border-subtle bg-main p-2.5"
              />

              <label className="flex items-center gap-2 cursor-pointer text-sm text-accent">
                <FiUpload />
                Upload Receipt
                <input
                  type="file"
                  name="receipt"
                  onChange={handleReimbChange}
                  className="hidden"
                  required
                />
              </label>

              <button className="w-full rounded-lg bg-accent py-2.5 font-medium text-white">
                Submit Reimbursement
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-2xl border border-subtle bg-elevated p-6">
          <h3 className="font-semibold mb-4">My Leaves</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted border-b border-subtle">
                <tr>
                  <th className="text-left py-2">Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l._id} className="border-b border-subtle">
                    <td className="py-2">{l.type}</td>
                    <td>{l.startDate?.slice(0, 10)}</td>
                    <td>{l.endDate?.slice(0, 10)}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${badge(
                          l.status
                        )}`}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-subtle bg-elevated p-6">
          <h3 className="font-semibold mb-4">My Reimbursements</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted border-b border-subtle">
                <tr>
                  <th className="text-left py-2">Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {reimbursements.map((r) => (
                  <tr key={r._id} className="border-b border-subtle">
                    <td className="py-2">{r.category}</td>
                    <td>₹{r.amount}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${badge(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.receiptUrl && (
                        <a
                          href={r.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-accent"
                        >
                          View <FiExternalLink size={14} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;