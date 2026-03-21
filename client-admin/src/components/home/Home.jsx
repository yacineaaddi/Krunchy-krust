import { useLocation } from "react-router-dom";
import { useApp } from "../../context/useApp";
import { useState, useEffect } from "react";
import OrderCard from "./OrderCard";
import Title from "../../ui/Title";
import api from "../../api/api";

const Home = () => {
  const { orders, setOrders, key, setKey } = useApp();

  const user = localStorage.getItem("user");

  const [isLoading, setIsLoading] = useState(true);

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
    const fetchData = async () => {
      if (!user) return;
      try {
        const res = await api.get("/orders");
        if (JSON.stringify(res.data) !== JSON.stringify(orders)) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getLocation = (item) => {
    const mapUrl = `https://www.google.com/maps?q=${item.location.coordinates[1]},${item.location.coordinates[0]}`;
    window.open(mapUrl, "_blank");
  };

  return (
    <div className="orders-component" key={key}>
      <Title>
        <p>Current Orders</p>
      </Title>
      {isLoading ? (
        <div className="orders-loading">Loading orders...</div>
      ) : orders?.length >= 1 ? (
        orders
          ?.map((item, index) => (
            <OrderCard
              item={item}
              index={index}
              key={index}
              getLocation={getLocation}
            />
          ))
          .reverse()
      ) : (
        <div className="orders-empty">No order in queue</div>
      )}
    </div>
  );
};

export default Home;
