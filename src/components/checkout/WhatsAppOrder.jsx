// src/components/checkout/WhatsAppOrder.jsx
import React, { useState } from 'react';
import { FaWhatsapp, FaCopy, FaCheck } from 'react-icons/fa';
import { 
  FiInfo, 
  FiPackage, 
  FiTruck, 
  FiDollarSign, 
  FiMapPin, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiClipboard,
  FiPrinter,
  FiCheckCircle,
  FiArrowRight,
  FiShoppingBag,
  FiClock,
  FiAlertCircle,
  FiPercent
} from 'react-icons/fi';
import { MdLocalShipping, MdReceipt, MdVerified } from 'react-icons/md';
import { createOrder } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';

const WhatsAppOrder = ({ orderData, onPaymentComplete, onCancel, processing }) => {
  const [copied, setCopied] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const { showToast } = useToast();

  // Generate unique order number
  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}${random}`;
  };

  const orderNumber = generateOrderNumber();
  
  // Calculate item price with discount (same logic as Cart)
  const calculateItemPrice = (item) => {
    let price = item.price;
    
    // Apply product discount if active
    if (item.discount?.isActive) {
      if (item.discount.type === 'percentage') {
        price = item.price * (1 - item.discount.value / 100);
      } else if (item.discount.type === 'fixed') {
        price = Math.max(0, item.price - item.discount.value);
      }
    }
    
    return price;
  };

  // Calculate item discount info
  const getItemDiscountInfo = (item) => {
    if (!item.discount?.isActive) return null;
    
    const discountedPrice = calculateItemPrice(item);
    const saved = item.price - discountedPrice;
    
    return {
      hasDiscount: true,
      type: item.discount.type,
      value: item.discount.value,
      discountedPrice,
      saved,
      label: item.discount.type === 'percentage' 
        ? `${item.discount.value}% OFF` 
        : `KES ${item.discount.value} OFF`
    };
  };

  // Calculate subtotal with discounts
  const calculateSubtotal = () => {
    return orderData.items.reduce((sum, item) => {
      const itemPrice = calculateItemPrice(item);
      return sum + (itemPrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  // const shipping = subtotal > 5000 ? 0 : 299;
    const shipping = 0;
 const tax = subtotal * 0;
  // const tax = subtotal * 0.16; // 16% VAT
  const grandTotal = subtotal + shipping + tax;
  
  // Calculate total savings
  const totalSavings = orderData.items.reduce((sum, item) => {
    if (item.discount?.isActive) {
      const originalPrice = item.price * item.quantity;
      const discountedPrice = calculateItemPrice(item) * item.quantity;
      return sum + (originalPrice - discountedPrice);
    }
    return sum;
  }, 0);
  
  // Check if any item has discount
  const hasAnyDiscount = orderData.items.some(item => item.discount?.isActive);

  // Generate WhatsApp message with full order details
  const generateWhatsAppMessage = (orderId) => {
    const currentDate = new Date().toLocaleString('en-KE', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // Format items with discount info
    const itemsList = orderData.items.map((item, index) => {
      const discountInfo = getItemDiscountInfo(item);
      const itemPrice = calculateItemPrice(item);
      const itemTotal = itemPrice * item.quantity;
      const originalTotal = item.price * item.quantity;
      
      let priceDisplay = '';
      if (discountInfo) {
        priceDisplay = `   Unit Price: KSh ${item.price.toLocaleString()} → KSh ${itemPrice.toLocaleString()} (${discountInfo.label})%0a` +
                       `   Original Total: KSh ${originalTotal.toLocaleString()}%0a` +
                       `   Discount: -KES ${discountInfo.saved.toLocaleString()}%0a` +
                       `   Final Total: KSh ${itemTotal.toLocaleString()}%0a`;
      } else {
        priceDisplay = `   Unit Price: KSh ${item.price.toLocaleString()}%0a` +
                       `   Total: KSh ${itemTotal.toLocaleString()}%0a`;
      }
      
      const sku = item.sku || `${item.productId?.slice(-6)}-${item.variantId?.slice(-6)}`;
      return `*${index + 1}. ${item.productName}*%0a` +
        `   Variant: ${item.variantName}%0a` +
        `   Quantity: ${item.quantity}%0a` +
        priceDisplay +
        `   SKU: ${sku}%0a`;
    }).join('%0a');

    let priceBreakdown = `*💰 PRICE BREAKDOWN*%0a` +
      `Subtotal: KSh ${subtotal.toLocaleString()}%0a`;
    
    if (hasAnyDiscount && totalSavings > 0) {
      priceBreakdown += `Original Subtotal: KSh ${(subtotal + totalSavings).toLocaleString()}%0a` +
        `Total Savings: -KES ${totalSavings.toLocaleString()}%0a`;
    }
    
    priceBreakdown += `Shipping: ${shipping === 0 ? 'FREE' : `KSh ${shipping.toLocaleString()}`}%0a` +
      `VAT (16%): KSh ${tax.toLocaleString()}%0a` +
      `━━━━━━━━━━━━━━━━━━━━━━%0a` +
      `*GRAND TOTAL: KSh ${grandTotal.toLocaleString()}*%0a` +
      `━━━━━━━━━━━━━━━━━━━━━━%0a%0a`;

    const message = `🍯 *APIARY HONEY ORDER* 🍯%0a` +
      `━━━━━━━━━━━━━━━━━━━━━━%0a` +
      `*Order ID:* ${orderId}%0a` +
      `*Order Number:* ${orderNumber}%0a` +
      `*Date:* ${currentDate}%0a` +
      `*Status:* ⏳ PENDING CONFIRMATION%0a` +
      `━━━━━━━━━━━━━━━━━━━━━━%0a%0a` +
      
      `*👤 CUSTOMER DETAILS*%0a` +
      `Name: ${orderData.customer.firstName} ${orderData.customer.lastName}%0a` +
      `Email: ${orderData.customer.email}%0a` +
      `Phone: ${orderData.customer.phone}%0a` +
      `━━━━━━━━━━━━━━━━━━━━━━%0a%0a` +
      
      `*📍 SHIPPING ADDRESS*%0a` +
      `Address: ${orderData.customer.address}%0a` +
      `City/Town: ${orderData.customer.city}%0a` +
      `County: ${orderData.customer.county || 'N/A'}%0a` +
      `Postal Code: ${orderData.customer.postalCode || 'N/A'}%0a` +
      `━━━━━━━━━━━━━━━━━━━━━━%0a%0a` +
      
      `*🛒 ORDER ITEMS*%0a` +
      `${itemsList}%0a` +
      `━━━━━━━━━━━━━━━━━━━━━━%0a%0a` +
      
      priceBreakdown +
      
      `*📝 ORDER NOTES*%0a` +
      `${orderData.customer.notes || 'No special instructions'}%0a%0a` +
      
      `*⚠️ ADMIN ACTION REQUIRED*%0a` +
      `Make the order Payment tho confirm the order.%0a` +
      `Order ID: ${orderId}%0a%0a` +
      
      `_This is an automated order message. Please verify and confirm._`;

    return message;
  };

  const handleWhatsAppOrder = async () => {
    try {
      setCreatingOrder(true);
      
      // Format items correctly for the backend with discount info
      const formattedItems = orderData.items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        discountedPrice: calculateItemPrice(item),
        name: item.productName,
        variantName: item.variantName,
        sku: item.sku,
        discount: item.discount || null
      }));

      // Prepare order payload for the backend
      const orderPayload = {
        items: formattedItems,
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        discount: totalSavings,
        totalPrice: grandTotal,
        paymentMethod: 'whatsapp',
        orderStatus: 'pending',
        shippingAddress: {
          name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
          firstName: orderData.customer.firstName,
          lastName: orderData.customer.lastName,
          address: orderData.customer.address,
          city: orderData.customer.city,
          postalCode: orderData.customer.postalCode || '',
          county: orderData.customer.county || 'Nairobi',
          country: 'Kenya',
          phone: orderData.customer.phone,
          email: orderData.customer.email
        },
        notes: orderData.customer.notes || '',
        guestEmail: orderData.customer.email,
        guestName: `${orderData.customer.firstName} ${orderData.customer.lastName}`
      };

      // If user is logged in, add user ID
      if (orderData.customer.userId) {
        orderPayload.user = orderData.customer.userId;
        delete orderPayload.guestEmail;
        delete orderPayload.guestName;
      }

      console.log('Creating WhatsApp order with payload:', orderPayload);
      
      // Create the order in the system
      const response = await createOrder(orderPayload);
      const createdOrder = response.data || response;
      const orderId = createdOrder._id;
      
      console.log('Order created successfully:', createdOrder);
      
      showToast('Order created successfully! Redirecting to WhatsApp...', 'success');
      
      // Then open WhatsApp with the order details
      const phoneNumber = '+254115685773';
      const message = generateWhatsAppMessage(orderId);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      
      window.open(whatsappUrl, '_blank');
      
      // Call onPaymentComplete with the created order to clear cart and redirect
      onPaymentComplete({ 
        method: 'whatsapp',
        orderId: orderId,
        orderNumber: orderNumber,
        status: 'successful',
        orderDetails: {
          items: orderData.items,
          subtotal,
          shipping,
          tax,
          discount: totalSavings,
          total: grandTotal
        }
      });
      
    } catch (error) {
      console.error('WhatsApp order process failed:', error);
      showToast(error.response?.data?.message || 'Failed to create order. Please try again.', 'error');
    } finally {
      setCreatingOrder(false);
    }
  };

  const copyOrderSummary = () => {
    const summary = generateWhatsAppMessage('ORDER_ID_PLACEHOLDER').replace(/%0a/g, '\n');
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Order summary copied to clipboard', 'info');
  };

  return (
    <div className="whatsapp-order">
      <div className="whatsapp-info">
        <FaWhatsapp className="whatsapp-icon" />
        <h3>Order via WhatsApp</h3>
        <p>
          You'll be redirected to WhatsApp with a pre-filled order message.
          Simply send the message to complete your order.
        </p>
        <div className="whatsapp-number">
          <FiPhone className="number-icon" />
          <span>Send to: +254 115 685 773</span>
          <MdVerified className="verified-icon" />
        </div>
        <div className="order-status-note">
          <FiClock />
          <span>Your order will be pending confirmation until admin verifies it via WhatsApp</span>
        </div>
      </div>

      <div className="order-summary-details">
        <div className="summary-header">
          <h4>
            <FiShoppingBag />
            Order Summary
          </h4>
          <button 
            className="copy-summary-btn"
            onClick={copyOrderSummary}
            title="Copy order summary"
            disabled={processing || creatingOrder}
          >
            {copied ? <FaCheck /> : <FaCopy />}
            {copied ? 'Copied!' : 'Copy Summary'}
          </button>
        </div>

        <div className="order-info-row">
          <span className="info-label">
            <MdReceipt />
            Order Number:
          </span>
          <span className="info-value">{orderNumber}</span>
        </div>

        {/* Order Items with Discount Display */}
        <div className="order-items">
          <div className="items-header">
            <FiPackage />
            Items:
          </div>
          {orderData.items.map((item, index) => {
            const discountInfo = getItemDiscountInfo(item);
            const itemPrice = calculateItemPrice(item);
            const itemTotal = itemPrice * item.quantity;
            
            return (
              <div key={index} className="order-item">
                <div className="item-name">
                  {item.productName} <span className="item-variant">({item.variantName})</span>
                  {discountInfo && (
                    <span className="discount-badge">
                      <FiPercent /> {discountInfo.label}
                    </span>
                  )}
                </div>
                {discountInfo && (
                  <div className="item-price-breakdown">
                    <span className="original-price">KSh {item.price.toLocaleString()}</span>
                    <span className="discounted-price">KSh {itemPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="item-details">
                  <span className="item-quantity">x{item.quantity}</span>
                  <span className="item-price">KSh {itemTotal.toLocaleString()}</span>
                  {discountInfo && (
                    <span className="item-saved">Save KSh {discountInfo.saved.toLocaleString()}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Breakdown with Discount */}
        <div className="price-breakdown">
          {hasAnyDiscount && (
            <div className="breakdown-row discount-row">
              <span>Original Subtotal:</span>
              <span>KSh {(subtotal + totalSavings).toLocaleString()}</span>
            </div>
          )}
          <div className="breakdown-row">
            <span>Subtotal:</span>
            <span>KSh {subtotal.toLocaleString()}</span>
          </div>
          {hasAnyDiscount && totalSavings > 0 && (
            <div className="breakdown-row savings-row">
              <span>
                <FiPercent />
                Discount Saved:
              </span>
              <span className="savings-amount">-KES {totalSavings.toLocaleString()}</span>
            </div>
          )}
          <div className="breakdown-row">
            <span>
              <FiTruck />
              Shipping:
            </span>
            <span>{shipping === 0 ? 'FREE' : `KSh ${shipping.toLocaleString()}`}</span>
          </div>
          <div className="breakdown-row">
            <span>VAT (16%):</span>
            <span>KSh {tax.toLocaleString()}</span>
          </div>
          <div className="breakdown-row total">
            <span>
              <FiDollarSign />
              Total:
            </span>
            <span>KSh {grandTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Customer Info Preview */}
        <div className="customer-info-preview">
          <h5>
            <FiMapPin />
            Shipping to:
          </h5>
          <div className="customer-details">
            <p><FiUser /> {orderData.customer.firstName} {orderData.customer.lastName}</p>
            <p><FiMapPin /> {orderData.customer.address}</p>
            <p><FiMapPin /> {orderData.customer.city}, {orderData.customer.county || 'N/A'}</p>
            <p><FiPhone /> {orderData.customer.phone}</p>
            <p><FiMail /> {orderData.customer.email}</p>
          </div>
        </div>

        {orderData.customer.notes && (
          <div className="order-notes">
            <h5>
              <FiClipboard />
              Notes:
            </h5>
            <p>{orderData.customer.notes}</p>
          </div>
        )}

        <div className="delivery-info">
          <MdLocalShipping />
          <div className="delivery-text">
            <strong>Estimated Delivery:</strong> 2-5 business days after confirmation
            <br />
            <small>Free shipping on orders over KSh 5,000</small>
          </div>
        </div>

        <div className="order-warning">
          <FiAlertCircle />
          <div className="warning-text">
            <strong>Important:</strong> Your order will be created in our system but marked as "Pending Confirmation".
            The admin will confirm your order after receiving your WhatsApp message.
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn btn-secondary"
          disabled={processing || creatingOrder}
        >
          Back
        </button>
        <button 
          type="button" 
          onClick={handleWhatsAppOrder}
          disabled={processing || creatingOrder}
          className={`btn btn-success ${creatingOrder ? 'loading' : ''}`}
        >
          {creatingOrder ? (
            <>
              <span className="spinner"></span>
              Creating Order...
            </>
          ) : (
            <>
              <FaWhatsapp />
              Continue to WhatsApp
              <FiArrowRight />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WhatsAppOrder;