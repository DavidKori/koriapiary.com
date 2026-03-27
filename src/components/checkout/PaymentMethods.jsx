// src/components/checkout/PaymentMethods.jsx
import React from 'react';
import { FaCreditCard, FaWhatsapp } from 'react-icons/fa';

const PaymentMethods = ({ selectedMethod, onSelect }) => {
  const methods = [
    {
      id: 'paystack',
      name: 'Pay with Paystack',
      icon: <FaCreditCard />,
      description: 'Card, M-Pesa, Airtel Money, Bank Transfer',
    },
    {
      id: 'whatsapp',
      name: 'Order via WhatsApp',
      icon: <FaWhatsapp />,
      description: 'Place order and pay on delivery',
    }
  ];

  return (
    <div className="payment-methods">
      <h3 className="section-title">Payment Method</h3>
      
      <div className="payment-options">
        {methods.map(method => (
          <label 
            key={method.id} 
            className={`payment-option ${selectedMethod === method.id ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onSelect(method.id)}
            />
            <div className="payment-option-content">
              <div className="payment-icon">
                {method.icon}
              </div>
              <div className="payment-info">
                <span className="payment-name">{method.name}</span>
                <span className="payment-description">{method.description}</span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;


// // src/components/checkout/PaymentMethods.jsx
// import React from 'react';
// import { FaStripe, FaWhatsapp, FaMoneyBillWave } from 'react-icons/fa';
// import { MdPhoneAndroid } from 'react-icons/md';

// const PaymentMethods = ({ selectedMethod, onSelect }) => {
//   const methods = [
//     {
//       id: 'stripe',
//       name: 'Credit / Debit Card',
//       icon: <FaStripe />,
//       description: 'Pay securely with Stripe',
//     },
//     {
//       id: 'mpesa',
//       name: 'M-Pesa',
//       icon: <MdPhoneAndroid />,
//       description: 'Pay with M-Pesa mobile money',
//     },
//     {
//       id: 'whatsapp',
//       name: 'Order via WhatsApp',
//       icon: <FaWhatsapp />,
//       description: 'Place order and pay on delivery',
//     },
//     {
//       id: 'cash',
//       name: 'Cash on Delivery',
//       icon: <FaMoneyBillWave />,
//       description: 'Pay when you receive your order',
//     }
//   ];

//   return (
//     <div className="payment-methods">
//       <h3 className="section-title">Payment Method</h3>
      
//       <div className="payment-options">
//         {methods.map(method => (
//           <label 
//             key={method.id} 
//             className={`payment-option ${selectedMethod === method.id ? 'selected' : ''}`}
//           >
//             <input
//               type="radio"
//               name="paymentMethod"
//               value={method.id}
//               checked={selectedMethod === method.id}
//               onChange={() => onSelect(method.id)}
//             />
//             <div className="payment-option-content">
//               <div className="payment-icon">
//                 {method.icon}
//               </div>
//               <div className="payment-info">
//                 <span className="payment-name">{method.name}</span>
//                 <span className="payment-description">{method.description}</span>
//               </div>
//             </div>
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PaymentMethods;

