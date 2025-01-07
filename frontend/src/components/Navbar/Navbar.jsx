import React, { useEffect, useState, useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, getTotalBillItems, tableNumber } =
    useContext(StoreContext);
  const [totalBillItems, setTotalBillItems] = useState(0);

  useEffect(() => {
    const fetchTotalBillItems = async () => {
      const total = await getTotalBillItems(tableNumber); // Assuming tableNumber is 5
      setTotalBillItems(total);
    };

    fetchTotalBillItems();
  }, [getTotalBillItems, tableNumber]);
  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <li
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </li>
        <li
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </li>
        <li
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </li>
        <li
          onClick={() => setMenu("about")}
          className={menu === "about" ? "active" : ""}
        >
          about
        </li>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to="/bill">
            <img className="navbar-bill-icon" src={assets.bill} alt="" />
          </Link>
          <div className={totalBillItems === 0 ? "" : "dot"}></div>
        </div>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
