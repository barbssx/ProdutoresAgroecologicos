import React from 'react';
import './SeasonChip.css';

const SeasonChip = ({ season }) => {
  const seasonColors = {
    Anual: 'lightgrey',
    Verão: 'yellow',
    Outono: 'orange',
    Inverno: 'lightblue',
    Primavera: 'lightgreen'
  };

  return (
    <span 
      className="season-chip" 
      style={{ backgroundColor: seasonColors[season], color: 'black', padding: '5px 10px', borderRadius: '15px', margin: '5px' }}
    >
      {season}
    </span>
  );
};

export default SeasonChip;
