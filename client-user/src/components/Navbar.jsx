import { RiSendPlaneLine } from "react-icons/ri";
import { IoHomeOutline } from "react-icons/io5";
import { IoBookOutline } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Navbar = ({ cart, tracked }) => {
  return (
    <div className="navbar">
      <ul className="navbar-items">
        <li>
          <NavLink to="/" className="navlink">
            {({ isActive }) => (
              <>
                <IoHomeOutline
                  className={`text-xl ${
                    isActive ? "text-green" : " text-cyan-300"
                  }`}
                />
                <span
                  className={`labelsize ${
                    isActive ? "activelink" : " inactivelink"
                  }`}
                >
                  Home
                </span>
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/menu" className="navlink">
            {({ isActive }) => (
              <>
                <div className="flex flex-row gap-1">
                  <IoBookOutline
                    className={`text-xl ${
                      isActive ? "text-green" : " text-cyan-300"
                    }`}
                  />
                </div>
                <span
                  className={`labelsize ${
                    isActive ? "activelink" : " inactivelink"
                  }`}
                >
                  Menu
                </span>
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className="navlink">
            {({ isActive }) => (
              <>
                <div className="flex flex-row gap-1">
                  <FiShoppingBag
                    className={`text-xl ${
                      isActive ? "text-green" : " text-cyan-300"
                    }`}
                  />
                  {cart?.length >= 1 && (
                    <p className="text-[13px] font-extrabold text-secondary">
                      {cart?.length}
                    </p>
                  )}
                </div>
                <span
                  className={`labelsize ${
                    isActive ? "activelink" : " inactivelink"
                  }`}
                >
                  Cart
                </span>
              </>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink to="/tracking" className="navlink">
            {({ isActive }) => (
              <>
                <div className="flex flex-row gap-1">
                  <RiSendPlaneLine
                    className={`text-xl ${
                      isActive ? "text-green" : " text-cyan-300"
                    }`}
                  />
                  {tracked?.length >= 1 && (
                    <p className="text-[13px] font-extrabold text-secondary">
                      {tracked?.length}
                    </p>
                  )}
                </div>
                <span
                  className={`labelsize ${
                    isActive ? "activelink" : " inactivelink"
                  }`}
                >
                  Tracking
                </span>
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
