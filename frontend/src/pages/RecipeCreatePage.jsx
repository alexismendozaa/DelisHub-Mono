import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import AuthContext from '../context/AuthContext';

function RecipeCreatePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirigir al login si no hay usuario autenticado
    }
  }, [user, navigate]);

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    setLoading(true); // Indicar que está cargando

    // Validar que los campos estén llenos
    if (!title || !description || !ingredients || !steps) {
      setMessage('Todos los campos son obligatorios.');
      setLoading(false);
      return;
    }

    try {
      // Enviar los datos al backend
      const response = await apiClient.post('/recipes', {
        title,
        description,
        ingredients: ingredients.split(','), // Separar ingredientes por comas
        steps: steps.split('.'), // Separar pasos por puntos
      });
      setMessage('Receta creada exitosamente.');
      navigate(`/recipes/${response.data.id}`); // Redirigir al detalle de la receta creada
    } catch (error) {
      console.error('Error al crear la receta:', error);
      setMessage('Ocurrió un error al crear la receta. Inténtalo nuevamente.');
    } finally {
      setLoading(false); // Detener el indicador de carga
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Crear Receta</h1>

      {message && <div className="alert alert-info">{message}</div>}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <form onSubmit={handleCreateRecipe}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Título
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Título de la receta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea
              className="form-control"
              id="description"
              placeholder="Descripción breve de la receta"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="ingredients" className="form-label">
              Ingredientes (separados por comas)
            </label>
            <textarea
              className="form-control"
              id="ingredients"
              placeholder="Ejemplo: Harina, Azúcar, Huevos"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="steps" className="form-label">
              Pasos (separados por puntos)
            </label>
            <textarea
              className="form-control"
              id="steps"
              placeholder="Ejemplo: Mezclar ingredientes. Hornear a 180°C."
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Crear Receta
          </button>
        </form>
      )}
    </div>
  );
}

export default RecipeCreatePage;
