import { IoBookOutline } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { Ri24HoursFill } from "react-icons/ri";
import { useApp } from "../../context/useApp";
import { NavLink } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";

const Navbar = ({ setLogout }) => {
  const { orders } = useApp();

  const handleLogout = () => {
    setLogout(true);
  };

  function NavItem({ icon, isActive, navLabel, orders }) {
    const Icon = icon;
    return (
      <>
        <div className="flex flex-row gap-1">
          <Icon
            className={`text-xl ${isActive ? "text-green" : "text-cyan-300"}`}
          />
          {navLabel === "Orders" && orders?.length >= 1 && (
            <p className="order-quantity">{orders?.length}</p>
          )}
        </div>
        <p className={`labelsize ${isActive ? "activelink" : " inactivelink"}`}>
          {navLabel}
        </p>
      </>
    );
  }

  return (
    <div className="navbar-component">
      <ul className="flex flex-row justify-around">
        <li>
          <NavLink to="/" className="navlink">
            {({ isActive }) => (
              <NavItem
                icon={FiShoppingBag}
                isActive={isActive}
                navLabel="Orders"
                orders={orders}
              ></NavItem>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/hours" className="navlink">
            {({ isActive }) => (
              <NavItem
                icon={Ri24HoursFill}
                isActive={isActive}
                navLabel="Hours"
              ></NavItem>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/menu" className="navlink">
            {({ isActive }) => (
              <NavItem
                icon={IoBookOutline}
                isActive={isActive}
                navLabel="Menu"
              ></NavItem>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink className="navlink" onClick={handleLogout}>
            {({ isActive }) => (
              <NavItem
                icon={LuLogOut}
                isActive={isActive}
                navLabel="Logout"
              ></NavItem>
            )}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

// Export the component
export default Navbar;
