import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Button = ({ label, onClick, variant = 'primary', disabled = false, isSocial = false }) => (
  <button
    className={`btn btn-${variant} ${isSocial ? 'btn-social' : ''} shadow-sm rounded-pill px-4 py-2`}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);

export default Button;
