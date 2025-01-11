import { NavLink } from "react-router";
import { useAuthStore } from "../../store/useAuthStore.tsx";

export default function Navbar() {
  const { authUser, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className=" p-4">
      <div className="container mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center ">
          <svg
            className="h-8 w-8 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="font-bold text-xl">MyApp</span>
        </NavLink>
        <div className="space-x-4">
          <NavLink to="/" className=" hover:text-gray-300">
            Home
          </NavLink>
          {authUser ? (
            <button onClick={handleLogout} className=" hover:text-gray-300">
              Logout
            </button>
          ) : (
            <NavLink to="/login" className=" hover:text-gray-300">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
