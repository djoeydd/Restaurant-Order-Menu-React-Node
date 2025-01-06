import React, { useEffect, useState, useContext } from "react";
import "./AdminNavbar.css";
import { Link } from "react-router-dom";
import { assets } from "../../../assets/assets";

const AdminNavbar = () => {
  return (
    <div className="admin-navbar">
      <Link to="/admin">
        <h1>Admin Dashboard</h1>{" "}
      </Link>

      <button>Log In</button>
    </div>
  );
};
export default AdminNavbar;
