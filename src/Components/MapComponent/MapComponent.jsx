import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ startLocation, destination, onDistanceCalculated  }) => {
  const mapRef = useRef(null); // Store the map instance
  const routingControlRef = useRef(null); // Store the routing control instance
  const mapContainerRef = useRef(null); // Reference to the DOM element

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize the map only once
      const map = L.map(mapContainerRef.current).setView(
        [startLocation.lat, startLocation.lng],
        13
      );

      // Set up the tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Save the map instance in the ref
      mapRef.current = map;
    }

    // Update or add the routing control
    if (routingControlRef.current) {
      // Remove the previous routing control if it exists
      mapRef.current.removeControl(routingControlRef.current);
    }

    // Create and add a new routing control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startLocation.lat, startLocation.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: true,
    }).addTo(mapRef.current);
    

    // Save the routing control instance in the ref
    routingControlRef.current = routingControl;

    // Cleanup function to remove the map and routing control on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [startLocation, destination]);

  return <div ref={mapContainerRef} style={{ height: '500px', width: '100%' }} />;
};

export default MapComponent;
