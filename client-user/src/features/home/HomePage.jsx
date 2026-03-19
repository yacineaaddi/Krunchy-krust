import { useOutletContext } from "react-router-dom";
import Welcome from "./Welcome";
import Home from "./Home";

const HomePage = () => {
  const { AvailableStatus, groupedMenu } = useOutletContext();
  return (
    <>
      {groupedMenu && <Home />}
      {AvailableStatus && <Welcome />}
    </>
  );
};

export default HomePage;
