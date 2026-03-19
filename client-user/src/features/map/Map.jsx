import useGeolocation from "../../services/useGeolocation";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { useEffect, useRef } from "react";
import L from "leaflet";

const Map = ({ setUserPosition }) => {
  const OpenStreetmap_Url =
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const Map_Url = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

  const { position, getLocation, loading } = useGeolocation();

  const hasRequestedLocation = useRef(false);
  const mapInstanceRef = useRef(null);
  const mapRef = useRef(null);

  const ResetLocation = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    mapInstanceRef.current = L.map(mapRef.current).setView(
      [34.2592258246762, -6.584565120362721],
      13,
    );

    L.tileLayer(Map_Url, {
      maxZoom: 19,
      attribution: OpenStreetmap_Url,
    }).addTo(mapInstanceRef.current);
  };

  useEffect(() => {
    ResetLocation();
  }, []);

  useEffect(() => {
    if (!hasRequestedLocation.current || !position) {
      return;
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    mapInstanceRef.current = L.map(mapRef.current).setView(
      [position.latitude, position.longitude],
      14,
    );

    L.tileLayer(Map_Url, {
      maxZoom: 19,
      attribution: OpenStreetmap_Url,
    }).addTo(mapInstanceRef.current);

    L.marker([position.latitude, position.longitude]).addTo(
      mapInstanceRef.current,
    );
  }, [position]);

  const AutoGeolocate = async (e) => {
    e.preventDefault();

    hasRequestedLocation.current = true;

    const coords = await getLocation();

    if (!coords) return;

    setUserPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };

  const ManualGeolocate = (e) => {
    e.preventDefault();

    ResetLocation();
    setUserPosition("");

    mapInstanceRef.current.once("click", (e) => {
      const { lat: latitude, lng: longitude } = e.latlng;

      L.marker([latitude, longitude])
        .addTo(mapInstanceRef.current)
        .bindPopup("My current location");

      setUserPosition({
        latitude: latitude,
        longitude: longitude,
      });
    });
  };
  return (
    <div className="map-container">
      <div ref={mapRef} className="user-map-box">
        {loading && (
          <div className="getting-location">
            <p>Getting your location...</p>
          </div>
        )}
      </div>
      <div className="buttons-box">
        <div className="location-button">
          <FaLocationDot />
          <button onClick={ManualGeolocate}>Choose location</button>
        </div>
        <div className="location-button">
          <FaLocationCrosshairs />
          <button onClick={AutoGeolocate}>Auto location</button>
        </div>
      </div>
    </div>
  );
};

export default Map;
