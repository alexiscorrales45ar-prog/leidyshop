import React from 'react';

function Buscador({ value, onChange, placeholder = 'Buscar productos...' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="search-input"
    />
  );
}

export default Buscador;
