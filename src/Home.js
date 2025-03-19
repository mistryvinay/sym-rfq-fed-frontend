import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { useNavigate } from "react-router-dom";
import TickerTape from "./components/TickerTape";
import NewOrders from "./components/NewOrders";
import OrderHistory from "./components/OrderHistory";
import Symphony from "./components/Symphony";

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Simulate user authentication for testing purposes
  useEffect(() => {
    setUser({ name: "Test User" });
  }, []);

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"}`}>
        <button
          type="button"
          className={`${theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"} font-bold py-2 px-4 rounded inline-flex items-center`}
          disabled
        >
          <svg className="mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill={theme === "dark" ? "#1a202c" : "#f7fafc"}
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </button>
      </div>
    );
  }

  const themeClasses = theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      {/* Header */}
      <header className="p-4 shadow-md bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold dark:text-gray-100">Trading App</h1>
      </header>

      {/* Main layout using Tailwind grid */}
      <main className="p-4 grid gap-4">
        <div>
          <TickerTape />
        </div>

        <div>
          <NewOrders />
        </div>

        {/* Two-column grid: OrderHistory on the left, Symphony on the right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OrderHistory />
          <div className="w-full">
            <Symphony />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;