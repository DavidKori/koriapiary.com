// src/components/forms/ValidationMessage.jsx
import React from 'react';

const ValidationMessage = ({ errors = {} }) => {
  const errorMessages = Object.values(errors).filter(Boolean);

  if (errorMessages.length === 0) return null;

  return (
    <div className="validation-messages">
      {errorMessages.map((message, index) => (
        <div key={index} className="validation-error">
          ⚠️ {message}
        </div>
      ))}
    </div>
  );
};

export default ValidationMessage;