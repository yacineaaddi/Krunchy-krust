import { FaRegTrashCan } from "react-icons/fa6";
import { useApp } from "../../context/useApp";
import { FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import { useState } from "react";
import api from "../../api/api";

const ItemMenuModal = ({ item, handleSave }) => {
  const [imageName, setImageName] = useState("Select New Image");
  const [newPrepTime, setNewPrepTime] = useState(item.prep_time);
  const [newPrice, setNewPrice] = useState(item.price);
  const [newName, setNewName] = useState(item.name);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const { setMenu, setTempMenu } = useApp();

  async function handleImageChange(e) {
    e.preventDefault();

    const file = e.target.files[0];
    const id = e.target.dataset.id;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await api.put(`/menu/${id}/image`, formData);

      const updateMenuImages = (prevMenu) =>
        prevMenu.map((m) =>
          m._id === id ? { ...m, image: `/uploads/${data}` } : m,
        );

      setMenu(updateMenuImages);
      setTempMenu(updateMenuImages);

      toast.success("Image updated successfully");
    } catch (error) {
      toast.error(error.response?.data || error.message);
    }
  }

  return (
    <div className="Menu-ItemModal">
      <div className="Menu-ItemName">{item.name}</div>
      <div className="Menu-ItemImage">
        <img
          src={`${BASE_URL}${item.image}`}
          className="h-[100%] w-[100%] object-cover"
          alt={item.name}
        />
      </div>

      <div className="Menu-ItemForm">
        <input
          type="file"
          id={`custom-input-${item._id}`}
          data-id={item._id}
          onChange={(e) => {
            handleImageChange(e);
            setImageName(e.target.files[0].name.slice(0, 14) + "...");
          }}
          hidden
        />
        <label htmlFor={`custom-input-${item._id}`} className="Menu-NewImage">
          Choose file
        </label>
        <label className="text-sm text-slate-500">{imageName}</label>
      </div>

      <div className="Menu-Available">
        <label className="text-xl font-semibold">Available :</label>
        <input
          className="Menu-Checkbox"
          type="checkbox"
          checked={item.available}
          onChange={() => {
            const val = item.available;

            setMenu((prevMenu) =>
              prevMenu.map((m) =>
                m._id === item._id ? { ...m, available: !val } : m,
              ),
            );
          }}
        />
      </div>
      <div className="Menu-EditContainer">
        <div className="Menu-EditBox">
          <label className="Menu-ItemLabel">Name :</label>
          <input
            className="Menu-Input"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={() => {
              setMenu((prevMenu) =>
                prevMenu.map((m) =>
                  m._id === item._id ? { ...m, name: newName } : m,
                ),
              );
            }}
          />
        </div>
        <div className="Menu-EditBox">
          <label className="Menu-ItemLabel">Price :</label>
          <input
            className="Menu-Input"
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(+e.target.value)}
            onBlur={() => {
              setMenu((prevMenu) =>
                prevMenu.map((m) =>
                  m._id === item._id ? { ...m, price: newPrice } : m,
                ),
              );
            }}
          />
        </div>
        {item.prep_time && (
          <div className="Menu-EditBox">
            <label className="Menu-ItemLabel">Preparation time :</label>
            <input
              className="Menu-Input"
              type="number"
              value={newPrepTime}
              onChange={(e) => setNewPrepTime(+e.target.value)}
              onBlur={() => {
                setMenu((prevMenu) =>
                  prevMenu.map((m) =>
                    m._id === item._id ? { ...m, prep_time: newPrepTime } : m,
                  ),
                );
              }}
            />
          </div>
        )}
      </div>
      <div className="Menu-save-delete">
        <div
          data-type="deleteItem"
          data-id={item._id}
          onClick={handleSave}
          className="Menu-delete"
        >
          <FaRegTrashCan />
        </div>
        <div data-type="saveMenu" onClick={handleSave} className="Menu-save">
          <FaCheck />
        </div>
      </div>
    </div>
  );
};

export default ItemMenuModal;
