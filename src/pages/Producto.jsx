import React, { useEffect, useState } from 'react';
import CardProducto from '../components/CardProducto';
import Buscador from '../components/Buscador';
import {
  fetchProductosFromFirebase,
  isFirebaseConfigured
} from '../services/firebase';

function Producto() {
  const [buscar, setBuscar] = useState('');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function cargarProductos() {
      if (isFirebaseConfigured) {
        const lista = await fetchProductosFromFirebase();
        setProductos(lista);
      }
    }

    cargarProductos();
  }, []);

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
            <CardProducto
              key={producto.id}
              producto={producto}
            />
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </section>
  );
}

export default Producto;