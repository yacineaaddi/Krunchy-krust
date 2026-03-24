import { useEffect, useRef, useState, useCallback } from "react";
import { getStoreStatus } from "../../utils/GetStoreStatus";
import ScrollToTop from "../../utils/ScrollToTop";
import Navbar from "../../components/Navbar";
import { socket } from "../../socket/socket";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { App } from "@capacitor/app";
import toast from "react-hot-toast";
import api from "../../api/api";
import { useMemo } from "react";

const AppLayout = () => {
  const [trackedIds, setTrackedIds] = useState(() => {
    const tracked = localStorage.getItem("trackedIds");
    return tracked ? JSON.parse(tracked) : [];
  });

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  const [driverPosition, setDriverPosition] = useState(null);
  const [availableHours, setAvailableHours] = useState(null);
  const [tracked, setTracked] = useState([]);
  const [menu, setMenu] = useState([]);
  const [key, setKey] = useState(0);

  const lastRunRef = useRef(0);
  const abortRef = useRef(null);

  const isInList = (item, list) => {
    return list.some((curr) => curr.id === item.id);
  };

  const AvailableStatus = useMemo(
    () => getStoreStatus(availableHours),
    [availableHours],
  );

  const fetchHours = useCallback(async () => {
    try {
      const res = await api.get("/working-hours");
      const { workingHours } = res.data;

      setAvailableHours((prev) => {
        if (JSON.stringify(workingHours) !== JSON.stringify(prev)) {
          return workingHours;
        }
        return prev;
      });
    } catch (error) {
      if (error.name === "CanceledError") return;
      console.error(error.response?.data || error.message);
    }
  }, []);

  const fetchMenu = useCallback(async () => {
    try {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const { data } = await api.get("/menu", {
        signal: abortRef.current.signal,
      });

      setMenu((prev) => {
        if (JSON.stringify(data) !== JSON.stringify(prev)) return data;
        return prev;
      });
    } catch (error) {
      if (error.name === "CanceledError") return;
      console.error(error.response?.data || error.message);
    }
  }, []);

  const fetchTrackedOrders = useCallback(async () => {
    if (!trackedIds || trackedIds.length === 0) return;

    try {
      const res = await api.post("/myorders", {
        trackedIds,
      });

      const newIds = res.data.map((el) => el._id);

      setTracked((prev) => {
        if (JSON.stringify(res.data) !== JSON.stringify(prev)) return res.data;
        return prev;
      });

      setTrackedIds((prev) => {
        const updated = prev.filter((id) => newIds.includes(id));
        localStorage.setItem("trackedIds", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      if (error.name === "CanceledError") return;
      console.error(error.response?.data || error.message);
    }
  }, [trackedIds]);

  useEffect(() => {
    let isMounted = true;
    let listener;

    const handleVisibility = (state) => {
      if (!isMounted) return;
      const now = Date.now();

      if (now - lastRunRef.current < 300) return;
      lastRunRef.current = now;

      const isVisible =
        document.visibilityState === "visible" || state?.isActive === true;

      if (!isVisible) return;

      fetchMenu();
      fetchTrackedOrders();
      fetchHours();
    };

    const init = async () => {
      listener = await App.addListener("appStateChange", handleVisibility);
    };

    document.addEventListener("visibilitychange", handleVisibility);

    init();

    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibility);
      listener?.remove();
      abortRef.current?.abort();
    };
  }, [fetchMenu, fetchTrackedOrders, fetchHours]);

  useEffect(() => {
    const initialFetch = async () => {
      await fetchMenu();
      await fetchTrackedOrders();
      await fetchHours();
    };

    const id = setTimeout(() => {
      initialFetch();
    }, 0);

    return () => clearInterval(id);
  }, [fetchMenu, fetchTrackedOrders, fetchHours]);

  const groupedMenu = useMemo(() => {
    return menu.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }

      acc[item.category].push(item);
      return acc;
    }, {});
  }, [menu]);

  useEffect(() => {
    const handleHours = (availableHours) => {
      setAvailableHours(availableHours);
    };

    const handleMenu = (menu) => {
      setMenu(menu);
    };

    socket.on("order:updateHours", handleHours);
    socket.on("order:updateMenu", handleMenu);

    return () => {
      socket.off("order:updateHours", handleHours);
      socket.off("order:updateMenu", handleMenu);
    };
  }, []);

  useEffect(() => {
    const handleUpdate = (order) => {
      setTracked((prev) => prev.map((o) => (o._id === order._id ? order : o)));
    };
    const handleLocation = (location) => {
      setDriverPosition(location);
    };

    const handleDelete = (id) => {
      setTracked((prev) => prev.filter((item) => item._id !== id));

      setTrackedIds((prev) => {
        const updated = prev.filter((currId) => currId !== id);
        localStorage.setItem("trackedIds", JSON.stringify(updated));
        return updated;
      });
    };

    trackedIds.forEach((id) => socket.emit("order:join", id));

    socket.on("order:update", handleUpdate);
    socket.on("order:delete", handleDelete);
    socket.on("order:driverLocation", handleLocation);

    return () => {
      trackedIds.forEach((id) => socket.emit("order:leave", id));

      socket.off("order:update", handleUpdate);
      socket.off("order:delete", handleDelete);
      socket.off("order:driverLocation", handleLocation);
    };
  }, [trackedIds]);

  const handleUpdate = (item, list, listName, setList) => {
    const key = listName === "cart" ? "cart" : "wishlist";

    if (isInList(item, list)) {
      const updated = list.filter((curr) => curr._id !== item._id);

      setList(updated);

      localStorage.setItem(key, JSON.stringify(updated));
      toast.success(`Removed from ${key}!`);
    } else {
      const newItem =
        key === "cart" ? { ...item, additional: [], Qty: 1 } : item;

      setList((prev) => {
        const updated = [...prev, newItem];
        localStorage.setItem(key, JSON.stringify(updated));
        return updated;
      });

      toast.success(`Added to ${key}!`);
    }
  };

  return (
    <div className="bg-cyan-300">
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar cart={cart} tracked={trackedIds} />
      <Outlet
        context={{
          cart,
          setCart,
          wishlist,
          setWishlist,
          handleUpdate,
          isInList,
          trackedIds,
          setTrackedIds,
          setTracked,
          tracked,
          driverPosition,
          menu,
          AvailableStatus,
          availableHours,
          groupedMenu,
          key,
          setKey,
        }}
      />
    </div>
  );
};

export default AppLayout;
