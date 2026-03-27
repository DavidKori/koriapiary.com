// src/components/forms/Textarea.jsx
import React from 'react';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}{required && ' *'}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className={error ? 'error' : ''}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Textarea;