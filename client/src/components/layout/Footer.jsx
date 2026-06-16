  import React from 'react';
  import { Link } from 'react-router-dom';
  import { MapPin, Phone, Mail } from "lucide-react";
  import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaLinkedin
  } from "react-icons/fa";
  import './Footer.css';

  const Footer = () => {
    return (
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              Shop<span>Ease</span>
            </Link>
            <p>Your one-stop destination for modern, high-quality products. We bring style and convenience to your doorstep.</p>
            <div className="social-links">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <Link to="/shop">Shop All</Link>
            <Link to="/cart">My Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/about">About Us</Link>
          </div>

          <div className="footer-links">
            <h3>Support</h3>
            <Link to="/faq">FAQs</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>

          <div className="footer-contact">
            <h3>Get in Touch</h3>
            <div className="contact-item">
              <MapPin size={18} />
              <span>123 Commerce St, Tech City</span>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <span>+1 234 567 890</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>support@shopease.com</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 ShopEase. All rights reserved.</p>
        </div>
      </footer>
    );
  };

  export default Footer;
