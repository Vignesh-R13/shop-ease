import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// safe localStorage read
const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
  } catch {
    return [];
  }
};

const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getCart);
  const [wishlist, setWishlist] = useState(getWishlist);

  // sync cart
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // sync wishlist
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // ADD TO CART
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const exists = prev.find(item => item._id === product._id);

      if (exists) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      }

      return [...prev, { ...product, qty: quantity }];
    });
  };

  // REMOVE FROM CART
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  // UPDATE QTY (FIXED)
  const updateQty = (id, qty) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item._id === id ? { ...item, qty } : item
        )
        .filter(item => item.qty > 0)
    );
  };

  // CLEAR CART
  const clearCart = () => setCartItems([]);

  // WISHLIST
  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(item => item._id === product._id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item._id !== id));
  };

  // TOTAL
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        wishlist,
        addToWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);