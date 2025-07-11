import React, { useState, useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/store-context";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("");
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);

  const { token, setToken, list } = useContext(StoreContext);
  const navigate = useNavigate();

  const categories = [...new Set(list.map((item) => item.category))];

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  // Show dropdown if either hovered on menu or dropdown itself
  const showPlacesDropdown = menu === "places" && (isMenuHovered || isDropdownHovered);

  return (
    <div className="navbar">
      {/* Logo */}
      <Link to="/" className="logo-container">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>

      {/* Main Menu */}
      <div className="navbar-menu">
        {/* PLACES DROPDOWN */}
        <div
          className="navbar-menu-item dropdown"
          onMouseEnter={() => {
            setMenu("places");
            setIsMenuHovered(true);
          }}
          onMouseLeave={() => {
            setIsMenuHovered(false);
            setTimeout(() => {
              if (!isDropdownHovered) {
                setMenu("");
              }
            }, 200);
          }}
        >
          <span
            className={`menu-link ${menu === "places" ? "active red" : ""}`}
            onClick={() => navigate("/places")}
          >
            Places to go
          </span>

          {showPlacesDropdown && (
            <div
              className="dropdown-content"
              onMouseEnter={() => setIsDropdownHovered(true)}
              onMouseLeave={() => {
                setIsDropdownHovered(false);
                setTimeout(() => {
                  if (!isMenuHovered) {
                    setMenu("");
                  }
                }, 200);
              }}
            >
              {categories.map((category, idx) => (
                <span
                  key={idx}
                  onClick={() => {
                    navigate(`/places?category=${category}`);
                    setMenu("");
                  }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Other menu items */}
        <span className={menu === "things" ? "active red" : ""} onClick={() => {
          setMenu("things");
          navigate("/things-to-do");
        }}>
          Things to do
        </span>
        <span className={menu === "plan" ? "active red" : ""} onClick={() => {
          setMenu("plan");
          navigate("/plan-your-trip");
        }}>
          Plan your trip
        </span>
        <span className={menu === "offers" ? "active red" : ""} onClick={() => {
          setMenu("offers");
          navigate("/offers");
        }}>
          Travel offers
        </span>

        <div className="lang-dropdown">{/* Language (optional) */}</div>

        
      </div>

      {/* Right side: Sign In / Profile */}
      <div className="navbar-right">
        {!token ? (
          <button className="navbar-btn" onClick={() => setShowLogin(true)}>
            Sign in
          </button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li>
                <img src={assets.bag_icon} alt="Bookings" />
                <p>Bookings</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Log out</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
