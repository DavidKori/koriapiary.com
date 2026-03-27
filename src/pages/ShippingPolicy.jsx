// src/pages/ShippingPolicy.jsx
import React from 'react';
import SEO from '../components/common/SEO';
import { FiTruck, FiMapPin, FiClock, FiPackage, FiDollarSign, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import '../styles/policy.css';

const ShippingPolicy = () => {
  return (
    <>
      <SEO 
        title="Shipping Policy | Apiary Honey" 
        description="Learn about Apiary Honey's shipping policy including delivery times, costs, areas covered, and order tracking information."
      />
      
      <div className="policy-page">
        <div className="policy-hero">
          <div className="policy-hero-content">
            <FiTruck className="policy-hero-icon" />
            <h1>Shipping Policy</h1>
            <p>How we deliver our pure honey to your doorstep</p>
          </div>
        </div>

        <div className="policy-container">
          <div className="policy-content">
            <section className="policy-section">
              <h2>Delivery Areas</h2>
              <div className="policy-grid">
                <div className="policy-card">
                  <FiMapPin />
                  <h3>Nairobi & Major Towns</h3>
                  <p>We deliver to all areas within Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and other major towns across Kenya.</p>
                </div>
                <div className="policy-card">
                  <FiTruck />
                  <h3>Remote Areas</h3>
                  <p>We also deliver to remote areas, though delivery may take 5-7 business days. Contact us for specific locations.</p>
                </div>
              </div>
            </section>

            <section className="policy-section">
              <h2>Delivery Timeframes</h2>
              <div className="timeline-grid">
                <div className="timeline-item">
                  <div className="timeline-icon">1</div>
                  <h3>Order Processing</h3>
                  <p>1-2 business days</p>
                  <span>Orders are processed and packed carefully</span>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">2</div>
                  <h3>Nairobi Delivery</h3>
                  <p>2-3 business days</p>
                  <span>After processing, delivery within Nairobi</span>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">3</div>
                  <h3>Other Towns</h3>
                  <p>3-5 business days</p>
                  <span>Delivery to major towns across Kenya</span>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">4</div>
                  <h3>Remote Areas</h3>
                  <p>5-7 business days</p>
                  <span>Additional time for remote locations</span>
                </div>
              </div>
            </section>

            <section className="policy-section">
              <h2>Shipping Costs</h2>
              <div className="shipping-table">
                <div className="shipping-row header">
                  <span>Order Value</span>
                  <span>Shipping Cost</span>
                </div>
                <div className="shipping-row">
                  <span>Under KSh 10,000</span>
                  <span>KSh 299</span>
                </div>
                <div className="shipping-row highlight">
                  <span>KSh 10,000 and above</span>
                  <span className="free">FREE SHIPPING!</span>
                </div>
              </div>
              <div className="policy-note">
                <FiAlertCircle />
                <p>Free shipping applies to orders delivered within Kenya only. For bulk orders or special delivery arrangements, contact us for custom quotes.</p>
              </div>
            </section>

            <section className="policy-section">
              <h2>Order Tracking</h2>
              <p>Once your order is shipped, you will receive:</p>
              <ul className="policy-list">
                <li>Email confirmation with tracking number</li>
                <li>SMS notification with delivery updates (if phone number provided)</li>
                <li>Link to track your order in real-time</li>
              </ul>
              <p>You can also track your order by logging into your account and visiting the "My Orders" section.</p>
            </section>

            <section className="policy-section">
              <h2>Delivery Process</h2>
              <div className="process-steps">
                <div className="process-step">
                  <FiCheckCircle />
                  <h4>Order Confirmation</h4>
                  <p>Receive confirmation email with order details</p>
                </div>
                <div className="process-step">
                  <FiPackage />
                  <h4>Order Processing</h4>
                  <p>We carefully pack your honey for safe delivery</p>
                </div>
                <div className="process-step">
                  <FiTruck />
                  <h4>Dispatch & Tracking</h4>
                  <p>Order shipped with tracking information</p>
                </div>
                <div className="process-step">
                  <FiMapPin />
                  <h4>Delivery</h4>
                  <p>Arrives at your doorstep</p>
                </div>
              </div>
            </section>

            <section className="policy-section">
              <h2>Important Notes</h2>
              <div className="policy-notes">
                <div className="policy-note-item">
                  <FiAlertCircle />
                  <div>
                    <strong>Delivery Confirmation</strong>
                    <p>We may require proof of delivery for insurance purposes. Please ensure someone is available to receive the package.</p>
                  </div>
                </div>
                <div className="policy-note-item">
                  <FiClock />
                  <div>
                    <strong>Delivery Attempts</strong>
                    <p>Couriers typically make up to 2 delivery attempts. After failed attempts, you may need to pick up from the nearest collection point.</p>
                  </div>
                </div>
                <div className="policy-note-item">
                  <FiAlertCircle />
                  <div>
                    <strong>Damaged Packages</strong>
                    <p>If your package arrives damaged, please take photos and contact us within 24 hours for assistance.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;