import React, { useContext, useRef, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate, Link } from "react-router-dom";

// Load Backend URL from Environment Variable
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      navigate("/login");
    } catch (error) {
      console.error("🚨 Logout Error:", error);
    }
  };

  // For now, simulate a user object
  const user = { name: "Test User", picture: "/path/to/profile/picture.jpg" };

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 p-4 shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo & Portal Title */}
        <div className="flex items-center space-x-3">
          <img
            src={
              theme === "dark"
                ? require("../images/Symphony_Glyph_Digital_FullColor.png")
                : require("../images/Symphony_Glyph_Digital_FullColor.png")
            }
            alt="Symphony Logo"
            className="h-6 w-auto"
          />
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            SymFX
          </Link>
        </div>

        {/* Right Side: Theme Toggle & Profile Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-md transition-all duration-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* <div className="relative flex items-center space-x-2">
            <img
              src={user.picture}
              alt="Profile"
              className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600"
            />
            <span className="text-gray-900 dark:text-white hidden md:inline">
              {user.name}
            </span>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>

            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-3 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 z-50"
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;