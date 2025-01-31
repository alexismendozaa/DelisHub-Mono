import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import apiClient from '../api/axios';

const UserSettings = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.user?.username || '',
    email: user?.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser?.token && !error) {
      navigate('/login');
    }
  }, [navigate, error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setFormData({
      username: user?.user?.username || '',
      email: user?.user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    if (editingField === 'username' && !formData.currentPassword) {
      setError('Por favor ingresa tu contraseña actual para confirmar.');
      return;
    }
    if (editingField === 'email' && !formData.currentPassword) {
      setError('Por favor ingresa tu contraseña actual para confirmar.');
      return;
    }
    if (editingField === 'password') {
      if (!formData.currentPassword) {
        setError('Por favor, ingresa tu contraseña actual.');
        return;
      }
      if (!formData.newPassword || !formData.confirmPassword) {
        setError('Por favor, completa los campos de nueva contraseña.');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    try {
      setLoading(true);

      let endpoint = '/user-config/update-profile';
      let body = {
        userId: user?.user?.id,
        username: formData.username,
        password: formData.currentPassword,
      };

      if (editingField === 'password') {
        body = {
          userId: user?.user?.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        };
        endpoint = '/user-config/update-password';
      } else if (editingField === 'email') {
        body = {
          userId: user?.user?.id,
          email: formData.email,
          password: formData.currentPassword,
        };
        endpoint = '/user-config/update-email';
      }

      const response = await apiClient.put(endpoint, body);

      if (response.status === 200) {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
          login(response.data);

          setFormData((prev) => ({
            ...prev,
            username: response.data.user.username,
            email: response.data.user.email,
          }));
        }
        setSuccess('Perfil actualizado con éxito.');
        setEditingField(null);
      } else {
        throw new Error('Error actualizando los datos del perfil.');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Contraseña incorrecta. Por favor intenta nuevamente.');
      } else {
        setError('Hubo un error al actualizar los datos. Inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    try {
      setLoading(true);
      await apiClient.delete(`/user-config/delete-account/${user.user.id}`);

      // Cerrar sesión después de eliminar la cuenta
      localStorage.removeItem('user');
      login(null);
      navigate('/login');
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      setError('Hubo un problema al eliminar tu cuenta. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header
        className="d-flex justify-content-between align-items-center bg-light px-4 py-3 shadow-sm"
        style={{ position: 'sticky', top: 0, zIndex: 1000 }}
      >
        <button
          className="btn btn-outline-primary btn-lg fw-bold rounded-pill px-4 shadow-sm"
          onClick={() => navigate('/dashboard')}
          style={{
            fontSize: '1.25rem',
            letterSpacing: '0.5px',
          }}
        >
          🍴 DelisHub
        </button>
        <h4 className="mb-0">Configuración de Usuario</h4>
      </header>

      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-body">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            {!editingField ? (
              <div>
                <div className="mb-3">
                  <h5 className="fw-bold">Nombre:</h5>
                  <p>{formData.username}</p>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleEdit('username')}
                  >
                    Editar Nombre
                  </button>
                </div>
                <div className="mb-3">
                  <h5 className="fw-bold">Email:</h5>
                  <p>{formData.email}</p>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleEdit('email')}
                  >
                    Editar Correo
                  </button>
                </div>
                <div className="mb-3">
                  <h5 className="fw-bold">Contraseña:</h5>
                  <p>********</p>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleEdit('password')}
                  >
                    Cambiar Contraseña
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                {editingField === 'username' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Nuevo Nombre</label>
                      <input
                        type="text"
                        name="username"
                        className="form-control"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Nuevo Nombre"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Contraseña Actual</label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="form-control"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Contraseña Actual"
                      />
                    </div>
                  </>
                )}
                {editingField === 'email' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Nuevo Correo Electrónico</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nuevo Correo Electrónico"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Contraseña Actual</label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="form-control"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Contraseña Actual"
                      />
                    </div>
                  </>
                )}
                {editingField === 'password' && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Contraseña Actual</label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="form-control"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Contraseña Actual"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nueva Contraseña</label>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-control"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Nueva Contraseña"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirmar Nueva Contraseña"
                      />
                    </div>
                  </>
                )}
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="text-center mt-4">
              {!editingField && ( // Condición para mostrar el botón solo si no hay ningún campo en edición
                <button
                  className="btn btn-link text-danger small"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  {loading ? 'Eliminando cuenta...' : 'Eliminar cuenta'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
