import toast from "react-hot-toast";
import { useState } from "react";

export default function useGeolocation() {
  const storeLocation = {
    Latitude: import.meta.env.STORE_LATITUDE,
    Longitude: import.meta.env.STORE_LONGITUDE,
  };

  const [loading, setLoading] = useState(false);

  const getPosition = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
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

      return coords;
    } catch (err) {
      console.error(err);
      toast.error("Error getting location");
    } finally {
      setLoading(false);
    }
  };

  return { getPosition, loading, storeLocation };
}
