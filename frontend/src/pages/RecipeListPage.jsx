import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await apiClient.get('/recipes'); // Solicitud al backend para obtener recetas
        setRecipes(response.data);
      } catch (error) {
        console.error('Error al obtener las recetas:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      try {
        await apiClient.delete(`/recipes/${id}`); // Elimina la receta del backend
        setRecipes(recipes.filter((recipe) => recipe.id !== id)); // Actualiza el estado
      } catch (error) {
        console.error('Error al eliminar la receta:', error);
      }
    }
  };

  return (
    <div className="container py-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Lista de Recetas</h1>
        <div>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary me-2">
            Regresar al Dashboard
          </button>
          <button onClick={() => navigate('/recipes/create')} className="btn btn-success">
            + Crear Receta
          </button>
        </div>
      </header>

      <main>
        {recipes.length === 0 ? (
          <div className="alert alert-info text-center">
            <p className="mb-0">No hay recetas disponibles. ¡Crea una nueva receta!</p>
          </div>
        ) : (
          <ul className="list-group">
            {recipes.map((recipe) => (
              <li key={recipe.id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
                <div className="flex-grow-1">
                  <h5 className="text-primary">{recipe.title}</h5>
                  <p className="text-muted">{recipe.description}</p>
                </div>
                <div className="d-flex gap-2 mt-3 mt-md-0">
                  <button
                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                    className="btn btn-outline-primary"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                    className="btn btn-outline-warning"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="btn btn-outline-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default RecipeListPage;
