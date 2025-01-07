import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-dashboard">
      <hr />
      <div className="admin-dashboard-title">
        <h1>Tools</h1>
      </div>
      <div className="admin-dashboard-menu">
        <button onClick={() => navigate("/admin/orders?open=true")}>
          Open Orders
        </button>
        <button onClick={() => navigate("/admin/orders/all")}>
          All Orders
        </button>
        <button onClick={() => navigate("/admin/menu")}>Manage Menu</button>
        <button>Clock In/Out</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
