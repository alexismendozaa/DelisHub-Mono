import React, { useEffect, useState, useContext } from 'react';
import apiClient from '../api/axios';
import AuthContext from '../context/AuthContext';

const CommentSection = ({ recipeId }) => {
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null); // ID del comentario que se edita
    const [editContent, setEditContent] = useState(''); // Contenido del comentario en edición
    const [message, setMessage] = useState(''); // Mensajes de error o éxito

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await apiClient.get(`/recipes/${recipeId}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
                setMessage('Error fetching comments');
            }
        };
        fetchComments();
    }, [recipeId]);

    const handleAddComment = async () => {
        try {
            const response = await apiClient.post(`/recipes/${recipeId}/comments`, { content: newComment });
            setComments((prev) => [...prev, response.data.comment]);
            setNewComment('');
            setMessage('Comment added successfully');
        } catch (error) {
            setMessage('Error adding comment');
            console.error(error);
        }
    };

    const handleEditComment = async (id) => {
        try {
            const response = await apiClient.put(`/comments/${id}`, { content: editContent });
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === id ? { ...comment, content: response.data.comment.content } : comment
                )
            );
            setEditingComment(null);
            setEditContent('');
            setMessage('Comment updated successfully');
        } catch (error) {
            setMessage('Error editing comment');
            console.error(error);
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            await apiClient.delete(`/comments/${id}`);
            setComments((prev) => prev.filter((comment) => comment.id !== id));
            setMessage('Comment deleted successfully');
        } catch (error) {
            setMessage('Error deleting comment');
            console.error(error);
        }
    };

    return (
        <div className="comment-section">
            <h3>Comments</h3>
            {message && <p className="message">{message}</p>}
            <ul className="comments-list">
                {comments.map((comment) => (
                    <li key={comment.id} className="comment">
                        {editingComment === comment.id ? (
                            <input
                                type="text"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Edit your comment"
                            />
                        ) : (
                            <p>
                                <strong>{comment.user?.username}</strong>: {comment.content}
                            </p>
                        )}
                        {user && user.id === comment.userId && (
                            <div className="comment-actions">
                                {editingComment === comment.id ? (
                                    <button onClick={() => handleEditComment(comment.id)}>Save</button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditingComment(comment.id);
                                            setEditContent(comment.content);
                                        }}
                                    >
                                        Edit
                                    </button>
                                )}
                                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {user && (
                <div className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                    />
                    <button onClick={handleAddComment}>Post Comment</button>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
