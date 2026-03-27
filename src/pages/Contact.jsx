// src/pages/Contact.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import SEO from '../components/common/SEO';
import { useToast } from '../context/ToastContext';
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiClock, 
  FiSend, 
  FiCheckCircle, 
  FiAlertCircle,
  FiMessageSquare,
  FiUser,
  FiPackage,
  FiTruck,
  FiRefreshCw,
  FiShoppingBag,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiLinkedin
} from 'react-icons/fi';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import '../styles/contact.css';

const Contact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    orderNumber: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const toastShownRef = useRef(false);
  
  // Formspree hook - Replace with your Formspree form ID
  const [state, handleSubmit] = useForm("xnjonwvw"); // Replace with your actual form ID

  const subjects = [
    'General Inquiry',
    'Product Information',
    'Order Issue',
    'Returns & Refunds',
    'Wholesale Inquiry',
    'Partnership',
    'Feedback',
    'Other'
  ];

  // Reset form when submission is successful
  useEffect(() => {
    if (state.succeeded && !toastShownRef.current) {
      toastShownRef.current = true;
      setSubmitted(true);
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      
      // Reset form data
      setFormData({
        name: '',
        email: '',
        subject: '',
        orderNumber: '',
        message: ''
      });
      
      // Reset submitted state after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        toastShownRef.current = false;
      }, 5000);
    }
  }, [state.succeeded, showToast]);

  // Show error toast if submission fails
  useEffect(() => {
    if (state.errors && Object.keys(state.errors).length > 0 && !toastShownRef.current) {
      toastShownRef.current = true;
      showToast('Failed to send message. Please try again.', 'error');
      
      setTimeout(() => {
        toastShownRef.current = false;
      }, 3000);
    }
  }, [state.errors, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Reset toast ref on new submission
    toastShownRef.current = false;
    
    if (!validateForm()) {
      showToast('Please fill in all required fields correctly', 'error');
      return;
    }
    
    // Submit to Formspree
    await handleSubmit(e);
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: 'Visit Us',
      details: ['Nairobi, Kenya', 'P.O. Box 12345-00100'],
      link: null
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      details: ['+254 115 685 773', '+254 722 000 000'],
      link: 'tel:+254115685773'
    },
    {
      icon: FiMail,
      title: 'Email Us',
      details: ['info@apiaryhoney.com', 'support@apiaryhoney.com'],
      link: 'mailto:info@apiaryhoney.com'
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM', 'Sunday: Closed'],
      link: null
    }
  ];

  const quickSupport = [
    {
      icon: FiShoppingBag,
      title: 'Order Issues',
      description: 'Having trouble with your order?',
      email: 'orders@apiaryhoney.com',
      phone: '+254 115 685 773'
    },
    {
      icon: FiRefreshCw,
      title: 'Returns & Refunds',
      description: 'Questions about returns?',
      email: 'returns@apiaryhoney.com',
      phone: '+254 115 685 773'
    },
    {
      icon: FiPackage,
      title: 'Wholesale',
      description: 'Interested in bulk orders?',
      email: 'wholesale@apiaryhoney.com',
      phone: '+254 115 685 773'
    },
    {
      icon: FiTruck,
      title: 'Shipping',
      description: 'Questions about delivery?',
      email: 'shipping@apiaryhoney.com',
      phone: '+254 115 685 773'
    }
  ];

  return (
    <>
      <SEO 
        title="Contact Us - Apiary Honey" 
        description="Get in touch with Apiary Honey. Contact us for inquiries about our pure honey, orders, returns, wholesale, or any questions you may have."
      />
      
      <div className="contact-page">
        {/* Hero Section */}
        <div className="contact-hero">
          <div className="contact-hero-content">
            <h1>Get in Touch</h1>
            <p>We'd love to hear from you. Reach out with any questions, feedback, or inquiries.</p>
          </div>
        </div>

        <div className="contact-container">
          {/* Contact Info Cards */}
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="contact-info-card">
                  <div className="info-icon">
                    <Icon />
                  </div>
                  <h3>{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i}>{detail}</p>
                  ))}
                  {info.link && (
                    <a href={info.link} className="info-link">
                      {info.title === 'Call Us' ? 'Call Now' : 'Send Email'}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Support Section */}
          <div className="quick-support">
            <h2>Quick Support</h2>
            <p className="quick-support-subtitle">Need immediate help? Contact our specialized teams</p>
            <div className="quick-support-grid">
              {quickSupport.map((support, index) => {
                const Icon = support.icon;
                return (
                  <div key={index} className="quick-support-card">
                    <div className="support-icon">
                      <Icon />
                    </div>
                    <h3>{support.title}</h3>
                    <p>{support.description}</p>
                    <div className="support-contact">
                      <a href={`mailto:${support.email}`} className="support-email">
                        <FiMail /> {support.email}
                      </a>
                      <a href={`tel:${support.phone}`} className="support-phone">
                        <FiPhone /> {support.phone}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form & Map Section */}
          <div className="contact-form-section">
            <div className="form-container">
              <div className="form-header">
                <FiMessageSquare className="form-header-icon" />
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours</p>
              </div>

              <form onSubmit={onSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      <FiUser />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                    <ValidationError 
                      prefix="Name" 
                      field="name"
                      errors={state.errors}
                      className="error-text"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <FiMail />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                    <ValidationError 
                      prefix="Email" 
                      field="email"
                      errors={state.errors}
                      className="error-text"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="subject">
                      <FiMessageSquare />
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={errors.subject ? 'error' : ''}
                    >
                      <option value="">Select a subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    {errors.subject && <span className="error-text">{errors.subject}</span>}
                    <ValidationError 
                      prefix="Subject" 
                      field="subject"
                      errors={state.errors}
                      className="error-text"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="orderNumber">
                      <FiPackage />
                      Order Number (if applicable)
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder="e.g., ORD-123456"
                    />
                    <ValidationError 
                      prefix="Order Number" 
                      field="orderNumber"
                      errors={state.errors}
                      className="error-text"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    <FiMessageSquare />
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className={errors.message ? 'error' : ''}
                  />
                  {errors.message && <span className="error-text">{errors.message}</span>}
                  <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                    className="error-text"
                  />
                  <div className="message-counter">
                    {formData.message.length}/500 characters
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`submit-btn ${state.submitting ? 'submitting' : ''} ${submitted ? 'submitted' : ''}`}
                  disabled={state.submitting}
                >
                  {state.submitting ? (
                    <>
                      <div className="spinner"></div>
                      Sending...
                    </>
                  ) : submitted ? (
                    <>
                      <FiCheckCircle />
                      Sent!
                    </>
                  ) : (
                    <>
                      <FiSend />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map Section */}
            <div className="map-container">
              <h3>Our Location</h3>
              <div className="map-wrapper">
                <iframe
                  title="Apiary Honey Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819218666914!2d36.821476!3d-1.286389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d4b5e3e3e3%3A0x8e5e5e5e5e5e5e5e!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1647888888888!5m2!1sen!2ske"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="map-note">
                <FiMapPin />
                <p>Visit our Nairobi location. Call ahead to schedule an appointment.</p>
              </div>
            </div>
          </div>

          {/* WhatsApp & Social Section */}
          <div className="social-section">
            <div className="whatsapp-card">
              <FaWhatsapp className="whatsapp-icon" />
              <div className="whatsapp-content">
                <h3>Chat with us on WhatsApp</h3>
                <p>Get instant responses to your questions</p>
                <a 
                  href="https://wa.me/254115685773?text=Hello! I have a question about Apiary Honey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                >
                  <FaWhatsapp />
                  Start Chat
                </a>
              </div>
            </div>

            <div className="social-links-section">
              <h3>Follow Us</h3>
              <p>Stay connected for updates, promotions, and honey tips</p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                  <FiFacebook />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                  <FiInstagram />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter">
                  <FiTwitter />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link youtube">
                  <FiYoutube />
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Prompt */}
          <div className="faq-prompt">
            <div className="faq-prompt-content">
              <FiAlertCircle />
              <div>
                <h3>Frequently Asked Questions</h3>
                <p>Find quick answers to common questions about our honey, shipping, and returns</p>
              </div>
              <a href="/faq" className="faq-link">
                View FAQ <FiSend />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;