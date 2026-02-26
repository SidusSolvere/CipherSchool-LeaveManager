import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Link to="/login">Login</Link>
      <Link to="/register">CompanyRegister</Link>
    </>
  );
}
