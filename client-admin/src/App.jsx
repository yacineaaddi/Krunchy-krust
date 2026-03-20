import Navbar from "./components/navbar/Navbar";
import Logout from "./components/logout/Logout";
import Hours from "./components/hours/Hours";
import Login from "./components/login/Login";
import { useState, useEffect } from "react";
import Home from "./components/home/Home";
import { Toaster } from "react-hot-toast";
import { useApp } from "./context/useApp";
import Menu from "./components/menu/Menu";
import { socket } from "./socket/socket";
import NotFound from "./ui/NotFound";
import toast from "react-hot-toast";
import Loader from "./ui/Loader";
import api from "./api/api";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

function App() {
  const alarm = new Audio("/sounds/Firebell.mp3");
  const storedId = localStorage.getItem("user");

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? stored : null;
  });

  const { loading, setLoading, setOrders, setMenu, setOriginalMenu } = useApp();

  useEffect(() => {
    async function fetchMenu() {
      if (!storedId) return;
      try {
        const { data } = await api.get("/menu");
        setMenu(data);
        setOriginalMenu(data);
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
        console.log("error", error.message);
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

    const handleUpdateMenu = (menu) => {
      setMenu(menu);
    };

    socket.emit("admin:join");
    socket.on("order:delete", handleDelete);
    socket.on("order:add", handleAdd);
    socket.on("order:update", handleUpdate);
    socket.on("menu:update", handleUpdateMenu);

    return () => {
      socket.emit("admin:leave");
      socket.off("order:add");
      socket.off("order:update");
      socket.off("order:delete");
      socket.off("menu:update");
    };
  }, []);

  const ProtectedRoute = ({ user, setUser }) => {
    const [logout, setLogout] = useState(false);

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
            <Route path="/" element={<Home />} />
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

// Export App
export default App;
