// src/components/common/Card.jsx
import React from 'react';

const Card = ({ children, className = '', onClick, hoverable = true }) => {
  return (
    <div 
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;