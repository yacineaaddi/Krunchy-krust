import { useApp } from "../../context/useApp";
import ItemMenuModal from "./ItemMenuModal";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import api from "../../api/api";

const MenuModal = ({ category, item }) => {
  const { menu, tempMenu, setTempMenu, setMenu } = useApp();

  const newItem = new Object({
    id: menu.length + 1,
    name: "Insert name",
    image: "/images/New image",
    price: "00",
    category: category,
    available: false,
    prep_time: category === "Dish" ? "30" : null,
  });

  async function handleSave(e) {
    e.preventDefault();
    const type = e.currentTarget.dataset.type;

    let updatedMenu = menu;

    switch (type) {
      case "newItem":
        updatedMenu = [...menu, newItem];
        break;

      case "deleteItem":
        updatedMenu = menu.filter((m) => m._id !== e.currentTarget.dataset.id);
        break;

      case "saveMenu":
        updatedMenu = menu;
        break;

      default:
        return;
    }

    if (JSON.stringify(tempMenu) === JSON.stringify(updatedMenu)) {
      toast.error("Please update menu");
      return;
    }

    try {
      const newMenu = await api.post("admin/menu", updatedMenu);
      setMenu(newMenu.data);
      setTempMenu(newMenu.data);
      toast.success("Menu updated successfully");
    } catch (error) {
      toast.error(error.response?.data || error.message);
    }
  }

  return (
    <div className="Menu-container">
      <div className="Menu-Categoryname">{category}</div>
      {item.map((item) => (
        <ItemMenuModal item={item} key={item._id} handleSave={handleSave} />
      ))}
      <div data-type="newItem" onClick={handleSave} className="Menu-newItem">
        <FaPlus />
      </div>
    </div>
  );
};

export default MenuModal;
