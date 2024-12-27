import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';

const Feed = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await apiClient.get('/recipes');
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleLike = async (recipeId) => {
    try {
      await apiClient.post(`/recipes/${recipeId}/like`);
      alert('Liked!');
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-xl mb-2">{recipe.title}</h2>
          <p className="text-gray-700 mb-4">{recipe.description.slice(0, 100)}...</p>
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleLike(recipe.id)}
              className="bg-red-500 text-white py-1 px-3 rounded"
            >
              Like
            </button>
            <Link
              to={`/recipes/${recipe.id}`}
              className="bg-blue-500 text-white py-1 px-3 rounded"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
