import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import apiClient from '../api/axios';
import Button from '../components/Button'; // Botón reutilizable
import '../styles/LoginPage.css'; // Estilos personalizados para LoginPage

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { email, password });

      // Guardar el usuario en localStorage y actualizar el contexto
      localStorage.setItem('user', JSON.stringify(response.data));
      login(response.data);

      // Redirigir al dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Error durante el login:', err);
      setError('Email o contraseña incorrectos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="form-container bg-white shadow p-5 rounded">
        <h2 className="text-center mb-4">Inicia Sesión en DelisHub</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <Button label={loading ? 'Iniciando...' : 'Iniciar Sesión'} variant="primary" disabled={loading} />
        </form>
        <div className="text-center mt-3">
          <p>¿No tienes una cuenta? <a href="/register">Regístrate aquí</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
