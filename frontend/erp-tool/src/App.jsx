import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

function App() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        () => {
          console.log('Unable to retrieve your location');
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <>
      <h1>City Navigation Tool</h1>
      {position && (
        <MapContainer center={position} zoom={13} style={{ height: '100vh' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
        </MapContainer>
      )}
    </>
  );
}

export default App;
