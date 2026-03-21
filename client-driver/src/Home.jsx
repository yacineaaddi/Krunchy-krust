import useGeolocation from "./customHook/useGeolocation";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import OrderCard from "./components/OrderCard";
import { useApp } from "./context/useApp";
import toast from "react-hot-toast";
import api from "./api/api";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { getPosition } = useGeolocation();

  const { orders, setOrders, key, setKey } = useApp();

  const positionRef = useRef({
    Latitude: 0,
    Longitude: 0,
  });

  const location = useLocation();
  const currentPath = location.pathname.split("/")[1];

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (!currentPath === "") return;
        setKey((prevKey) => prevKey + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      const coords = await getPosition();

      if (!coords || orders.length == 0) return;

      const isOutForDelivery = orders.some(
        (order) => order.status === "OUT_FOR_DELIVERY",
      );

      if (!isOutForDelivery) return;

      const prev = positionRef.current;

      const hasChanged =
        prev.Latitude !== coords.latitude ||
        prev.Longitude !== coords.longitude;

      /*if (!hasChanged) {
        console.log("returned");
        return;
      }*/

      const newPosition = {
        Latitude: coords.latitude,
        Longitude: coords.longitude,
      };

      positionRef.current = newPosition;

      try {
        await api.post("/setLocation", newPosition);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    };

    const interval = setInterval(fetchLocation, 5000);

    return () => clearInterval(interval);
  }, [orders]);

  useEffect(() => {
    const fetchData = async () => {
      const user = localStorage.getItem("user");
      if (!user) return;
      try {
        const res = await api.get("/orders");

        if (JSON.stringify(res.data) !== JSON.stringify(orders)) {
          setOrders(res.data);
        }
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    };
    fetchData();
  }, []);

  const getLocation = (item) => {
    const mapUrl = `https://www.google.com/maps?q=${item.location.coordinates[1]},${item.location.coordinates[0]}`;
    window.open(mapUrl, "_blank");
  };

  return (
    <div className="dashboard-container" key={key}>
      <div className="ui-head-title">
        <p>Dashboard</p>
      </div>
      {isLoading ? (
        <div className="orders-status">Loading orders...</div>
      ) : orders?.length >= 1 ? (
        <div className="order-full">
          {orders
            ?.filter((item) =>
              ["CONFIRMED", "READY", "OUT_FOR_DELIVERY", "DELIVERED"].includes(
                item.status,
              ),
            )
            .slice()
            .reverse()
            .map((item, index) => (
              <OrderCard
                key={item._id}
                item={item}
                index={index}
                getLocation={getLocation}
              />
            ))}
        </div>
      ) : (
        <div className="orders-status">No orders in queue</div>
      )}
    </div>
  );
};

export default Home;
