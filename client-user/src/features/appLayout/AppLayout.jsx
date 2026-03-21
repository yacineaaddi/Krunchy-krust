import { getStoreStatus } from "../../utils/GetStoreStatus";
import ScrollToTop from "../../utils/ScrollToTop";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { socket } from "../../socket/socket";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import api from "../../api/api";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const AppLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1];

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

  const isInList = (item, list) => {
    return list.some((curr) => curr.id === item.id);
  };

  const AvailableStatus = useMemo(
    () => getStoreStatus(availableHours),
    [availableHours],
  );

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (!currentPath === "tracking") return;
        setKey((prevKey) => prevKey + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchWorkingHours = async () => {
      try {
        const res = await api.get("/working-hours");

        const { workingHours } = res.data;

        console.log("fetched working hours");

        if (mounted) setAvailableHours(workingHours);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchWorkingHours();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const { data } = await api.get("/menu");
        console.log(data);
        setMenu(data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    }

    fetchMenu();
  }, []);

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
    const fetchTrackedOrders = async () => {
      if (trackedIds == undefined && trackedIds == null) return;
      try {
        const res = await api.post("/myorders", {
          trackedIds,
        });

        setTracked(res.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchTrackedOrders();
  }, []);

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
