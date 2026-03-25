import { useState, useMemo } from "react";
import { AppContext } from "./AppContext";

const AppProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempMenu, setTempMenu] = useState([]);

  const value = useMemo(
    () => ({
      orders,
      setOrders,
      loading,
      setLoading,
      menu,
      setMenu,
      tempMenu,
      setTempMenu,
    }),
    [orders, loading, menu, tempMenu],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
