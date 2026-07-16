import React from 'react';
import { useCarrito } from '../context/CarritoContext';

function CardProducto({ producto }) {
  const { agregarAlCarrito } = useCarrito();
  const sinStock = producto.stock <= 0;

  return (
    <article className="product-card">
      <img src={producto.imagen} alt={producto.nombre} className="product-image" />
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <span>{producto.categoria}</span>
      <strong>${producto.precio}</strong>
      <p>Stock disponible: {producto.stock}</p>
      <button onClick={() => agregarAlCarrito(producto)} disabled={sinStock}>
        {sinStock ? 'Sin stock' : 'Agregar al carrito'}
      </button>
    </article>
  );
}

export default CardProducto;
