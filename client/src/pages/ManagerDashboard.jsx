import { useEffect, useState } from "react";
import {
  getAllLeaves,
  updateLeaveStatus,
  getAllReimbursements,
  updateReimbursementStatus,
} from "../services/managerApi";

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

  return (
    <div style={{ padding: 20 }}>
      <h2>Manager Dashboard</h2>

      <h3>Employee Leaves</h3>
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Type</th>
            <th>Dates</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l._id}>
              <td>{l.employeeId?.name}</td>
              <td>{l.type}</td>
              <td>
                {l.startDate.slice(0, 10)} → {l.endDate.slice(0, 10)}
              </td>
              <td>{l.status}</td>
              <td>
                <button onClick={() => updateLeave(l._id, "APPROVED")}>
                  Approve
                </button>
                <button onClick={() => updateLeave(l._id, "REJECTED")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h3>Employee Reimbursements</h3>
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Receipt</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reimbursements.map((r) => (
            <tr key={r._id}>
              <td>{r.employee?.name}</td>
              <td>{r.category}</td>
              <td>₹{r.amount}</td>
              <td>
                <a href={r.receiptUrl} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => updateReimbursement(r._id, "APPROVED")}>
                  Approve
                </button>
                <button onClick={() => updateReimbursement(r._id, "REJECTED")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerDashboard;
