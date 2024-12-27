import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import AuthContext from '../context/AuthContext';
import '../styles/Dashboard.css';
import Button from '../components/Button';

function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Nuevo estado para manejar errores
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirige al login si no hay usuario autenticado
      return;
    }

    const fetchData = async () => {
      try {
        const recipesResponse = await apiClient.get('/recipes'); // Llama al endpoint de recetas
        console.log('Recipes Response:', recipesResponse.data); // Para depuración
        setRecipes(Array.isArray(recipesResponse.data) ? recipesResponse.data : []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Hubo un problema al cargar las recetas. Intenta nuevamente.');
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateRecipe = () => {
    navigate('/recipes/create');
  };

  const handleViewRecipe = (id) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <div className="dashboard-container d-flex">
      {/* Barra Lateral */}
      <aside className="sidebar bg-light p-4">
        <div className="d-flex flex-column align-items-center mb-4">
          <h5>{user?.name || 'Usuario'}</h5>
          <Button label="Cerrar Sesión" onClick={handleLogout} variant="danger" />
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="main-content flex-grow-1">
        <header className="dashboard-header bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center">
          <h1 className="h3">DelisHub Dashboard</h1>
          <Button label="Crear Receta" onClick={handleCreateRecipe} variant="success" />
        </header>

        <div className="dashboard-content container py-4">
          {loading ? (
            <div className="text-center">
              <p>Cargando datos...</p>
            </div>
          ) : error ? ( // Muestra el error si existe
            <div className="text-center text-danger">
              <p>{error}</p>
            </div>
          ) : recipes.length > 0 ? ( // Renderiza las recetas si hay datos
            <section className="recipes-section mb-5">
              <h2 className="h5 mb-3">Feed</h2>
              <div className="row">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="col-md-4">
                    <div className="card mb-4 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{recipe.title}</h5>
                        <p className="card-text">{recipe.description}</p>
                        <ul>
                          <li>
                            <strong>Ingredientes:</strong> {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : 'N/A'}
                          </li>
                          <li>
                            <strong>Pasos:</strong> {Array.isArray(recipe.steps) ? recipe.steps.join(' -> ') : 'N/A'}
                          </li>
                        </ul>
                        <Button label="Ver Receta" onClick={() => handleViewRecipe(recipe.id)} variant="primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : ( // Muestra un mensaje si no hay recetas
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
