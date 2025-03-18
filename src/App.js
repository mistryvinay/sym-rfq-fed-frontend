import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import TradingLayout from "./components/TradingLayout";
import Navbar from "./components/Navbar"; // Import Navbar
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trading-layout" element={<TradingLayout />} />
          {/* other routes... */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;