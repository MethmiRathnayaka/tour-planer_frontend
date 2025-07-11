import React, { useContext, useState } from 'react';
import './display.css';
import { AccContext } from '../../Context/acc-context'; // Use AccContext instead of StoreContext
import Accomedation from '../Accomedation/accomedation';

const DisplayAcc = ({ placeId }) => {
    const { list } = useContext(AccContext);

    // Log the full accommodation list and the current placeId
    console.log("Accommodation list:", list);
    console.log("Current placeId:", placeId);

    // Only show accommodations where nearbyPlaces includes this placeId
    const filteredList = list.filter(item =>
        Array.isArray(item.nearbyPlaces) && item.nearbyPlaces.includes(placeId)
    );

    return (
        <div className='display' id='display'>
            <div className="display_list">
                {filteredList.length > 0 ? (
                    filteredList.map((item) => (
                        <Accomedation
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            images={item.images}
                            lat={item.lat}
                            lng={item.lng}
                            category={item.category}
                            size={item.size} // Pass size prop if needed
                            price={item.price} // Pass price prop if needed
                        />
                    ))
                ) : (
                    <p>No accommodations found near this place.</p>
                )}
            </div>
        </div>
    );
};

export default DisplayAcc;
