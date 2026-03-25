import { useApp } from "../../context/useApp";
import OrderCard from "./OrderCard";
import Title from "../../ui/Title";

const Home = ({ isLoading }) => {
  const { orders } = useApp();

  const getLocation = (item) => {
    const mapUrl = `https://www.google.com/maps?q=${item.location.coordinates[1]},${item.location.coordinates[0]}`;
    window.open(mapUrl, "_blank");
  };

  return (
    <div className="orders-component">
      <Title>
        <p>Current Orders</p>
      </Title>
      {isLoading ? (
        <div className="orders-loading">Loading orders...</div>
      ) : orders?.length >= 1 ? (
        <div className="order-full">
          {orders
            ?.map((item, index) => (
              <OrderCard
                item={item}
                index={index}
                key={index}
                getLocation={getLocation}
              />
            ))
            .reverse()}
        </div>
      ) : (
        <div className="orders-empty">No order in queue</div>
      )}
    </div>
  );
};

export default Home;
