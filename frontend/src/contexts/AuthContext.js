import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Recupera el usuario del localStorage si existe
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        // Verificar que el token no sea demasiado viejo o malformado
        const tokenPayload = JSON.parse(atob(savedToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        // Si el token está expirado, limpiar localStorage
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          console.log('🔒 Token expirado - limpiando localStorage');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          return null;
        }

        // Configura el token en el header de axios
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        return JSON.parse(savedUser);
      } catch (error) {
        console.log('🔒 Token malformado - limpiando localStorage');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;
      
      // Guarda el usuario y token
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      // Configura el token en el header de axios para futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return userData;
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error('Credenciales incorrectas');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isSuperAdmin: user?.role === 'super_admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto más fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
