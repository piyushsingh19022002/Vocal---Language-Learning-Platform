import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const token = localStorage.getItem('token');

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">V</div>
          <span className="logo-text">Vocal</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Courses</Link>
          <Link to="/" className="nav-link">About Us</Link>
          <Link to="/" className="nav-link">Contact</Link>
          {token ? (
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </nav>
        {!token && (
          <Link to="/login" className="btn-signup">
            Sign Up
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

