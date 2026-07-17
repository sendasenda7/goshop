import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Origine du serveur (sans le "/api" final), utile pour construire l'URL
// complète de fichiers servis statiquement (avatars, images uploadées...).
export const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  // En dev, si REACT_APP_API_URL n'est pas défini dans .env, on retombe sur localhost:5000.
  // En prod, définir REACT_APP_API_URL dans l'environnement de déploiement (Vercel, etc.).
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Ajoute le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gère les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;