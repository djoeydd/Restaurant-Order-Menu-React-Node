import React, { useEffect, useState } from "react";
import "./BillDisplay.css";
import BillItem from "../BillItem/BillItem";
import axios from "axios";

const BillDisplay = ({ orders }) => {
  const [localOrders, setLocalOrders] = useState([]);

  useEffect(() => {
    const validOrders = orders.filter(
      (order) => order.items && order.items.length > 0
    );
    setLocalOrders(validOrders);
  }, [orders]);

  const handleItemDeleted = async (orderId, itemId) => {
    // Find the order we're working with
    const order = localOrders.find((order) => order._id === orderId);

    // Calculate what the items would be after deletion
    const updatedItems = order.items.filter((item) => item._id !== itemId);

    // If this would leave us with an empty order, confirm first
    if (updatedItems.length === 0) {
      const confirmDelete = window.confirm(
        "Deleting this item will remove the order. Continue?"
      );

      if (!confirmDelete) {
        return false; // Return false to indicate deletion was cancelled
      }

      try {
        await axios.delete(`http://localhost:3000/api/orders/${orderId}`);
        setLocalOrders(localOrders.filter((order) => order._id !== orderId));
        return true; // Return true to indicate successful deletion
      } catch (error) {
        console.error(
          "Failed to delete order:",
          error.response ? error.response.data : error.message
        );
        return false; // Return false if deletion failed
      }
    } else {
      try {
        // Make API call to delete the item
        await axios.delete(
          `http://localhost:3000/api/orders/${orderId}/items/${itemId}`
        );

        // Only update state if API call was successful
        const updatedOrders = localOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                items: updatedItems,
              }
            : order
        );
        setLocalOrders(updatedOrders);
        return true; // Return true to indicate successful deletion
      } catch (error) {
        console.error(
          "Failed to delete item:",
          error.response ? error.response.data : error.message
        );
        return false; // Return false if deletion failed
      }
    }
  };

  return (
    <div className="admin-bill-display" id="admin-bill-display">
      <div className="admin-bill-display-list">
        {localOrders.map((order) => {
          if (!order.items || order.items.length === 0) {
            return null;
          }

          const total = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return (
            <div key={order._id} className="admin-order">
              <h3>Order Number: {order._id}</h3>
              <div className="admin-order-table-date">
                <p>Table Number: {order.tableNumber}</p>
                <p>Date: {new Date(order.date).toLocaleString()}</p>
                <p>Status: {order.open ? "Open" : "Closed"}</p>
              </div>
              <div className="admin-bill-item-list">
                {order.items.map((item) => (
                  <BillItem
                    key={item._id}
                    orderId={order._id}
                    itemId={item._id}
                    name={item.itemName}
                    price={item.price}
                    quantity={item.quantity}
                    onItemDeleted={handleItemDeleted}
                  />
                ))}
              </div>
              <h4>Total: ¥{total}</h4>
              {order.open && (
                <div className="button-group">
                  <button id="close-button">Close Order</button>
                  <button id="add-button">Add Item</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BillDisplay;
