import toast from "react-hot-toast";
import { useState } from "react";

export default function useGeolocation() {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    try {
      setLoading(true);
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };

      setPosition(coords);
      return coords;
    } catch (err) {
      toast.error("Error getting location");
      console.error("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return { position, getLocation, loading };
}
