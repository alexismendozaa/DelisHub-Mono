// src/components/Post/Post.jsx
import React from 'react';

const Post = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        className="w-full h-48 object-cover"
        src="https://source.unsplash.com/400x300/?food"
        alt="Recipe"
      />
      <div className="p-4">
        <h2 className="font-bold text-xl text-gray-800 hover:text-blue-600 transition-colors duration-300">
          Amazing Chocolate Cake
        </h2>
        <p className="text-sm text-gray-500 mb-2">Shared by @bakerqueen</p>
        <p className="text-gray-700">This is the most amazing chocolate cake you'll ever try!</p>
        <div className="mt-4 flex justify-between">
          <button className="text-blue-500 hover:text-blue-700">Like</button>
          <button className="text-blue-500 hover:text-blue-700">Comment</button>
          <button className="text-blue-500 hover:text-blue-700">Share</button>
        </div>
      </div>
    </div>
  );
};

export default Post;
