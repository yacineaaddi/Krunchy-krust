import { useNavigate } from "react-router-dom";

export default function CategoryItem({ item }) {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const scrollToItem = (item) => {
    navigate("/menu", { state: { targetId: item._id } });
  };

  return (
    <div className="home-cirleItems" onClick={() => scrollToItem(item)}>
      <img
        src={`${BASE_URL}${item?.image}`}
        className="h-[100%] w-[100%] object-cover"
        loading="lazy"
      />
    </div>
  );
}
