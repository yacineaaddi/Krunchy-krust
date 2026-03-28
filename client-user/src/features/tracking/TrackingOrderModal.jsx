import { FaArrowAltCircleRight } from "react-icons/fa";
import StarRating from "../../ui/StarRating";
import { ClipLoader } from "react-spinners";
import { BsStars } from "react-icons/bs";
import DriverMap from "../map/DriverMap";
import { Form } from "react-router-dom";

import { useState } from "react";

const TrackingOrderModal = ({ item }) => {
  const [rating, setRating] = useState(0);
  const [Review, setReview] = useState("");

  function isStep(item, step) {
    return item?.status === step;
  }

  function handleRating(rate) {
    setRating(rate);
  }

  const handleReview = (e) => {
    const value = e.target.value;
    setReview(value);
  };

  return (
    <div className="tracking-modal">
      <div className="tracking-info">
        <p className="tracking-name">Order Nº : {item.orderId}</p>

        <div className="tracking-order">
          {item?.Order?.map((item) => (
            <p>
              {item?.Qty} {item?.name}
            </p>
          ))}

          {item?.Order.map((item) =>
            item.additional?.map((add, index) => (
              <p key={index}>
                {add.Qty} {add.name}
              </p>
            )),
          )}
        </div>
      </div>

      <div className="tracking-status">
        {isStep(item, "PLACED") && (
          <div className="trackingbox">
            <input
              readOnly
              className="w-[18px] accent-green"
              type="checkbox"
              checked={true}
            />

            <div className="trackingstatus">
              <div className="h-[45px] w-[45px]">
                <img
                  src="/images/shopping-cart.png"
                  className="h-[100%] w-[100%] object-cover"
                  alt="shopping-cart"
                />
              </div>
              <div className="w-fit">
                <p>Order placed</p>
              </div>
            </div>
          </div>
        )}
        {isStep(item, "REJECTED") && (
          <div className="trackingbox">
            <div className="trackingstatus">
              <div className="h-[45px] w-[45px]">
                <img
                  src="/images/rejected.png"
                  className="h-[100%] w-[100%] object-cover"
                  alt="shopping-cart"
                />
              </div>
              <div className="w-fit">
                <p>Order Rejected</p>
              </div>
            </div>
          </div>
        )}

        {isStep(item, "CONFIRMED") && (
          <div className="trackingbox">
            <ClipLoader color="green" size={25} />
            <div className="trackingstatus">
              <div className="h-[45px] w-[45px]">
                <img
                  src="/images/order-processing.png"
                  className="h-[100%] w-[100%] object-cover"
                  alt="shopping-cart"
                />
              </div>
              <div className="w-fit">
                <p>Preparing your order</p>
              </div>
            </div>
          </div>
        )}
        {isStep(item, "READY") && (
          <div className="trackingbox">
            <ClipLoader color="green" size={25} />
            <div className="trackingstatus">
              <div className="h-[45px] w-[45px]">
                <img
                  src="/images/delivery-man.png"
                  className="h-[100%] w-[100%] object-cover"
                  alt="shopping-cart"
                />
              </div>
              <div className="w-fit">
                <p>Awaiting pickup</p>
              </div>
            </div>
          </div>
        )}
        {isStep(item, "OUT_FOR_DELIVERY") && (
          <>
            <div className="trackingbox">
              <ClipLoader color="green" size={25} />
              <div className="trackingstatus">
                <div className="h-[45px] w-[45px]">
                  <img
                    src="/images/delivery-driver.png"
                    className="h-[100%] w-[100%] object-cover"
                    alt="shopping-cart"
                  />
                </div>
                <div className="w-fit">
                  <p>On the way</p>
                </div>
              </div>
            </div>
            <DriverMap item={item} />
          </>
        )}
        {isStep(item, "NEAR_ME") && (
          <>
            <div className="trackingbox">
              <ClipLoader color="green" size={25} />
              <div className="trackingstatus">
                <div className="h-[45px] w-[45px]">
                  <img
                    src="/images/delivery-man.png"
                    className="h-[100%] w-[100%] object-cover"
                    alt="shopping-cart"
                  />
                </div>
                <div className="w-fit">
                  <p>Driver is nearby</p>
                </div>
              </div>
            </div>
          </>
        )}

        {isStep(item, "DELIVERED") && (
          <>
            <div className="trackingbox">
              <div className="trackingstatus">
                <div className="h-[45px] w-[45px]">
                  <img
                    src="/images/delivered.png"
                    className="h-[100%] w-[100%] object-cover"
                    alt="shopping-cart"
                  />
                </div>
                <div className="w-fit">
                  <p>Order Delivered</p>
                </div>
              </div>
            </div>
            <div className="w-[95%] py-4">
              <Form method="post" className="trackingbox-form">
                <div className="flex flex-row gap-2">
                  <BsStars fill="green" size="25px" />
                  <p className="trackingbox-rate">Rate your experience</p>
                </div>

                <div className="flex flex-col gap-4 lg:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <label htmlFor="fullName" className="font-md text-sm">
                      How would you rate your experience ?
                    </label>
                    <StarRating
                      size={25}
                      defaultRating={rating}
                      handleRating={handleRating}
                    />
                    <label htmlFor="fullName" className="font-md text-sm">
                      Leave us a comment:
                    </label>
                    <input
                      id="comment"
                      name="comment"
                      type="text"
                      placeholder="Rating experience"
                      className="trackingbox-rate-input"
                      required
                      value={Review}
                      onChange={handleReview}
                    />
                  </div>
                  <input name="rating" type="hidden" value={rating} />
                  <input name="username" type="hidden" value={item?.name} />
                  <input name="orderId" type="hidden" value={item?._id} />
                  <button type="submit" className="trackingbox-submit">
                    <p>Submit</p>
                    <FaArrowAltCircleRight />
                  </button>
                </div>
              </Form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackingOrderModal;
