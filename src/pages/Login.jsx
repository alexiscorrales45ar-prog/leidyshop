import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  auth,
  isFirebaseConfigured,
  signInWithEmailAndPassword
} from '../services/firebase';

const OWNER_EMAIL = 'jahteseguire@hotmail.com';
const OWNER_PASSWORD = 'leidyshop123';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.localStorage.setItem('leidyshop-owner', 'true');
        setMensaje('Acceso concedido con Firebase.');
        navigate('/dashboard');
        return;
      } catch {
        setMensaje('Credenciales de Firebase inválidas.');
        return;
      }
    }

    if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
      window.localStorage.setItem('leidyshop-owner', 'true');
      setMensaje('Acceso concedido.');
      navigate('/dashboard');
      return;
    }

    setMensaje('Credenciales incorrectas.');
  };

  return (
    <section>
      <h1>Login de la vendedora</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Ingresar</button>
      </form>
      <p>{mensaje}</p>
      
    </section>
  );
}

export default Login;
