import { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext(null);

const STORAGE_KEY = "liberty-shop-cart";

function loadCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const productId = product._id || product.id;

    setCartItems((currentItems) => {
      const existing = currentItems.find(
        (item) => (item._id || item.id) === productId,
      );

      if (existing) {
        return currentItems.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          id: productId,
          quantity: 1,
        },
      ];
    });
  };

  const decreaseQuantity = (id) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const { cartCount, cartTotal } = useMemo(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    const sum = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return { cartCount: count, cartTotal: sum };
  }, [cartItems]);

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
