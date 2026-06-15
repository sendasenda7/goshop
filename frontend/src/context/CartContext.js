import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchCart();
    else setCart([]);
  }, [user]);

  useEffect(() => {
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
  }, [cart]);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data.cart.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (productId, quantity, size, color) => {
    try {
      const res = await api.post('/cart', { productId, quantity, size, color });
      setCart(res.data.cart.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      setCart(res.data.cart.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity });
      setCart(res.data.cart.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart([]);
    } catch (err) {
      console.error(err);
    }
  };

  const total = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, total, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);