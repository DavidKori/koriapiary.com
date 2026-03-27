// src/pages/FAQ.jsx
import React, { useState } from 'react';
import SEO from '../components/common/SEO';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiPackage, 
  FiTruck, 
  FiRefreshCw, 
  FiShield, 
  FiHeart,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiCreditCard,
  FiLock,
  FiHelpCircle,
  FiAward,
  FiUsers
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import '../styles/faq.css';
import { GiBee } from "react-icons/gi";



const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const categories = [
    { id: 'all', name: 'All Questions', icon: FiHelpCircle },
    { id: 'products', name: 'Products & Honey', icon: GiBee },
    { id: 'orders', name: 'Orders & Shipping', icon: FiPackage },
    { id: 'returns', name: 'Returns & Refunds', icon: FiRefreshCw },
    { id: 'payment', name: 'Payment', icon: FiCreditCard },
    { id: 'account', name: 'Account', icon: FiUsers }
  ];

  const faqs = [
    {
      id: 1,
      category: 'products',
      question: 'What makes Apiary Honey different from other honey?',
      answer: 'Our honey is 100% pure, raw, and unprocessed. We harvest from our own apiaries using sustainable practices. Unlike commercial honey that is pasteurized and filtered, our honey retains all natural enzymes, pollen, and health benefits. Each batch is tested for purity and quality.'
    },
    {
      id: 2,
      category: 'products',
      question: 'Do you offer organic honey?',
      answer: 'Yes! Our honey is certified organic. Our apiaries are located in pristine areas away from agricultural chemicals. We follow strict organic farming practices to ensure our bees forage on natural, untreated flora.'
    },
    {
      id: 3,
      category: 'products',
      question: 'What types of honey do you offer?',
      answer: 'We offer a variety of honey types including: Wildflower Honey, Acacia Honey, Manuka Honey, Forest Honey, and seasonal specialty honey. Each type has unique flavor profiles and health benefits. Visit our products page to explore our collection.'
    },
    {
      id: 4,
      category: 'products',
      question: 'How should I store my honey?',
      answer: 'Store honey in a cool, dry place at room temperature. Do not refrigerate as this can cause crystallization. If your honey crystallizes, simply place the jar in warm water to restore its liquid state. Properly stored, honey can last indefinitely.'
    },
    {
      id: 5,
      category: 'orders',
      question: 'How long does shipping take?',
      answer: 'Orders are processed within 1-2 business days. Standard shipping within Kenya takes 3-5 business days. For Nairobi and major towns, delivery is typically 2-3 days. Express shipping options are available at checkout for 1-2 day delivery.'
    },
    {
      id: 6,
      category: 'orders',
      question: 'Do you ship internationally?',
      answer: 'Currently, we ship within Kenya only. We are working on expanding our shipping capabilities to neighboring countries soon. Subscribe to our newsletter for updates on international shipping.'
    },
    {
      id: 7,
      category: 'orders',
      question: 'What is your shipping cost?',
      answer: 'Shipping is FREE for orders over KSh 10,000. For orders below this amount, shipping costs KSh 299. We use reliable courier services to ensure your honey arrives safely and on time.'
    },
    {
      id: 8,
      category: 'returns',
      question: 'Can I return honey?',
      answer: 'Due to food safety regulations, honey is not returnable once purchased for hygiene and safety reasons. However, if your product arrives damaged or defective, please contact us within 48 hours of delivery for a replacement or refund.'
    },
    {
      id: 9,
      category: 'returns',
      question: 'What is your policy on other products?',
      answer: 'For non-honey products (beeswax candles, skincare items, etc.), we offer a 14-day return policy. Items must be unused and in original packaging. Customers are responsible for return shipping costs unless the item is defective.'
    },
    {
      id: 10,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept payments via Paystack, which includes all major credit/debit cards (Visa, Mastercard), M-Pesa, and Airtel Money. You can also place orders via WhatsApp for manual processing.'
    },
    {
      id: 11,
      category: 'payment',
      question: 'Is it safe to pay online?',
      answer: 'Absolutely! Our payment processing is handled by Paystack, a PCI-DSS compliant payment gateway. All transactions are encrypted and secure. We never store your payment information on our servers.'
    },
    {
      id: 12,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click the "Register" link at the top of the page. You\'ll need to provide your name, email, and create a password. You can also sign up during checkout. Creating an account allows you to track orders, save addresses, and earn loyalty points.'
    },
    {
      id: 13,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page. Enter your registered email address, and we\'ll send you instructions to reset your password. The link expires in 1 hour for security.'
    },
    {
      id: 14,
      category: 'products',
      question: 'Is your honey raw and unfiltered?',
      answer: 'Yes! All our honey is raw, unfiltered, and unpasteurized to preserve the natural enzymes, antioxidants, and health benefits. We only strain it to remove large particles like beeswax, but all the beneficial pollen remains.'
    },
    {
      id: 15,
      category: 'products',
      question: 'Do you offer wholesale or bulk orders?',
      answer: 'Yes, we offer wholesale pricing for businesses, restaurants, and bulk buyers. Please contact our sales team at wholesale@apiaryhoney.com for custom quotes and minimum order quantities.'
    }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <>
      <SEO 
        title="FAQ - Frequently Asked Questions | Apiary Honey" 
        description="Find answers to common questions about Apiary Honey products, shipping, returns, payments, and more. Get all the information you need about our pure, natural honey."
      />
      
      <div className="faq-page">
        {/* Hero Section */}
        <div className="faq-hero">
          <div className="faq-hero-content">
            <h1>Frequently Asked Questions</h1>
            <p>Find answers to common questions about our honey, shipping, returns, and more</p>
          </div>
        </div>

        <div className="faq-container">
          {/* Categories */}
          <div className="faq-categories">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <Icon />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* FAQ Items */}
          <div className="faq-list">
            {filteredFaqs.map((faq, index) => (
              <div 
                key={faq.id} 
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleQuestion(index)}
                >
                  <span>{faq.question}</span>
                  {openIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="still-have-questions">
            <h3>Still Have Questions?</h3>
            <p>We're here to help! Contact us through any of the channels below</p>
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
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;