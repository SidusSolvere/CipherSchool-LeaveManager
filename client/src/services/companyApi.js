import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/company",
});

export const registerCompany = (data) => API.post("/register", data);
