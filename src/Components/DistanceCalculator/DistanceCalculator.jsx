import React, { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const DistanceCalculator = ({
  startLocation,
  destination,
  travelModes,
  setDistanceInKm,
  setCostBreakdown,
  setError,
}) => {
  useEffect(() => {
    const calculateDistanceWithGoogle = async () => {
      if (!startLocation || !destination) return;

      const loader = new Loader({
        apiKey: "AIzaSyAJcRq1pUNgGzjw0OUk9XVTpAXQAgqmxyo",
        libraries: ['places'],
      });

      try {
        const google = await loader.load();
        const service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix(
          {
            origins: [new google.maps.LatLng(startLocation.lat, startLocation.lng)],
            destinations: [new google.maps.LatLng(destination.lat, destination.lng)],
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === 'OK') {
              const result = response.rows[0].elements[0];
              const distanceInMeters = result.distance.value;
              const distanceInKm = distanceInMeters / 1000;

              setDistanceInKm(distanceInKm);

              const costs = {};
              for (const key in travelModes) {
                costs[key] = (travelModes[key].rate * distanceInKm).toFixed(2);
              }
              setCostBreakdown(costs);
            } else {
              setError('Failed to fetch distance from Google Maps.');
              console.error('Distance Matrix error:', status);
            }
          }
        );
      } catch (error) {
        setError('Error loading Google Maps.');
        console.error('Google Maps Loader error:', error);
      }
    };

    calculateDistanceWithGoogle();
  }, [startLocation, destination]);

  return null; // This component doesn't render anything directly
};

export default DistanceCalculator;
