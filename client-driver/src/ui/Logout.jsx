import { LuLogOut } from "react-icons/lu";

const Logout = ({ setUser, setLogout }) => {
  const cancelLogout = () => {
    setLogout(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setLogout(false);
  };
  return (
    <div className="logout-component">
      <div className="logout-box">
        <div className="flex flex-col items-center gap-4">
          <LuLogOut className="text-3xl text-cyan-300" />
          <h2 className="text-xl font-bold">Log out</h2>
        </div>
        <p>Are you sure you want to log out ?</p>
        <div className="flex w-[80%] justify-between gap-4">
          <button className="logout-button bg-cyan-300" onClick={cancelLogout}>
            Cancel
          </button>
          <button className="logout-button bg-red-600" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
