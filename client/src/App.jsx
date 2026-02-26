import CompanyRegister from "./pages/CompanyRegister";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import { Routes, Route } from "react-router-dom";

function App() {
  return(
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;