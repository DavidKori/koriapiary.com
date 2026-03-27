// src/components/home/Newsletter.jsx
import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { FiMail, FiCheck } from 'react-icons/fi';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Simulate subscription - in real app, call API
    console.log('Newsletter subscription:', email);
    
    setSubscribed(true);
    setEmail('');
    showToast('Successfully subscribed to newsletter!', 'success');
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 3000);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-content">
        <h2>Join the Hive</h2>
        <p>Subscribe for honey recipes, beekeeping tips, and exclusive offers</p>
        
        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="newsletter-input-wrapper">
            <FiMail className="input-icon" />
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
              required
              disabled={subscribed}
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn btn-primary btn-glow ${subscribed ? 'success' : ''}`}
            disabled={subscribed}
          >
            {subscribed ? (
              <>
                <FiCheck /> Subscribed!
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>

        <p className="newsletter-note">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;