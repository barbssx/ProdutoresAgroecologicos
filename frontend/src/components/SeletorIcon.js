// SeletorIcon.js
import React, { useState } from 'react';

const SeletorIcon = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Lista dos 160 ícones
  const icons = Array.from({ length: 160 }, (_, i) => `/assets/Icons/icon_${String(i + 1).padStart(2, '0')}.png`);

  return (
    <div className="icon-selector">
      <button onClick={() => setIsOpen(!isOpen)}>
        Selecionar Ícone
      </button>
      {isOpen && (
        <div className="icon-list">
          {icons.map((icon, index) => (
            <img 
              key={index} 
              src={icon} 
              alt={`Ícone ${index + 1}`} 
              onClick={() => { 
                onSelect(`icon_${String(index + 1).padStart(2, '0')}.png`);
                setIsOpen(false); 
              }}
              className="icon-item"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SeletorIcon;
