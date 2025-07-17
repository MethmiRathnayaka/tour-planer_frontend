import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './trips.css';
import MapComponent from '../../Components/MapComponent/MapComponent';
import Gallery from '../../Components/Gallery/Gallery';
import DisplayAcc from '../../Components/Display/displayAcc';
import DistanceCalculator from '../../Components/DistanceCalculator/DistanceCalculator';

const Trips = () => {
  const { destination } = useParams();
  const location = useLocation();
  const { placeId, name, description, images } = location.state || {};

  const [startLocation, setStartLocation] = useState(null);
  const [userInputLocation, setUserInputLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [distanceInKm, setDistanceInKm] = useState(0);
  const [costBreakdown, setCostBreakdown] = useState({});

  const travelModes = {
    luxury: { label: 'Luxury Mode', rate: 80 },
    cheap: { label: 'Cheap Mode', rate: 20 },
    smart: { label: 'Smartest Mode', rate: 50 },
  };

  let destLat = null,
    destLng = null;
  if (destination) {
    const decodedDestination = decodeURIComponent(destination);
    const destinationCoords = decodedDestination.split(',');
    if (destinationCoords.length === 2) {
      destLat = parseFloat(destinationCoords[0]);
      destLng = parseFloat(destinationCoords[1]);
    }
  }

  useEffect(() => {
    if (
      destLat === null ||
      destLng === null ||
      isNaN(destLat) ||
      isNaN(destLng)
    ) {
      setError('Invalid or missing destination coordinates. Please check the URL.');
    } else {
      setError('');
    }
  }, [destLat, destLng]);

  const fetchCoordinates = async () => {
    if (!userInputLocation) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          userInputLocation
        )}&format=json`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setStartLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        setError('Location not found. Please try another input.');
      }
    } catch (err) {
      console.error('Error fetching coordinates:', err);
      setError('Failed to fetch location. Please try again later.');
    }
    setLoading(false);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStartLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error fetching location', error);
      }
    );
  }, []);

  return (
    <div className="destination-details">
      <h1>{name}</h1>
      <div className="discription">
        <pre className="place-description">
          {decodeURIComponent(description)}
        </pre>
      </div>

      <Gallery images={images} />

      <div className="location-input">
        <label htmlFor="start-location">Enter your starting location:</label>
        <input
          type="text"
          id="start-location"
          value={userInputLocation}
          onChange={(e) => setUserInputLocation(e.target.value)}
          placeholder="City or address"
        />
        <button onClick={fetchCoordinates} disabled={loading}>
          {loading ? 'Loading...' : 'Set Start Location'}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      {startLocation && destLat && destLng ? (
        <>
          <MapComponent
            startLocation={startLocation}
            destination={{ lat: destLat, lng: destLng }}
          />

          <DistanceCalculator
            startLocation={startLocation}
            destination={{ lat: destLat, lng: destLng }}
            travelModes={travelModes}
            setDistanceInKm={setDistanceInKm}
            setCostBreakdown={setCostBreakdown}
            setError={setError}
          />

          {distanceInKm > 0 && (
            <div className="travel-costs">
              <h2>Estimated Travel Cost for {distanceInKm.toFixed(2)} km</h2>
              <div className="cost-cards">
                {Object.entries(travelModes).map(([key, { label }]) => (
                  <div className="cost-card" key={key}>
                    <h3>{label}</h3>
                    <p>Rs. {costBreakdown[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading your location...</p>
      )}

      <h1>Looking for a Place to accommodate..?</h1>
      <div className="accommodations-link">
        <DisplayAcc placeId={placeId} />
      </div>
    </div>
  );
};

export default Trips;
