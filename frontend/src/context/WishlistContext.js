import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchWishlist();
    else setWishlist([]);
  }, [user]);

  useEffect(() => {
    setWishlistCount(wishlist.length);
  }, [wishlist]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data.wishlist.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const res = await api.post('/wishlist', { productId });
      setWishlist(res.data.wishlist.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.delete(`/wishlist/${productId}`);
      setWishlist(res.data.wishlist.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const moveAllToCart = async () => {
    try {
      const res = await api.post('/wishlist/move-to-cart');
      setWishlist([]);
      return res.data.cart;
    } catch (err) {
      console.error(err);
    }
  };

  const clearWishlist = async () => {
    try {
      await api.delete('/wishlist');
      setWishlist([]);
    } catch (err) {
      console.error(err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product?._id === productId || item.product === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      moveAllToCart,
      clearWishlist,
      isInWishlist,
      fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);