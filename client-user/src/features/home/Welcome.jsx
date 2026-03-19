import { getStoreStatus } from "../../utils/GetStoreStatus";
import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const { availableHours } = useOutletContext();
  const navigate = useNavigate();
  const [now, setNow] = useState();

  const AvailableStatus = useMemo(
    () => getStoreStatus(availableHours),
    [availableHours, now],
  );

  console.log("welcome rendred");

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100000);

    return () => clearInterval(interval);
  }, []);

  console.log(AvailableStatus);

  const { isOpen, openTime, closeTime } = AvailableStatus;

  if (availableHours == null) return null;

  return (
    <div
      onClick={() => navigate("/menu")}
      className="welcomebutton flex flex-col gap-4"
    >
      {
        <p>
          WELCOME TO <span className="text-primary">KRUNCHY</span>
          <span className="text-secondary"> KRUST</span>
        </p>
      }

      {isOpen ? (
        <>🟢 Open – closes at {closeTime}</>
      ) : (
        <>
          🔴 Sorry, we are closed
          {openTime && <> – opens at {openTime}</>}
        </>
      )}
    </div>
  );
};

export default Welcome;
