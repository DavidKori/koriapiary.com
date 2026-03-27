// src/components/forms/Input.jsx
import React from 'react';

const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}{required && ' *'}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={error ? 'error' : ''}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Input;