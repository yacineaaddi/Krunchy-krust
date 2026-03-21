import LogoutButton from "./ui/LogoutButton";
import NotFound from "./ui/NotFound";
import { useState, useEffect } from "react";
import { useApp } from "./context/useApp";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader";
import { socket } from "./socket/socket";
import Login from "./components/Login";
import Logout from "./ui/Logout";
import api from "./api/api";
import Home from "./Home";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

function App() {
  const alarm = new Audio("/sounds/Firebell.mp3");

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? stored : null;
  });

  const { loading, setLoading, setOrders } = useApp();

  useEffect(() => {
    const fetchUser = async () => {
      const storedId = localStorage.getItem("user");
      if (!storedId) return;
      setLoading(true);
      try {
        const res = await api.get("/me");
        const { _id } = res.data;
        setUser(_id);
        localStorage.setItem("user", _id);
      } catch (err) {
        console.error("error", err.message);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

    socket.emit("driver:join");
    socket.on("order:add", handleAdd);
    socket.on("order:delete", handleDelete);
    socket.on("order:update", handleUpdate);

    return () => {
      socket.emit("driver:leave");
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
        <LogoutButton setLogout={setLogout} />
        <Outlet />
      </>
    );
  };

  return (
    <>
      {/*loading && <Loader />*/}
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute user={user} setUser={setUser} />}>
            <Route path="/" element={<Home />} />
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

export default App;
