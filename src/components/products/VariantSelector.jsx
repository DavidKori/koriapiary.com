// ==========================================
// VARIANT SELECTOR - Allows selecting product variants with price update
// ==========================================
import React, { useState, useEffect } from 'react';
import { FiPackage, FiDroplet } from 'react-icons/fi';

const VariantSelector = ({ variants, onVariantChange, selectedVariant }) => {
  const [selected, setSelected] = useState(selectedVariant || variants[0]);

  useEffect(() => {
    if (selected && onVariantChange) {
      onVariantChange(selected);
    }
  }, [selected]);

  const handleVariantSelect = (variant) => {
    setSelected(variant);
  };

  // Group variants by name if needed
  const getVariantIcon = (variant) => {
    if (variant.name.toLowerCase().includes('jar')) return <FiPackage />;
    if (variant.name.toLowerCase().includes('bottle')) return <FiDroplet />;
    return <FiPackage />;
  };

  return (
    <div className="variant-selector">
      <label className="variant-label">Select Size:</label>
      <div className="variant-options">
        {variants.map((variant) => (
          <button
            key={variant._id}
            className={`variant-option ${selected?._id === variant._id ? 'selected' : ''} 
              ${variant.stock <= 0 ? 'out-of-stock' : ''}`}
            onClick={() => handleVariantSelect(variant)}
            disabled={variant.stock <= 0}
          >
            <div className="variant-content">
              <span className="variant-icon">{getVariantIcon(variant)}</span>
              <span className="variant-name">{variant.name}</span>
              <span className="variant-price">Ksh{variant.price.toFixed(2)}</span>
              {variant.stock <= 0 && (
                <span className="variant-stock-badge">Out of Stock</span>
              )}
              {variant.stock > 0 && variant.stock < 5 && (
                <span className="variant-stock-badge low-stock">
                  Only {variant.stock} left
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariantSelector;