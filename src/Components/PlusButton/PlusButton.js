import React from 'react';
import './PlusButton.scss';

const PlusButton = ({ className = '', open = false, color = '#222' }) => {
  return (
    <div className={`plus-button ${className} ${open ? 'close' : ''}`}>
      <span className="line" style={{ backgroundColor: color }} />
      <span className="line" style={{ backgroundColor: color }} />
    </div>
  );
};

export default PlusButton;
