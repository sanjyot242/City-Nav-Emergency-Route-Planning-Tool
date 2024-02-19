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
    <div className='flex flex-col h-screen'>
      <header className='w-full bg-blue-600 text-white py-4 shadow-md z-10'>
        <h1 className='text-4xl font-bold text-center'>City Navigation Tool</h1>
      </header>
      <div className='flex-grow flex'>
        <div className='w-full md:w-1/4 xl:w-1/5 p-4 bg-gray-100 overflow-auto'>
          <div className='mb-4'>
            <label
              htmlFor='start-point'
              className='block text-sm font-medium text-gray-700'>
              Select Start Point
            </label>
            <select
              id='start-point'
              className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
              onChange={(e) => setStart(e.target.value)}>
              <option value=''>Select Start Point</option>
              {locations.map((location, idx) => (
                <option key={idx} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label
              htmlFor='end-point'
              className='block text-sm font-medium text-gray-700'>
              Select End Point
            </label>
            <select
              id='end-point'
              className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
              onChange={(e) => setEnd(e.target.value)}>
              <option value=''>Select End Point</option>
              {locations.map((location, idx) => (
                <option key={idx} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={handleRouteCalculation}>
            Calculate Route
          </button>
        </div>
        <div className='w-full md:w-3/4 xl:w-4/5 h-full'>
          {position && <MapComponent position={position} path={path} />}
        </div>
      </div>
    </div>
  );
}

export default App;
