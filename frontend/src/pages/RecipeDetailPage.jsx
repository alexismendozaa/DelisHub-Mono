import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import AuthContext from '../context/AuthContext';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Usuario autenticado
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [canModify, setCanModify] = useState(false);

  const checkCommentPermissions = async (commentId) => {
    try {
      const response = await apiClient.get(`/comments/${commentId}/can-modify`);
      return response.data.canModify;
    } catch (error) {
      console.error('Error checking comment permissions:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await apiClient.get(`/recipes/${id}`);
        setRecipe(response.data);

        // Verificar si el usuario puede modificar la receta
        const canModifyResponse = await apiClient.get(`/recipes/${id}/can-modify`);
        setCanModify(canModifyResponse.data.canModify);

        const commentsResponse = await apiClient.get(`/comments/${id}`);
        const commentsWithPermissions = await Promise.all(
          commentsResponse.data.comments.map(async (comment) => {
            const canModify = await checkCommentPermissions(comment.id);
            return { ...comment, canModify };
          })
        );
        setComments(commentsWithPermissions);
      } catch (error) {
        console.error('Error fetching recipe details or permissions:', error);
        setMessage('Error al cargar los detalles de la receta.');
        setComments([]);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleEditRecipe = () => {
    navigate(`/recipes/${recipe.id}/edit`); // Redirige al formulario de edición
  };

  const handleDeleteRecipe = async () => {
    try {
      await apiClient.delete(`/recipes/${recipe.id}`);
      navigate('/recipes'); // Redirige a la lista de recetas tras eliminar
    } catch (error) {
      console.error('Error al eliminar la receta:', error);
      setMessage('Error al eliminar la receta.');
    }
  };

  const handleAddComment = async () => {
    if (!newComment) {
      setMessage('El comentario no puede estar vacío.');
      return;
    }
  
    try {
      // Crear el nuevo comentario
      const response = await apiClient.post('/comments', {
        recipeId: id,
        content: newComment,
      });
  
      const newCommentData = response.data.comment;
  
      // Verificar si el usuario puede modificar este comentario
      const canModify = await checkCommentPermissions(newCommentData.id);
  
      // Agregar el comentario al estado con el atributo canModify
      setComments([...comments, { ...newCommentData, canModify }]);
      setNewComment('');
      setMessage('Comentario agregado exitosamente.');
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
      setMessage('Error al agregar el comentario.');
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    try {
      await apiClient.put(`/comments/${editingComment}`, { content: editContent });
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

  const handleDeleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
      setMessage('Comentario eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      setMessage('Error al eliminar el comentario.');
    }
  };

  if (!recipe) return <p className="text-center">Cargando receta...</p>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="mb-3 text-center">{recipe.title}</h1>
          <p className="lead text-center text-muted">{recipe.description}</p>

          {recipe.user ? (
            <p className="text-center">
              <strong>Publicado por:</strong> {recipe.user.username} ({recipe.user.email})
            </p>
          ) : (
            <p className="text-center text-muted">Usuario no disponible</p>
          )}

          <section className="mt-5">
            <h3 className="h4 text-muted">Ingredientes</h3>
            <ul className="list-group list-group-flush">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="list-group-item border-0">
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-5">
            <h3 className="h4 text-muted">Pasos</h3>
            <ol className="list-group list-group-numbered">
              {recipe.steps.map((step, index) => (
                <li key={index} className="list-group-item border-0">
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => navigate('/dashboard')}
            >
              Regresar al Dashboard
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/recipes')}
            >
              Ver Todas las Recetas
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

          {/* Mensaje de error o éxito */}
          {message && <div className="alert alert-info">{message}</div>}

          <section className="mt-5">
            <h3 className="h4 text-muted">Comentarios</h3>
            <ul className="list-group mb-4">
              {Array.isArray(comments) &&
                comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {editingComment === comment.id ? (
                      <div className="w-100">
                        <textarea
                          className="form-control mb-2"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="d-flex justify-content-end">
                          <button className="btn btn-sm btn-success me-2" onClick={handleSaveEdit}>
                            Guardar
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingComment(null)}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span>{comment.content}</span>
                        {comment.canModify && (
                          <div className="d-flex">
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditComment(comment)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </>
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
  );
};

export default RecipeDetailPage;
