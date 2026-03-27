// src/components/common/ConfirmationModal.jsx
import React, { useEffect, useRef } from 'react';
import { FiAlertTriangle, FiX, FiTrash2, FiShield, FiCheckCircle } from 'react-icons/fi';
import '../../styles/ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  icon = null,
  loading = false,
  showInput = false,
  inputPlaceholder = '',
  inputValue = '',
  onInputChange = null
}) => {
  const confirmButtonRef = useRef(null);
  const inputRef = useRef(null);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && isOpen && !loading) {
        // Check if confirm button should be enabled
        const isConfirmDisabled = showInput && !inputValue;
        if (!isConfirmDisabled) {
          onConfirm();
        }
      }
      
      // Close on Escape key
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen, loading, showInput, inputValue, onConfirm, onClose]);

  // Auto-focus on input or confirm button
  useEffect(() => {
    if (isOpen) {
      if (showInput && inputRef.current) {
        setTimeout(() => inputRef.current.focus(), 100);
      } else if (confirmButtonRef.current) {
        setTimeout(() => confirmButtonRef.current.focus(), 100);
      }
    }
  }, [isOpen, showInput]);

  if (!isOpen) return null;

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'danger':
        return <FiTrash2 />;
      case 'warning':
        return <FiAlertTriangle />;
      case 'success':
        return <FiCheckCircle />;
      case 'info':
        return <FiShield />;
      default:
        return <FiAlertTriangle />;
    }
  };

  const getIconClass = () => {
    switch (type) {
      case 'danger':
        return 'modal-icon-danger';
      case 'warning':
        return 'modal-icon-warning';
      case 'success':
        return 'modal-icon-success';
      case 'info':
        return 'modal-icon-info';
      default:
        return 'modal-icon-danger';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'modal-btn-danger';
      case 'warning':
        return 'modal-btn-warning';
      case 'success':
        return 'modal-btn-success';
      case 'info':
        return 'modal-btn-info';
      default:
        return 'modal-btn-danger';
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const isConfirmDisabled = showInput && !inputValue;
      if (!isConfirmDisabled) {
        onConfirm();
      }
    }
  };

  return (
    <div className="confirmation-modal-overlay" onClick={onClose}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>
        
        <div className={`modal-icon ${getIconClass()}`}>
          {getIcon()}
        </div>
        
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        
        {showInput && (
          <input
            ref={inputRef}
            type="text"
            className="modal-input"
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(e) => onInputChange && onInputChange(e.target.value)}
            onKeyPress={handleInputKeyPress}
            autoFocus
          />
        )}
        
        <div className="modal-buttons">
          <button 
            className="modal-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button 
            ref={confirmButtonRef}
            className={`modal-btn-confirm ${getButtonClass()}`}
            onClick={onConfirm}
            disabled={loading || (showInput && !inputValue)}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;