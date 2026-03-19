import { useApp } from "../../context/useApp";
import MenuModal from "./MenuModal";
import Title from "../../ui/Title";

const Menu = () => {
  const { menu } = useApp();

  const groupedMenu = menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="Menu-component">
      <Title>
        <p>Update Menu</p>
      </Title>
      {menu &&
        Object.entries(groupedMenu).map(([category, items]) => (
          <MenuModal category={category} items={items} key={category} />
        ))}
    </div>
  );
};

export default Menu;
