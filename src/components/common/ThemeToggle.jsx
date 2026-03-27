// src/components/common/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import '../../styles/components.css'
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className={`theme-toggle-track ${theme}`}>
        <FiSun className="theme-icon sun" />
        <FiMoon className="theme-icon moon" />
        <div className={`theme-toggle-thumb ${theme}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;