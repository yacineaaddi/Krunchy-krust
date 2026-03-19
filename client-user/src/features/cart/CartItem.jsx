import { calculateAdditionalPrice } from "../../utils/calculateprice";
import { calculateOrderPrice } from "../../utils/calculateprice";
import { FreeMode, Thumbs, Scrollbar } from "swiper/modules";
import { handleAdditional } from "../../utils/updatecart";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { updateQty } from "../../utils/updatecart";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuMinus } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import "swiper/css";

const CartItem = ({ item }) => {
  const { cart, wishlist, handleUpdate, setCart, setWishlist, groupedMenu } =
    useOutletContext();

  const additionalPrice = calculateAdditionalPrice({ item });
  const OrderPrice = calculateOrderPrice({ item });

  const Extra = Object.entries(groupedMenu).filter(([test]) => test !== "Dish");
  const BASE_URL = import.meta.env.VITE_API_URL;

  return (
    <div className="cart-item-container">
      <div className="cart-item-image">
        <div className="cart-item-imagebox">
          <img
            src={`${BASE_URL}${item.image}`}
            className="h-[100%] w-[100%] object-cover"
            loading="lazy"
          />
        </div>
        <div
          className="cart-whishlist-button"
          onClick={() => handleUpdate(item, wishlist, "wishlist", setWishlist)}
        >
          {wishlist.some((curr) => curr.id === item.id) ? (
            <FaHeart fill="red" />
          ) : (
            <FaRegHeart stroke="black" />
          )}
        </div>
      </div>

      <div className="cart-item-info">
        <div className="cart-item-infobox">
          <h1 className="cart-item-name">{item.name.toUpperCase()}</h1>
          <p className="cart-item-price">{OrderPrice} DH</p>
        </div>

        <div className="cart-edit-box">
          <div className="cart-quantity">
            <div
              onClick={(e) => updateQty({ e, setCart, item })}
              data-action="decrease"
              className="edit-quantity-button"
            >
              <LuMinus />
            </div>
            <div className="cart-item-quantity">{item.Qty}</div>

            <div
              onClick={(e) => updateQty({ e, setCart, item })}
              data-action="increase"
              className="edit-quantity-button"
            >
              <FiPlus />
            </div>
          </div>
          <div
            onClick={() => handleUpdate(item, cart, "cart", setCart)}
            className="cart-update"
          >
            <FaRegTrashCan />
            <p>Remove</p>
          </div>
        </div>
        {Extra?.map(([category, items]) => (
          <div key={category} className="extra-container">
            <div className="extra-titlebox">
              <h1 className="extra-title">Want some more {category} ?</h1>
              {items.length > 2 && (
                <p className="text-xs text-gray-400">{"SWIPE TO VIEW >"}</p>
              )}
            </div>

            <div>
              <Swiper
                scrollbar={{
                  hide: false,
                }}
                spaceBetween={10}
                slidesPerView={2}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Thumbs, Scrollbar]}
                className="product-thumbs-swiper"
              >
                {items?.map((currItem, index) => {
                  const additionalQty =
                    item.additional?.find((el) => el._id === currItem._id)
                      ?.Qty || 0;
                  return (
                    <SwiperSlide key={index}>
                      <div className="swiper-box">
                        <div className="swiper-box-image">
                          <img
                            src={`${BASE_URL}${currItem.image}`}
                            className="object-full h-[100%] w-[100%]"
                            loading="lazy"
                          />
                        </div>
                        <div className="swiper-item-info">
                          <p className="swiper-item-name">{currItem.name}</p>
                          <p className="swiper-item-price">{`${currItem.price} DH`}</p>
                        </div>

                        <div className="swiper-item-quantity">
                          <div
                            onClick={(e) =>
                              handleAdditional({ e, currItem, item, setCart })
                            }
                            data-action="decrease"
                            className="edit-quantity-button"
                          >
                            <LuMinus />
                          </div>
                          <div className="cart-item-quantity">
                            {additionalQty}
                          </div>

                          <div
                            onClick={(e) =>
                              handleAdditional({ e, currItem, item, setCart })
                            }
                            data-action="increase"
                            className="edit-quantity-button"
                          >
                            <FiPlus />
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        ))}
      </div>
      <div className="total-price">
        <p>{`Order Price : ${additionalPrice + OrderPrice} DH`}</p>
      </div>
    </div>
  );
};

export default CartItem;
