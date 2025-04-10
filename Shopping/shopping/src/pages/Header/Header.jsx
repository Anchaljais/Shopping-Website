import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ cartItemCount }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Mobile menu button (hidden on desktop) */}
        <button 
          className="mobile-menu-button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-highlight">Shop</span>Hub
        </Link>

        {/* Main Navigation */}
        <nav className={`main-nav ${showMobileMenu ? 'mobile-show' : ''}`} ref={mobileMenuRef}>
          <div className="nav-categories">
            <Link to="/" className="nav-link">
              Men
            </Link>
            <Link to="/" className="nav-link">
              Women
            </Link>
            <Link to="/" className="nav-link highlight">
              New Arrivals
            </Link>
            <Link to="/" className="nav-link sale">
              Sale
            </Link>
          </div>
        </nav>

        {/* User Actions */}
        <div className="user-actions">
          {/* Search Button */}
          <button 
            className="action-button search-button"
            onClick={() => navigate('/search')}
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>

          {/* Cart Button */}
          <button 
            className="action-button cart-button"
            onClick={() => navigate('/cart')}
            aria-label="Cart"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" 
                stroke="currentColor" strokeWidth="2"/>
            </svg>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="profile-dropdown" ref={dropdownRef}>
            <button 
              className="action-button profile-button"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="Profile"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
                  stroke="currentColor" strokeWidth="2"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" 
                  stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/account" className="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
                      stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" 
                      stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  My Account
                </Link>
                <Link to="/orders" className="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" 
                      stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 12H15" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 16H15" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" 
                      stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  My Orders
                </Link>
                <button 
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M17 16L21 12M21 12L17 8M21 12H7M13 16V17C13 18.1046 12.1046 19 11 19H6C4.89543 19 4 18.1046 4 17V7C4 5.89543 4.89543 5 6 5H11C12.1046 5 13 5.89543 13 7V8" 
                      stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;