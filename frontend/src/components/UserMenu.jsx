import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const UserMenu = ({ userName }) => {
  const { logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="user-menu">
      <span className="user-name" onClick={toggleMenu}>
        {userName} ▼
      </span>
      {menuOpen && (
        <div className="menu-dropdown">
          <Link to="/profile">Mi Perfil</Link>
          <Link to="/settings">Configuración</Link>
          <button onClick={logout}>Cerrar Sesión</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
