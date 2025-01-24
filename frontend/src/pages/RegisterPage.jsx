import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import Button from '../components/Button';

function RegisterPage() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register', { username, email, password });
      alert('Registro exitoso');
      console.log('Usuario registrado:', response.data);
      navigate('/login'); // Redirige al usuario a la página de inicio de sesión
    } catch (error) {
      console.error('Error recibido:', error);
      if (error.response && error.response.data) {
        const { error: errorMsg, details } = error.response.data;
        setError(`${errorMsg}: ${details}`);
      } else {
        setError('Hubo un error durante el registro. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="form-container bg-white shadow p-5 rounded">
        <h2 className="text-center mb-4">Regístrate</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Nombre Completo</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Ingresa tu nombre completo"
              value={username}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-center">
            <Button label={loading ? 'Cargando...' : 'Registrarse'} variant="success" disabled={loading} />
          </div>
        </form>
        <div className="text-center mt-3">
          <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
