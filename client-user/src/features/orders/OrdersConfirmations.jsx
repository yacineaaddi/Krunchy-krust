import { calculateTotalPrice } from "../../utils/calculateprice";
import OrderConfirmationItem from "./OrderConfirmationItem";
import { getStoreStatus } from "../../utils/GetStoreStatus";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { IoArrowBackCircle } from "react-icons/io5";
import { TiTick, TiTimes } from "react-icons/ti";
import { useState, useEffect, useMemo } from "react";
import Map from "../map/Map";
import {
  useOutletContext,
  useNavigate,
  useActionData,
  Form,
  useNavigation,
} from "react-router-dom";
import TitleModel from "../../ui/TitleModel";

const OrdersConfirmations = () => {
  const { cart, setTrackedIds, setTracked, setCart } = useOutletContext();
  const [userPosition, setUserPosition] = useState();

  const { availableHours } = useOutletContext();

  const [now, setNow] = useState();

  const actionData = useActionData();

  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submiting";

  let TotalPrice = calculateTotalPrice({ cart });

  useEffect(() => {
    if (!actionData) return;

    setTrackedIds((prev) => {
      if (prev.includes(actionData._id)) return prev;
      const updated = [...prev, actionData._id];
      localStorage.setItem("trackedIds", JSON.stringify(updated));

      return updated;
    });

    setTracked((prev) => {
      return [...prev, actionData];
    });

    setCart([]);

    navigate("/tracking");
  }, [actionData]);

  const AvailableStatus = useMemo(
    () => getStoreStatus(availableHours),
    [availableHours, now],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, []);
  const handleGoBack = () => {
    navigate(-1);
  };
  const { isOpen } = AvailableStatus;

  const isDisabled = !userPosition || !isOpen || isSubmitting;

  return (
    <div className="Confirm-component">
      <div className="Confirm-header">
        <button onClick={handleGoBack} className="back-button">
          <IoArrowBackCircle />
        </button>
        <div className="confirm-title">
          <p>
            {cart.length >= 1 ? "Orders Confirmations" : "Order Confirmation"}
          </p>
        </div>
      </div>
      <div className="confirm-box">
        <TitleModel>
          <p>My Orders :</p>
        </TitleModel>

        <div className="modalItem-container">
          {cart.map((item, index) => (
            <OrderConfirmationItem item={item} key={index} />
          ))}
        </div>

        <Form method="post" className="confirm-form">
          <TitleModel>
            <p>Delivery Info :</p>
          </TitleModel>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="form-Modal">
              <label htmlFor="fullName" className="form-Label">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Full name"
                className="input-Modal"
                required
              />
            </div>

            <div className="form-Modal">
              <label htmlFor="phone" className="form-Label">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone number"
                className="input-Modal"
                required
              />
            </div>

            <div className="form-Modal lg:col-span-2">
              <label htmlFor="address" className="form-Label">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Delivery Address"
                className="input-Modal"
                required
              />
            </div>
          </div>

          <TitleModel>
            <p>Current location :</p>
          </TitleModel>

          <Map setUserPosition={setUserPosition} />

          {userPosition ? (
            <div className="confirm-location">
              <TiTick fill="green" className="text-[28px]" />
              <p>Location was set successfully!</p>
            </div>
          ) : (
            <div className="confirm-location">
              <TiTimes fill="red" className="text-[28px]" />
              <p>Location was not set yet!</p>
            </div>
          )}

          <div className="confirm-totalPrice">
            <p>{`Total Price : ${TotalPrice} DH`}</p>
          </div>
          <input name="cart" type="hidden" value={JSON.stringify(cart)} />
          <input
            name="location"
            type="hidden"
            value={JSON.stringify(userPosition ?? {})}
          />
          <button
            disabled={isDisabled}
            type="submit"
            className="confirm-submit"
          >
            {!isOpen
              ? "Sorry we are closed 🔒"
              : isSubmitting
                ? "Submitting..."
                : "Submit"}

            {isOpen && <FaArrowAltCircleRight />}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default OrdersConfirmations;
