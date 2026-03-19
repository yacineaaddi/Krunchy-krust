import { useState, useEffect } from "react";

export default function OrderCountdown({ readyAt }) {
  const [timeLeft, setTimeLeft] = useState();

  useEffect(() => {
    const update = () => setTimeLeft(readyAt - Date.now());
    update();

    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(readyAt - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <span className="order-countdown">
      ⏱️
      {timeLeft <= 0
        ? "00:00"
        : `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
    </span>
  );
}
