import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importar useNavigate
import apiClient from '../api/axios';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Instanciar navigate
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const [editingComment, setEditingComment] = useState(null); // Estado para editar un comentario
  const [editContent, setEditContent] = useState(''); // Texto del comentario que se está editando

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeResponse = await apiClient.get(`/recipes/${id}`);
        setRecipe(recipeResponse.data);

        const commentsResponse = await apiClient.get(`/comments/${id}`);
        setComments(commentsResponse.data.comments || []);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setComments([]);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment) {
      setMessage('El comentario no puede estar vacío.');
      return;
    }

    try {
      const response = await apiClient.post('/comments', {
        recipeId: id, // ID de la receta
        content: newComment, // Contenido del comentario
      });

      setComments([...comments, response.data.comment]);
      setNewComment('');
      setMessage('Comentario agregado exitosamente.');
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
      setMessage('Error al agregar el comentario.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`); // Llamada al endpoint de eliminación
      setComments(comments.filter((comment) => comment.id !== commentId)); // Actualiza la lista
      setMessage('Comentario eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      setMessage('Error al eliminar el comentario.');
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id); // Configurar el ID del comentario a editar
    setEditContent(comment.content); // Prellenar el contenido del comentario
  };

  const handleSaveEdit = async () => {
    try {
      await apiClient.put(`/comments/${editingComment}`, { content: editContent }); // Actualizar en el backend
      setComments(
        comments.map((comment) =>
          comment.id === editingComment ? { ...comment, content: editContent } : comment
        )
      );
      setEditingComment(null); // Salir del modo de edición
      setMessage('Comentario editado exitosamente.');
    } catch (error) {
      console.error('Error al editar el comentario:', error);
      setMessage('Error al editar el comentario.');
    }
  };

  if (!recipe) return <p>Cargando receta...</p>;

  return (
    <div className="container py-4">
      <h1 className="mb-4">{recipe.title}</h1>
      <p>{recipe.description}</p>

      {/* Botones de navegación */}
      <div className="d-flex justify-content-between mb-4">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Regresar al Dashboard
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/recipes')}>
          Ver Todas las Recetas
        </button>
      </div>

      <div className="mt-4">
        <h2 className="mb-3">Comentarios</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <ul className="list-group mb-3">
          {Array.isArray(comments) &&
            comments.map((comment) => (
              <li key={comment.id} className="list-group-item d-flex justify-content-between align-items-center">
                {editingComment === comment.id ? (
                  <div className="w-100">
                    <textarea
                      className="form-control mb-2"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button className="btn btn-sm btn-success me-2" onClick={handleSaveEdit}>
                      Guardar
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditingComment(null)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{comment.content}</span>
                    <div>
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
                  </>
                )}
              </li>
            ))}
        </ul>
        <textarea
          className="form-control mb-3"
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddComment}>
          Agregar Comentario
        </button>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
