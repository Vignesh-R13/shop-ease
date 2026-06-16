import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Sun, Moon, Search, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartItems, wishlist } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <Link to="/" className="logo">
          Shop<span>Ease</span>
        </Link>

        {/* Desktop Search */}
        <div className="nav-search">
          <input type="text" placeholder="Search products..." />
          <Search size={20} className="search-icon" />
        </div>

        {/* Desktop Nav */}
        <div className="nav-links">
          <Link to="/shop">Shop</Link>
          <Link to="/cart" className="nav-icon-link">
            <ShoppingCart size={22} />
            {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
          </Link>
          <Link to="/wishlist" className="nav-icon-link">
            <Heart size={22} />
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </Link>
          
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
          </button>

          {user ? (
            <div className="user-menu">
              <User size={22} />
              <div className="dropdown">
                <Link to="/profile">Profile</Link>
                {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="mobile-nav fade-in">
          <Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart ({cartItems.length})</Link>
          <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist ({wishlist.length})</Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
