const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = {
  // Actualizar perfil del usuario
  async updateProfile(req, res) {
    const { username, email, password } = req.body;

    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Usuario no autenticado.' });
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(403).json({ message: 'Contraseña incorrecta.' });
      }

      user.username = username || user.username;
      user.email = email || user.email;
      await user.save();

      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.json({
        message: 'Perfil actualizado con éxito.',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al actualizar el perfil.' });
    }
  },

  

  // Actualizar contraseña
  async updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;

    try {
      // Validar que el usuario esté autenticado
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

      // Validar seguridad de la nueva contraseña
      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 8 caracteres.' });
      }

      // Cifrar y guardar la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();
      res.json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      res.status(500).json({ message: 'Error al actualizar la contraseña.', error });
    }
  },

  // Eliminar cuenta del usuario
  async deleteUser(req, res) {
    try {
      // Validar que el usuario esté autenticado
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Usuario no autenticado.' });
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      await user.destroy();
      res.json({ message: 'Usuario eliminado con éxito.' });
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      res.status(500).json({ message: 'Error al eliminar la cuenta.', error });
    }
  },
};
