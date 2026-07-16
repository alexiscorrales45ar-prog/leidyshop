import React, { useState } from 'react';
import { productos } from '../services/productos';
import CardProducto from '../components/CardProducto';
import Buscador from '../components/Buscador';

function Producto() {
  const [buscar, setBuscar] = useState('');

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <section>
      <h1>Productos</h1>
      <Buscador value={buscar} onChange={setBuscar} />
      <div className="products-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <CardProducto key={producto.id} producto={producto} />
          ))
        ) : (
          <p>No hay productos disponibles con ese filtro.</p>
        )}
      </div>
    </section>
  );
}

export default Producto;
