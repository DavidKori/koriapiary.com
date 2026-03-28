// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube,FaCcVisa,FaMobileAlt, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { FaLocationCrosshairs, FaBusinessTime } from "react-icons/fa6";
import { GiHoneypot } from "react-icons/gi";
import { MdCall,MdOutlineEmail  } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate()
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-title"><GiHoneypot /> Apiary Honey</h3>
            <p className="footer-description">
              Pure, organic honey from our family-owned apiary. 
              Sustainable beekeeping practices since 2015.
            </p>
            <div className="social-links">
              <a href="https://web.facebook.com/profile.php?id=61577051360197" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://x.com/mutugidavid37" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/kooridavid" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://youtube.com/@koridevifys?si=54YYr2DEa4kdMt_y" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li onClick={() =>navigate('/about')} className='link'>About Us</li>
              <li onClick={() =>navigate('/products')} className='link'>Our Products</li>
              <li onClick={() =>navigate('/blog')} className='link'>Blog</li>
              <li onClick={() =>navigate('/contact')} className='link'>Contact</li>
              <li onClick={() =>navigate('/projects')} className='link'>Projects</li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Customer Service</h4>
            <ul className="footer-links">
              <li onClick={() =>navigate('/faq')} className='link'>FAQ</li>
              <li onClick={() =>navigate('/shipping')} className='link'>Shipping Policy</li>
              <li onClick={() =>navigate('/returns')} className='link'>Returns</li>
              <li onClick={() =>navigate('/privacy')} className='link'>Privacy Policy</li>
              <li onClick={() =>navigate('/terms')} className='link'>Terms of Service</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Us</h4>
            <ul className="footer-contact">
              <li><FaLocationCrosshairs/> 41 Kerugoya, Kenya</li>
              <a tel='+254 115 685 773'><li><MdCall/> +254 115 685 773</li></a>
              <li><MdOutlineEmail/> mutugidavid37@gmail.com</li>
              <li><FaBusinessTime /> Mon-Fri: 9am - 6pm</li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="footer-newsletter">
          <h4>Subscribe to Our Newsletter</h4>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Apiary Honey. All rights reserved.</p>
          <div className="payment-methods">
            <span><FaCcVisa color="#1A1F71" /> <span className='willHide'>Visa</span> </span>
            <span><FaCcMastercard color="#EB001B" /> <span className='willHide'>Mastercard</span> </span>
            <span><FaCcPaypal color="#003087" /> <span className='willHide'>PayPal</span></span>
            <span><FaMobileAlt color="#34B233" /> <span className='willHide'>M-Pesa</span> </span> 
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;