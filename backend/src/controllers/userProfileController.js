const bcrypt = require('bcrypt');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Obtener el perfil del usuario
const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        console.log('UserID recibido:', userId); // Depuración para validar userId

        // Consulta a la base de datos
        const recipes = await Recipe.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    as: 'user', // Aquí especificamos el alias definido en el modelo
                    attributes: ['id', 'username', 'email'], // Seleccionamos los atributos necesarios
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username', 'email'], // Usuario que hizo el comentario
                        },
                    ],
                },
            ],
        });

        console.log('Recetas encontradas:', recipes); // Muestra las recetas obtenidas
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error); // Muestra el error en la consola
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

// Actualizar el perfil del usuario
const updateProfile = async (req, res) => {
    const { userId, username, password } = req.body;

    try {
        const user = await User.findByPk(userId); // Usamos el userId enviado en la solicitud
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); // Validamos la contraseña
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        user.username = username || user.username;
        await user.save();

        res.status(200).json({ message: 'Perfil actualizado con éxito.', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el perfil.' });
    }
};

// Actualizar la contraseña del usuario
const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Validar la contraseña actual
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña actual incorrecta.' });
        }

        // Validar que la nueva contraseña sea diferente
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la actual.' });
        }

        // Actualizar la contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ message: 'Error al actualizar la contraseña.', error: error.message });
    }
};


const updateUserEmail = async (req, res) => {
    const { userId, email, password } = req.body;

    try {
        // Validar que el usuario existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Actualizar el correo electrónico
        user.email = email;
        await user.save();

        return res.status(200).json({ message: 'Correo electrónico actualizado con éxito.', user });
    } catch (error) {
        console.error('Error al actualizar el correo electrónico:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};


const updateUserPassword = async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
  
    try {
      // Buscar al usuario por ID
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
  
      // Verificar la contraseña actual
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña actual incorrecta.' });
      }
  
      // Hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Actualizar la contraseña
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  };
  
  const deleteUserAccount = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Buscar al usuario por ID
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
  
      // Eliminar las recetas y comentarios del usuario
      await Recipe.destroy({ where: { userId } });
      await Comment.destroy({ where: { userId } });
  
      // Eliminar al usuario
      await user.destroy();
  
      return res.status(200).json({ message: 'Cuenta eliminada con éxito.' });
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  };

  module.exports = {
    getUserProfile,
    updateProfile,
    updateUserEmail,
    updatePassword,
    updateUserPassword,
    deleteUserAccount, 
};
