import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../Context/store-context";
import "./Places.css"; // You can define styles here
import Display from "../../Components/Display/display";

const Places = () => {
  const { list } = useContext(StoreContext);
  const location = useLocation();

  // Read query param
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get("category");


  return (
    <div className="places-page">
      <Display category={selectedCategory} />
    </div>
    
  );
};

export default Places;
