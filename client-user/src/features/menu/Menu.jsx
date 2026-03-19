import { useOutletContext, useNavigate } from "react-router-dom";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import { IoIosSearch } from "react-icons/io";
import MenuItem from "./MenuItem";
import { useState } from "react";

const Menu = () => {
  const { cart, groupedMenu } = useOutletContext();

  const { Dish } = groupedMenu;

  const [search, setSearch] = useState("");
  const [results, setResults] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const dishes = Dish.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
    setResults(dishes);
  };

  return (
    <div className="menu-component">
      <div className="menu-search-container">
        <div className="relative w-full">
          <input
            className="menu-search"
            value={search}
            placeholder="Search menu"
            onChange={handleSearch}
          />
          <div className="menu-search-icon">
            {search ? (
              <div onClick={() => setSearch("")}>
                <TiDeleteOutline />
              </div>
            ) : (
              <IoIosSearch />
            )}
          </div>
        </div>
      </div>
      <div className="menu-container">
        {search && results.length === 0 ? (
          <div className="menu-empty">No results found</div>
        ) : (
          <>
            <div className="menu-full">
              {search
                ? results?.map((item, index) => (
                    <MenuItem item={item} key={index} />
                  ))
                : Dish?.map((item, index) => (
                    <MenuItem item={item} key={index} />
                  ))}
            </div>{" "}
            {cart.length >= 1 && (
              <div onClick={() => navigate("/cart")} className="confirm-button">
                <p>{cart.length !== 1 ? "Place Orders" : "Place Order"}</p>
                <FaArrowAltCircleRight />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
