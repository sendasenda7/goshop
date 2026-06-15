import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Toaster } from 'react-hot-toast';

const AppWithProviders = () => {
  const { loading } = useAuth();
  if (loading) return null;
  return (
    <CartProvider>
      <WishlistProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a0a0a',
              color: '#fff',
              border: '1px solid #c9a96e',
              fontSize: '12px',
              letterSpacing: '0.05em',
            },
          }}
        />
      </WishlistProvider>
    </CartProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppWithProviders />
    </AuthProvider>
  </React.StrictMode>
);