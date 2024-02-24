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

  const [blockageStart, setBlockageStart] = useState(null);
  const [blockageEnd, setBlockageEnd] = useState(null);

  const [path, setPath] = useState([]);

  const [initialDistanceMatrix, setInitialDistanceMatrix] = useState([]);
  const [distanceMatrixWithBlockages, setDistanceMatrixWithBlockages] =
    useState([]);

  function handleRouteCalculation() {
    const matrixToUse =
      distanceMatrixWithBlockages && distanceMatrixWithBlockages.length > 0
        ? distanceMatrixWithBlockages
        : initialDistanceMatrix;

    const { dist, next } = floydWarshall(matrixToUse);

    const startIndex = locations.findIndex((loc) => loc.name === start);
    const endIndex = locations.findIndex((loc) => loc.name === end);

    if (startIndex !== -1 && endIndex !== -1) {
      const pathIndices = constructPath(next, startIndex, endIndex);
      console.log(pathIndices);
      const pathCoordinates = pathIndices.map((index) => ({
        lat: locations[index].lat,
        lon: locations[index].lon,
      }));

      console.log(pathCoordinates);
      setPath(pathCoordinates);
      console.log(
        `Shortest distance from ${start} to ${end} is ${dist[startIndex][endIndex]} km`
      );
    } else {
      console.error('Start or end location not found');
    }
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
          from: {
            name: startLocation.name,
            lat: startLocation.lat,
            lon: startLocation.lon,
          },
          to: {
            name: endLocation.name,
            lat: endLocation.lat,
            lon: endLocation.lon,
          },
        },
      ]);
    }
  }

  const floydWarshall = (matrix) => {
    const numVertices = matrix.length;
    let next = Array.from({ length: numVertices }, () =>
      Array.from({ length: numVertices }, () => null)
    );

    let dist = matrix.map((row, i) =>
      row.map((value, j) => {
        if (value !== 999 && i !== j) {
          next[i][j] = j;
        }
        return value;
      })
    );

    for (let k = 0; k < numVertices; k++) {
      for (let i = 0; i < numVertices; i++) {
        for (let j = 0; j < numVertices; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            next[i][j] = next[i][k];
          }
        }
      }
    }

    return { dist, next };
  };

  const constructPath = (next, start, end) => {
    if (next[start][end] === null) return [];
    let path = [start];
    while (start !== end) {
      start = next[start][end];
      path.push(start);
    }
    return path;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

  const generateInitialDistanceMatrix = () => {
    let matrix = locations.map((from) =>
      locations.map((to) =>
        from === to ? 0 : calculateDistance(from.lat, from.lon, to.lat, to.lon)
      )
    );
    console.log('Initial');
    console.log(matrix);
    setInitialDistanceMatrix(matrix);
    setDistanceMatrixWithBlockages(matrix);
  };

  const applyBlockagesToDistanceMatrix = () => {
    let matrix = initialDistanceMatrix.map((row) => [...row]);
    for (let i = 0; i < blockages.length; i++) {
      const fromIndex = locations.findIndex(
        (loc) => loc.name === blockages[i].from.name
      );
      const toIndex = locations.findIndex(
        (loc) => loc.name === blockages[i].to.name
      );
      if (fromIndex !== -1 && toIndex !== -1) {
        matrix[fromIndex][toIndex] = 999;
      }
    }
    console.log('Blockage');
    console.log(matrix);
    setDistanceMatrixWithBlockages(matrix);
  };

  useEffect(() => {
    generateInitialDistanceMatrix();
  }, []);

  useEffect(() => {
    applyBlockagesToDistanceMatrix();
  }, [blockages]);

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
            setStart={setBlockageStart}
            setEnd={setBlockageEnd}
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
