import React, { useCallback, useRef, useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const GoogleMapComponent = ({ startLocation, destination, onDistanceCalculated }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const mapRef = useRef(null);

  const handleLoad = useCallback((map) => {
    mapRef.current = map;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: startLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
          const distanceMeters = result.routes[0].legs[0].distance.value;
          onDistanceCalculated?.((distanceMeters / 1000).toFixed(2));
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  }, [startLocation, destination, onDistanceCalculated]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAJcRq1pUNgGzjw0OUk9XVTpAXQAgqmxyo">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={startLocation}
        zoom={10}
        onLoad={handleLoad}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
