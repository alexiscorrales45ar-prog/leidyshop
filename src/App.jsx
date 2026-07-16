import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Producto from './pages/Producto';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { CarritoProvider } from './context/CarritoContext';

function App() {
  return (
    <HashRouter>
      <CarritoProvider>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/producto" element={<Producto />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CarritoProvider>
    </HashRouter>
  );
}

export default App;