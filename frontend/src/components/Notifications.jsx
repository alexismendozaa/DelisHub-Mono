import React, { useEffect, useState } from 'react';
import socket from '../api/socket'; // Asegúrate de que el archivo socket.js esté correctamente configurado

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Escuchar los eventos de nuevos comentarios
    socket.on('new-comment', (data) => {
      setNotifications((prev) => [...prev, data.message]);
    });

    // Limpiar los eventos al desmontar el componente
    return () => {
      socket.off('new-comment');
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 m-4 bg-white shadow-lg p-4 rounded w-1/3 z-50">
      <h2 className="text-xl font-bold mb-2">Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index} className="border-b py-2">
            {notification}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
