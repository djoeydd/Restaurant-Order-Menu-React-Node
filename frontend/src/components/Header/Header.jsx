import React from "react";
import "./Header.css";

const Header = () => {
  const handleMenuClick = () => {
    document
      .getElementById("explore-menu")
      .scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Place order here</h2>
        <p>Order your favorite items from diverse menue of Mexican</p>
        <button onClick={handleMenuClick}>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
