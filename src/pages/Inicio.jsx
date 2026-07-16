import React, { useEffect, useState } from 'react';
import { readProductos } from '../services/productos';
import { isFirebaseConfigured, fetchProductosFromFirebase } from '../services/firebase';
import CardProducto from '../components/CardProducto';
import Buscador from '../components/Buscador';

function Inicio() {
  const [buscar, setBuscar] = useState('');
  const [productosCatalogo, setProductosCatalogo] = useState(() => readProductos());

  useEffect(() => {
    const cargarProductos = async () => {
      if (isFirebaseConfigured) {
        const productosCloud = await fetchProductosFromFirebase();

        if (productosCloud.length > 0) {
          setProductosCatalogo(productosCloud);
          return;
        }
      }

      setProductosCatalogo(readProductos());
    };

    cargarProductos();
  }, []);

  const productosFiltrados = productosCatalogo.filter((producto) =>
    producto.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <section className="homepage">
      <div className="hero-banner">
        <div>
          <span className="hero-badge">Nueva colección</span>
          <h1>Bienvenido a LeidyShop</h1>
          <p>Explora productos elegantes, modernos y listos para vender.</p>
        </div>
        <Buscador value={buscar} onChange={setBuscar} />
      </div>

      <div className="products-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <CardProducto key={producto.id} producto={producto} />
          ))
        ) : (
          <p>No encontramos productos para tu búsqueda.</p>
        )}
      </div>
    </section>
  );
}

export default Inicio;
