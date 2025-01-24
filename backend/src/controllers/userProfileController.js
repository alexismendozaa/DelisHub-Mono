const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Comment = require('../models/Comment');

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
  
  

module.exports = { getUserProfile };
