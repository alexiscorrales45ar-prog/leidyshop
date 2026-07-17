import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  readProductos,
  saveProductos,
  readVendedorWhatsapp,
  saveVendedorWhatsapp
} from '../services/productos';
import {
  isFirebaseConfigured,
  uploadProductImage,
  saveProductoToFirebase,
  updateProductoStockInFirebase,
  updateProductoInFirebase,
  deleteProductoFromFirebase,
  fetchProductosFromFirebase
} from '../services/firebase';

const formularioBase = {
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: '',
  stock: '',
  imagen: ''
};

function Dashboard() {
  const navigate = useNavigate();
  const [productosAdmin, setProductosAdmin] = useState([]);
  const [formulario, setFormulario] = useState(formularioBase);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [vendedorWhatsapp, setVendedorWhatsapp] = useState(() => readVendedorWhatsapp());
  const catalogUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    const esAdmin = window.localStorage.getItem('leidyshop-owner') === 'true';

    if (!esAdmin) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    console.log("Firebase configurado:", isFirebaseConfigured);

    const cargarDesdeFirebase = async () => {
      if (!isFirebaseConfigured) return;

      const productosCloud = await fetchProductosFromFirebase();

      setProductosAdmin(productosCloud);
    };

    cargarDesdeFirebase();
  }, []);

  const categorias = [...new Set(productosAdmin.map((producto) => producto.categoria))];
  const totalInventario = productosAdmin.reduce((acc, producto) => acc + producto.precio * producto.stock, 0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagen = async (event) => {
    const file = event.target.files?.[0];
    console.log("Se presionó Agregar producto");

    if (!file) {
      return;
    }

    const fileName = file.name?.toLowerCase() || '';
    const isImageFile = file.type?.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg|avif|ico)$/i.test(fileName);

    if (!isImageFile) {
      setStatus('El archivo seleccionado no es una imagen válida.');
      event.target.value = '';
      return;
    }

    const imageUrl = await uploadProductImage(file);

    if (imageUrl) {
      setFormulario((prev) => ({ ...prev, imagen: imageUrl }));
      setStatus('Foto subida correctamente.');
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setFormulario((prev) => ({ ...prev, imagen: localPreviewUrl }));
    setStatus('Foto preparada para el producto en modo local.');
  };

  const resetFormulario = () => {
    setFormulario(formularioBase);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const productoData = {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      categoria: formulario.categoria,
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      imagen: formulario.imagen || 'https://via.placeholder.com/300x200?text=Producto'
    };

    if (editingId) {
      setProductosAdmin((prev) =>
        prev.map((producto) =>
          producto.id === editingId
            ? { ...producto, ...productoData }
            : producto
        )
      );

      if (isFirebaseConfigured) {
        await updateProductoInFirebase(editingId, productoData);
      }

      setStatus('Producto actualizado correctamente.');
      resetFormulario();
      return;
    }

    if (isFirebaseConfigured) {
  try {
    console.log("Voy a guardar en Firestore", productoData);
    const id = await saveProductoToFirebase(productoData);
    console.log("ID recibido:", id);
    console.log("Producto guardado. ID:", id);

    setProductosAdmin((prev) => [{ ...productoData, id }, ...prev]);
    setStatus("Producto guardado en Firebase.");
  } catch (error) {
    console.error("Error Firebase:", error);
    setStatus(error.message);
  }
} else {
      setProductosAdmin((prev) => [{ ...productoData, id: Date.now() }, ...prev]);
      setStatus('Producto agregado localmente.');
    }

    setFormulario(formularioBase);
  };

  const editarProducto = (producto) => {
    setEditingId(producto.id);
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
      imagen: producto.imagen
    });
    setStatus('Editando producto.');
  };

  const eliminarProducto = async (id) => {
    setProductosAdmin((prev) => prev.filter((producto) => producto.id !== id));

    if (isFirebaseConfigured) {
      await deleteProductoFromFirebase(id);
    }

    if (editingId === id) {
      resetFormulario();
    }

    setStatus('Producto eliminado.');
  };

  const copiarLinkCatalogo = async () => {
    if (!catalogUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(catalogUrl);
      setStatus('Link del catálogo copiado.');
    } catch {
      setStatus('No se pudo copiar el link automáticamente.');
    }
  };

  const guardarWhatsapp = () => {
    saveVendedorWhatsapp(vendedorWhatsapp);
    setStatus('Número de WhatsApp guardado.');
  };

  const actualizarStock = async (id, nuevaCantidad) => {
    setProductosAdmin((prev) =>
      prev.map((producto) =>
        producto.id === id
          ? { ...producto, stock: Number(nuevaCantidad) }
          : producto
      )
    );

    if (isFirebaseConfigured) {
      await updateProductoStockInFirebase(id, nuevaCantidad);
    }
  };

  return (
    <section>
      <h1>Panel de la vendedora</h1>
      <p>{status}</p>

      <div className="dashboard-share-box">
        <strong>Compartir catálogo</strong>
        <p>Usa este enlace para enviar el catálogo a tus compradores.</p>
        <div className="dashboard-share-actions">
          <input type="text" value={catalogUrl} readOnly />
          <button type="button" onClick={copiarLinkCatalogo}>Copiar link</button>
          <a
            className="whatsapp-button"
            href={`https://wa.me/?text=${encodeURIComponent(`Mira mi catálogo: ${catalogUrl}`)}`}
            target="_blank"
            rel="noreferrer"
          >
            Compartir por WhatsApp
          </a>
        </div>
      </div>

      <div className="dashboard-share-box">
        <strong>WhatsApp de pedidos</strong>
        <p>Escribe el número de la vendedora para que los compradores lleguen al pedido correcto.</p>
        <div className="dashboard-share-actions">
          <input
            type="text"
            value={vendedorWhatsapp}
            onChange={(event) => setVendedorWhatsapp(event.target.value)}
            placeholder="Ej: 573001234567"
          />
          <button type="button" onClick={guardarWhatsapp}>Guardar WhatsApp</button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-card">
          <strong>Total de productos</strong>
          <span>{productosAdmin.length}</span>
        </div>
        <div className="dashboard-card">
          <strong>Categorías</strong>
          <span>{categorias.length}</span>
        </div>
        <div className="dashboard-card">
          <strong>Inventario estimado</strong>
          <span>${totalInventario}</span>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre del producto" required />
        <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} placeholder="Descripción" required />
        <input name="categoria" value={formulario.categoria} onChange={handleChange} placeholder="Categoría" required />
        <input name="precio" type="number" value={formulario.precio} onChange={handleChange} placeholder="Precio" required />
        <input name="stock" type="number" value={formulario.stock} onChange={handleChange} placeholder="Stock" required />
        <input
          type="file"
          accept="image/*,.png,.jpg,.jpeg,.gif,.webp,.bmp,.svg,.avif,.ico"
          onChange={handleImagen}
        />
        <button type="submit">{editingId ? 'Guardar cambios' : 'Agregar producto'}</button>
        {editingId ? (
          <button type="button" onClick={resetFormulario}>Cancelar edición</button>
        ) : null}
      </form>

      <div className="dashboard-list">
        {productosAdmin.map((producto) => (
          <div key={producto.id} className="dashboard-card">
            <strong>{producto.nombre}</strong>
            <span>{producto.categoria}</span>
            <span>{producto.descripcion}</span>
            <span>Precio: ${producto.precio}</span>
            <label>
              Stock:
              <input
                type="number"
                value={producto.stock}
                onChange={(event) => actualizarStock(producto.id, event.target.value)}
              />
            </label>
            <img src={producto.imagen} alt={producto.nombre} className="product-image" />
            <div className="dashboard-actions">
              <button type="button" onClick={() => editarProducto(producto)}>Modificar</button>
              <button type="button" onClick={() => eliminarProducto(producto.id)}>Borrar</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
