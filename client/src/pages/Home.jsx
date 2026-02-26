import { Link } from "react-router-dom";
import {
  FiLogIn,
  FiUserPlus,
  FiFileText,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";
import ThemeControls from "../components/ThemeControls";

export default function Home() {
  return (
    <div className="min-h-screen bg-main text-main flex flex-col">
      <ThemeControls />

      <header className="flex items-center justify-between px-6 py-4 border-b border-subtle">
        <h1 className="text-lg font-semibold tracking-tight">LeaveManager</h1>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-medium hover:text-accent"
          >
            <FiLogIn />
            Login
          </Link>

          <Link
            to="/register"
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            <FiUserPlus />
            Register
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Simple leave management for businesses
          </h2>

          <p className="mt-3 text-muted">
            Manage leaves, approvals, and receipts in one place.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-subtle bg-elevated p-6">
              <FiUsers className="mx-auto mb-3 text-2xl text-accent" />
              <p className="font-medium">Employee Leave Tracking</p>
            </div>

            <div className="rounded-xl border border-subtle bg-elevated p-6">
              <FiCheckCircle className="mx-auto mb-3 text-2xl text-accent" />
              <p className="font-medium">Approval Workflow</p>
            </div>

            <div className="rounded-xl border border-subtle bg-elevated p-6">
              <FiFileText className="mx-auto mb-3 text-2xl text-accent" />
              <p className="font-medium">Receipt Database</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-subtle px-6 py-4 text-center text-sm text-muted">
        Built for modern teams
      </footer>
    </div>
  );
}
