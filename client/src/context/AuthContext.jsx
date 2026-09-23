import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, login as apiLogin, register as apiRegister } from '../api/endpoints';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const { data } = await getProfile();
          // API returns { success: true, user: { ... } }
          const profileUser = data.user || data;
          setUser(profileUser);
          localStorage.setItem('user', JSON.stringify(profileUser));
        } catch (error) {
          console.error("Failed to fetch profile", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (user && user.role) {
      document.documentElement.setAttribute('data-theme', user.role);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [user]);

  const login = async (credentials) => {
    const { data } = await apiLogin(credentials);
    localStorage.setItem('token', data.token);
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }
    setToken(data.token);
    return data;
  };

  const register = async (userData) => {
    const { data } = await apiRegister(userData);
    localStorage.setItem('token', data.token);
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }
    setToken(data.token);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
