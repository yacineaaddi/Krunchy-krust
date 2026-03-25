import { Route, Navigate, Outlet, Routes } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Logout from "./components/logout/Logout";
import Hours from "./components/hours/Hours";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import { useApp } from "./context/useApp";
import Menu from "./components/menu/Menu";
import { Toaster } from "react-hot-toast";
import { socket } from "./socket/socket";
import NotFound from "./ui/NotFound";
import toast from "react-hot-toast";
import Loader from "./ui/Loader";
import { App } from "@capacitor/app";
import api from "./api/api";

function ReactApp() {
  const { loading, setLoading, setOrders, setMenu, setTempMenu } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const lastRunRef = useRef(0);
  const abortRef = useRef(null);

  const alarm = new Audio("/sounds/Firebell.mp3");

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? stored : null;
  });

  const storedId = localStorage.getItem("user");

  const fetchData = useCallback(async () => {
    try {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const user = localStorage.getItem("user");
      if (!user) return;

      const res = await api.get("/orders", {
        signal: abortRef.current.signal,
      });

      setOrders((prev) => {
        if (JSON.stringify(res.data) !== JSON.stringify(prev)) return res.data;
        return prev;
      });

      setIsLoading(false);
    } catch (error) {
      if (error.name === "CanceledError") return;
      console.error(error.response?.data?.message || error.message);
    }
  }, [setOrders]);

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

      fetchData();
    };
    const init = async () => {
      listener = await App.addListener("appStateChange", handleVisibility);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    //const removeListener = App.addListener("appStateChange", handleVisibility);
    init();
    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibility);
      listener?.remove();
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(fetchData, 0);

    return () => clearTimeout(id);
  }, [fetchData, user]);

  useEffect(() => {
    async function fetchMenu() {
      if (!storedId) return;
      try {
        const { data } = await api.get("/menu");
        setMenu(data);
        setTempMenu(data);
      } catch (error) {
        toast.error(error.response?.data || error.message);
      }
    }

    fetchMenu();
  }, [storedId]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!storedId) return;
      setLoading(true);
      try {
        const res = await api.get("/me");
        const { _id } = res.data;
        setUser(_id);
        localStorage.setItem("user", _id);
      } catch (error) {
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [storedId]);

  useEffect(() => {
    const handleAdd = (order) => {
      setOrders((prev) => [...prev, order]);

      alarm.play();

      setTimeout(() => {
        alarm.pause();
        alarm.currentTime = 0;
      }, 10000);
    };

    const handleUpdate = (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)),
      );
    };

    const handleDelete = (orderId) => {
      setOrders((prev) => prev.filter((currEl) => currEl._id !== orderId));
    };

    socket.emit("admin:join");
    socket.on("order:delete", handleDelete);
    socket.on("order:add", handleAdd);
    socket.on("order:update", handleUpdate);

    return () => {
      socket.emit("admin:leave");
      socket.off("order:add");
      socket.off("order:update");
      socket.off("order:delete");
    };
  }, []);

  const ProtectedRoute = ({ user, setUser }) => {
    const [logout, setLogout] = useState(false);

    useEffect(() => {
      document.body.style.overflow = logout ? "hidden" : "visible";

      return () => {
        document.body.style.overflow = "visible";
      };
    }, [logout]);

    if (!user) return <Navigate to="/login" replace />;
    return (
      <>
        {logout && <Logout setUser={setUser} setLogout={setLogout} />}
        <Navbar setLogout={setLogout} />
        <Outlet />
      </>
    );
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute user={user} setUser={setUser} />}>
            <Route path="/" element={<Home isLoading={isLoading} />} />
            <Route path="/hours" element={<Hours />} />
            <Route path="/menu" element={<Menu />} />
          </Route>
          <Route
            path="/login"
            element={
              loading ? (
                <Loader />
              ) : user ? (
                <Navigate to="/" />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default ReactApp;
