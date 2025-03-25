import React, { useContext, useRef, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate, Link } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const reconnectInterval = 5000; // 5 seconds restart

  useEffect(() => {
    let ws;
    let reconnectTimeout;

    const connect = () => {
      ws = new WebSocket("ws://localhost:8000/ws/orders");
      ws.onopen = () => {
        console.log("WebSocket connected in Navbar");
        setSocketConnected(true);
      };
      ws.onclose = () => {
        console.log("WebSocket disconnected in Navbar, attempting reconnect in 5 seconds");
        setSocketConnected(false);
        reconnectTimeout = setTimeout(connect, reconnectInterval);
      };
      ws.onerror = (error) => {
        console.error("WebSocket error in Navbar:", error);
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      ws && ws.close();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* Right Side: Connection Indicator, Theme Toggle & Profile Menu */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div
              className={`w-3 h-3 rounded-full ${
                socketConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {socketConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-md transition-all duration-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;