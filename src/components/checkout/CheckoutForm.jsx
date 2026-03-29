// src/components/checkout/CheckoutForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createOrder } from '../../services/orderService';
import { getAddresses, addAddress } from '../../services/addressService';
import PaymentMethods from './PaymentMethods';
import PaystackForm from './PaystackForm';
import WhatsAppOrder from './WhatsAppOrder';
import { FiLock, FiTruck, FiMapPin, FiPhone, FiMail, FiUser, FiCheck, FiPlus, FiSave, FiPercent, FiDollarSign } from 'react-icons/fi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import '../../styles/checkoutForm.css';

// All 47 Counties in Kenya
const KENYA_COUNTIES = [
  'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita Taveta',
  'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka Nithi',
  'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
  'Muranga', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia',
  'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru',
  'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
  'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi'
];

// Cities/Towns by County
const COUNTY_CITIES = {
  'Mombasa': ['Mombasa CBD', 'Nyali', 'Bamburi', 'Likoni', 'Kilindini', 'Mtwapa'],
  'Kwale': ['Ukunda', 'Diani Beach', 'Msambweni', 'Kinango', 'Lunga Lunga'],
  'Kilifi': ['Kilifi Town', 'Malindi', 'Watamu', 'Mtwapa', 'Mariakani'],
  'Tana River': ['Hola', 'Garsen', 'Madogo', 'Bura'],
  'Lamu': ['Lamu Town', 'Shella', 'Mpeketoni', 'Faza'],
  'Taita Taveta': ['Voi', 'Wundanyi', 'Taveta', 'Mwatate'],
  'Garissa': ['Garissa Town', 'Dadaab', 'Balambala', 'Masalani'],
  'Wajir': ['Wajir Town', 'Habasswein', 'Eldas', 'Griffu'],
  'Mandera': ['Mandera Town', 'Elwak', 'Rhamu', 'Takaba'],
  'Marsabit': ['Marsabit Town', 'Moyale', 'Loiyangalani', 'North Horr'],
  'Isiolo': ['Isiolo Town', 'Garbatulla', 'Merti', 'Kinna'],
  'Meru': ['Meru Town', 'Maua', 'Chuka', 'Nkubu', 'Timau'],
  'Tharaka Nithi': ['Chuka', 'Kathwana', 'Marimanti', 'Mitheru'],
  'Embu': ['Embu Town', 'Runyenjes', 'Siakago', 'Manyatta'],
  'Kitui': ['Kitui Town', 'Mwingi', 'Mutomo', 'Kyuso'],
  'Machakos': ['Machakos Town', 'Kangundo', 'Tala', 'Mavoko', 'Athi River'],
  'Makueni': ['Wote', 'Kibwezi', 'Makindu', 'Sultan Hamud'],
  'Nyandarua': ['Ol Kalou', 'Nyahururu', 'Engineer', 'Kinamba'],
  'Nyeri': ['Nyeri Town', 'Karatina', 'Othaya', 'Mukurweini', 'Naro Moru'],
  'Kirinyaga': ['Kerugoya', 'Kutus', 'Kianyaga', 'Baricho'],
  'Muranga': ['Muranga Town', 'Kangema', 'Kigumo', 'Kenol'],
  'Kiambu': ['Kiambu Town', 'Thika', 'Limuru', 'Ruiru', 'Kikuyu', 'Juja'],
  'Turkana': ['Lodwar', 'Lokichoggio', 'Kakuma', 'Lokitaung'],
  'West Pokot': ['Kapenguria', 'Chepareria', 'Kacheliba', 'Kodich'],
  'Samburu': ['Maralal', 'Baragoi', 'Archers Post', 'Wamba'],
  'Trans Nzoia': ['Kitale', 'Kiminini', 'Endebess', 'Saboti'],
  'Uasin Gishu': ['Eldoret', 'Kapsabet', 'Moiben', 'Turbo'],
  'Elgeyo Marakwet': ['Iten', 'Kapsowar', 'Tambach', 'Chesoi'],
  'Nandi': ['Kapsabet', 'Nandi Hills', 'Mosoriot', 'Kabiyet'],
  'Baringo': ['Kabarnet', 'Eldama Ravine', 'Marigat', 'Mogotio'],
  'Laikipia': ['Nanyuki', 'Nyahururu', 'Rumuruti', 'Kinamba', 'Ngarua'],
  'Nakuru': ['Nakuru Town', 'Naivasha', 'Gilgil', 'Molo', 'Njoro', 'Rongai'],
  'Narok': ['Narok Town', 'Kilgoris', 'Mai Mahiu', 'Ololulunga'],
  'Kajiado': ['Kajiado Town', 'Ngong', 'Kitengela', 'Loitokitok', 'Ongata Rongai'],
  'Kericho': ['Kericho Town', 'Litein', 'Bomet', 'Sotik', 'Kipkelion'],
  'Bomet': ['Bomet Town', 'Sotik', 'Chepalungu', 'Konoin'],
  'Kakamega': ['Kakamega Town', 'Mumias', 'Butere', 'Lugari', 'Malava'],
  'Vihiga': ['Vihiga Town', 'Mbale', 'Luanda', 'Sabatia'],
  'Bungoma': ['Bungoma Town', 'Kimilili', 'Webuye', 'Chwele'],
  'Busia': ['Busia Town', 'Malaba', 'Nambale', 'Bumala'],
  'Siaya': ['Siaya Town', 'Bondo', 'Yala', 'Ugunja'],
  'Kisumu': ['Kisumu City', 'Ahero', 'Kombewa', 'Muhoroni', 'Maseno'],
  'Homa Bay': ['Homa Bay Town', 'Mbita', 'Oyugis', 'Rodi Kopany'],
  'Migori': ['Migori Town', 'Kehancha', 'Rongo', 'Awendo'],
  'Kisii': ['Kisii Town', 'Nyamira', 'Keroka', 'Ogembo', 'Suneka'],
  'Nyamira': ['Nyamira Town', 'Keroka', 'Manga', 'Borabu'],
  'Nairobi': ['Nairobi CBD', 'Westlands', 'Karen', 'Langata', 'Kilimani', 'Parklands', 'Eastlands', 'South B', 'South C', 'Embakasi', 'Kasarani', 'Roysambu']
};

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [newAddressName, setNewAddressName] = useState('');
  const [savingNewAddress, setSavingNewAddress] = useState(false);
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    county: '',
    city: '',
    postalCode: '',
    phone: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

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

  // Calculate subtotal with discounts
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemPrice = calculateItemPrice(item);
      return sum + (itemPrice * item.quantity);
    }, 0);
  };

  // Calculate total savings
  const calculateTotalSavings = () => {
    return cartItems.reduce((sum, item) => {
      if (item.discount?.isActive) {
        const originalPrice = item.price * item.quantity;
        const discountedPrice = calculateItemPrice(item) * item.quantity;
        return sum + (originalPrice - discountedPrice);
      }
      return sum;
    }, 0);
  };

  // Check if any item has discount
  const hasAnyDiscount = cartItems.some(item => item.discount?.isActive);

  const subtotalKES = calculateSubtotal();
  const totalSavings = calculateTotalSavings();
  const originalSubtotal = subtotalKES + totalSavings;
  // const taxKES = subtotalKES * 0.16;
  // const shippingKES = subtotalKES > 10000 ? 0 : 299;
    const taxKES = 0;
  const shippingKES = 0;
  const totalKES = subtotalKES + taxKES + shippingKES;

  // Load saved addresses when user is authenticated
  useEffect(() => {
    const loadAddresses = async () => {
      if (isAuthenticated) {
        setLoadingAddresses(true);
        try {
          const addresses = await getAddresses();
          setSavedAddresses(addresses || []);
          
          // Auto-select default address if exists
          const defaultAddress = addresses?.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id);
            populateFormFromAddress(defaultAddress);
          }
        } catch (error) {
          console.error('Error loading addresses:', error);
        } finally {
          setLoadingAddresses(false);
        }
      }
    };
    
    loadAddresses();
  }, [isAuthenticated]);

  // Populate form from selected saved address
  const populateFormFromAddress = (address) => {
    setFormData(prev => ({
      ...prev,
      firstName: address.name?.split(' ')[0] || '',
      lastName: address.name?.split(' ').slice(1).join(' ') || '',
      address: address.address,
      county: address.county,
      city: address.city,
      postalCode: address.postalCode || '',
      phone: address.phone,
    }));
    
    // Update available cities based on county
    if (address.county) {
      setAvailableCities(COUNTY_CITIES[address.county] || []);
    }
  };

  // Handle saved address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const selectedAddress = savedAddresses.find(addr => addr._id === addressId);
    if (selectedAddress) {
      populateFormFromAddress(selectedAddress);
      // Clear any address-related errors
      setErrors(prev => ({ ...prev, address: '', county: '', city: '', phone: '' }));
    }
  };

  // Toggle between saved address and new address
  const toggleAddressMode = (useSaved) => {
    setUseSavedAddress(useSaved);
    if (!useSaved) {
      // Clear selected address and reset form to empty
      setSelectedAddressId('');
      setFormData(prev => ({
        ...prev,
        firstName: '',
        lastName: '',
        address: '',
        county: '',
        city: '',
        postalCode: '',
        phone: ''
      }));
      setSaveNewAddress(false);
      setNewAddressName('');
    } else if (savedAddresses.length > 0) {
      // Auto-select default address
      const defaultAddress = savedAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        populateFormFromAddress(defaultAddress);
      }
    }
  };

  // Save new address to user's address book
  const handleSaveNewAddress = async () => {
    if (!isAuthenticated) {
      showToast('Please login to save addresses', 'warning');
      return;
    }

    if (!newAddressName.trim()) {
      showToast('Please enter an address name (e.g., Home, Office)', 'error');
      return;
    }

    setSavingNewAddress(true);
    try {
      const addressData = {
        name: newAddressName,
        address: formData.address,
        city: formData.city,
        county: formData.county,
        postalCode: formData.postalCode,
        phone: formData.phone,
        isDefault: savedAddresses.length === 0
      };
      
      const updatedAddresses = await addAddress(addressData);
      setSavedAddresses(updatedAddresses);
      setSaveNewAddress(false);
      setNewAddressName('');
      showToast('Address saved successfully!', 'success');
      
      // Auto-select the newly saved address
      const newAddress = updatedAddresses.find(addr => 
        addr.address === formData.address && 
        addr.city === formData.city &&
        addr.county === formData.county
      );
      if (newAddress) {
        setSelectedAddressId(newAddress._id);
        setUseSavedAddress(true);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      showToast('Failed to save address', 'error');
    } finally {
      setSavingNewAddress(false);
    }
  };

  const handleCountyChange = (e) => {
    const county = e.target.value;
    setFormData(prev => ({ ...prev, county, city: '' }));
    setAvailableCities(COUNTY_CITIES[county] || []);
    if (errors.county) {
      setErrors(prev => ({ ...prev, county: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.county) newErrors.county = 'County is required';
    if (!formData.city) newErrors.city = 'City/Town is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^(\+?254|0)[71]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number (e.g., 0712345678)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save or update address in user's address book on every submit
  const saveOrUpdateAddress = async () => {
    if (!isAuthenticated) return;
    
    // Don't save if using an unchanged saved address
    if (useSavedAddress && selectedAddressId) {
      // Check if form data matches the selected saved address
      const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId);
      if (selectedAddress) {
        const isUnchanged = 
          selectedAddress.name === `${formData.firstName} ${formData.lastName}` &&
          selectedAddress.address === formData.address &&
          selectedAddress.city === formData.city &&
          selectedAddress.county === formData.county &&
          selectedAddress.phone === formData.phone;
        
        if (isUnchanged) {
          return; // No changes, don't save
        }
      }
    }
    
    // Save or update the address
    try {
      const addressData = {
        name: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        county: formData.county,
        postalCode: formData.postalCode,
        phone: formData.phone,
        isDefault: savedAddresses.length === 0
      };
      
      const updatedAddresses = await addAddress(addressData);
      setSavedAddresses(updatedAddresses);
      
      // Update selected address to the newly saved one
      const newAddress = updatedAddresses.find(addr => 
        addr.address === formData.address && 
        addr.city === formData.city &&
        addr.county === formData.county
      );
      if (newAddress) {
        setSelectedAddressId(newAddress._id);
        setUseSavedAddress(true);
      }
      
      console.log('Address saved/updated successfully');
    } catch (error) {
      console.error('Error saving/updating address:', error);
    }
  };

  // Create order in the system
  const createOrderInSystem = async () => {
    setProcessing(true);
    try {
      // Save address to address book on every submit
      if (isAuthenticated) {
        await saveOrUpdateAddress();
      }

      const items = cartItems.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        discountedPrice: calculateItemPrice(item),
        name: item.productName,
        variantName: item.variantName,
        discount: item.discount || null
      }));

      const orderPayload = {
        items,
        subtotal: subtotalKES,
        originalSubtotal: originalSubtotal,
        tax: taxKES,
        shipping: shippingKES,
        discount: totalSavings,
        totalPrice: totalKES,
        paymentMethod: paymentMethod,
        orderStatus: 'pending',
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          county: formData.county,
          postalCode: formData.postalCode || '',
          country: 'Kenya',
          phone: formData.phone,
          email: formData.email
        },
        notes: formData.notes || '',
        guestEmail: !isAuthenticated ? formData.email : null,
        guestName: !isAuthenticated ? `${formData.firstName} ${formData.lastName}` : null,
        savedAddressId: useSavedAddress && selectedAddressId ? selectedAddressId : null
      };

      if (isAuthenticated && user) {
        orderPayload.user = user._id;
      }

      const response = await createOrder(orderPayload);
      const createdOrder = response.data || response;
      
      setCreatedOrderId(createdOrder._id);
      setOrderData(createdOrder);
      return createdOrder;
      
    } catch (error) {
      console.error('Error creating order:', error);
      showToast(error.response?.data?.message || 'Failed to create order. Please try again.', 'error');
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const handleNextStep = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && paymentMethod) {
      try {
        await createOrderInSystem();
        if (paymentMethod === "whatsapp") {
          setStep(3);
        } else {
          setStep(3);
        }
      } catch (error) {
        // Error already handled
      }
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentComplete = async (paymentResult) => {
    setProcessing(true);

    try {
      if (paymentResult.status === 'successful' || paymentResult.method === 'whatsapp') {
        clearCart();
        showToast('Order placed successfully!', 'success');
       isAuthenticated ? navigate(`/order-success?orderId=${createdOrderId}`) : navigate('/');
      } else {
        showToast('Payment failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Payment processing failed:', error);
      showToast('Failed to process payment. Please contact support.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-form">
      {/* Checkout Steps */}
      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Information</span>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Payment</span>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Confirm</span>
        </div>
      </div>

      {/* Step 1: Information */}
      {step === 1 && (
        <div className="checkout-step">
          <h2>Contact Information</h2>
          
          <div className="form-group">
            <label htmlFor="email">
              <FiMail className="input-icon" />
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <h2>Shipping Information</h2>

          {/* Saved Addresses Section - Only show for logged in users */}
          {isAuthenticated && savedAddresses.length > 0 && (
            <div className="saved-addresses-section">
              <div className="address-toggle">
                <label className="toggle-option">
                  <input
                    type="radio"
                    checked={useSavedAddress}
                    onChange={() => toggleAddressMode(true)}
                  />
                  <span>Use Saved Address</span>
                </label>
                <label className="toggle-option">
                  <input
                    type="radio"
                    checked={!useSavedAddress}
                    onChange={() => toggleAddressMode(false)}
                  />
                  <span>Enter New Address</span>
                </label>
              </div>

              {useSavedAddress && (
                <div className="saved-addresses-list">
                  <label>Select a saved address:</label>
                  {savedAddresses.map(address => (
                    <div 
                      key={address._id}
                      className={`saved-address-item ${selectedAddressId === address._id ? 'selected' : ''}`}
                      onClick={() => handleAddressSelect(address._id)}
                    >
                      <div className="address-radio">
                        <FiCheck className={selectedAddressId === address._id ? 'checked' : ''} />
                      </div>
                      <div className="address-details">
                        <p className="address-name">
                          {address.name}
                          {address.isDefault && <span className="default-badge">Default</span>}
                        </p>
                        <p className="address-text">{address.address}</p>
                        <p className="address-text">{address.city}, {address.county}</p>
                        {address.postalCode && <p className="address-text">Postal: {address.postalCode}</p>}
                        <p className="address-phone"><FiPhone /> {address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Show address form when either not logged in OR using new address */}
          { (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    <FiUser className="input-icon" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    <FiUser className="input-icon" />
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  <FaMapMarkerAlt className="input-icon" />
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House number and street name"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="county">
                    <FiMapPin className="input-icon" />
                    County *
                  </label>
                  <select
                    id="county"
                    name="county"
                    value={formData.county}
                    onChange={handleCountyChange}
                    className={errors.county ? 'error' : ''}
                  >
                    <option value="">Select your county</option>
                    {KENYA_COUNTIES.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                  {errors.county && <span className="error-text">{errors.county}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="city">
                    <FiMapPin className="input-icon" />
                    City/Town *
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!formData.county}
                    className={errors.city ? 'error' : ''}
                  >
                    <option value="">{formData.county ? 'Select city/town' : 'Select county first'}</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <span className="error-text">{errors.city}</span>}
                  {formData.county && availableCities.length === 0 && (
                    <span className="help-text">No cities listed for this county. Please enter manually.</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postalCode">
                    <FiMapPin className="input-icon" />
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="00100"
                    className={errors.postalCode ? 'error' : ''}
                  />
                  {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <FiPhone className="input-icon" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0712345678"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              </div>

              {/* Save New Address Option - Only show for logged in users */}
              {isAuthenticated && (
                <div className="save-address-option">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={saveNewAddress}
                      onChange={(e) => setSaveNewAddress(e.target.checked)}
                    />
                    <span>Save this address to my account</span>
                  </label>
                  
                  {saveNewAddress && (
                    <div className="save-address-details">
                      <div className="form-group">
                        <label htmlFor="addressName">
                          <FiMapPin className="input-icon" />
                          Address Name *
                        </label>
                        <input
                          type="text"
                          id="addressName"
                          value={newAddressName}
                          onChange={(e) => setNewAddressName(e.target.value)}
                          placeholder="e.g., Home, Office, Apartment"
                        />
                        <small>Give this address a name for easy reference</small>
                      </div>
                      <button
                        type="button"
                        className="btn-save-address"
                        onClick={handleSaveNewAddress}
                        disabled={savingNewAddress || !newAddressName.trim()}
                      >
                        {savingNewAddress ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <FiSave /> Save Address
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label htmlFor="notes">Order Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Special instructions for your order"
              rows={3}
            />
          </div>

          {/* Enhanced Order Summary with Discounts */}
          <div className="order-summary-preview">
            <h3>Order Summary</h3>
            
            {/* Show original subtotal if discounts exist */}
            {hasAnyDiscount && (
              <div className="summary-row original-price-row">
                <span>Original Subtotal</span>
                <span className="strikethrough">KSh {originalSubtotal.toLocaleString()}</span>
              </div>
            )}
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>KSh {subtotalKES.toLocaleString()}</span>
            </div>
            
            {/* Show discount savings */}
            {hasAnyDiscount && totalSavings > 0 && (
              <div className="summary-row discount-row">
                <span>
                  <FiPercent className="discount-icon" />
                  Discount Savings
                </span>
                <span className="discount-amount">-KES {totalSavings.toLocaleString()}</span>
              </div>
            )}
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shippingKES === 0 ? 'FREE' : `KSh ${shippingKES.toLocaleString()}`}</span>
            </div>
            
            <div className="summary-row">
              <span>Tax (16% VAT)</span>
              <span>KSh {taxKES.toLocaleString()}</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>KSh {totalKES.toLocaleString()}</span>
            </div>
            
            {/* Show savings message if applicable */}
            {hasAnyDiscount && totalSavings > 0 && (
              <div className="savings-message">
                <FiCheck />
                <span>You saved KES {totalSavings.toLocaleString()} on this order!</span>
              </div>
            )}
            
            {/* Free shipping reminder */}
            {shippingKES > 0 && subtotalKES < 10000 && (
              <div className="shipping-reminder">
                Add KSh {(10000 - subtotalKES).toLocaleString()} more for free shipping!
              </div>
            )}
          </div>

          <div className="step-actions">
            <button onClick={() => navigate('/cart')} className="btn btn-secondary">
              Back to Cart
            </button>
            <button onClick={handleNextStep} className="btn btn-primary">
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment Method Selection */}
      {step === 2 && (
        <div className="checkout-step">
          <h2>Select Payment Method</h2>
          
          <PaymentMethods 
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />

          <div className="step-actions">
            <button onClick={handlePrevStep} className="btn btn-secondary">
              Back
            </button>
            <button 
              onClick={handleNextStep} 
              className="btn btn-primary"
              disabled={!paymentMethod || processing}
            >
              {processing ? 'Creating Order...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment Processing */}
      {step === 3 && (
        <div className="checkout-step">
          <h2>Complete Your Payment</h2>
          <p className="payment-instruction">
            Order #{createdOrderId?.slice(-8)} has been created. Complete payment to confirm your order.
          </p>
          
          {paymentMethod === 'paystack' && (
            <PaystackForm 
              amount={totalKES}
              email={formData.email}
              name={`${formData.firstName} ${formData.lastName}`}
              phoneNumber={formData.phone}
              orderId={createdOrderId}
              onPaymentComplete={handlePaymentComplete}
              onCancel={handlePrevStep}
              processing={processing}
            />
          )}

          {paymentMethod === 'whatsapp' && (
            <WhatsAppOrder 
              orderData={{
                items: cartItems,
                total: totalKES,
                customer: formData,
                orderId: createdOrderId
              }}
              onPaymentComplete={handlePaymentComplete}
              onCancel={handlePrevStep}
              processing={processing}
            />
          )}
        </div>
      )}

      {/* Security Badge */}
      <div className="checkout-security">
        <FiLock />
        <span>Secure Checkout - Your information is encrypted</span>
      </div>

      <div className="checkout-guarantee">
        <FiTruck />
        <div>
          <h4>Free Shipping on Orders Over KSh 10,000</h4>
          <p>30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;