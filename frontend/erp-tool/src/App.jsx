import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import MapComponent from './Components/MapComponent';
import { useState, useEffect } from 'react';
import { locations, list } from './data';

function App() {
  const [position, setPosition] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);

  function handleRouteCalculation() {
    setPath([
      { lat: 33.8704, lon: -117.9242 }, //source node
      { lat: 33.881683, lon: -118.117012 }, //inteermediate
      { lat: 33.77005, lon: -118.193741 }, //destination
    ]);
  }

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

      <select onChange={(e) => setStart(e.target.value)}>
        <option value=''>Select Start Point</option>
        {locations.map((location, idx) => (
          <option key={idx} value={location.name}>
            {location.name}
          </option>
        ))}
      </select>

      <select onChange={(e) => setEnd(e.target.value)}>
        <option value=''>Select End Point</option>
        {locations.map((location, idx) => (
          <option key={idx} value={location.name}>
            {location.name}
          </option>
        ))}
      </select>
      <button onClick={handleRouteCalculation}>Calculate Route</button>

      {position && <MapComponent position={position} path={path} />}
    </>
  );
}

export default App;
