import React from 'react';
import './ExplorePlaces.css';
import { menu_list } from '../../assets/assets';
import { Link } from 'react-router-dom';

const ExplorePlaces = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Trending Places</h1>
      <p className="explore-places-text">You can explore our trending places to plan your next tour</p>
      <div className="menu">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() => setCategory((prev) => (prev === item.menu_name ? 'All' : item.menu_name))}
              key={index}
              className="menu-item"
            >
<Link to={`/Trips/${item.destination.lat},${item.destination.lng}`}>
  <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt={item.menu_name} />
</Link>
              <h3>{item.menu_name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExplorePlaces;
