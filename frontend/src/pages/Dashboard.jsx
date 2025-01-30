import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import AuthContext from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useContext(AuthContext); // Acceso al usuario autenticado
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirige al login si no hay usuario autenticado
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Fetch recetas públicas al cargar el componente
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await apiClient.get('/recipes'); // Endpoint para obtener las recetas públicas
        setRecipes(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Hubo un problema al cargar las recetas. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // Manejar cierre de sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userName = user?.user?.username || 'Usuario';

  return (
    <div className="dashboard-container d-flex vh-100">
      {/* Barra Lateral */}
      <aside className="sidebar bg-light p-4 d-flex flex-column align-items-center">
        <div className="user-info text-center mb-4">
          <h5 className="user-name fw-bold text-primary mb-2">{userName}</h5>
          <p className="user-email text-secondary">{user?.user?.email || 'Correo no disponible'}</p>
        </div>
        <div className="menu-options w-100">
          <button
            className="btn btn-primary w-100 mb-3 py-2 rounded"
            onClick={() => navigate(`/user-profile/${user.user.id}`)}
          >
            <i className="bi bi-person-circle me-2"></i> Mi Perfil
          </button>
          <button
            className="btn btn-secondary w-100 mb-3 py-2 rounded"
            onClick={() => navigate('/settings')}
          >
            <i className="bi bi-gear-fill me-2"></i> Configuración
          </button>
          <button
            className="btn btn-danger w-100 py-2 rounded"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="main-content flex-grow-1 bg-light">
        <header className="dashboard-header bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center shadow">
          <h1 className="h3 mb-0">DelisHub</h1>
          <button
            className="btn btn-success rounded-pill px-4"
            onClick={() => navigate('/recipes/create')}
          >
            Crear Receta
          </button>
        </header>

        <div className="dashboard-content container py-4">
          {loading ? (
            <div className="text-center">
              <p>Cargando datos...</p>
            </div>
          ) : error ? (
            <div className="text-center text-danger">
              <p>{error}</p>
            </div>
          ) : recipes.length > 0 ? (
            <section className="recipes-section mb-5">
              <h2 className="h5 mb-3 text-primary">Feed de Recetas</h2>
              <div className="row g-4">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="col-lg-4 col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title text-primary fw-bold">{recipe.title}</h5>
                        <p className="card-text text-secondary flex-grow-1">
                          {recipe.description}
                        </p>
                        <ul className="mb-3">
                          <li>
                            <strong>Ingredientes:</strong>{' '}
                            {Array.isArray(recipe.ingredients)
                              ? recipe.ingredients.join(', ')
                              : 'N/A'}
                          </li>
                          <li>
                            <strong>Pasos:</strong>{' '}
                            {Array.isArray(recipe.steps)
                              ? recipe.steps.join(' -> ')
                              : 'N/A'}
                          </li>
                        </ul>
                        <button
                          className="btn btn-primary rounded mt-auto"
                          onClick={() => navigate(`/recipes/${recipe.id}`)}
                        >
                          Ver Receta
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="text-center">
              <p>No hay recetas disponibles. ¡Crea una nueva para comenzar!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
