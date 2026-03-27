// src/pages/TermsOfService.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { 
  FiFileText, 
  FiShield, 
  FiShoppingBag, 
  FiCreditCard, 
  FiTruck, 
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiLock,
  FiUsers,
  FiMail,
  FiPhone,
  FiGlobe,
  FiBookOpen,
  FiFlag,
  FiHeart
} from 'react-icons/fi';
import '../styles/legal.css';

const TermsOfService = () => {
  const lastUpdated = "March 27, 2026";

  return (
    <>
      <SEO 
        title="Terms of Service | KoriDevifys" 
        description="Read the Terms of Service for KoriDevifys. Understand your rights and obligations when using our e-commerce platform and services."
      />
      
      <div className="legal-page">
        <div className="legal-hero">
          <div className="legal-hero-content">
            <FiFileText className="legal-hero-icon" />
            <h1>Terms of Service</h1>
            <p>Agreement between you and KoriDevifys</p>
            <div className="last-updated">Last Updated: {lastUpdated}</div>
          </div>
        </div>

        <div className="legal-container">
          <div className="legal-sidebar">
            <div className="sidebar-sticky">
              <h3>Contents</h3>
              <ul className="sidebar-nav">
                <li><a href="#acceptance">1. Acceptance of Terms</a></li>
                <li><a href="#changes">2. Changes to Terms</a></li>
                <li><a href="#account">3. Account Registration</a></li>
                <li><a href="#purchases">4. Purchases & Orders</a></li>
                <li><a href="#pricing">5. Pricing & Payments</a></li>
                <li><a href="#shipping">6. Shipping & Delivery</a></li>
                <li><a href="#returns">7. Returns & Refunds</a></li>
                <li><a href="#products">8. Product Information</a></li>
                <li><a href="#intellectual">9. Intellectual Property</a></li>
                <li><a href="#user-content">10. User Content</a></li>
                <li><a href="#prohibited">11. Prohibited Activities</a></li>
                <li><a href="#disclaimers">12. Disclaimers</a></li>
                <li><a href="#liability">13. Limitation of Liability</a></li>
                <li><a href="#indemnification">14. Indemnification</a></li>
                <li><a href="#termination">15. Termination</a></li>
                <li><a href="#governing">16. Governing Law</a></li>
                <li><a href="#contact">17. Contact Information</a></li>
              </ul>
            </div>
          </div>

          <div className="legal-content">
            <section id="acceptance" className="legal-section">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing or using the KoriDevifys website, mobile application, and services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.</p>
              <p>These Terms apply to all users of the Service, including customers, vendors, and contributors of content.</p>
            </section>

            <section id="changes" className="legal-section">
              <h2>2. Changes to Terms</h2>
              <p>We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page with an updated effective date. Your continued use of the Service after changes constitutes acceptance of the modified Terms.</p>
            </section>

            <section id="account" className="legal-section">
              <h2>3. Account Registration</h2>
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul className="legal-list">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
              <p>We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.</p>
            </section>

            <section id="purchases" className="legal-section">
              <h2>4. Purchases & Orders</h2>
              <p>When you place an order through our Service, you agree to:</p>
              <ul className="legal-list">
                <li>Provide accurate and complete order information</li>
                <li>Be at least 18 years of age or have parental consent</li>
                <li>Pay all charges incurred under your account</li>
                <li>Accept that orders are subject to acceptance and availability</li>
              </ul>
              <p>We reserve the right to refuse or cancel any order for reasons including product availability, pricing errors, or suspected fraud.</p>
            </section>

            <section id="pricing" className="legal-section">
              <h2>5. Pricing & Payments</h2>
              <div className="pricing-info">
                <h3>Pricing</h3>
                <p>All prices are listed in Kenyan Shillings (KES) and are subject to change without notice. Taxes and shipping fees are calculated at checkout.</p>
                
                <h3>Payment Methods</h3>
                <p>We accept payments via Paystack, including:</p>
                <ul className="legal-list">
                  <li>Credit and Debit Cards (Visa, Mastercard)</li>
                  <li>M-Pesa</li>
                  <li>Airtel Money</li>
                  <li>Bank Transfers (selected orders)</li>
                </ul>
                
                <div className="policy-note">
                  <FiLock />
                  <p>All payment processing is secured with 256-bit SSL encryption. We do not store your full payment information.</p>
                </div>
              </div>
            </section>

            <section id="shipping" className="legal-section">
              <h2>6. Shipping & Delivery</h2>
              <p>We ship to addresses within Kenya. Please refer to our <Link to="/shipping-policy">Shipping Policy</Link> for detailed information on:</p>
              <ul className="legal-list">
                <li>Delivery timeframes</li>
                <li>Shipping costs and free shipping thresholds</li>
                <li>Order tracking</li>
                <li>International shipping (currently not available)</li>
              </ul>
              <p>Delivery times are estimates and not guaranteed. We are not liable for delays caused by carriers or customs.</p>
            </section>

            <section id="returns" className="legal-section">
              <h2>7. Returns & Refunds</h2>
              <p>Our return policy varies by product type:</p>
              
              <div className="return-policy-details">
                <div className="policy-card">
                  <FiRefreshCw />
                  <h3>Honey Products</h3>
                  <p>Due to food safety regulations, honey products are non-returnable. Exceptions apply only for damaged, defective, or incorrect items reported within 48 hours of delivery.</p>
                </div>
                <div className="policy-card">
                  <FiShoppingBag />
                  <h3>Other Apiary Products</h3>
                  <p>Non-honey products (candles, skincare, accessories) are eligible for return within 14 days of delivery, unused and in original packaging.</p>
                </div>
              </div>
              
              <p>For complete details, please review our <Link to="/returns-policy">Returns Policy</Link>.</p>
            </section>

            <section id="products" className="legal-section">
              <h2>8. Product Information</h2>
              <p>We strive to provide accurate product descriptions and images. However, we do not warrant that:</p>
              <ul className="legal-list">
                <li>Product descriptions are complete, accurate, or error-free</li>
                <li>Colors and images accurately represent products</li>
                <li>Products will meet your expectations</li>
              </ul>
              <p>We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time.</p>
            </section>

            <section id="intellectual" className="legal-section">
              <h2>9. Intellectual Property</h2>
              <p>The Service and its content, features, and functionality are owned by KoriDevifys and are protected by copyright, trademark, and other intellectual property laws.</p>
              <p>You may not:</p>
              <ul className="legal-list">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use our trademarks without written consent</li>
                <li>Reproduce any part of the Service for commercial purposes</li>
              </ul>
            </section>

            <section id="user-content" className="legal-section">
              <h2>10. User Content</h2>
              <p>By submitting reviews, comments, or other content, you grant us a non-exclusive, royalty-free, perpetual license to use, modify, and display such content. You represent that you own or have permission to submit the content.</p>
              <p>We reserve the right to remove any content that violates these Terms.</p>
            </section>

            <section id="prohibited" className="legal-section">
              <h2>11. Prohibited Activities</h2>
              <p>You agree not to engage in any of the following:</p>
              <ul className="legal-list">
                <li>Violating any laws or regulations</li>
                <li>Interfering with the Service's security features</li>
                <li>Attempting to gain unauthorized access</li>
                <li>Using the Service for fraudulent purposes</li>
                <li>Uploading malicious code or viruses</li>
                <li>Harassing or abusing other users</li>
                <li>Reselling products without authorization</li>
              </ul>
            </section>

            <section id="disclaimers" className="legal-section">
              <h2>12. Disclaimers</h2>
              <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:</p>
              <ul className="legal-list">
                <li>The Service will be uninterrupted or error-free</li>
                <li>Results obtained from using the Service will be accurate</li>
                <li>Any errors will be corrected</li>
              </ul>
              <p>We disclaim all warranties, including implied warranties of merchantability and fitness for a particular purpose.</p>
            </section>

            <section id="liability" className="legal-section">
              <h2>13. Limitation of Liability</h2>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, KORIDEVIFYS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.</p>
              <p>Our total liability shall not exceed the amount you paid for products purchased through the Service.</p>
            </section>

            <section id="indemnification" className="legal-section">
              <h2>14. Indemnification</h2>
              <p>You agree to indemnify and hold harmless KoriDevifys, its officers, employees, and agents from any claims, damages, losses, or expenses arising from:</p>
              <ul className="legal-list">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you submit</li>
              </ul>
            </section>

            <section id="termination" className="legal-section">
              <h2>15. Termination</h2>
              <p>We may terminate or suspend your account immediately, without prior notice, for conduct that violates these Terms or is harmful to other users or the Service. Upon termination, your right to use the Service ceases immediately.</p>
            </section>

            <section id="governing" className="legal-section">
              <h2>16. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of Kenya.</p>
            </section>

            <section id="contact" className="legal-section contact-section">
              <h2>17. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us:</p>
              <div className="contact-options">
                <a href="mailto:admin@koridevs.getmx.net" className="contact-option">
                  <FiMail />
                  <span>admin@koridevs.getmx.net</span>
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

export default TermsOfService;