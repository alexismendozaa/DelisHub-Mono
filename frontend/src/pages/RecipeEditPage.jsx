import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

function RecipeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await apiClient.get(`/recipes/${id}`);
        const { title, description, ingredients, steps } = response.data;
        setRecipe(response.data);
        setTitle(title);
        setDescription(description);
        setIngredients(ingredients.join(', '));
        setSteps(steps.join('. '));
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/recipes/${id}`, {
        title,
        description,
        ingredients: ingredients.split(',').map((i) => i.trim()),
        steps: steps.split('.').map((s) => s.trim()),
      });
      setMessage('¡Receta actualizada correctamente!');
      navigate(`/recipes/${id}`);
    } catch (error) {
      console.error('Error updating recipe:', error);
      setMessage('Error al actualizar la receta.');
    }
  };

  if (!recipe) return <p>Cargando...</p>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg">
            <div className="card-body">
              <h1 className="text-center text-primary mb-4">Editar Receta</h1>
              {message && (
                <div
                  className={`alert ${
                    message.includes('Error') ? 'alert-danger' : 'alert-success'
                  } text-center`}
                >
                  {message}
                </div>
              )}
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">
                    Título de la receta
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                    placeholder="Ingrese el título de la receta"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    placeholder="Ingrese una descripción breve"
                    rows="3"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="ingredients" className="form-label">
                    Ingredientes (separados por comas)
                  </label>
                  <textarea
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="form-control"
                    placeholder="Ingredientes (separados por comas)"
                    rows="3"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="steps" className="form-label">
                    Pasos (separados por puntos)
                  </label>
                  <textarea
                    id="steps"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    className="form-control"
                    placeholder="Pasos (separados por puntos)"
                    rows="3"
                  ></textarea>
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">
                    Actualizar Receta
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/recipes/${id}`)}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeEditPage;
