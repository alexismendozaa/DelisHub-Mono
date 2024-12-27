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
        setIngredients(ingredients.join(','));
        setSteps(steps.join('.'));
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
        ingredients: ingredients.split(','),
        steps: steps.split('.'),
      });
      setMessage('Recipe updated successfully!');
      navigate(`/recipes/${id}`);
    } catch (error) {
      console.error('Error updating recipe:', error);
      setMessage('Failed to update recipe.');
    }
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <form onSubmit={handleUpdate} className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
      {message && <p className="text-red-500">{message}</p>}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2 w-full border p-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-2 w-full border p-2"
      ></textarea>
      <textarea
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Ingredients (comma-separated)"
        className="mb-2 w-full border p-2"
      ></textarea>
      <textarea
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        placeholder="Steps (separated by periods)"
        className="mb-2 w-full border p-2"
      ></textarea>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Update Recipe
      </button>
    </form>
  );
}

export default RecipeEditPage;
