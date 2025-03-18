// filepath: c:\Users\vinay\Downloads\Development\sym-rfq-fed-workflow\frontend\src\components\TradingLayout.js
import React, { useState, useEffect, useContext } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css"; // Import react-grid-layout default styles
import "react-resizable/css/styles.css";    // Import react-resizable default styles
import { ThemeContext } from "../context/ThemeContext"; 
import { useNavigate } from "react-router-dom";

// We wrap the Responsive grid with a WidthProvider
const ResponsiveGridLayout = WidthProvider(Responsive);

const TradingLayout = () => {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Temporarily remove the backend user login check
  useEffect(() => {
    // Simulate user authentication for testing purposes
    setUser({ name: "Test User" });
  }, []);

  // If user is not loaded, show a loading spinner (similar to your existing code)
  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
        }`}
      >
        <button
          type="button"
          className={`${
            theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
          } font-bold py-2 px-4 rounded inline-flex items-center`}
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

  // For react-grid-layout, define some layout specs:
  const layout = [
    // i = item key, x/y = position on grid, w/h = width/height in grid units
    { i: "panel1", x: 0, y: 0, w: 4, h: 4 },
    { i: "panel2", x: 4, y: 0, w: 4, h: 4 },
    { i: "panel3", x: 8, y: 0, w: 4, h: 4 },
  ];

  // For responsive, you can define different breakpoints if needed
  const layouts = { lg: layout };

  // Example panels content; replace with your real data
  const panels = [
    {
      key: "panel1",
      title: "Market Overview",
      content: "Live market data, indices, etc.",
    },
    {
      key: "panel2",
      title: "Order Book",
      content: "Order book details here...",
    },
    {
      key: "panel3",
      title: "Trade History",
      content: "Historical trades, times, prices...",
    },
  ];

  // Classes that handle light/dark backgrounds
  const themeClasses =
    theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const outlineClass = "border-2 border-gray-500"; // Add this class for the outline

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      {/* Example Header */}
      <header className="p-4 shadow-md bg-white dark:bg-gray-800">
        <h1 className="text-xl font-bold dark:text-gray-100">Trading Layout</h1>
      </header>

      {/* The main grid layout container */}
      <main className="p-4">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          // If you want to allow resizing and dragging:
          isDraggable={true}
          isResizable={true}
          // If you want to allow items to move only within container
          useCSSTransforms={true}
          compactType="vertical"
          preventCollision={false}
        >
          {panels.map((panel) => (
            <div
              key={panel.key}
              className={`flex flex-col rounded shadow-md overflow-hidden ${cardBg} ${outlineClass}`}
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{panel.title}</h2>
                <p className="text-sm">{panel.content}</p>
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      </main>
    </div>
  );
};

export default TradingLayout;