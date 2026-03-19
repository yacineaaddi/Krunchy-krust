import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoBagCheck } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";

const MenuItem = ({ item }) => {
  const { cart, wishlist, setWishlist, setCart, handleUpdate, isInList } =
    useOutletContext();

  const BASE_URL = import.meta.env.VITE_API_URL;

  return (
    <div className="menuItem-box">
      <div className="menuItem-image">
        <img
          src={`${BASE_URL}${item.image}`}
          className={`h-[100%] w-[100%] object-cover ${
            item.available ? "" : "grayscale"
          }`}
          loading="lazy"
        />
        <div
          className="menuItem-wishlist"
          onClick={() => handleUpdate(item, wishlist, "wishlist", setWishlist)}
        >
          {wishlist.some((curr) => curr.id === item.id) ? (
            <FaHeart fill="red" />
          ) : (
            <FaRegHeart stroke="black" />
          )}
        </div>
      </div>
      <div className="menuItem-info">
        <h1 className="menuItem-name">{item.name.toUpperCase()}</h1>

        <p className="menuItem-price">{item.price} DH</p>
        <div className="menuItem-delivery">
          <IoMdTime fill="#00979E" />
          <p>Delivery: {item.prep_time} min</p>
        </div>
        {item.available ? (
          <div
            onClick={() => handleUpdate(item, cart, "cart", setCart)}
            className="menuItem-update"
          >
            <div className="menuItem-icon">
              {cart.some((curr) => curr._id === item._id) ? (
                <FaRegTrashCan />
              ) : (
                <IoBagCheck />
              )}
            </div>
            <div className="menuItem-status">
              <p>{isInList(item, cart) ? "Remove from cart" : "Add to cart"}</p>
            </div>
          </div>
        ) : (
          <p className="menuItem-unavailable">Currently unavailable</p>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
