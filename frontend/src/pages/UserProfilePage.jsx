import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import apiClient from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.user || !user.user.id) return;

      try {
        const response = await apiClient.get(`/user-profile/${user.user.id}`);
        console.log('Recetas del perfil:', response.data);
        setRecipes(response.data);

        const initialComments = {};
        response.data.forEach((recipe) => {
          initialComments[recipe.id] = '';
        });
        setNewComments(initialComments);
      } catch (error) {
        console.error('Error al cargar el perfil del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleAddComment = async (recipeId, content) => {
    try {
      const response = await apiClient.post(`/recipes/${recipeId}/comments`, {
        content,
      });
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, Comments: [...recipe.Comments, response.data] }
            : recipe
        )
      );
      setNewComments((prev) => ({ ...prev, [recipeId]: '' }));
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  const handleEditRecipe = (recipeId) => {
    console.log(`Editar receta con ID: ${recipeId}`);
    // Implementa la lógica de edición aquí (por ejemplo, abrir un formulario modal)
  };

  const handleDeleteComment = async (recipeId, commentId) => {
    try {
      await apiClient.delete(`/recipes/${recipeId}/comments/${commentId}`);
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? {
                ...recipe,
                Comments: recipe.Comments.filter((c) => c.id !== commentId),
              }
            : recipe
        )
      );
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await apiClient.delete(`/recipes/${recipeId}`);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error al eliminar receta:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando recetas...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Perfil de {user.user.username}</h1>
      <div className="row mt-4">
        {recipes.length === 0 ? (
          <div className="col-12 text-center">
            <p>No has creado ninguna receta aún.</p>
          </div>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p className="card-text">{recipe.description}</p>
                  <p>
                    <strong>Ingredientes:</strong>
                  </p>
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                  <p>
                    <strong>Pasos:</strong>
                  </p>
                  <ol>
                    {recipe.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                  <p className="text-muted">
                    Publicado por {recipe.user?.username || 'Usuario desconocido'} -{' '}
                    {formatDistanceToNow(new Date(recipe.createdAt), {
                      locale: es,
                    })}
                  </p>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditRecipe(recipe.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteRecipe(recipe.id)}
                  >
                    Eliminar
                  </button>
                </div>
                <div className="card-footer">
                  <h6>Comentarios</h6>
                  {recipe.Comments && recipe.Comments.length > 0 ? (
                    recipe.Comments.map((comment) => (
                      <div key={comment.id} className="mb-2">
                        <p className="mb-1">
                          <strong>{comment.user?.username || 'Anónimo'}</strong>: {comment.content}
                        </p>
                        {comment.user?.id === user.user.id && (
                          <>
                            <button
                              className="btn btn-danger btn-sm me-2"
                              onClick={() =>
                                handleDeleteComment(recipe.id, comment.id)
                              }
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No hay comentarios aún.</p>
                  )}
                  <textarea
                    className="form-control mt-3"
                    placeholder="Escribe un comentario"
                    value={newComments[recipe.id] || ''}
                    onChange={(e) =>
                      setNewComments((prev) => ({
                        ...prev,
                        [recipe.id]: e.target.value,
                      }))
                    }
                  ></textarea>
                  <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() =>
                      handleAddComment(recipe.id, newComments[recipe.id])
                    }
                    disabled={!newComments[recipe.id]}
                  >
                    Agregar comentario
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
