import React, { createContext, useContext, useMemo, useState } from 'react';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);

  const agregarAlCarrito = (producto) => {
    setItems((prev) => {
      const yaExiste = prev.find((item) => item.id === producto.id);

      if (producto.stock <= 0) {
        return prev;
      }

      if (yaExiste && yaExiste.cantidad >= producto.stock) {
        return prev;
      }

      if (yaExiste) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const quitarDelCarrito = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [items]
  );

  return (
    <CarritoContext.Provider value={{ items, agregarAlCarrito, quitarDelCarrito, total }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);

  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }

  return context;
}
