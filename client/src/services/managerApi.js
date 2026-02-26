import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/manager",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getAllLeaves = () => API.get("/leaves");
export const updateLeaveStatus = (id, status) =>
  API.patch(`/leaves/${id}`, { status });

export const getAllReimbursements = () => API.get("/reimbursements");
export const updateReimbursementStatus = (id, status) =>
  API.patch(`/reimbursements/${id}`, { status });
