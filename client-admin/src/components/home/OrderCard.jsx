import deliveryStates from "../../data/deliveryStates";
import rejectOptions from "../../data/rejectOptions";
import customStyles from "../../ui/customStyles";
import { useApp } from "../../context/useApp";
import toast from "react-hot-toast";
import Select from "react-select";
import { useState } from "react";
import api from "../../api/api";

const OrderCard = ({ item, getLocation }) => {
  const [selected, setSelected] = useState(null);
  const { setOrders } = useApp();
  console.log(item);
  const updateOrder = async (orderId, action) => {
    try {
      const payload = { action };

      if (selected !== undefined && selected !== null) {
        payload.reject_message = selected.value;
      }
      const { data } = await api.put(`/${orderId}/admin-transition`, {
        payload,
      });

      setOrders((prev) => {
        const updated = prev.map((currEl) =>
          orderId === currEl._id
            ? {
                ...currEl,
                status: data.status,
              }
            : currEl,
        );
        return updated;
      });

      toast.success("Order updated successfully");
    } catch (error) {
      toast.error(error.response?.data || error.message);
    }
  };
  const [Element] = item.Order;
  return (
    <>
      <div className="order-container">
        <div className="flex flex-col gap-2">
          <div className="order-number">Order Nº : {item.orderId}</div>
          <div className="grid-col-2 grid gap-3">
            <div className="order-client-info">
              <span className="font-semibold">Name :</span> {item.name}
            </div>
            <div className="order-client-info">
              <span className="font-semibold">Phone :</span> {item.phone}
            </div>
            <div className="order-client-info">
              <span className="font-semibold">Address :</span> {item.address}
            </div>
            <div onClick={() => getLocation(item)} className="location-button">
              Location
            </div>
            <div className="order-details">
              <span className="font-semibold">Order :</span>
              {item?.Order?.map(
                (currEl) =>
                  `
                    ${currEl.Qty} ${currEl.name}
                  `,
              ).join("-")}
            </div>
            {Element.additional.length >= 1 && (
              <div className="order-details">
                <span className="font-semibold">Additional :</span>
                {Element?.additional
                  .map(
                    (currEl) =>
                      `
                    ${currEl.Qty} ${currEl.category} ${currEl.name}
                  `,
                  )
                  .join("-")}
              </div>
            )}
          </div>
          <div className="order-state">
            <p className="text-center font-semibold">
              {item?.status && deliveryStates[item.status]}
            </p>
          </div>
          <div className="decision-container">
            {item.status === "CONFIRMED" && (
              <button
                onClick={() => updateOrder(item._id, "READY")}
                className="ready-button"
              >
                Order is Ready
              </button>
            )}

            {item.status === "PLACED" && (
              <div className="decision-box">
                <div className="select-box">
                  <Select
                    placeholder="Choose a reason"
                    styles={customStyles}
                    options={rejectOptions}
                    onChange={setSelected}
                    value={selected}
                    isSearchable={false}
                  />
                </div>
                <div className="decision-buttons">
                  <button
                    onClick={() => updateOrder(item._id, "REJECTED")}
                    className="decision-button bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateOrder(item._id, "CONFIRMED")}
                    className="decision-button bg-green"
                  >
                    Accept
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default OrderCard;
