// src/pages/settings/AddressesTab.jsx
import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../services/addressService';
import AddressModal from './AddressModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Loader from '../../components/common/Loader';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiHome, FiPhone } from 'react-icons/fi';

const AddressesTab = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await getAddresses();
      setAddresses(data || []);
    } catch (error) {
      console.error('Error loading addresses:', error);
      showToast('Failed to load addresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (addressData) => {
    setSaving(true);
    try {
      const newAddresses = await addAddress(addressData);
      setAddresses(newAddresses);
      showToast('Address added successfully', 'success');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding address:', error);
      showToast(error.message || 'Failed to add address', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAddress = async (addressData) => {
    setSaving(true);
    try {
      const updatedAddresses = await updateAddress(editingAddress._id, addressData);
      setAddresses(updatedAddresses);
      showToast('Address updated successfully', 'success');
      setShowModal(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error updating address:', error);
      showToast(error.message || 'Failed to update address', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    // Open confirmation modal instead of window.confirm
    setAddressToDelete(addressId);
    setShowDeleteModal(true);
  };

  const confirmDeleteAddress = async () => {
    setDeleteLoading(true);
    try {
      const remainingAddresses = await deleteAddress(addressToDelete);
      setAddresses(remainingAddresses);
      showToast('Address deleted successfully', 'success');
      setShowDeleteModal(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error('Error deleting address:', error);
      showToast('Failed to delete address', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const updatedAddresses = await setDefaultAddress(addressId);
      setAddresses(updatedAddresses);
      showToast('Default address updated', 'success');
    } catch (error) {
      console.error('Error setting default address:', error);
      showToast('Failed to update default address', 'error');
    }
  };

  // Get the address being deleted for the modal message
  const getAddressDisplayForModal = () => {
    if (!addressToDelete) return '';
    const address = addresses.find(a => a._id === addressToDelete);
    if (!address) return '';
    return `"${address.name}" at ${address.address}, ${address.city}`;
  };

  // Check if the address being deleted is the only address
  const isOnlyAddress = () => {
    if (!addressToDelete) return false;
    const address = addresses.find(a => a._id === addressToDelete);
    return address?.isDefault && addresses.length === 1;
  };

  if (loading) {
    return <Loader size="small" text="Loading addresses..." />;
  }

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Shipping Addresses</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setEditingAddress(null);
            setShowModal(true);
          }}
        >
          <FiPlus /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="empty-state">
          <FiMapPin className="empty-icon" />
          <p>No addresses added yet</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="addresses-list">
          {addresses.map(address => (
            <div key={address._id} className="address-card">
              <div className="address-header">
                <div className="address-name">
                  <FiHome />
                  <span>{address.name}</span>
                  {address.isDefault && <span className="default-badge">Default</span>}
                </div>
                <div className="address-actions">
                  <button
                    className="icon-btn edit"
                    onClick={() => {
                      setEditingAddress(address);
                      setShowModal(true);
                    }}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDeleteAddress(address._id)}
                    disabled={address.isDefault && addresses.length === 1}
                    title={address.isDefault && addresses.length === 1 ? "Cannot delete the only address" : "Delete address"}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="address-details">
                <p><strong>{address.name}</strong></p>
                <p>{address.address}</p>
                <p>{address.city}, {address.county}</p>
                {address.postalCode && <p>Postal Code: {address.postalCode}</p>}
                <p><FiPhone /> {address.phone}</p>
              </div>
              {!address.isDefault && (
                <button
                  className="set-default-btn"
                  onClick={() => handleSetDefaultAddress(address._id)}
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <AddressModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAddress(null);
        }}
        address={editingAddress}
        onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
        saving={saving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setAddressToDelete(null);
        }}
        onConfirm={confirmDeleteAddress}
        title="Delete Address"
        message={isOnlyAddress() 
          ? `You are about to delete ${getAddressDisplayForModal()}. This is your only address. You'll need to add a new address before checking out. Are you sure?`
          : `Are you sure you want to delete ${getAddressDisplayForModal()}? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default AddressesTab;