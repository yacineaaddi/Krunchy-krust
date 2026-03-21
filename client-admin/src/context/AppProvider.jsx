// src/context/AppProvider.jsx
import { useState, useMemo } from "react";
import { AppContext } from "./AppContext";

const AppProvider = ({ children }) => {
  const [key, setKey] = useState(0);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalMenu, setOriginalMenu] = useState([]);

  const value = useMemo(
    () => ({
      orders,
      setOrders,
      loading,
      setLoading,
      menu,
      setMenu,
      originalMenu,
      setOriginalMenu,
      key,
      setKey,
    }),
    [orders, loading, menu, originalMenu, key, setKey],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
