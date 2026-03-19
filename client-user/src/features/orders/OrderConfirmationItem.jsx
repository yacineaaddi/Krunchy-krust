import {
  calculateOrderPrice,
  calculateAdditionalPrice,
} from "../../utils/calculateprice";

const OrderConfirmationItem = ({ item }) => {
  const additionalPrice = calculateAdditionalPrice({ item });
  const OrderPrice = calculateOrderPrice({ item });

  const BASE_URL = import.meta.env.VITE_API_URL;

  return (
    <div className="confirm-itemModal">
      <div className="confirm-itemImage">
        <img
          src={`${BASE_URL}${item.image}`}
          className="h-[100%] w-[100%] object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col font-[400]">
        <p className="text-[16px] font-bold text-cyan-300">
          {`${item?.Qty} ${item?.name}`}
        </p>
        {item.additional.map((currEl) => (
          <p>
            {currEl.Qty} {currEl.name}
          </p>
        ))}
        <p>
          <span className="font-medium text-cyan-300">Price : </span>
          {additionalPrice + OrderPrice} DH
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmationItem;
