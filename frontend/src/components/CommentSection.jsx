import React, { useEffect, useState, useContext } from 'react';
import apiClient from '../api/axios';
import AuthContext from '../context/AuthContext';

const CommentSection = ({ recipeId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await apiClient.get(`/recipes/${recipeId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [recipeId]);

  const handleAddComment = async () => {
    try {
      const response = await apiClient.post(`/recipes/${recipeId}/comments`, {
        content: newComment,
      });
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
    } catch (error) {
      setMessage('Error adding comment');
      console.error(error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p><strong>{comment.user.username}</strong>: {comment.content}</p>
          </div>
        ))}
      </div>
      {user && (
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Submit</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default CommentSection;
