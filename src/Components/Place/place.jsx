import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../Context/store-context";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { assets } from "../../assets/assets";
import { useEffect } from "react";

const Place = ({ placeId, name, description, images = [], lat, lng }) => {
  const { url } = useContext(StoreContext); // Get base URL from context

  // Log placeId to check if it's available
  console.log("Place component - placeId:", placeId);

  return ( 
    <Link to={{
      pathname: `/Trips/${lat},${lng}`
    }} state={{ placeId, name, description, images }}>
      <div className="place-card">
        <div className="place-image-container">
          {images.length > 0 ? (
            <img src={`${url}/uploads/${images[0]}`} alt={name} className="place-image" />
          ) : (
            <div>
              <img src={assets.default_image} alt="Default" className="place-image" />
            </div>
          )}
        </div>
        <div className="place-info">
          <h3>{name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default Place;
