import React from 'react';
import { useCarrito } from '../context/CarritoContext';
import { readVendedorWhatsapp } from '../services/productos';

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
}

function Carrito() {
  const { items, quitarDelCarrito, total } = useCarrito();
  const vendedorWhatsapp = readVendedorWhatsapp();

  const mensajePedido = encodeURIComponent(
    `Hola, quiero hacer este pedido:\n${items
      .map((item) => `- ${item.nombre} (${item.cantidad}) - ${formatCurrency(item.precio * item.cantidad)}`)
      .join('\n')}\n\nTotal: ${formatCurrency(total)}`
  );

  const whatsappUrl = `https://wa.me/${vendedorWhatsapp}?text=${mensajePedido}`;

  return (
    <section>
      <h1>Carrito</h1>
      {items.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <span>{item.nombre}</span>
              <span>{item.cantidad} x {formatCurrency(item.precio)}</span>
              <span>Stock disponible: {item.stock}</span>
              <button onClick={() => quitarDelCarrito(item.id)}>Quitar</button>
            </div>
          ))}
          <h3>Total estimado: {formatCurrency(total)}</h3>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-button">
            Enviar pedido por WhatsApp
          </a>
        </div>
      )}
    </section>
  );
}

export default Carrito;
