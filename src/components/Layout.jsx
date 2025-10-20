import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Movies", to: "/movies" },
    { label: "Add New Movie", to: "/movies/add" },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-900 shadow-lg border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="text-2xl font-bold text-red-600 hover:text-red-400 transition-colors">
            🎬 MovieHub
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex gap-6">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`relative px-4 py-2 text-gray-300 font-semibold transition-colors hover:text-white
                    ${location.pathname === to ? "text-red-500" : ""}
                    after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white 
                    after:transition-all after:duration-300
                    ${
                      location.pathname === to
                        ? "after:w-full"
                        : "after:w-0 hover:after:w-full"
                    }`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Logout */}
          <button
            onClick={handleLogout}
            className="hidden md:flex px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors items-center gap-2">
            <FaSignInAlt /> Logout
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-300 text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 border-t border-gray-800 pt-4 space-y-3">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`block text-gray-300 hover:text-white font-semibold px-2 py-1 ${
                  location.pathname === to ? "text-red-500" : ""
                }`}>
                {label}
              </Link>
            ))}

            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
              <FaSignInAlt /> Logout
            </button>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
