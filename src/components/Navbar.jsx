import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

function Navbar() {
  const { items } = useCarrito();
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <nav className="navbar">
      <div className="brand">LeidyShop</div>
      <div className="nav-links">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/producto">Productos</NavLink>
        <NavLink to="/carrito">Carrito ({totalItems})</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
