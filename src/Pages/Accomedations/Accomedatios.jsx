import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Accomedations.css';
import MapComponent from '../../Components/MapComponent/MapComponent';
import Gallery from '../../Components/Gallery/Gallery';

const Trips = () => {
  const { destination } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { id, name, description, images,category,size,price} = location.state || {};

  const [user, setUser] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [userInputLocation, setUserInputLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [distanceInKm, setDistanceInKm] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  // ✅ Get user from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
fetch("http://localhost:4000/api/user/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        } 
      })
      .catch(() => {
      });      return;
    }

    
  }, [navigate]);

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setStartLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error('Location error:', err)
    );
  }, []);

  // Destination coordinates
  let destLat = null, destLng = null;
  if (destination) {
    const coords = decodeURIComponent(destination).split(',');
    if (coords.length === 2) {
      destLat = parseFloat(coords[0]);
      destLng = parseFloat(coords[1]);
    }
  }

  useEffect(() => {
    if (!destLat || !destLng || isNaN(destLat) || isNaN(destLng)) {
      setError('Invalid or missing destination coordinates.');
    } else {
      setError('');
    }
  }, [destLat, destLng]);

  // Manually set location
  const fetchCoordinates = async () => {
    if (!userInputLocation) return;
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(userInputLocation)}&format=json`);
      const data = await res.json();
      if (data.length > 0) {
        setStartLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      } else {
        setError('Location not found.');
      }
    } catch {
      setError('Failed to fetch location.');
    }
    setLoading(false);
  };

  // Fetch bookings
  useEffect(() => {
    if (!id) return;
    setAvailabilityLoading(true);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    fetch(`http://localhost:4000/api/bookings/accommodation/${id}?startDate=${today.toISOString().split('T')[0]}&endDate=${nextWeek.toISOString().split('T')[0]}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBookings(data.bookings);
        }
        setAvailabilityLoading(false);
      })
      .catch(() => setAvailabilityLoading(false));
  }, [id]);

  const isDateBooked = (dateStr) => {
    const target = new Date(dateStr);
    return bookings.some(({ checkIn, checkOut }) => {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      return target >= start && target <= end;
    });
  };

  const isRangeAvailable = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const current = new Date(s);
    while (current <= e) {
      const dateStr = current.toISOString().split('T')[0];
      if (isDateBooked(dateStr)) return false;
      current.setDate(current.getDate() + 1);
    }
    return true;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      window.alert("Please sign in to continue.");
      return;
    }

    if (!isRangeAvailable(checkIn, checkOut)) {
      setBookingMessage("Selected dates are not available.");
      return;
    }

    setBookingLoading(true);
    setBookingMessage('');
    try {
      const response = await fetch("http://localhost:4000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user._id,
          accommodation: id,
          checkIn,
          checkOut,
          guests,
          totalPrice: 0
        }),
      });
      const data = await response.json();
      setBookingMessage(data.success ? "Booking successful!" : data.message || "Booking failed.");
    } catch {
      setBookingMessage("Booking failed.");
    }
    setBookingLoading(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="destination-details">
      <h1>{name}</h1>
      <div className="discription">
        <pre className="place-description">{decodeURIComponent(description)}</pre>
      </div>
      <h2>Accommodation Details</h2>
      <p><strong>Category:</strong> {category}</p>  
      <p><strong>Size:</strong> {size}</p>
      <p><strong>Price per day:</strong> LKR {price}</p>
     
      <Gallery images={images} />

      <div style={{ margin: "1rem 0" }}>
        <h3>Availability (Next 7 Days):</h3>
        {availabilityLoading ? (
          <p>Loading availability...</p>
        ) : (
          <ul style={{ display: "flex", gap: "1rem", listStyle: "none", padding: 0 }}>
            {[...Array(7)].map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const dateStr = date.toISOString().split('T')[0];
              const isBooked = isDateBooked(dateStr);
              return (
                <li key={dateStr} style={{ color: isBooked ? "red" : "green" }}>
                  {dateStr} {isBooked ? "Booked" : "Available"}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <form className="booking-form" onSubmit={handleBooking}>
        <h2>Book this Accommodation</h2>
        <label>
          Check-in:
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required min={todayStr} />
        </label>
        <label>
          Check-out:
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required min={checkIn || todayStr} />
        </label>
        
        <button type="submit" disabled={bookingLoading}>
          {bookingLoading ? "Booking..." : "Book Now"}
        </button>
        {bookingMessage && <p>{bookingMessage}</p>}
      </form>

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

      {startLocation ? (
        <MapComponent
          startLocation={startLocation}
          destination={{ lat: destLat, lng: destLng }}
          onDistanceCalculated={setDistanceInKm}
        />
      ) : (
        <p>Loading your location...</p>
      )}
    </div>
  );
};

export default Trips;
