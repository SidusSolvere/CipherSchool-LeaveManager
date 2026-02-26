import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/employee",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const applyLeave = (data) => API.post("/leaves", data);
export const getMyLeaves = () => API.get("/leaves");

export const applyReimbursement = (formData) =>
  API.post("/reimbursements", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getMyReimbursements = () => API.get("/reimbursements");
