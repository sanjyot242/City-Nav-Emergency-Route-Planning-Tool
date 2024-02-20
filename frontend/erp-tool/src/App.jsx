import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import MapComponent from './Components/MapComponent';
import { useState, useEffect } from 'react';
import { locations, list } from './data';

import CustomInput from './Components/CustomInput';

function App() {
  const [position, setPosition] = useState(null);
  const [blockages, setBlockages] = useState([]);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const [blockageStart, setblockageStart] = useState(null);
  const [blockageEnd, setblockageEnd] = useState(null);

  const [path, setPath] = useState([]);

  function handleRouteCalculation() {
    {
      // Find the start location in the locations array
      const startLocation = locations.find(
        (location) => location.name === start
      );
      // Find the end location in the locations array
      const endLocation = locations.find((location) => location.name === end);

      // If both start and end locations are found, set the path
      if (startLocation && endLocation) {
        setPath([
          { lat: startLocation.lat, lon: startLocation.lon }, // Start node
          { lat: 33.80497, lon: -118.0718 },
          { lat: endLocation.lat, lon: endLocation.lon }, // End node
        ]);
      } else {
        // Handle the case where the locations are not found
        console.error('Start or end location not found');
      }
    }
    // setPath([
    //   { lat: 33.8704, lon: -117.9242 }, //source node
    //   { lat: 33.881683, lon: -118.117012 }, //inteermediate
    //   { lat: 33.77005, lon: -118.193741 }, //destination
    // ]);
  }

  function clearAllBlockAges() {
    setBlockages([]);
  }

  function handleAddBlockage() {
    const startLocation = locations.find(
      (location) => location.name === blockageStart
    );
    const endLocation = locations.find(
      (location) => location.name === blockageEnd
    );

    if (startLocation && endLocation) {
      setBlockages([
        ...blockages,
        {
          from: { lat: startLocation.lat, lon: startLocation.lon },
          to: { lat: endLocation.lat, lon: endLocation.lon },
        },
      ]);
    }
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
        <div className='flex flex-col md:w-1/4 xl:w-1/5 p-4 bg-gray-100 overflow-auto'>
          <CustomInput
            setStart={setStart}
            setEnd={setEnd}
            onClick={handleRouteCalculation}
            buttonTitle={'Calculate Route '}>
            Plan Your Journey
          </CustomInput>
          <CustomInput
            setStart={setblockageStart}
            setEnd={setblockageEnd}
            onClick={handleAddBlockage}
            buttonTitle={'Add Blockages '}>
            Add Blockages
          </CustomInput>
          <div className='py-4 px-2'>
            <button
              className='w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
              onClick={clearAllBlockAges}>
              Clear All Blockages
            </button>
          </div>
        </div>
        <div className='w-full md:w-3/4 xl:w-4/5 h-full'>
          {position && (
            <MapComponent
              position={position}
              path={path}
              blockedPaths={blockages}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
