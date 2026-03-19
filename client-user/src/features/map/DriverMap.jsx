import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useOutletContext } from "react-router-dom";
import L from "leaflet";

const DriverMap = ({ item }) => {
  const { driverPosition } = useOutletContext();

  const driverLatLng = [driverPosition?.Latitude, driverPosition?.Longitude];
  const Map_Url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const [lng, lat] = item.location.coordinates;
  const storeLatLng = [34.2592609, -6.5965996];
  const customerLatLng = [lat, lng];

  const StoreIcon = new L.Icon({
    iconUrl: "/images/maplogo.png",
    iconSize: [34, 34],
  });

  const driverIcon = new L.Icon({
    iconUrl: "/images/delivery-driver.png",
    iconSize: [34, 34],
  });

  const userIcon = new L.Icon({
    iconUrl: "/images/mylocation.png",
    iconSize: [34, 34],
  });

  if (!driverPosition) return null;

  return (
    <div className="map-container">
      <MapContainer
        center={driverLatLng}
        zoom={14}
        className="h-[300px] w-full rounded-xl"
      >
        <TileLayer url={Map_Url} />

        <Marker position={storeLatLng} icon={StoreIcon} />

        <Marker position={customerLatLng} icon={userIcon} />

        <Marker position={driverLatLng} icon={driverIcon} />
      </MapContainer>
    </div>
  );
};

export default DriverMap;
