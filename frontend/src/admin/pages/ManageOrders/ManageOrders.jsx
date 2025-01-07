import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageOrders.css";
import BillDisplay from "../../components/BillDisplay/BillDisplay";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/orders/?open=true`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="manage-orders-title">
      <h1>Open Orders</h1>
      <BillDisplay orders={orders} />
    </div>
  );
};

export default ManageOrders;
