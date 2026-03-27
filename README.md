# Apiary Honey - Frontend Documentation

## 🍯 Overview

Apiary Honey is a modern e-commerce platform for selling premium honey and apiary products. This frontend application provides a seamless shopping experience with features like product browsing, cart management, user authentication, order processing, and payment integration.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Features](#features)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Context Providers](#context-providers)
- [Services](#services)
- [Styling](#styling)
- [Payment Integration](#payment-integration)
- [Email Integration](#email-integration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend framework |
| **React Router DOM** | Routing and navigation |
| **Axios** | HTTP client for API calls |
| **React Icons** | Icon library |
| **Formspree React** | Contact form handling |
| **React Helmet Async** | SEO management |
| **CSS3** | Styling with CSS modules and global styles |

## 📁 Project Structure

```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable components
│   ├── cart/           # Cart-related components
│   ├── checkout/       # Checkout flow components
│   ├── common/         # Shared components (Loader, Modal, etc.)
│   ├── layout/         # Layout components (Header, Footer, Layout)
│   └── products/       # Product display components
├── context/            # React Context providers
├── pages/              # Page components
│   └── settings/       # User settings pages
├── services/           # API service functions
├── styles/             # Global and component-specific CSS
├── utils/              # Utility functions
├── App.jsx             # Main app component
├── index.jsx           # Entry point
└── routes.jsx          # Route definitions (if separated)
```

## 🔧 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

5. **Build for production**
```bash
npm run build
# or
yarn build
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Paystack Payment
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# Formspree
VITE_FORMSPREE_ID=your_formspree_form_id

# App Configuration
VITE_APP_NAME=Apiary Honey
VITE_APP_URL=http://localhost:5173
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## ✨ Features

### User Features
- **User Authentication**: Register, login, email verification
- **Product Browsing**: View products with variants, discounts, and ratings
- **Shopping Cart**: Add/remove items, update quantities, apply discounts
- **Wishlist**: Save favorite products
- **Checkout**: Multiple payment methods (Paystack, WhatsApp)
- **Order Management**: View order history and details
- **Profile Management**: Update profile, change password
- **Address Book**: Save and manage shipping addresses
- **Payment Methods**: Save card details for faster checkout

### Admin Features
- **Admin Dashboard**: Overview of sales and orders
- **Product Management**: Add/edit products and variants
- **Order Management**: Process and update orders
- **User Management**: Manage customer accounts
- **Discount Management**: Create product and cart discounts

### Security Features
- **Email Verification**: Verify email during registration
- **Admin Login Verification**: Two-step verification for admin access
- **Password Reset**: Secure password recovery
- **Account Deletion**: Soft delete with verification for admins

## 🗺️ Pages & Routes

### Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page |
| `/products` | Products | Product listing |
| `/product/:slug` | ProductDetails | Single product view |
| `/about` | About | Company information |
| `/blog` | Blog | Blog listing |
| `/blog/:slug` | BlogPost | Single blog post |
| `/contact` | Contact | Contact form |
| `/projects` | Projects | Portfolio/projects |
| `/cart` | Cart | Shopping cart |
| `/faq` | FAQ | Frequently asked questions |
| `/shipping-policy` | ShippingPolicy | Shipping information |
| `/returns-policy` | ReturnsPolicy | Return policy |
| `/privacy-policy` | PrivacyPolicy | Privacy policy |
| `/terms-of-service` | TermsOfService | Terms and conditions |

### Auth Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login | User login |
| `/register` | Register | User registration |
| `/verify` | VerifyEmail | Email verification |

### Protected Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/profile` | Profile | User profile |
| `/orders` | Orders | Order history |
| `/orders/:id` | OrderDetails | Single order details |
| `/wishlist` | Wishlist | Saved products |
| `/settings` | Settings | Account settings |
| `/admin-delete-confirm` | AdminDeleteConfirm | Admin account deletion |

### Checkout Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/checkout` | CheckoutForm | Checkout process |
| `/order-success` | OrderSuccess | Order confirmation |
| `/payment-callback` | PaymentCallback | Payment callback handler |

## 🧩 Components

### Common Components

| Component | Purpose |
|-----------|---------|
| `Loader` | Loading spinner |
| `Modal` | Reusable modal dialog |
| `ConfirmationModal` | Confirmation dialog |
| `Carousel` | Image carousel |
| `SEO` | Meta tags management |
| `ProtectedRoute` | Route protection wrapper |

### Cart Components

| Component | Purpose |
|-----------|---------|
| `CartItem` | Individual cart item display |
| `CartSummary` | Cart totals summary |

### Checkout Components

| Component | Purpose |
|-----------|---------|
| `CheckoutForm` | Multi-step checkout |
| `PaymentMethods` | Payment method selection |
| `PaystackForm` | Paystack payment integration |
| `WhatsAppOrder` | WhatsApp order processing |

### Product Components

| Component | Purpose |
|-----------|---------|
| `ProductCard` | Product display card |
| `ProductRecommendations` | Related products |
| `VariantSelector` | Product variant selection |

### Layout Components

| Component | Purpose |
|-----------|---------|
| `Layout` | Main layout wrapper |
| `Header` | Navigation header |
| `Footer` | Page footer |

## 🔄 Context Providers

| Context | Purpose |
|---------|---------|
| `AuthContext` | User authentication state |
| `CartContext` | Shopping cart state |
| `ThemeContext` | Dark/light theme |
| `ToastContext` | Toast notifications |
| `GoogleTranslateContext` | Language translation |

## 🌐 Services

| Service | Purpose |
|---------|---------|
| `api.js` | Axios instance configuration |
| `authService.js` | Authentication API calls |
| `productService.js` | Product operations |
| `cartService.js` | Cart operations |
| `orderService.js` | Order operations |
| `paymentService.js` | Payment processing |
| `userService.js` | User profile operations |
| `addressService.js` | Address management |
| `wishlistService.js` | Wishlist operations |

## 🎨 Styling

### CSS Structure

```
styles/
├── global.css          # Global styles and variables
├── pages.css           # Page-specific styles
├── components.css      # Component styles
├── auth.css            # Authentication pages
├── cart.css            # Cart page styles
├── checkoutForm.css    # Checkout styles
├── productCard.css     # Product card styles
├── profile.css         # Profile page styles
├── faq.css             # FAQ page styles
├── policy.css          # Policy pages styles
├── contact.css         # Contact page styles
├── legal.css           # Legal pages styles
└── paystackForm.css    # Paystack form styles
```

### CSS Variables

```css
:root {
  /* Colors */
  --color-primary: #4a90e2;
  --color-secondary: #67b26f;
  --color-danger: #e74c3c;
  --color-success: #27ae60;
  --color-warning: #f1c40f;
  --color-info: #3498db;
  
  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-card: #ffffff;
  --bg-navbar: rgba(255, 255, 255, 0.95);
  
  /* Text */
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --text-muted: #95a5a6;
  
  /* Borders */
  --border-light: #e9ecef;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
  
  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-modal: 1050;
  --z-toast: 1060;
}
```

## 💳 Payment Integration

### Paystack Integration
- Uses Paystack's inline modal for secure payments
- Supports card payments and mobile money (M-Pesa, Airtel Money)
- Automatic payment verification via webhook

```javascript
// Example Paystack initialization
const handler = PaystackPop.setup({
  key: PAYSTACK_PUBLIC_KEY,
  email: userEmail,
  amount: amount * 100,
  currency: 'KES',
  callback: (response) => {
    // Handle successful payment
  },
  onClose: () => {
    // Handle modal close
  }
});
```

### WhatsApp Order Processing
- Creates order in system
- Generates pre-filled WhatsApp message
- Admin confirms order manually

## 📧 Email Integration

### Formspree Contact Form
- Simple form submission handling
- Spam protection
- Email notifications

```javascript
import { useForm } from '@formspree/react';

const [state, handleSubmit] = useForm('your_form_id');

// Form submission
<form onSubmit={handleSubmit}>
  <input name="email" type="email" />
  <textarea name="message" />
  <button type="submit">Send</button>
</form>
```

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist` folder.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Deploy to GitHub Pages
```bash
npm run build
npm install -g gh-pages
gh-pages -d dist
```

## 🔍 Troubleshooting

### Common Issues

#### 1. API Connection Errors
- Ensure backend server is running
- Check `VITE_API_URL` in `.env`
- Verify CORS configuration on backend

#### 2. Paystack Not Loading
- Check internet connection
- Verify Paystack public key
- Ensure script is loaded correctly

#### 3. Formspree Not Working
- Verify form ID is correct
- Check network connectivity
- Ensure form fields match Formspree configuration

#### 4. Cart Items Not Persisting
- Clear browser cache
- Check localStorage permissions
- Verify cart context implementation

### Debugging
- Open browser DevTools (F12)
- Check Console for errors
- Check Network tab for API calls
- Use React DevTools for component inspection

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is prohibited.

## 📞 Support

For support, email support@apiaryhoney.com or visit our [contact page](https://apiaryhoney.com/contact).

---

**Built with ❤️ by KoriDevifys**