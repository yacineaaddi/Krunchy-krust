import { calculateTotalPrice } from "../../utils/calculateprice";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import Title from "../../components/Title";

const Cart = () => {
  const navigate = useNavigate();
  const { cart } = useOutletContext();
  let TotalPrice = calculateTotalPrice({ cart });

  return (
    <div className="cart-component">
      <Title>
        <p>My orders</p>
      </Title>
      <div className="cart-container">
        {cart?.length >= 1 ? (
          <>
            <div className="cart-box-container">
              {cart
                .map((item) => <CartItem item={item} key={item._id} />)
                .reverse()}
            </div>
            <div
              onClick={() => navigate("/order-confirmation")}
              className="confirm-button"
            >
              <p>{`Total Price : ${TotalPrice} DH`}</p>
              <FaArrowAltCircleRight />
            </div>
          </>
        ) : (
          <div className="empty-cart">No order in cart</div>
        )}
      </div>
    </div>
  );
};

export default Cart;
