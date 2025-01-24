import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link para el enlace
import apiClient from '../api/axios';
import AuthContext from '../context/AuthContext';
import '../styles/Dashboard.css';
import Button from '../components/Button';

function Dashboard() {
  const { user, logout } = useContext(AuthContext); // Acceso al usuario autenticado
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Debug: Verificar datos del usuario
  useEffect(() => {
    console.log('Datos del usuario en el Dashboard (Debug):', user);
  }, [user]);

  // Fetch recipes al inicio
  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirige al login si no hay usuario autenticado
      return;
    }

    const fetchData = async () => {
      try {
        const response = await apiClient.get('/recipes');
        setRecipes(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Hubo un problema al cargar las recetas. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container d-flex">
      {/* Barra Lateral */}
      <aside className="sidebar bg-light p-4 text-center">
        <div className="user-info mb-4">
          {/* Lógica que replica RecipeDetailPage */}
          {user && user.user ? (
            <>
              <h5 className="user-name fw-bold">{user.user.username || 'Usuario'}</h5>
              <p className="user-email text-muted">{user.user.email || 'Sin correo disponible'}</p>
              {/* Enlace al perfil del usuario */}
              <Link to={`/user-profile/${user.user.id}`} className="btn btn-primary mb-3">
                Mi perfil
              </Link>
            </>
          ) : (
            <p className="text-danger">No se pudo cargar la información del usuario.</p>
          )}
        </div>
        <Button label="Cerrar Sesión" onClick={handleLogout} variant="danger" />
      </aside>

      {/* Contenido Principal */}
      <main className="main-content flex-grow-1">
        <header className="dashboard-header bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center">
          <h1 className="h3">DelisHub </h1>
          <Button label="Crear Receta" onClick={() => navigate('/recipes/create')} variant="success" />
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
              <h2 className="h5 mb-3">Feed de Recetas</h2>
              <div className="row">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="col-md-4">
                    <div className="card mb-4 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{recipe.title}</h5>
                        <p className="card-text">{recipe.description}</p>
                        <ul>
                          <li>
                            <strong>Ingredientes:</strong>{' '}
                            {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : 'N/A'}
                          </li>
                          <li>
                            <strong>Pasos:</strong>{' '}
                            {Array.isArray(recipe.steps) ? recipe.steps.join(' -> ') : 'N/A'}
                          </li>
                        </ul>
                        <Button label="Ver Receta" onClick={() => navigate(`/recipes/${recipe.id}`)} variant="primary" />
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
