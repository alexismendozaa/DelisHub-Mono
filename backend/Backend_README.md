# Recipe Social Network API

## **Descripción**
Backend para una red social de recetas de comida que permite a los usuarios registrarse, iniciar sesión, gestionar recetas y comentarios, y recibir notificaciones en tiempo real. El sistema está desarrollado con Node.js y Express, utilizando una arquitectura moderna y segura.

---

## **Tecnologías utilizadas**
- **Node.js**: Para la ejecución del servidor.
- **Express.js**: Framework para la creación de APIs RESTful.
- **PostgreSQL**: Base de datos relacional para usuarios y recetas.
- **Redis**: Para caché y almacenamiento temporal.
- **Socket.io**: Implementación de WebSockets para notificaciones en tiempo real.
- **Swagger**: Documentación interactiva de la API.
- **Jest y Supertest**: Pruebas unitarias y de integración.
- **AWS RDS**: Para la base de datos PostgreSQL en la nube.
- **AWS EC2**: Para el despliegue del servidor backend.

---

## **Requerimientos Previos**
1. Node.js (versión LTS recomendada).
2. PostgreSQL.
3. Redis.
4. Instancia de AWS EC2 configurada para el despliegue.

---

## **Instalación y Configuración**

### 1. Clonar el repositorio
```bash
git clone (https://github.com/alexismendozaa/DelisHub.git)
cd recipe-social-network
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
DB_HOST=localhost
DB_USER=alexis
DB_PASSWORD=admin123
DB_NAME=postgresql
DB_PORT=5432
JWT_SECRET=clave_secreta_segura

```

### 4. Inicializar la base de datos
- Configura tu instancia de PostgreSQL en AWS RDS.
- Crea la base de datos con el nombre especificado en `postregsql`.
- Ejecuta las migraciones y/o modelos definidos automáticamente con Sequelize.

### 5. Iniciar el servidor
Para desarrollo:
```bash
npx nodemon src/server.js
```
Para producción:
```bash
node src/server.js
```

---

## **Estructura del proyecto**
```
recipe-social-network
├── src
│   ├── config
│   │   └── database.js       # Configuración de Sequelize
│   ├── controllers
│   │   ├── authController.js # Lógica de autenticación
│   │   ├── commentController.js # Lógica de comentarios
│   │   └── recipeController.js # Lógica de recetas
│   ├── middleware
│   │   ├── authMiddleware.js # Protección de rutas
│   │   └── errorHandler.js   # Manejo de errores global
│   ├── models
│   │   ├── User.js           # Modelo de usuario
│   │   ├── Recipe.js         # Modelo de receta
│   │   └── Comment.js        # Modelo de comentario
│   ├── routes
│   │   ├── auth.js           # Rutas de autenticación
│   │   ├── comment.js        # Rutas de comentarios
│   │   └── recipe.js         # Rutas de recetas
│   └── server.js             # Configuración del servidor principal
├── tests
│   └── auth.test.js          # Pruebas de autenticación
└── package.json              # Dependencias y scripts
```

---

## **Endpoints de la API**

### Autenticación
- **POST** `/api/auth/register`: Registrar un nuevo usuario.
- **POST** `/api/auth/login`: Iniciar sesión y obtener un token JWT.

### Recetas
- **POST** `/api/recipes`: Crear una receta (protegido).
- **GET** `/api/recipes`: Listar todas las recetas.

### Comentarios
- **POST** `/api/comments`: Crear un comentario en una receta (protegido).
- **GET** `/api/comments/:recipeId`: Listar comentarios de una receta.

### Notificaciones
- WebSockets conectados al servidor en tiempo real.

---

## **Notificaciones en tiempo real**
- Configuradas mediante `Socket.io`.
- Los usuarios reciben notificaciones cuando alguien comenta en sus recetas.
- Los eventos son gestionados en `server.js`.

---

## **Swagger**
La API está documentada y accesible en:
```
http://<servidor>:3000/api-docs
```

---

## **Pruebas**
Ejecuta las pruebas con:
```bash
npm test
```

---

## **Despliegue en AWS**
1. Configura una instancia EC2 con Amazon Linux 2.
2. Instala Node.js, Git y dependencias necesarias.
3. Clona el repositorio y configura las variables de entorno.
4. Ejecuta el servidor usando PM2 o Node.js directamente.
5. Asegúrate de que el puerto 3000 esté habilitado en el grupo de seguridad.

---

## **Contribuciones**
Si encuentras algún problema o deseas contribuir, abre un issue o envía un pull request al repositorio.
