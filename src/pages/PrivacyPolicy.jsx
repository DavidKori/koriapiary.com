// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { 
  FiShield, 
  FiLock, 
  FiEye, 
  FiMail, 
  FiDatabase, 
  FiGlobe, 
  FiUserCheck,
  FiAlertCircle,
  FiFileText,
  FiBell,
  FiTrash2,
  FiCheckCircle,
  FiPhone
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter,FaCookie } from 'react-icons/fa';
import '../styles/legal.css';
import { FaBalanceScale } from "react-icons/fa";


const PrivacyPolicy = () => {
  const lastUpdated = "March 27, 2026";

  return (
    <>
      <SEO 
        title="Privacy Policy | KoriDevifys" 
        description="Learn how KoriDevifys collects, uses, and protects your personal information. Read our privacy policy to understand your rights and our practices."
      />
      
      <div className="legal-page">
        <div className="legal-hero">
          <div className="legal-hero-content">
            <FiShield className="legal-hero-icon" />
            <h1>Privacy Policy</h1>
            <p>Your privacy matters to us. Learn how we protect your information.</p>
            <div className="last-updated">Last Updated: {lastUpdated}</div>
          </div>
        </div>

        <div className="legal-container">
          <div className="legal-sidebar">
            <div className="sidebar-sticky">
              <h3>Contents</h3>
              <ul className="sidebar-nav">
                <li><a href="#introduction">1. Introduction</a></li>
                <li><a href="#information">2. Information We Collect</a></li>
                <li><a href="#usage">3. How We Use Your Information</a></li>
                <li><a href="#sharing">4. Information Sharing</a></li>
                <li><a href="#security">5. Data Security</a></li>
                <li><a href="#cookies">6. Cookies & Tracking</a></li>
                <li><a href="#rights">7. Your Rights</a></li>
                <li><a href="#children">8. Children's Privacy</a></li>
                <li><a href="#international">9. International Transfers</a></li>
                <li><a href="#changes">10. Changes to Policy</a></li>
                <li><a href="#contact">11. Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="legal-content">
            <section id="introduction" className="legal-section">
              <h2>1. Introduction</h2>
              <p>Welcome to KoriDevifys ("we," "our," "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
              <p>By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with any part of this policy, please do not use our services.</p>
            </section>

            <section id="information" className="legal-section">
              <h2>2. Information We Collect</h2>
              <div className="info-grid">
                <div className="info-card">
                  <FiUserCheck />
                  <h3>Personal Information</h3>
                  <ul>
                    <li>Name and contact details (email, phone number)</li>
                    <li>Billing and shipping addresses</li>
                    <li>Account credentials (username, password)</li>
                    <li>Profile information and preferences</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
                <div className="info-card">
                  <FiDatabase />
                  <h3>Transaction Information</h3>
                  <ul>
                    <li>Order history and details</li>
                    <li>Payment information (processed securely via Paystack)</li>
                    <li>Shipping and delivery information</li>
                    <li>Return and refund records</li>
                  </ul>
                </div>
                <div className="info-card">
                  <FiGlobe />
                  <h3>Technical Information</h3>
                  <ul>
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent</li>
                    <li>Location data (with your consent)</li>
                    <li>Cookies and similar technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="usage" className="legal-section">
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="legal-list">
                <li><FiCheckCircle /> Process and fulfill your orders</li>
                <li><FiCheckCircle /> Communicate with you about orders, updates, and promotions</li>
                <li><FiCheckCircle /> Improve our website, products, and services</li>
                <li><FiCheckCircle /> Personalize your experience and recommendations</li>
                <li><FiCheckCircle /> Prevent fraud and ensure security</li>
                <li><FiCheckCircle /> Comply with legal obligations</li>
                <li><FiCheckCircle /> Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section id="sharing" className="legal-section">
              <h2>4. Information Sharing</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
              <div className="sharing-grid">
                <div className="sharing-item">
                  <strong>Service Providers</strong>
                  <p>Payment processors (Paystack), shipping carriers, email service providers who assist in our operations.</p>
                </div>
                <div className="sharing-item">
                  <strong>Business Partners</strong>
                  <p>Third parties who help us provide our services, under strict confidentiality agreements.</p>
                </div>
                <div className="sharing-item">
                  <strong>Legal Requirements</strong>
                  <p>When required by law, court order, or to protect our rights and safety.</p>
                </div>
                <div className="sharing-item">
                  <strong>Business Transfers</strong>
                  <p>In connection with a merger, acquisition, or sale of assets, with notice to you.</p>
                </div>
              </div>
            </section>

            <section id="security" className="legal-section">
              <h2>5. Data Security</h2>
              <p>We implement appropriate technical and organizational security measures to protect your personal information:</p>
              <div className="security-features">
                <div className="security-feature">
                  <FiLock />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="security-feature">
                  <FiShield />
                  <span>PCI-DSS Compliant Payment Processing</span>
                </div>
                <div className="security-feature">
                  <FiEye />
                  <span>Regular Security Audits</span>
                </div>
                <div className="security-feature">
                  <FiDatabase />
                  <span>Secure Data Storage</span>
                </div>
              </div>
              <div className="policy-note">
                <FiAlertCircle />
                <p>While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.</p>
              </div>
            </section>

            <section id="cookies" className="legal-section">
              <h2>6. Cookies & Tracking Technologies</h2>
              <p>We use cookies and similar tracking technologies to enhance your experience. Types of cookies we use:</p>
              <div className="cookie-types">
                <div className="cookie-type">
                  <FaCookie />
                  <div>
                    <strong>Essential Cookies</strong>
                    <p>Required for basic site functionality and security.</p>
                  </div>
                </div>
                <div className="cookie-type">
                  <FaCookie />
                  <div>
                    <strong>Functional Cookies</strong>
                    <p>Remember your preferences and settings.</p>
                  </div>
                </div>
                <div className="cookie-type">
                  <FaCookie />
                  <div>
                    <strong>Analytics Cookies</strong>
                    <p>Help us understand how visitors use our site.</p>
                  </div>
                </div>
                <div className="cookie-type">
                  <FaCookie />
                  <div>
                    <strong>Marketing Cookies</strong>
                    <p>Used to deliver relevant advertisements.</p>
                  </div>
                </div>
              </div>
              <p>You can manage cookie preferences through your browser settings.</p>
            </section>

            <section id="rights" className="legal-section">
              <h2>7. Your Rights</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul className="legal-list">
                <li><strong>Right to Access</strong> - Request a copy of your personal data</li>
                <li><strong>Right to Rectification</strong> - Correct inaccurate information</li>
                <li><strong>Right to Erasure</strong> - Request deletion of your data (subject to legal obligations)</li>
                <li><strong>Right to Restrict Processing</strong> - Limit how we use your data</li>
                <li><strong>Right to Data Portability</strong> - Receive your data in a structured format</li>
                <li><strong>Right to Object</strong> - Object to certain processing activities</li>
                <li><strong>Right to Withdraw Consent</strong> - Withdraw consent at any time</li>
              </ul>
              <p>To exercise these rights, contact us at <a href="mailto:privacy@koridevifys.com">privacy@koridevifys.com</a>.</p>
            </section>

            <section id="children" className="legal-section">
              <h2>8. Children's Privacy</h2>
              <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.</p>
            </section>

            <section id="international" className="legal-section">
              <h2>9. International Data Transfers</h2>
              <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.</p>
            </section>

            <section id="changes" className="legal-section">
              <h2>10. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date. We encourage you to review this policy periodically.</p>
            </section>

            <section id="contact" className="legal-section contact-section">
              <h2>11. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="contact-options">
                <a href="mailto:admin@koridevs.getmx.net" className="contact-option">
                  <FiMail />
                  <span>admin@koridevs.getmx.net</span>
                </a>
                <a href="mailto:info@koridevifys.com" className="contact-option">
                  <FiMail />
                  <span>info@koridevifys.com</span>
                </a>
                <a href="tel:+254115685773" className="contact-option">
                  <FiPhone />
                  <span>+254 115 685 773</span>
                </a>
              </div>
              <div className="business-address">
                <h4>Business Address:</h4>
                <p>KoriDevifys<br />
                Nairobi, Kenya<br />
                P.O. Box 12345-00100</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;