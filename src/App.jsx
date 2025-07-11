import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Components/NavBar/Navbar';
import Home from './Pages/home/Home';
import Accomedatios from './Pages/Accomedations/Accomedatios';
import Trips from './Pages/Trips/Trips';
import Login from './Components/Login/Login';
import SearchResults from './Components/SearchResults/SearchResults';
import Places from "./Pages/places/Places";


const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin && <Login setShowLogin={setShowLogin} />} {/* Pass setShowLogin */}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Accommodations/:destination" element={<Accomedatios />} />
          {/* Update route to accept dynamic destination */}
          <Route path="/Trips/:destination" element={<Trips />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/places" element={<Places />} />

        </Routes>
      </div>
    </>
  );
};

export default App;
