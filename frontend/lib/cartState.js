import { createContext, useContext, useState } from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // This is our own custom Provider
  // We will store data (state) and functionality (updaters in here)
  // And anyone can access it via the consumer
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider value={{
      cartOpen,
      setCartOpen,
      toggleCart,
      closeCart,
      openCart
    }}>
      {children}
    </LocalStateProvider>
  );
}

// Make a custom hook for accessing the cart local state
function useCart() {
  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, useCart };
