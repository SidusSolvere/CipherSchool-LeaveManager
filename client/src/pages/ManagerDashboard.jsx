import { useEffect, useState } from "react";
import {
  getAllLeaves,
  updateLeaveStatus,
  getAllReimbursements,
  updateReimbursementStatus,
} from "../services/managerApi";
import {
  FiCheck,
  FiX,
  FiFileText,
  FiCalendar,
  FiUsers,
  FiExternalLink,
} from "react-icons/fi";
import ThemeControls from "../components/ThemeControls";

const ManagerDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);

  const fetchData = async () => {
    const leavesRes = await getAllLeaves();
    const reimbRes = await getAllReimbursements();
    setLeaves(leavesRes.data.leaves);
    setReimbursements(reimbRes.data.reimbursements);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateLeave = async (id, status) => {
    await updateLeaveStatus(id, status);
    fetchData();
  };

  const updateReimbursement = async (id, status) => {
    await updateReimbursementStatus(id, status);
    fetchData();
  };

  const statusBadge = (status) => {
    const base =
      "px-2 py-1 rounded-full text-xs font-medium border border-subtle";
    if (status === "APPROVED")
      return `${base} bg-green-500/10 text-green-500`;
    if (status === "REJECTED")
      return `${base} bg-red-500/10 text-red-500`;
    return `${base} bg-yellow-500/10 text-yellow-500`;
  };

  return (
    <div className="min-h-screen bg-main text-main p-6">
      <ThemeControls />

      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Manager Dashboard
          </h2>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <FiCalendar className="text-accent" />
            <h3 className="text-lg font-semibold">Employee Leaves</h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-subtle bg-elevated">
            <table className="min-w-full text-sm">
              <thead className="border-b border-subtle text-muted">
                <tr>
                  <th className="text-left px-4 py-3">Employee</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Dates</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr
                    key={l._id}
                    className="border-b border-subtle hover:bg-muted/40 transition-all"
                  >
                    <td className="px-4 py-3 flex items-center gap-2">
                      <FiUsers className="text-muted" />
                      {l.employeeId?.name}
                    </td>
                    <td className="px-4 py-3">{l.type}</td>
                    <td className="px-4 py-3">
                      {l.startDate.slice(0, 10)} →{" "}
                      {l.endDate.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusBadge(l.status)}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() =>
                          updateLeave(l._id, "APPROVED")
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all"
                      >
                        <FiCheck size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateLeave(l._id, "REJECTED")
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                      >
                        <FiX size={14} />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-6 text-center text-muted"
                    >
                      No leave requests
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <FiFileText className="text-accent" />
            <h3 className="text-lg font-semibold">
              Employee Reimbursements
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-subtle bg-elevated">
            <table className="min-w-full text-sm">
              <thead className="border-b border-subtle text-muted">
                <tr>
                  <th className="text-left px-4 py-3">Employee</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Receipt</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {reimbursements.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b border-subtle hover:bg-muted/40 transition-all"
                  >
                    <td className="px-4 py-3">
                      {r.employee?.name}
                    </td>
                    <td className="px-4 py-3">{r.category}</td>
                    <td className="px-4 py-3 font-medium">
                      ₹{r.amount}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={r.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent hover:underline"
                      >
                        View <FiExternalLink size={14} />
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusBadge(r.status)}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() =>
                          updateReimbursement(
                            r._id,
                            "APPROVED"
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all"
                      >
                        <FiCheck size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateReimbursement(
                            r._id,
                            "REJECTED"
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                      >
                        <FiX size={14} />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {reimbursements.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-6 text-center text-muted"
                    >
                      No reimbursement requests
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
};

export default ManagerDashboard;