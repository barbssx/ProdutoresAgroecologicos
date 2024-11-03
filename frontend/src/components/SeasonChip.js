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
      style={{ backgroundColor: seasonColors[season], color: 'black', padding: '5px 10px', borderRadius: '5px', margin: '5px', border: '2px solid black' }}
    >
      {season}
    </span>
  );
};

export default SeasonChip;
