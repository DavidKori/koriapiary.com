// src/pages/settings/PaymentsTab.jsx
import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getPaymentMethods, addPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } from '../../services/paymentService';
import PaymentModal from './PaymentModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Loader from '../../components/common/Loader';
import { FiPlus, FiTrash2, FiCreditCard, FiPhone, FiCheck } from 'react-icons/fi';

const PaymentsTab = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [isDefaultToDelete, setIsDefaultToDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setLoading(true);
    try {
      const data = await getPaymentMethods();
      console.log('Loaded payment methods:', data);
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      showToast('Failed to load payment methods', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (paymentData) => {
    setSaving(true);
    try {
      let data;
      if (paymentData.type === 'card') {
        data = {
          type: 'card',
          cardNumber: paymentData.cardNumber,
          cardName: paymentData.cardName,
          expiryDate: paymentData.expiryDate,
          isDefault: paymentData.isDefault
        };
      } else {
        data = {
          type: 'mpesa',
          phoneNumber: paymentData.phoneNumber,
          cardName: paymentData.cardName,
          isDefault: paymentData.isDefault
        };
      }
      
      const newPaymentMethods = await addPaymentMethod(data);
      setPaymentMethods(newPaymentMethods);
      showToast('Payment method added successfully', 'success');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding payment method:', error);
      showToast(error.response?.data?.message || 'Failed to add payment method', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePaymentMethod = async (paymentId, isDefault) => {
    if (isDefault && paymentMethods.length === 1) {
      showToast('Cannot delete the only payment method. Add another first.', 'warning');
      return;
    }
    
    // Open confirmation modal instead of window.confirm
    setPaymentToDelete(paymentId);
    setIsDefaultToDelete(isDefault);
    setShowDeleteModal(true);
  };

  const confirmDeletePayment = async () => {
    setDeleteLoading(true);
    try {
      const remainingMethods = await deletePaymentMethod(paymentToDelete);
      setPaymentMethods(remainingMethods);
      showToast('Payment method deleted successfully', 'success');
      setShowDeleteModal(false);
      setPaymentToDelete(null);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      showToast('Failed to delete payment method', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSetDefaultPayment = async (paymentId) => {
    try {
      const updatedMethods = await setDefaultPaymentMethod(paymentId);
      setPaymentMethods(updatedMethods);
      showToast('Default payment method updated', 'success');
    } catch (error) {
      console.error('Error setting default payment method:', error);
      showToast('Failed to update default payment method', 'error');
    }
  };

  const getPaymentIcon = (type) => {
    return type === 'card' ? <FiCreditCard /> : <FiPhone />;
  };

  const getPaymentDisplay = (method) => {
    if (method.type === 'card') {
      return (
        <>
          <div className="payment-type">Credit/Debit Card</div>
          <div className="payment-details">
            •••• {method.last4} | Expires {method.expiryDate}
          </div>
          <div className="cardholder-name">{method.cardName}</div>
        </>
      );
    } else {
      return (
        <>
          <div className="payment-type">M-Pesa</div>
          <div className="payment-details">
            {method.phoneNumber} ****** {method.last4}
          </div>
          <div className="cardholder-name">{method.cardName}</div>
        </>
      );
    }
  };

  if (loading) {
    return <Loader size="small" text="Loading payment methods..." />;
  }

  // Get the payment method being deleted for the modal message
  const getPaymentDisplayForModal = () => {
    if (!paymentToDelete) return '';
    const method = paymentMethods.find(m => m._id === paymentToDelete);
    if (!method) return '';
    
    if (method.type === 'card') {
      return `Card ending in ${method.last4}`;
    } else {
      return `M-Pesa ending in ${method.last4}`;
    }
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Payment Methods</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setEditingPayment(null);
            setShowModal(true);
          }}
        >
          <FiPlus /> Add Payment Method
        </button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="empty-state">
          <FiCreditCard className="empty-icon" />
          <p>No payment methods added yet</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Your First Payment Method
          </button>
        </div>
      ) : (
        <div className="payment-methods-list">
          {paymentMethods.map(method => (
            <div key={method._id} className="payment-card">
              <div className="payment-header">
                <div className="payment-info">
                  <div className="payment-icon">{getPaymentIcon(method.type)}</div>
                  <div>
                    {getPaymentDisplay(method)}
                  </div>
                </div>
                <div className="payment-actions">
                  {method.isDefault && (
                    <span className="default-badge">
                      <FiCheck /> Default
                    </span>
                  )}
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDeletePaymentMethod(method._id, method.isDefault)}
                    title="Delete payment method"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              {!method.isDefault && (
                <button
                  className="set-default-btn"
                  onClick={() => handleSetDefaultPayment(method._id)}
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <PaymentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPayment(null);
        }}
        payment={editingPayment}
        onSubmit={handleAddPaymentMethod}
        saving={saving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPaymentToDelete(null);
        }}
        onConfirm={confirmDeletePayment}
        title="Delete Payment Method"
        message={`Are you sure you want to delete ${getPaymentDisplayForModal()}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default PaymentsTab;