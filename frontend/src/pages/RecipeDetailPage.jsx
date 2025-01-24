import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import apiClient from '../api/axios';
import AuthContext from '../context/AuthContext';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [canModify, setCanModify] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkCommentPermissions = async (commentId) => {
    try {
      const response = await apiClient.get(`/comments/${commentId}/can-modify`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data.canModify;
    } catch (error) {
      console.error('Error verificando permisos de comentario:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchRecipeAndComments = async () => {
      try {
        const recipeResponse = await apiClient.get(`/recipes/${id}`);
        setRecipe(recipeResponse.data);

        const canModifyResponse = await apiClient.get(`/recipes/${id}/can-modify`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setCanModify(canModifyResponse.data.canModify);

        const commentsResponse = await apiClient.get(`/comments/${id}`);
        const commentsWithPermissions = await Promise.all(
          commentsResponse.data.comments.map(async (comment) => {
            const canModify = await checkCommentPermissions(comment.id);
            return { ...comment, canModify };
          })
        );

        setComments(commentsWithPermissions);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los detalles:', error);
        setMessage('Error al cargar los detalles de la receta.');
        setComments([]);
        setLoading(false);
      }
    };

    fetchRecipeAndComments();
  }, [id, user.token]);

  const handleAddComment = async () => {
    if (!newComment) {
      setMessage('El comentario no puede estar vacío.');
      return;
    }

    try {
      const response = await apiClient.post('/comments', {
        recipeId: id,
        content: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const newCommentData = response.data.comment;
      const canModify = await checkCommentPermissions(newCommentData.id);
      setComments([{ ...newCommentData, canModify }, ...comments]);
      setNewComment('');
      setMessage('Comentario agregado exitosamente.');
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
      setMessage('Error al agregar el comentario.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
      setMessage('Comentario eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      setMessage('No se pudo eliminar el comentario.');
    }
  };

  const handleEditRecipe = () => {
    navigate(`/recipes/${id}/edit`);
  };

  const handleDeleteRecipe = async () => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar esta receta? Esta acción no se puede deshacer.");
    if (!isConfirmed) return; // Si el usuario cancela, no se realiza ninguna acción
    try {
      await apiClient.delete(`/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMessage('Receta eliminada exitosamente.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al eliminar la receta:', error);
      setMessage('No se pudo eliminar la receta.');
    }
  };

  const handleSaveEdit = async () => {
    try {
      await apiClient.put(`/comments/${editingComment}`, { content: editContent }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setComments(
        comments.map((comment) =>
          comment.id === editingComment ? { ...comment, content: editContent } : comment
        )
      );
      setEditingComment(null);
      setMessage('Comentario editado exitosamente.');
    } catch (error) {
      console.error('Error al editar el comentario:', error);
      setMessage('Error al editar el comentario.');
    }
  };

  if (loading) {
    return <p className="text-center">Cargando receta y comentarios...</p>;
  }

  if (!recipe) {
    return <p className="text-center">Receta no encontrada.</p>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg p-4">
            <h1 className="mb-3 text-center text-primary">{recipe.title}</h1>
            <p className="lead text-center text-muted">{recipe.description}</p>

            {recipe.user ? (
              <p className="text-center text-muted">
                <strong>Publicado por:</strong> {recipe.user.username} ({recipe.user.email})
              </p>
            ) : (
              <p className="text-center text-muted">Usuario no disponible</p>
            )}

            <div className="d-flex justify-content-center mt-4">
              <button
                className="btn btn-secondary me-2"
                onClick={() => navigate(-1)}
              >
                Atrás
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </button>
            </div>

            {canModify && (
              <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-warning me-2" onClick={handleEditRecipe}>
                  Editar Receta
                </button>
                <button className="btn btn-danger" onClick={handleDeleteRecipe}>
                  Eliminar Receta
                </button>
              </div>
            )}

            <section className="mt-5">
              <h3 className="h4 text-muted mb-3">Ingredientes</h3>
              <ul className="list-group list-group-flush">
                {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="list-group-item border-0 py-2 px-4 mb-2 rounded-sm"
                    style={{ backgroundColor: '#f7f7f7', fontWeight: 300 }}
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-5">
              <h3 className="h4 text-muted mb-3">Pasos</h3>
              <ol className="list-group list-group-numbered">
                {recipe.steps && recipe.steps.map((step, index) => (
                  <li
                    key={index}
                    className="list-group-item border-0 py-2 px-4 mb-2 rounded-sm"
                    style={{ backgroundColor: '#f7f7f7', fontWeight: 300 }}
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-5">
              <h3 className="h4 text-muted mb-3">Comentarios</h3>
              {message && <div className="alert alert-info">{message}</div>}
              <ul className="list-group mb-4">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 mb-2 rounded-sm"
                    style={{ backgroundColor: '#f7f7f7' }}
                  >
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted">
                          <strong>
                            {comment.User?.username || 'Usuario desconocido'}
                            {comment.User?.email ? ` (${comment.User.email})` : ''}
                          </strong>{' '}
                          -{' '}
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                      <p className="mb-1">{comment.content}</p>
                    </div>
                    {comment.canModify && (
                      <div className="d-flex">
                        {editingComment === comment.id ? (
                          <>
                            <input
                              className="form-control form-control-sm me-2"
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                            />
                            <button className="btn btn-sm btn-success me-2" onClick={handleSaveEdit}>
                              Guardar
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setEditingComment(null)}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => {
                                setEditingComment(comment.id);
                                setEditContent(comment.content);
                              }}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="input-group mb-4">
                <textarea
                  className="form-control"
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleAddComment}>
                  Agregar Comentario
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
