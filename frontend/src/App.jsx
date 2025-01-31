import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import RecipeListPage from './pages/RecipeListPage';
import RecipeCreatePage from './pages/RecipeCreatePage';
import RecipeEditPage from './pages/RecipeEditPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import UserProfilePage from './pages/UserProfilePage'; 
import UserSettings from './pages/UserSettings';
import 'bootstrap-icons/font/bootstrap-icons.css';


const App = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/recipes"
        element={
          <PrivateRoute>
            <RecipeListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/recipes/create"
        element={
          <PrivateRoute>
            <RecipeCreatePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/recipes/:id"
        element={
          <PrivateRoute>
            <RecipeDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/recipes/:id/edit"
        element={
          <PrivateRoute>
            <RecipeEditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <UserSettings />
          </PrivateRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route path="*" element={<LoginPage />} />

      <Route path="/user-profile/:userId" element={<UserProfilePage />} />
    </Routes>
  );
};

export default App;
