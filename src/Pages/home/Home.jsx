import React, { useState } from 'react'; // Added useState import
import './home.css';
import Header from '../../Components/Header/Header';
import ExplorePlaces from '../../Components/ExplorePlaces/ExplorePlaces';
import Display from '../../Components/Display/display';

const Home = () => {
  const [category, setCategory] = useState("All"); // State declaration for category

  return (
    <div>
      <Header />
      <h1>Places you may like</h1>
      <Display category={category} />
    </div>
  );
};

export default Home;
