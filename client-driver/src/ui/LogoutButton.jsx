import { LuLogOut } from "react-icons/lu";

const LogoutButton = ({ setLogout }) => {
  const handleLogout = () => {
    setLogout(true);
  };

  return (
    <div onClick={handleLogout} className="logout-top-button">
      <LuLogOut />
    </div>
  );
};

export default LogoutButton;
