import React, { useContext } from 'react';
import './display.css';
import { StoreContext } from '../../Context/store-context';
import Place from '../../Components/Place/place';
import { useLocation } from 'react-router-dom';

const Display = () => {
  const { list } = useContext(StoreContext);
  const location = useLocation();

  // Get ?category=... from the URL
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');

  // Filter places by the selected category (if present)
  const filteredList = selectedCategory
    ? list.filter(item => item.category?.toLowerCase() === selectedCategory.toLowerCase())
    : list;

  return (
    <div className='display' id='display'>
      {/* Places List */}
      <div className="display_list">
        {filteredList.length > 0 ? (
          filteredList.map((item) => (
            <Place
              key={item._id}
              placeId={item._id}
              name={item.name}
              description={item.description}
              images={item.images}
              lat={item.lat}
              lng={item.lng}
            />
          ))
        ) : (
          <p>No places found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default Display;
