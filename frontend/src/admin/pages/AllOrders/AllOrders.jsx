import { useState, useEffect } from "react";
import React from "react";
import "./AllOrders.css";
import axios from "axios";
import BillDisplay from "../../components/BillDisplay/BillDisplay";

function AllOrders() {
  const [orders, setBillItems] = useState([]);

  useEffect(() => {
    const fetchBillItems = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/orders`
        );
        setBillItems(response.data);
      } catch (error) {
        console.error("Error fetching bill items:", error);
      }
    };
    fetchBillItems();
  }, [orders]);

  return (
    <div className="manage-orders-title">
      <h1>All Orders</h1>
      <BillDisplay orders={orders} />
    </div>
  );
}

export default AllOrders;
