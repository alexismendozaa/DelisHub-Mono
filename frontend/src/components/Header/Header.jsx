// src/components/Header/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">RecipeNet</h1>
      <input
        type="text"
        placeholder="Search recipes..."
        className="rounded-lg px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-white"
      />
      <div className="flex items-center space-x-4">
        <button className="text-white">Notifications</button>
        <button className="text-white">Profile</button>
      </div>
    </header>
  );
};

export default Header;
