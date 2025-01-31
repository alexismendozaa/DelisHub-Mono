import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import apiClient from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados para la edición de recetas
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIngredients, setEditIngredients] = useState('');
  const [editSteps, setEditSteps] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.user || !user.user.id) return;

      try {
const API_URL = process.env.REACT_APP_API_URL || "http://3.221.112.57/api";
const response = await apiClient.get(`${API_URL}/user-profile/${user.user.id}`);
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

  const handleSaveRecipe = async () => {
    try {
      const response = await apiClient.put(`/recipes/${editingRecipe.id}`, {
        title: editTitle,
        description: editDescription,
        ingredients: editIngredients.split(',').map((i) => i.trim()),
        steps: editSteps.split('.').map((s) => s.trim()),
      });

      // Reflejar los cambios directamente desde la respuesta del backend
      const updatedRecipe = response.data;
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === updatedRecipe.id
            ? { ...updatedRecipe }
            : recipe
        )
      );

      setEditingRecipe(null); // Salir del modo de edición
    } catch (error) {
      console.error('Error al guardar la receta:', error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      try {
        await apiClient.delete(`/recipes/${recipeId}`);
        setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
      } catch (error) {
        console.error('Error al eliminar la receta:', error);
      }
    }
  };

  const handleAddComment = async (recipeId, content) => {
    try {
      const response = await apiClient.post('/comments', { recipeId, content });
      const newComment = response.data.comment;

      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, Comments: [...recipe.Comments, { ...newComment, User: user.user }] }
            : recipe
        )
      );
      setNewComments((prev) => ({ ...prev, [recipeId]: '' }));
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  const handleDeleteComment = async (recipeId, commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`);
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

  const handleEditComment = async (recipeId, commentId, content) => {
    try {
      const response = await apiClient.put(`/comments/${commentId}`, { content });
      const updatedComment = response.data.comment;

      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? {
                ...recipe,
                Comments: recipe.Comments.map((comment) =>
                  comment.id === commentId
                    ? { ...updatedComment, User: user.user }
                    : comment
                ),
              }
            : recipe
        )
      );
      setEditingComment(null);
    } catch (error) {
      console.error('Error al editar comentario:', error);
    }
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando recetas...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
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
      </div>
      <h1 className="text-center mb-4">
        <span className="fw-bold text-primary">Perfil de {user.user.username}</span>
      </h1>
      <div className="row justify-content-center">
        {(recipes || []).map((recipe) => (
          <div key={recipe.id} className="col-md-8 mb-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-light">
                {editingRecipe?.id === recipe.id ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Título</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Título"
                        className="form-control form-control-lg border rounded-pill"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Descripción</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Descripción"
                        className="form-control form-control-lg border rounded"
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Ingredientes</label>
                      <input
                        type="text"
                        value={editIngredients}
                        onChange={(e) => setEditIngredients(e.target.value)}
                        placeholder="Ingredientes (separados por comas)"
                        className="form-control form-control-lg border rounded-pill"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Pasos</label>
                      <textarea
                        value={editSteps}
                        onChange={(e) => setEditSteps(e.target.value)}
                        placeholder="Pasos (separados por puntos)"
                        className="form-control form-control-lg border rounded"
                        rows="5"
                      ></textarea>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-success btn-lg me-2"
                        onClick={handleSaveRecipe}
                      >
                        Guardar
                      </button>
                      <button
                        className="btn btn-secondary btn-lg"
                        onClick={() => setEditingRecipe(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-primary mb-2 fw-bold">{recipe.title}</h4>
                    <p className="text-secondary mb-3">{recipe.description}</p>
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-primary btn-sm me-2 rounded-pill shadow-sm"
                        onClick={() => {
                          setEditingRecipe(recipe);
                          setEditTitle(recipe.title);
                          setEditDescription(recipe.description);
                          setEditIngredients((recipe.ingredients || []).join(', '));
                          setEditSteps((recipe.steps || []).join('. '));
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm rounded-pill shadow-sm"
                        onClick={() => handleDeleteRecipe(recipe.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="card-body">
              <p className="text-muted small mb-2">
  <strong>Publicado por:</strong> {recipe.user?.username || 'Desconocido'}{' '}
  {recipe.user?.email ? `(${recipe.user.email})` : ''} -{' '}
  {formatDistanceToNow(new Date(recipe.createdAt), { locale: es })}
</p>

                <h6 className="fw-bold text-secondary mt-4">Ingredientes:</h6>
                <ul className="list-unstyled ps-3">
                  {(recipe.ingredients || []).map((ingredient, index) => (
                    <li key={index} className="mb-1">• {ingredient}</li>
                  ))}
                </ul>
                <h6 className="fw-bold text-secondary mt-4">Pasos:</h6>
                <ol className="ps-3">
                  {(recipe.steps || []).map((step, index) => (
                    <li key={index} className="mb-1">{step}</li>
                  ))}
                </ol>
                <h6 className="fw-bold text-secondary mt-4">Comentarios:</h6>
                {(recipe.Comments || []).map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded bg-light shadow-sm mb-2 d-flex justify-content-between align-items-start"
                  >
                    {editingComment === comment.id ? (
                      <div className="flex-grow-1">
                        <textarea
                          className="form-control"
                          rows="1"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        ></textarea>
                        <div className="mt-2">
                          <button
                            className="btn btn-primary btn-sm me-2 rounded-pill shadow-sm"
                            onClick={() =>
                              handleEditComment(recipe.id, comment.id, editContent)
                            }
                          >
                            Guardar
                          </button>
                          <button
                            className="btn btn-secondary btn-sm rounded-pill shadow-sm"
                            onClick={() => setEditingComment(null)}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="mb-1">
                            <strong>{comment.User?.username || 'Anónimo'}</strong>{' '}
                            <span className="text-muted small">
                              -{' '}
                              {new Date(comment.createdAt).toLocaleString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </p>
                          <p className="mb-0">{comment.content}</p>
                        </div>
                        {comment.User?.id === user.user.id && (
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm me-2 rounded-pill border shadow-none text-muted px-4 py-2"
                              onClick={() => handleEditClick(comment)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-sm me-2 rounded-pill border shadow-none text-muted px-4 py-2"
                              onClick={() => handleDeleteComment(recipe.id, comment.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
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
                  className="btn btn-primary btn-sm mt-2 rounded-pill shadow-sm"
                  onClick={() =>
                    handleAddComment(recipe.id, newComments[recipe.id])
                  }
                  disabled={!newComments[recipe.id]}
                >
                  Comentar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfilePage;
