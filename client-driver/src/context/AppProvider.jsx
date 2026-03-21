import { useState, useMemo } from "react";
import { AppContext } from "./AppContext";

const AppProvider = ({ children }) => {
  const [key, setKey] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const value = useMemo(
    () => ({
      orders,
      setOrders,
      loading,
      setLoading,
      key,
      setKey,
    }),
    [orders, loading, key, setKey],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
