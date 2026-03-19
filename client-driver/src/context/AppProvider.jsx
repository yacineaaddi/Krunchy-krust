import { useState, useMemo } from "react";
import { AppContext } from "./AppContext";

const AppProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const value = useMemo(
    () => ({
      orders,
      setOrders,
      loading,
      setLoading,
    }),
    [orders, loading],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
