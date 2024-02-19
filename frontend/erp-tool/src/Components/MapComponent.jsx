import { locations, list } from '../data';
import L from 'leaflet'; // Import Leaflet library
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';

import icon from '../assets/icon-black.png';
import RouteHandler from '../RouteHandler';
import 'leaflet/dist/leaflet.css';
const customMarkerIcon = new L.Icon({
  iconUrl: icon,
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Anchor point of the icon
  popupAnchor: [0, -32], // Popup anchor point
});

function MapComponent({ position, path }) {
  return (
    <MapContainer
      center={position}
      zoom={10}
      style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={[location.lat, location.lon]}
          icon={customMarkerIcon}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}

      {path.length > 1 && (
        <>
          <RouteHandler
            from={[path[0].lat, path[0].lon]}
            to={[path[1].lat, path[1].lon]}
          />
          {path.slice(1, -1).map((point, index) => (
            <RouteHandler
              key={index}
              from={[point.lat, point.lon]}
              to={[path[index + 2].lat, path[index + 2].lon]}
              isBlocked={false}
            />
          ))}
        </>
      )}
    </MapContainer>
  );
}

export default MapComponent;
