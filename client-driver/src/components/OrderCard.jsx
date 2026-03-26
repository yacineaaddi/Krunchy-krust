import deliveryStates from "../data/deliveryStates";
import OrderCountdown from "./OrderCountdown";
import { useApp } from "../context/useApp";
import toast from "react-hot-toast";
import { useState } from "react";
import api from "../api/api";

const OrderCard = ({ item, getLocation }) => {
  const [paid, setPaid] = useState(null);

  const { setOrders } = useApp();

  const handleinput = (e) => {
    const value = e.target.value;
    setPaid(value);
  };

  const updateOrder = async (orderId, action, paid) => {
    try {
      const payload = { action };

      if (paid !== undefined && paid !== null) {
        payload.paid = paid;
      }
      const { data } = await api.put(`/${orderId}/driver-transition`, {
        payload,
      });

      const order = data.order;
      setOrders((prev) => {
        const updated = prev.map((currEl) =>
          orderId === currEl._id
            ? {
                ...currEl,
                status: order.status,
              }
            : currEl,
        );
        return updated;
      });

      toast.success("Order updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  return (
    <>
      <div className="order-container">
        <div className="order-box">
          <div className="order-number">Order Nº : {item.orderId}</div>
          <div className="grid-col-2 grid gap-3">
            <div className="order-details">
              <span className="font-semibold">Name :</span> {item.name}
            </div>
            <div className="order-details">
              <span className="font-semibold">Address :</span> {item.address}
            </div>
            <div onClick={() => getLocation(item)} className="location-button">
              Location
            </div>
          </div>
          <div
            className={`mt-4 rounded-xl ${item.status === "READY" ? "bg-red-500" : "bg-cyan-100 bg-opacity-80"} text-white`}
          >
            <p className="order-state">{deliveryStates[item.status]}</p>
          </div>
          <div className="decision-box">
            {item.status === "READY" && (
              <button
                onClick={() => updateOrder(item._id, "OUT_FOR_DELIVERY")}
                className="delivery-button"
              >
                Out for delivery
              </button>
            )}

            {item.status === "NEAR_ME" && (
              <div className="delivery-box">
                <label htmlFor="address" className="input-label">
                  Paid price :
                </label>
                <input
                  className="input-price"
                  value={paid}
                  placeholder="Paid price"
                  onChange={handleinput}
                />
                <button
                  onClick={() => updateOrder(item._id, "DELIVERED", paid)}
                  className="delivered-button"
                >
                  Delivred
                </button>
              </div>
            )}
          </div>
          {item.status === "CONFIRMED" && (
            <OrderCountdown readyAt={item.readyAt} />
          )}
        </div>
      </div>
    </>
  );
};

export default OrderCard;
