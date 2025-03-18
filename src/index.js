import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from "./context/ThemeContext";
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ThemeProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>
);