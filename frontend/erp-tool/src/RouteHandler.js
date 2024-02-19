import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';

// RoutingMachine component for displaying routes on the map
function RouteHandler({ from, to, isBlocked }) {
  // Using the useMap hook to get access to the map instance
  const map = useMap();

  // useEffect hook to add the routing control to the map when 'from' and 'to' props are updated
  useEffect(() => {
    let routingControl;
    if (from && to) {
      const lineColor = isBlocked ? 'red' : 'blue';

      if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
      }

      // Creating and adding the routing control to the map
      routingControl = L.Routing.control({
        waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
        routeWhileDragging: false,
        geocoder: L.Control.Geocoder.nominatim(),
        router: L.Routing.mapbox(
          'pk.eyJ1Ijoic2FuanlvdDI0MiIsImEiOiJjbHNzNzM2NXYwYnZvMnJxbjQzZHZibjFlIn0.aU9D-7-91z6UqtD6dQm9CQ'
        ),
        createMarker: () => {
          return null;
        },
        lineOptions: {
          styles: [{ color: lineColor, opacity: 1, weight: 5 }],
        },
      }).addTo(map);

      routingControl._container.style.display = 'none';
    }

    // Cleanup function to remove the routing control from the map when the component unmounts or the 'from' and 'to' props change
    return () => {
      // Check if routingControl exists and remove it
      if (routingControl && map) {
        map.removeControl(routingControl);
      }
    };
  }, [from, to, map, isBlocked]); // Add all dependencies here

  return null;
}

export default RouteHandler;
