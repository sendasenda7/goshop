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
    // Ne catch plus l'erreur en silence, sinon les toasts de succès s'affichent
    // même en cas d'échec (ex: utilisateur non connecté).
    const res = await api.post('/wishlist', { productId });
    setWishlist(res.data.wishlist.items || []);
  };

  const removeFromWishlist = async (productId) => {
    const res = await api.delete(`/wishlist/${productId}`);
    setWishlist(res.data.wishlist.items || []);
  };

  const moveAllToCart = async () => {
    const res = await api.post('/wishlist/move-to-cart');
    setWishlist([]);
    return res.data.cart;
  };

  const clearWishlist = async () => {
    await api.delete('/wishlist');
    setWishlist([]);
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