import { NavLink } from "react-router-dom";

export default function CategoryItem({ item }) {
  const BASE_URL = import.meta.env.VITE_API_URL;

  return (
    <NavLink to="/menu">
      <div className="home-cirleItems">
        <img
          src={`${BASE_URL}${item.image}`}
          className="h-[100%] w-[100%] object-cover"
          loading="lazy"
        />
      </div>
    </NavLink>
  );
}
