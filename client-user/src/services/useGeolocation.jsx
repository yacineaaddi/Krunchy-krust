import { Geolocation } from "@capacitor/geolocation";
import toast from "react-hot-toast";
import { useState } from "react";

export default function useGeolocation() {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    try {
      setLoading(true);

      const permission = await Geolocation.requestPermissions();
      if (permission.location !== "granted") {
        toast.error("Location permission not granted");
        return;
      }

      const pos = await Geolocation.getCurrentPosition();

      const coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      setPosition(coords);
      return coords;
    } catch (err) {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };

          setPosition(coords);
          return coords;
        } catch (browserErr) {
          toast.error(browserErr.message);
          console.error("Browser error:", browserErr);
        }
      } else {
        toast.error(err.message);
        console.error("Capacitor and browser geolocation failed", err);
      }
    } finally {
      setLoading(false);
    }
  };
  return { position, getLocation, loading };
}
