// src/pages/PaymentCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { verifyPaystackPayment } from '../services/paymentService';
import Loader from '../components/common/Loader';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');
      const paymentRef = reference || trxref;

      if (!paymentRef) {
        showToast('No payment reference found', 'error');
        navigate('/checkout');
        return;
      }

      try {
        const response = await verifyPaystackPayment(paymentRef);
        
        if (response.success && response.data?.status === 'success') {
          showToast('Payment successful!', 'success');
          // Redirect to order success page
          navigate(`/order-success?orderId=${response.data.orderId}`);
        } else {
          showToast(response.message || 'Payment verification failed', 'error');
          navigate('/checkout');
        }
      } catch (error) {
        console.error('Verification error:', error);
        showToast('Payment verification failed. Please contact support.', 'error');
        navigate('/checkout');
      }
    };

    verifyPayment();
  }, [searchParams, navigate, showToast]);

  return (
    <div className="payment-callback">
      <Loader text="Verifying your payment..." />
    </div>
  );
};

export default PaymentCallback;