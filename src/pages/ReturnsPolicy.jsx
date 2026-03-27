// src/pages/ReturnsPolicy.jsx
import React from 'react';
import SEO from '../components/common/SEO';
import { FiRefreshCw, FiAlertCircle, FiCheckCircle, FiPackage, FiClock, FiMail, FiPhone } from 'react-icons/fi';
import { GiHoneyJar } from "react-icons/gi";
import { FaWhatsapp } from "react-icons/fa";

import '../styles/policy.css';

const ReturnsPolicy = () => {
  return (
    <>
      <SEO 
        title="Returns Policy | Apiary Honey" 
        description="Apiary Honey's returns and refunds policy. Learn about our no-return policy on honey and return conditions for other apiary products."
      />
      
      <div className="policy-page">
        <div className="policy-hero">
          <div className="policy-hero-content">
            <FiRefreshCw className="policy-hero-icon" />
            <h1>Returns & Refunds Policy</h1>
            <p>Our commitment to quality and customer satisfaction</p>
          </div>
        </div>

        <div className="policy-container">
          <div className="policy-content">
            {/* Honey Policy - Non-returnable */}
            <section className="policy-section important">
              <div className="policy-warning">
                <GiHoneyJar className="warning-icon" />
                <div className="warning-content">
                  <h2>Honey Products - Non-Returnable</h2>
                  <p>Due to food safety regulations and hygiene standards, <strong>honey products are not eligible for return or exchange</strong> once purchased. This policy is in place to ensure the highest quality and safety for all our customers.</p>
                </div>
              </div>
              <div className="policy-exceptions">
                <h3>Exceptions for Honey Products:</h3>
                <ul className="policy-list">
                  <li>Damaged during shipping (must report within 24 hours of delivery)</li>
                  <li>Defective packaging or seal broken upon arrival</li>
                  <li>Wrong product delivered</li>
                </ul>
                <div className="policy-note">
                  <FiAlertCircle />
                  <p>If your honey product falls under the exceptions above, please contact us immediately with your order number and photos of the damage/issue.</p>
                </div>
              </div>
            </section>

            {/* Other Apiary Products */}
            <section className="policy-section">
              <h2>Other Apiary Products</h2>
              <p>For non-honey products including beeswax candles, skincare products, and accessories, we offer a <strong>14-day return policy</strong>.</p>
              
              <h3>Eligibility for Returns:</h3>
              <ul className="policy-list">
                <li>Items must be unused and in original condition</li>
                <li>Original packaging must be intact</li>
                <li>Returns must be initiated within 14 days of delivery</li>
                <li>Proof of purchase is required</li>
              </ul>

              <div className="policy-grid two-columns">
                <div className="policy-card">
                  <FiCheckCircle />
                  <h3>Items Eligible for Return</h3>
                  <ul>
                    <li>Beeswax candles (unused)</li>
                    <li>Lip balms and skincare (unopened)</li>
                    <li>Honey pots and accessories (unused)</li>
                    <li>Apiary merchandise</li>
                  </ul>
                </div>
                <div className="policy-card">
                  <FiAlertCircle />
                  <h3>Items NOT Eligible for Return</h3>
                  <ul>
                    <li>Any honey products</li>
                    <li>Opened skincare products</li>
                    <li>Used candles</li>
                    <li>Items damaged due to misuse</li>
                    <li>Sale or clearance items</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Return Process */}
            <section className="policy-section">
              <h2>Return Process</h2>
              <div className="process-steps">
                <div className="process-step">
                  <div className="step-number">1</div>
                  <h4>Contact Us</h4>
                  <p>Email us at returns@apiaryhoney.com with your order number and reason for return</p>
                </div>
                <div className="process-step">
                  <div className="step-number">2</div>
                  <h4>Get Approval</h4>
                  <p>Receive return authorization and instructions</p>
                </div>
                <div className="process-step">
                  <div className="step-number">3</div>
                  <h4>Package Item</h4>
                  <p>Pack the item securely in original packaging</p>
                </div>
                <div className="process-step">
                  <div className="step-number">4</div>
                  <h4>Ship Back</h4>
                  <p>Send the item to our return address (customer responsible for return shipping costs)</p>
                </div>
                <div className="process-step">
                  <div className="step-number">5</div>
                  <h4>Inspection & Refund</h4>
                  <p>We inspect the item and process refund within 5-7 business days</p>
                </div>
              </div>
            </section>

            {/* Refund Information */}
            <section className="policy-section">
              <h2>Refund Information</h2>
              <div className="refund-details">
                <div className="refund-item">
                  <FiClock />
                  <div>
                    <strong>Processing Time</strong>
                    <p>Refunds are processed within 5-7 business days after we receive and inspect the returned item.</p>
                  </div>
                </div>
                <div className="refund-item">
                  <FiPackage />
                  <div>
                    <strong>Original Payment Method</strong>
                    <p>Refunds will be issued to the original payment method used at checkout.</p>
                  </div>
                </div>
                <div className="refund-item">
                  <FiAlertCircle />
                  <div>
                    <strong>Shipping Costs</strong>
                    <p>Original shipping costs are non-refundable. Return shipping costs are the responsibility of the customer unless the return is due to our error.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Damaged or Defective Items */}
            <section className="policy-section">
              <h2>Damaged or Defective Items</h2>
              <div className="policy-warning light">
                <div className="warning-content">
                  <p>If you receive a damaged or defective product:</p>
                  <ul>
                    <li>Take clear photos of the damage</li>
                    <li>Contact us within 48 hours of delivery</li>
                    <li>Provide your order number and photos</li>
                    <li>We will arrange a replacement or refund promptly</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="policy-section contact-section">
              <h2>Need Help?</h2>
              <p>If you have any questions about our returns policy, please contact our customer service team:</p>
              <div className="contact-options">
                <a href="mailto:admin@koridevs.getmx.net" className="contact-option">
                  <FiMail />
                  <span>admin@koridevs.getmx.net</span>
                </a>
                <a href="tel:+254115685773" className="contact-option">
                  <FiPhone />
                  <span>+254 115 685 773</span>
                </a>
                <a href="https://wa.me/254115685773" className="contact-option" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp />
                  <span>WhatsApp Support</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnsPolicy;